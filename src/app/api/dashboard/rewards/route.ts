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

    const [balanceResult, historyResult] = await Promise.all([
      db.query(
        `SELECT COALESCE(SUM(points), 0) AS balance
         FROM loyalty_ledgers
         WHERE user_id = $1`,
        [customer.databaseUserId]
      ),
      db.query(
        `SELECT id, points, transaction_type, description, created_at
         FROM loyalty_ledgers
         WHERE user_id = $1
         ORDER BY created_at DESC
         LIMIT 100`,
        [customer.databaseUserId]
      ),
    ]);

    return NextResponse.json({
      balance: Number(balanceResult.rows[0]?.balance || 0),
      entries: historyResult.rows,
    }, {
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    });
  } catch (err) {
    console.error("Customer rewards history failed:", err);
    return NextResponse.json({ error: "Your rewards are temporarily unavailable. Please try again later." }, { status: 500 });
  }
}
