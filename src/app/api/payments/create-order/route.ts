import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        {
          error:
            "Razorpay server keys (RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET) are not configured yet. Use WhatsApp or recorded order request until gateway keys are added."
        },
        { status: 503 }
      );
    }

    const body = await req.json().catch(() => null);
    const orderId = typeof body?.orderId === "string" ? body.orderId.trim() : "";

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required." }, { status: 400 });
    }

    const orderRes = await db.query(
      `SELECT id, order_number, total_inr, status FROM orders WHERE id = $1::uuid LIMIT 1`,
      [orderId]
    );

    if (orderRes.rows.length === 0) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const order = orderRes.rows[0];
    const amountPaise = Math.max(100, Math.round(Number(order.total_inr) * 100));
    const authHeader = Buffer.from(`${keyId}:${keySecret}`, "utf8").toString("base64");

    const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authHeader}`
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency: "INR",
        receipt: order.order_number,
        notes: { lado_order_id: order.id }
      })
    });

    if (!rzpRes.ok) {
      return NextResponse.json(
        { error: "Unable to initialize gateway order with Razorpay." },
        { status: 502 }
      );
    }

    const rzpOrder = await rzpRes.json();
    const idempotencyKey = `create_order:${rzpOrder.id}:${crypto.randomUUID().slice(0, 8)}`;

    await db.query(
      `INSERT INTO payments (
        order_id, provider, provider_order_id, idempotency_key, amount_inr, status, event_type
      ) VALUES ($1::uuid, 'razorpay', $2, $3, $4, 'created', 'order.created')`,
      [order.id, rzpOrder.id, idempotencyKey, Number(order.total_inr)]
    );

    return NextResponse.json({
      keyId,
      razorpayOrderId: rzpOrder.id,
      amountPaise,
      currency: "INR",
      orderNumber: order.order_number
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : "Payment order creation failed";
    return NextResponse.json({ error: detail }, { status: 500 });
  }
}
