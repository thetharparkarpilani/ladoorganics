import { NextResponse } from "next/server";

// Phone sign-in is intentionally unavailable until a real SMS provider is configured.
// This endpoint must never issue a demo OTP or claim that an SMS was sent.
export async function POST() {
  return NextResponse.json(
    { error: "Mobile OTP sign-in is not available yet. Please use Google sign-in." },
    { status: 503 }
  );
}
