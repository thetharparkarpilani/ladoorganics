import { NextResponse } from "next/server";

// Reject all legacy OTP verification requests. The former implementation
// accepted an unverified production OTP and issued an unsigned user-ID cookie.
export async function POST() {
  return NextResponse.json(
    { error: "Mobile OTP sign-in is not available yet. Please use Google sign-in." },
    { status: 503 }
  );
}
