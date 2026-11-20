import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, interest } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }

    const targetInterest = interest || "general";

    // Insert into waitlist, ignoring duplicates for the same product interest
    await db.query(
      `INSERT INTO prelaunch_waitlist (email, product_interest) 
       VALUES ($1, $2) 
       ON CONFLICT (email, product_interest) DO NOTHING`,
      [email.toLowerCase().trim(), targetInterest]
    );

    return NextResponse.json({ ok: true, message: "You have been securely added to the priority list." });
  } catch (err) {
    console.error("Waitlist API Error:", err);
    return NextResponse.json({ error: "Failed to join waitlist. Please try again." }, { status: 500 });
  }
}
