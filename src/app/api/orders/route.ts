import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { sendTemplatedNotification } from "@/lib/customer-notifications";
import { sendAdminRequestAlert } from "@/lib/admin-notifications";
import { getCustomerIdentity } from "@/lib/customer-auth";
import { enforceRateLimit } from "@/lib/rate-limit";

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


export async function POST(req: NextRequest) {
  const rateLimited = await enforceRateLimit(req, "orders", 5, 600);
  if (rateLimited) return rateLimited;
  const idempotencyKey = req.headers.get("idempotency-key")?.trim() || "";
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idempotencyKey)) {
    return NextResponse.json({ error: "Checkout session expired. Please refresh your bag and try again." }, { status: 400 });
  }
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
  const customerIdentity = await getCustomerIdentity(req).catch((error) => {
    console.error("Customer identity lookup failed during checkout:", error);
    return null;
  });
  // Guest email is contact information only. Dashboard ownership is linked
  // exclusively through the verified, signed-in database user id.
  const email = customerIdentity?.email || clean(body.email, 254).toLowerCase();
  const userId = customerIdentity?.databaseUserId || null;
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

  let client: Awaited<ReturnType<typeof db.getClient>>;
  try {
    client = await db.getClient();
  } catch (error) {
    console.error("Order database connection failed:", error);
    return NextResponse.json(
      { error: "Ordering is temporarily unavailable because the order database could not be reached. Your cart has not been submitted; please try again later or contact us on WhatsApp." },
      { status: 503 }
    );
  }

  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [idempotencyKey]);
    const existing = await client.query(
      "SELECT id, order_number, total_inr, payment_method, payment_status FROM orders WHERE idempotency_key = $1 LIMIT 1",
      [idempotencyKey]
    );
    if (existing.rows[0]) {
      await client.query("ROLLBACK");
      return NextResponse.json({
        success: true,
        orderId: existing.rows[0].id,
        orderNumber: existing.rows[0].order_number,
        totalInr: Number(existing.rows[0].total_inr),
        paymentMethod: existing.rows[0].payment_method,
        paymentStatus: existing.rows[0].payment_status,
        message: "This checkout was already submitted. Your original order is shown here."
      }, { headers: { "Cache-Control": "no-store" } });
    }
    // Limit unresolved COD exposure per verified account/contact. This is
    // checked inside the checkout transaction so parallel requests serialize
    // behind the idempotency lock above.
    const openCod = await client.query(
      `SELECT COUNT(*)::int AS total
         FROM orders
        WHERE payment_method = 'cash_on_delivery'
          AND payment_status = 'pay_on_delivery'
          AND status IN ('pending_confirmation', 'processing', 'shipped')
          AND created_at > NOW() - INTERVAL '7 days'
          AND (($1::uuid IS NOT NULL AND user_id = $1::uuid) OR lower(COALESCE(guest_email, '')) = lower($2))`,
      [userId, email]
    );
    if (Number(openCod.rows[0]?.total || 0) >= 3 && method === "cash_on_delivery") {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "You already have three unpaid Cash on Delivery orders in progress. Please contact the team before placing another COD order." }, { status: 429 });
    }

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
       (id, order_number, user_id, idempotency_key, guest_name, guest_email, guest_phone, shipping_summary, shipping_address,
        subtotal_inr, total_inr, status, payment_method, payment_status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$8,$9,$9,'pending_confirmation',$10,$11)`,
      [orderId, orderNumber, userId, idempotencyKey, customerName, email, phone, address, total, method, paymentStatus]
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
      await client.query(
        "INSERT INTO inventory_movements(product_variant_id,movement_type,quantity_delta,reference_type,reference_id,note,created_by) " +
        "SELECT id,'sale',$1 * -1,'order',$2,'Stock deducted for customer order checkout','checkout' FROM product_variants WHERE sku=$3",
        [item.quantity,orderId,item.sku]
      );
    }

    await client.query(
      `INSERT INTO payments (order_id, provider, idempotency_key, amount_inr, status)
       VALUES ($1,$2,$3,$4,'created')`,
      [orderId, method, randomUUID(), total]
    );

    await client.query("COMMIT");
    await sendTemplatedNotification("order_received", email, {
      name: customerName,
      order_number: orderNumber,
      amount: total,
      payment_method: method === "cash_on_delivery" ? "Cash on Delivery" : "Manual UPI",
    });
    await sendAdminRequestAlert("customer order", {
      "Order number": orderNumber,
      "Customer": customerName,
      "Email": email,
      "Phone": phone,
      "Total (INR)": total,
      "Payment method": method === "cash_on_delivery" ? "Cash on Delivery" : "Manual UPI",
      "Status": "pending_confirmation",
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
