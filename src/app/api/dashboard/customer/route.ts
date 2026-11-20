import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    // 1. Authenticate user via secure HttpOnly cookie (mocked session extraction for architecture)
    const sessionToken = req.cookies.get("lado_secure_session")?.value;
    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    // In a real implementation, decrypt sessionToken to get userId. 
    // Using a placeholder UUID for the architectural scaffolding.
    const userId = "00000000-0000-0000-0000-000000000000"; 

    const client = await db.getClient();
    try {
      // Parallel safe queries enforcing Row-Level-Security equivalent via WHERE user_id
      const [ordersRes, bookingsRes, sponsorshipsRes] = await Promise.all([
        client.query(`SELECT id, order_number, total_inr, status, created_at FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10`, [userId]),
        client.query(`SELECT id, check_in, check_out, status, guests_count, total_amount_inr FROM bookings WHERE user_id = $1 ORDER BY check_in DESC LIMIT 5`, [userId]),
        client.query(`SELECT id, calf_name, plan_type, amount_inr, status FROM sponsorships WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5`, [userId])
      ]);

      return NextResponse.json({
        orders: ordersRes.rows,
        bookings: bookingsRes.rows,
        sponsorships: sponsorshipsRes.rows,
        profile: {
          name: "Verified Customer",
          tier: "Lado Patron",
          joined: "2026-11-20"
        }
      });
    } finally {
      client.release();
    }
  } catch (err) {
    const detail = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: detail }, { status: 500 });
  }
}
