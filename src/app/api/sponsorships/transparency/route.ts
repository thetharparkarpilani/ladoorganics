import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const res = await db.query(
      `SELECT calf_name,
              COUNT(*)::int AS entries_count,
              COALESCE(SUM(amount_inr), 0)::bigint AS recorded_amount_inr
       FROM sponsorships
       WHERE status = 'active'
       GROUP BY calf_name
       ORDER BY calf_name ASC`
    );

    return NextResponse.json({
      source: "database",
      calves: ["Dholi Sheri", "Tara", "Roshni"],
      summary: res.rows,
      note: "Only entries marked active by the Lado team are included. These records are not an audited expenditure statement or tax receipt."
    });
  } catch {
    return NextResponse.json({
      source: "fallback",
      calves: ["Dholi Sheri", "Tara", "Roshni"],
      summary: [],
      note: "Live sponsorship records are temporarily unavailable. Please contact the Lado team for current information."
    });
  }
}
