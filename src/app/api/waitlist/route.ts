import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const rateLimited = await enforceRateLimit(req, "waitlist", 5, 3600);
  if (rateLimited) return rateLimited;
  try {
    const body = await req.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const interest = typeof body?.interest === "string" ? body.interest.trim() : "general";

    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email) || email.length > 254) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }

    const targetInterest = (interest || "general").slice(0, 80);

    // Insert into waitlist, ignoring duplicates for the same product interest
    await db.query(
      `INSERT INTO prelaunch_waitlist (email, product_interest) 
       VALUES ($1, $2) 
       ON CONFLICT (email, product_interest) DO NOTHING`,
      [email, targetInterest]
    );

    return NextResponse.json({ ok: true, message: "You have been securely added to the priority list." });
  } catch (err) {
    console.error("Waitlist API Error:", err);
    return NextResponse.json({ error: "Failed to join waitlist. Please try again." }, { status: 500 });
  }
}
