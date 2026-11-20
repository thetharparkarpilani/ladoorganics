import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret || !signature) {
      return NextResponse.json({ error: "Invalid webhook configuration" }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);

    if (event.event === "payment.captured") {
      const orderId = event.payload.payment.entity.order_id;
      
      // Safely update the database order status to 'paid'
      await db.query(
        "UPDATE orders SET status = 'paid' WHERE id = $1",
        [orderId]
      );
    }

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("Webhook Verification Error:", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
