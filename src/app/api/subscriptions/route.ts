import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCustomerIdentity } from "@/lib/customer-auth";

export const runtime = "nodejs";

type EssentialsRequest = {
  frequencyDays?: unknown;
  quantity?: unknown;
  productInterest?: unknown;
};

export async function POST(req: NextRequest) {
  try {
    const customer = await getCustomerIdentity(req);
    if (!customer) {
      return NextResponse.json(
        { error: "Please sign in to submit an Essentials Club enquiry." },
        { status: 401 }
      );
    }

    let body: EssentialsRequest;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid Essentials Club enquiry." }, { status: 400 });
    }

    const frequencyDays = Number(body.frequencyDays);
    const quantity = Number(body.quantity);
    const productInterest = typeof body.productInterest === "string"
      ? body.productInterest.trim().slice(0, 100)
      : "Essentials Club products";

    if (![7, 14, 30].includes(frequencyDays) ||
        !Number.isInteger(quantity) || quantity < 1 || quantity > 20 ||
        !productInterest) {
      return NextResponse.json(
        { error: "Choose a valid delivery frequency, product and quantity (1–20)." },
        { status: 400 }
      );
    }

    const interest = `Repeat-delivery enquiry | Product: ${productInterest} | Frequency: every ${frequencyDays} days | Quantity: ${quantity}`;
    await db.query(
      `INSERT INTO prelaunch_waitlist (email, product_interest)
       VALUES ($1, $2)
       ON CONFLICT (email, product_interest) DO NOTHING`,
      [customer.email, interest]
    );

    return NextResponse.json({
      ok: true,
      status: "enquiry_recorded",
      message: "Your repeat-delivery enquiry has been recorded. The Lado Organics team will confirm availability, pricing and delivery with you. No payment or automatic subscription has been started.",
    }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Essentials Club enquiry failed:", error);
    return NextResponse.json(
      { error: "We could not record your enquiry. Please try again later." },
      { status: 503 }
    );
  }
}
