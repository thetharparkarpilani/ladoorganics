import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCustomerIdentity } from "@/lib/customer-auth";
import { getAdminActor } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("mode") || "customer";

  try {
    if (mode === "admin") {
      const adminActor = await getAdminActor(req, "operations");
      if (!adminActor) {
        return NextResponse.json(
          { error: "Unauthorized: valid server ADMIN_ACCESS_TOKEN required." },
          { status: 401 }
        );
      }

      const [ordersRes, bookingsRes, sponsorshipsRes, logsRes] = await Promise.all([
        db.query(
          `SELECT id, order_number, guest_name, guest_email, guest_phone, total_inr, status, payment_method, payment_status, shipping_summary, created_at
           FROM orders ORDER BY created_at DESC LIMIT 20`
        ),
        db.query(
          `SELECT id, guest_name, guest_email, check_in, check_out, guests_count, nights_count, total_amount_inr, status, created_at
           FROM bookings ORDER BY created_at DESC LIMIT 20`
        ),
        db.query(
          `SELECT id, calf_name, sponsor_name, sponsor_email, plan_type, amount_inr, status, created_at
           FROM sponsorships ORDER BY created_at DESC LIMIT 20`
        ),
        db.query(
          `SELECT id, action, entity_type, entity_id, metadata, created_at
           FROM audit_logs ORDER BY created_at DESC LIMIT 25`
        )
      ]);

      const totalOrderRevenueInr = ordersRes.rows.reduce(
        (sum, r) => sum + Number(r.total_inr || 0),
        0
      );

      return NextResponse.json({
        mode: "admin",
        metrics: {
          recentOrdersCount: ordersRes.rows.length,
          recentOrderVolumeInr: totalOrderRevenueInr,
          recentBookingsCount: bookingsRes.rows.length,
          recentSponsorshipsCount: sponsorshipsRes.rows.length
        },
        orders: ordersRes.rows,
        bookings: bookingsRes.rows,
        sponsorships: sponsorshipsRes.rows,
        auditLogs: logsRes.rows
      });
    }

    // Customer records are scoped to the verified Supabase session.
    // The old ?email=... parameter is intentionally no longer trusted.
    const customer = await getCustomerIdentity(req);
    if (!customer) {
      return NextResponse.json(
        { error: "Please sign in to view your customer records." },
        { status: 401 }
      );
    }

    const [ordersRes, bookingsRes, sponsorshipsRes] = await Promise.all([
      db.query(
        `SELECT id, order_number, shipping_summary, subtotal_inr, total_inr, status, created_at
         FROM orders WHERE LOWER(guest_email) = $1 ORDER BY created_at DESC LIMIT 20`,
        [customer.email]
      ),
      db.query(
        `SELECT id, stay_slug, check_in, check_out, guests_count, nights_count, total_amount_inr, status, created_at
         FROM bookings WHERE LOWER(guest_email) = $1 ORDER BY created_at DESC LIMIT 20`,
        [customer.email]
      ),
      db.query(
        `SELECT id, calf_name, plan_type, amount_inr, status, created_at
         FROM sponsorships WHERE LOWER(sponsor_email) = $1 ORDER BY created_at DESC LIMIT 20`,
        [customer.email]
      )
    ]);

    return NextResponse.json({
      mode: "customer",
      email: customer.email,
      orders: ordersRes.rows,
      bookings: bookingsRes.rows,
      sponsorships: sponsorshipsRes.rows
    });
  } catch (err) {
    console.error("Customer dashboard request failed:", err);
    return NextResponse.json({ error: "Customer records are temporarily unavailable." }, { status: 503 });
  }
}
