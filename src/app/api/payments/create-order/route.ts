import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { amountInr, customerName, phone } = await req.json();

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { error: "Payment gateway is not configured. Missing Razorpay keys." },
        { status: 503 }
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Create Razorpay Order securely on the server
    const options = {
      amount: amountInr * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Draft the pending order in PostgreSQL
    await db.query(
      `INSERT INTO orders (id, status, total_inr, shipping_address) 
       VALUES ($1, 'pending', $2, $3)`,
      [order.id, amountInr, "Pending Verification"]
    );

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Razorpay Order Error:", err);
    return NextResponse.json({ error: "Failed to initialize payment." }, { status: 500 });
  }
}
