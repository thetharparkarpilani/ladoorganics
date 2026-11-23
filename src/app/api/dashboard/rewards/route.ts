import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCustomerIdentity } from "@/lib/customer-auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const customer = await getCustomerIdentity(req);
    if (!customer) {
      return NextResponse.json({ error: "Please sign in to view your rewards." }, { status: 401 });
    }

    const result = await db.query(
      `SELECT id, points, transaction_type, description, created_at
       FROM loyalty_ledgers
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 100`,
      [customer.databaseUserId]
    );

    const entries = result.rows;
    const balance = entries.reduce((total: number, entry: { points: number | string }) => total + Number(entry.points || 0), 0);

    return NextResponse.json({ balance, entries }, {
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    });
  } catch (err) {
    console.error("Customer rewards history failed:", err);
    return NextResponse.json({ error: "Your rewards are temporarily unavailable. Please try again later." }, { status: 500 });
  }
}
