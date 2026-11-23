import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret || !signature) return NextResponse.json({ error: "Invalid webhook configuration" }, { status: 400 });

    const expected = crypto.createHmac("sha256", secret).update(body).digest();
    const supplied = Buffer.from(signature, "hex");
    if (supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });

    const event = JSON.parse(body);
    const payment = event?.payload?.payment?.entity;
    const gatewayOrderId = payment?.order_id;
    const paymentId = payment?.id;

    if (event.event === "payment.captured" && gatewayOrderId && paymentId) {
      const client = await db.getClient();
      try {
        await client.query("BEGIN");
        const found = await client.query(
          "SELECT p.id AS payment_row_id, p.order_id, p.amount_inr FROM payments p JOIN orders o ON o.id = p.order_id WHERE p.provider = 'razorpay' AND p.provider_order_id = $1 FOR UPDATE OF p, o",
          [gatewayOrderId]
        );
        if (found.rows[0] && Number(payment.amount) === Number(found.rows[0].amount_inr) * 100) {
          await client.query(
            "UPDATE payments SET provider_payment_id = $1, status = 'captured', verified_at = NOW(), event_type = $2 WHERE id = $3 AND (provider_payment_id IS NULL OR provider_payment_id = $1)",
            [paymentId, event.event, found.rows[0].payment_row_id]
          );
          await client.query("UPDATE orders SET status = 'paid' WHERE id = $1 AND status = 'pending_confirmation'", [found.rows[0].order_id]);
        }
        await client.query("COMMIT");
      } catch (err) {
        await client.query("ROLLBACK").catch(() => undefined);
        throw err;
      } finally { client.release(); }
    } else if (event.event === "payment.failed" && gatewayOrderId) {
      await db.query(
        "UPDATE payments SET status = 'failed', event_type = $1 WHERE provider = 'razorpay' AND provider_order_id = $2 AND status = 'created'",
        [event.event, gatewayOrderId]
      );
    }
    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("Razorpay webhook processing failed:", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
