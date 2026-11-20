import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const res = await db.query(
      `SELECT calf_name,
              COUNT(*)::int AS entries_count,
              COALESCE(SUM(amount_inr), 0)::bigint AS recorded_amount_inr
       FROM sponsorships
       WHERE status IN ('active', 'pending')
       GROUP BY calf_name
       ORDER BY calf_name ASC`
    );

    return NextResponse.json({
      source: "database",
      calves: ["Dholi Sheri", "Tara", "Roshni"],
      summary: res.rows,
      note: "Amounts reflect recorded sponsorship entries in PostgreSQL. Tax exemption claims are not asserted unless legally verified."
    });
  } catch {
    return NextResponse.json({
      source: "fallback",
      calves: ["Dholi Sheri", "Tara", "Roshni"],
      summary: [],
      note: "Connect DATABASE_URL to load live PostgreSQL sponsorship totals."
    });
  }
}
