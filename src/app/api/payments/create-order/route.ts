import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Razorpay is not an enabled customer checkout method. The storefront currently
// supports COD and manually verified UPI only. Keep this endpoint closed until
// Razorpay is fully wired to order reservation, payment status and refund flows.
export async function POST() {
  return NextResponse.json(
    { error: "Online card/UPI gateway checkout is not enabled. Please use Cash on Delivery or manually verified UPI at checkout." },
    { status: 410, headers: { "Cache-Control": "no-store" } }
  );
}
