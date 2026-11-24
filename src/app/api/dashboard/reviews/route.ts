import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCustomerIdentity } from "@/lib/customer-auth";
import { enforceRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const customer = await getCustomerIdentity(req);
    if (!customer) {
      return NextResponse.json({ error: "Please sign in to view your reviews." }, { status: 401 });
    }

    const result = await db.query(
      `SELECT id, product_slug, rating, title, comment, is_verified_purchase, is_approved, created_at
       FROM reviews
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 100`,
      [customer.databaseUserId]
    );

    return NextResponse.json({ reviews: result.rows }, {
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    });
  } catch (err) {
    console.error("Customer review history failed:", err);
    return NextResponse.json({ error: "Your reviews are temporarily unavailable. Please try again later." }, { status: 500 });
  }
}
