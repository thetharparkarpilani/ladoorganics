import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { sendTemplatedNotification } from "@/lib/customer-notifications";

export const runtime = "nodejs";

type Body = {
  items?: { sku: string; quantity: number }[];
  paymentMethod?: "cash_on_delivery" | "manual_upi";
  customerName?: string;
  email?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
};

const clean = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

async function signedInEmail(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get("lado_sb_access")?.value;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!token || !url || !key) return null;

  try {
    const response = await fetch(url + "/auth/v1/user", {
      headers: { apikey: key, Authorization: "Bearer " + token },
      cache: "no-store",
    });
    if (!response.ok) return null;
    const user = await response.json();
    return typeof user.email === "string" ? user.email.toLowerCase() : null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "Ordering is temporarily unavailable. Please contact us on WhatsApp." }, { status: 503 });
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid checkout details." }, { status: 400 });
  }

  const method = body.paymentMethod;
  if (method !== "cash_on_delivery" && method !== "manual_upi") {
    return NextResponse.json({ error: "Please choose Cash on Delivery or UPI." }, { status: 400 });
  }

  const inputItems = Array.isArray(body.items) ? body.items : [];
  if (!inputItems.length || inputItems.length > 30) {
    return NextResponse.json({ error: "Your cart is empty or contains too many items." }, { status: 400 });
  }

  const quantities = new Map<string, number>();
  for (const item of inputItems) {
    const sku = clean(item?.sku, 80);
    const quantity = Number(item?.quantity);
    if (!sku || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      return NextResponse.json({ error: "One or more cart items are invalid." }, { status: 400 });
    }
    quantities.set(sku, (quantities.get(sku) || 0) + quantity);
  }
  if ([...quantities.values()].some(quantity => quantity > 20)) {
    return NextResponse.json({ error: "Maximum 20 units per product variant per order." }, { status: 400 });
  }

  const customerName = clean(body.customerName, 100);
  const email = (await signedInEmail(req)) || clean(body.email, 254).toLowerCase();
  const phone = clean(body.phone, 30);
  const address1 = clean(body.addressLine1, 180);
  const address2 = clean(body.addressLine2, 180);
  const city = clean(body.city, 80);
  const state = clean(body.state, 80);
  const postal = clean(body.postalCode, 20);
  const address = [address1, address2, city, state, postal, "India"].filter(Boolean).join(", ");

  if (!customerName || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !phone || !/^[+0-9()\-\s]{7,20}$/.test(phone) ||
      !address1 || !city || !state || !/^\d{6}$/.test(postal)) {
    return NextResponse.json({ error: "Please provide your name, valid email, phone number and complete delivery address with a 6-digit PIN code." }, { status: 400 });
  }

  const client = await db.getClient();
  try {
    await client.query("BEGIN");
    const skus = [...quantities.keys()];
    const catalog = await client.query(
      `SELECT pv.sku, pv.label, pv.price_inr, pv.stock_qty, p.slug, p.name_en
       FROM product_variants pv
       JOIN products p ON p.id = pv.product_id
       WHERE pv.sku = ANY($1::text[]) AND p.is_active = TRUE
       FOR UPDATE OF pv`,
      [skus]
    );

    if (catalog.rows.length !== skus.length) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "A product in your cart is unavailable. Please refresh your cart." }, { status: 409 });
    }

    const lineItems = catalog.rows.map((product: {
      sku: string; label: string; price_inr: number; stock_qty: number; slug: string; name_en: string;
    }) => {
      const quantity = quantities.get(product.sku)!;
      if (Number(product.stock_qty) < quantity) throw new Error("INSUFFICIENT_STOCK");
      return { ...product, quantity };
    });

    const total = lineItems.reduce(
      (sum: number, item: { price_inr: number; quantity: number }) => sum + Number(item.price_inr) * item.quantity,
      0
    );
    if (!Number.isSafeInteger(total) || total <= 0 || total > 500000) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "The order total is invalid. Please contact us for assistance." }, { status: 400 });
    }

    const orderId = randomUUID();
    const orderNumber = "LO-" + new Date().toISOString().slice(0, 10).replace(/-/g, "") + "-" + randomUUID().slice(0, 8).toUpperCase();
    const paymentStatus = method === "cash_on_delivery" ? "pay_on_delivery" : "awaiting_manual_payment";

    await client.query(
      `INSERT INTO orders
       (id, order_number, guest_name, guest_email, guest_phone, shipping_summary, shipping_address,
        subtotal_inr, total_inr, status, payment_method, payment_status)
       VALUES ($1,$2,$3,$4,$5,$6,$6,$7,$7,'pending_confirmation',$8,$9)`,
      [orderId, orderNumber, customerName, email, phone, address, total, method, paymentStatus]
    );

    for (const item of lineItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_slug, variant_sku, item_title, unit_price_inr, quantity)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [orderId, item.slug, item.sku, item.name_en + " — " + item.label, Number(item.price_inr), item.quantity]
      );
      await client.query(
        "UPDATE product_variants SET stock_qty = stock_qty - $1 WHERE sku = $2",
        [item.quantity, item.sku]
      );
    }

    await client.query(
      `INSERT INTO payments (order_id, provider, idempotency_key, amount_inr, status)
       VALUES ($1,$2,$3,$4,'created')`,
      [orderId, method, randomUUID(), total]
    );

    await client.query("COMMIT");
    void sendTemplatedNotification("order_received", email, {
      name: customerName,
      order_number: orderNumber,
      amount: total,
      payment_method: method === "cash_on_delivery" ? "Cash on Delivery" : "Manual UPI",
    });
    return NextResponse.json({
      success: true,
      orderId,
      orderNumber,
      totalInr: total,
      paymentMethod: method,
      paymentStatus,
      customer: { name: customerName, email, phone },
      message: method === "cash_on_delivery"
        ? "Your order has been placed. Pay when it is delivered."
        : "Your order has been placed. Please contact us on WhatsApp for UPI payment instructions.",
    });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    if (error instanceof Error && error.message === "INSUFFICIENT_STOCK") {
      return NextResponse.json({ error: "One or more items do not have enough stock. Please update your cart." }, { status: 409 });
    }
    console.error("Lado Organics order creation failed:", error);
    return NextResponse.json({ error: "We could not place your order. Please try again or contact us on WhatsApp." }, { status: 500 });
  } finally {
    client.release();
  }
}
