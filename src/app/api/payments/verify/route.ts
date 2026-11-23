import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !secret || !process.env.DATABASE_URL) {
    return NextResponse.json({ error: "Payment verification is not configured." }, { status: 503 });
  }

  let body: { razorpay_order_id?: string; razorpay_payment_id?: string; razorpay_signature?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid payment confirmation." }, { status: 400 }); }
  const orderId = body.razorpay_order_id || "", paymentId = body.razorpay_payment_id || "", signature = body.razorpay_signature || "";
  if (!orderId || !paymentId || !signature || orderId.length > 100 || paymentId.length > 100) {
    return NextResponse.json({ error: "Payment confirmation is incomplete." }, { status: 400 });
  }

  const expected = crypto.createHmac("sha256", secret).update(orderId + "|" + paymentId).digest();
  const supplied = Buffer.from(signature, "hex");
  if (supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) {
    return NextResponse.json({ error: "Payment signature could not be verified." }, { status: 400 });
  }

  try {
    const gateway = new Razorpay({ key_id: keyId, key_secret: secret });
    const payment = await gateway.payments.fetch(paymentId);
    if (payment.order_id !== orderId || payment.status !== "captured") {
      return NextResponse.json({ error: "Payment has not been captured yet. Please wait or contact support." }, { status: 409 });
    }

    const client = await db.getClient();
    try {
      await client.query("BEGIN");
      const found = await client.query(
        "SELECT p.id AS payment_row_id, p.order_id, p.amount_inr, o.order_number FROM payments p JOIN orders o ON o.id = p.order_id WHERE p.provider = 'razorpay' AND p.provider_order_id = $1 FOR UPDATE OF p, o",
        [orderId]
      );
      if (!found.rows[0]) {
        await client.query("ROLLBACK");
        return NextResponse.json({ error: "We could not find this order. Please contact support with your payment ID." }, { status: 404 });
      }
      if (Number(payment.amount) !== Number(found.rows[0].amount_inr) * 100) {
        await client.query("ROLLBACK");
        return NextResponse.json({ error: "The captured amount does not match your order." }, { status: 409 });
      }

      const paymentUpdate = await client.query(
        "UPDATE payments SET provider_payment_id = $1, status = 'captured', verified_at = NOW(), event_type = 'payment.captured' WHERE id = $2 AND (provider_payment_id IS NULL OR provider_payment_id = $1) RETURNING id",
        [paymentId, found.rows[0].payment_row_id]
      );
      if (!paymentUpdate.rows[0]) {
        await client.query("ROLLBACK");
        return NextResponse.json({ error: "This order is already linked to a different payment. Please contact support." }, { status: 409 });
      }

      await client.query(
        "UPDATE orders SET status = 'paid', payment_status = 'paid' WHERE id = $1 AND status IN ('pending_confirmation', 'paid')",
        [found.rows[0].order_id]
      );
      await client.query("COMMIT");
      return NextResponse.json({ verified: true, orderNumber: found.rows[0].order_number });
    } catch (err) {
      await client.query("ROLLBACK").catch(() => undefined);
      throw err;
    } finally { client.release(); }
  } catch (err) {
    console.error("Razorpay payment verification failed:", err);
    return NextResponse.json({ error: "We could not verify the payment right now. Please contact support before trying to pay again." }, { status: 502 });
  }
}
