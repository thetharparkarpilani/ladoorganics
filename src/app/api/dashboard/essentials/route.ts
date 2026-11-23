import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCustomerIdentity } from "@/lib/customer-auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const customer = await getCustomerIdentity(req);
    if (!customer) {
      return NextResponse.json(
        { error: "Please sign in to view your Essentials Club enquiries." },
        { status: 401 }
      );
    }

    const result = await db.query(
      `SELECT id, product_interest, created_at
       FROM prelaunch_waitlist
       WHERE LOWER(email) = $1
         AND product_interest LIKE 'Repeat-delivery enquiry |%'
       ORDER BY created_at DESC
       LIMIT 100`,
      [customer.email]
    );

    return NextResponse.json(
      { enquiries: result.rows },
      { headers: { "Cache-Control": "private, no-store, max-age=0" } }
    );
  } catch (err) {
    console.error("Essentials Club history request failed:", err);
    return NextResponse.json(
      { error: "Your Essentials Club history is temporarily unavailable. Please try again later." },
      { status: 500 }
    );
  }
}
