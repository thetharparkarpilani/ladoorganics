import { NextResponse } from "next/server";

export async function POST() {
  // Do not return invented courier prices or delivery estimates. A live quote
  // requires an approved carrier/rate integration and confirmed business rules.
  return NextResponse.json(
    {
      error: "Live courier quotes are not configured. The Lado team will confirm shipping charges and delivery timing before dispatch.",
      shippingQuoteAvailable: false,
    },
    {
      status: 501,
      headers: { "Cache-Control": "no-store" },
    }
  );
}
