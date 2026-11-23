import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";

export const runtime = "nodejs";

type CheckoutBody = {
  items?: { sku: string; quantity: number }[];
  customerName?: string; email?: string; phone?: string;
  addressLine1?: string; addressLine2?: string; city?: string; state?: string; postalCode?: string;
};

const clean = (v: unknown, max: number) => typeof v === "string" ? v.trim().slice(0, max) : "";

async function signedInEmail(req: NextRequest) {
  const token = req.cookies.get("lado_sb_access")?.value;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!token || !url || !key) return null;
  const res = await fetch(url + "/auth/v1/user", { headers: { apikey: key, Authorization: "Bearer " + token }, cache: "no-store" });
  if (!res.ok) return null;
  const user = await res.json();
  return typeof user.email === "string" ? user.email.toLowerCase() : null;
}

export async function POST(req: NextRequest) {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET || !process.env.DATABASE_URL) {
    return NextResponse.json({ error: "Secure checkout is not fully configured. Please contact Lado Organics or use WhatsApp ordering." }, { status: 503 });
  }
  let body: CheckoutBody;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid checkout details." }, { status: 400 }); }

  const items = Array.isArray(body.items) ? body.items : [];
  if (!items.length || items.length > 30) return NextResponse.json({ error: "Your cart is empty or contains too many items." }, { status: 400 });
  const quantities = new Map<string, number>();
  for (const item of items) {
    const sku = clean(item?.sku, 80), qty = Number(item?.quantity);
    if (!sku || !Number.isInteger(qty) || qty < 1 || qty > 20) return NextResponse.json({ error: "One or more cart items are invalid." }, { status: 400 });
    quantities.set(sku, (quantities.get(sku) || 0) + qty);
  }
  if ([...quantities.values()].some(q => q > 20)) return NextResponse.json({ error: "Maximum 20 units per variant per order." }, { status: 400 });

  const customerName = clean(body.customerName, 100);
  const phone = clean(body.phone, 30);
  const email = (await signedInEmail(req)) || clean(body.email, 254).toLowerCase();
  const address1 = clean(body.addressLine1, 180), address2 = clean(body.addressLine2, 180);
  const city = clean(body.city, 80), state = clean(body.state, 80), postal = clean(body.postalCode, 20);
  const address = [address1, address2, city, state, postal, "India"].filter(Boolean).join(", ");
  if (!customerName || !phone || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !address1 || !city || !state || !postal) {
    return NextResponse.json({ error: "Please provide your full name, valid email, phone number and complete delivery address." }, { status: 400 });
  }
  if (!/^[+0-9()\-\s]{7,20}$/.test(phone)) return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });

  const client = await db.getClient();
  try {
    await client.query("BEGIN");
    const skus = [...quantities.keys()];
    const catalog = await client.query(
      "SELECT pv.sku, pv.label, pv.price_inr, pv.stock_qty, p.slug, p.name_en FROM product_variants pv JOIN products p ON p.id = pv.product_id WHERE pv.sku = ANY($1::text[]) AND p.is_active = TRUE FOR UPDATE OF pv",
      [skus]
    );
    if (catalog.rows.length !== skus.length) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "A product in your cart is no longer available. Please refresh your cart." }, { status: 409 });
    }
    const lineItems = catalog.rows.map((p: { sku: string; label: string; price_inr: number; stock_qty: number; slug: string; name_en: string }) => {
      const quantity = quantities.get(p.sku)!;
      if (Number(p.stock_qty) < quantity) throw new Error("INSUFFICIENT_STOCK");
      return { ...p, quantity };
    });
    const total = lineItems.reduce((sum: number, p: { price_inr: number; quantity: number }) => sum + Number(p.price_inr) * p.quantity, 0);
    if (!Number.isSafeInteger(total) || total <= 0 || total > 500000) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "The cart total is invalid. Please contact us for assistance." }, { status: 400 });
    }

    const gateway = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    const gatewayOrder = await gateway.orders.create({ amount: total * 100, currency: "INR", receipt: "lado_" + Date.now() + "_" + randomUUID().slice(0, 8), notes: { customer_email: email } });
    const localId = randomUUID();
    const orderNumber = "LO-" + new Date().toISOString().slice(0, 10).replace(/-/g, "") + "-" + randomUUID().slice(0, 8).toUpperCase();
    await client.query(
      "INSERT INTO orders (id, order_number, guest_name, guest_email, guest_phone, shipping_summary, subtotal_inr, total_inr, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$7,'pending_confirmation')",
      [localId, orderNumber, customerName, email, phone, address, total]
    );
    for (const item of lineItems) {
      await client.query(
        "INSERT INTO order_items (order_id, product_slug, variant_sku, item_title, unit_price_inr, quantity) VALUES ($1,$2,$3,$4,$5,$6)",
        [localId, item.slug, item.sku, item.name_en + " — " + item.label, Number(item.price_inr), item.quantity]
      );
    }
    await client.query(
      "INSERT INTO payments (order_id, provider, provider_order_id, idempotency_key, amount_inr, status) VALUES ($1,'razorpay',$2,$2,$3,'created')",
      [localId, gatewayOrder.id, total]
    );
    await client.query("COMMIT");
    return NextResponse.json({ orderId: gatewayOrder.id, amount: gatewayOrder.amount, currency: gatewayOrder.currency, keyId: process.env.RAZORPAY_KEY_ID, orderNumber, customer: { name: customerName, email, phone } });
  } catch (err) {
    await client.query("ROLLBACK").catch(() => undefined);
    if (err instanceof Error && err.message === "INSUFFICIENT_STOCK") return NextResponse.json({ error: "One of your items does not have enough stock. Please update your cart." }, { status: 409 });
    console.error("Razorpay checkout initialization failed:", err);
    return NextResponse.json({ error: "We could not prepare your order. Please try again." }, { status: 500 });
  } finally { client.release(); }
}
