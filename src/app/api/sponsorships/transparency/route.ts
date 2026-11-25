import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const res = await db.query(
      `SELECT COUNT(*)::int AS entries_count,
              COALESCE(SUM(amount_inr), 0)::bigint AS recorded_amount_inr
       FROM sponsorships
       WHERE status = 'active'`
    );

    const row = res.rows[0];
    const hasEntries = Number(row?.entries_count || 0) > 0;
    return NextResponse.json({
      source: "database",
      summary: hasEntries ? [{
        calf_name: "General Gau Seva",
        entries_count: Number(row.entries_count),
        recorded_amount_inr: Number(row.recorded_amount_inr)
      }] : [],
      note: "Only entries marked active by the Lado team are included. Contributions are shown as an aggregate, not assigned to an unverified animal profile. These records are not an audited expenditure statement or tax receipt."
    });
  } catch {
    return NextResponse.json({
      source: "fallback",
      summary: [],
      note: "Live Gau Seva records are temporarily unavailable. Please contact the Lado team for current information."
    });
  }
}
