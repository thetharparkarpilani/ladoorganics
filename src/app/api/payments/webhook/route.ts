import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function verifyRazorpaySignature(rawBody: string, signatureHeader: string | null, secret: string): boolean {
  if (!signatureHeader || !secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const actualBuf = Buffer.from(signatureHeader, "utf8");
  const expectedBuf = Buffer.from(expected, "utf8");
  if (actualBuf.length !== expectedBuf.length) return false;
  return crypto.timingSafeEqual(actualBuf, expectedBuf);
}

export async function POST(req: NextRequest) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json(
        { error: "Payment webhook secret is not configured on the server." },
        { status: 503 }
      );
    }

    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    if (!verifyRazorpaySignature(rawBody, signature, webhookSecret)) {
      return NextResponse.json({ error: "Invalid payment webhook signature." }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const eventType = typeof event?.event === "string" ? event.event : "unknown";
    const paymentEntity = event?.payload?.payment?.entity ?? {};
    const providerPaymentId =
      typeof paymentEntity?.id === "string" ? paymentEntity.id : `evt_${Date.now()}`;
    const providerOrderId =
      typeof paymentEntity?.order_id === "string" ? paymentEntity.order_id : null;
    const amountInr =
      typeof paymentEntity?.amount === "number" ? Math.round(paymentEntity.amount / 100) : 0;

    const paymentStatus =
      eventType === "payment.captured" || eventType === "order.paid"
        ? "captured"
        : eventType === "payment.failed"
          ? "failed"
          : eventType.includes("refund")
            ? "refunded"
            : "authorized";

    const idempotencyKey = `${eventType}:${providerPaymentId}`;

    const inserted = await db.query(
      `INSERT INTO payments (
        provider, provider_order_id, provider_payment_id, idempotency_key,
        amount_inr, status, event_type, verified_at
      ) VALUES ('razorpay', $1, $2, $3, $4, $5, $6, NOW())
      ON CONFLICT (idempotency_key) DO NOTHING
      RETURNING id, status`,
      [providerOrderId, providerPaymentId, idempotencyKey, amountInr, paymentStatus, eventType]
    );

    if (inserted.rows.length === 0) {
      return NextResponse.json({ received: true, duplicate: true, status: paymentStatus });
    }

    await db.query(
      `INSERT INTO audit_logs (action, entity_type, entity_id, metadata)
       VALUES ('PAYMENT_WEBHOOK_VERIFIED', 'payment', $1, $2::jsonb)`,
      [inserted.rows[0].id, JSON.stringify({ eventType, providerPaymentId, amountInr, paymentStatus })]
    );

    return NextResponse.json({
      received: true,
      duplicate: false,
      paymentId: inserted.rows[0].id,
      status: paymentStatus
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : "Webhook processing failed";
    return NextResponse.json({ error: detail }, { status: 500 });
  }
}
