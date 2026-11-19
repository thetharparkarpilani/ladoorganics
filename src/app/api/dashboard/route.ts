import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function isAuthorizedAdmin(headerToken: string | null): boolean {
  const expected = process.env.ADMIN_ACCESS_TOKEN;
  if (!expected || !headerToken) return false;
  const a = Buffer.from(headerToken, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("mode") || "customer";
  const email = (searchParams.get("email") || "").trim().toLowerCase();

  try {
    if (mode === "admin") {
      const token = req.headers.get("x-admin-token");
      if (!isAuthorizedAdmin(token)) {
        return NextResponse.json(
          { error: "Unauthorized: valid server ADMIN_ACCESS_TOKEN required." },
          { status: 401 }
        );
      }

      const [ordersRes, bookingsRes, sponsorshipsRes, logsRes] = await Promise.all([
        db.query(
          `SELECT id, order_number, guest_name, guest_email, guest_phone, total_inr, status, created_at
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

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Enter the email address used for your order, booking, or sponsorship." },
        { status: 400 }
      );
    }

    const [ordersRes, bookingsRes, sponsorshipsRes] = await Promise.all([
      db.query(
        `SELECT id, order_number, shipping_summary, subtotal_inr, total_inr, status, created_at
         FROM orders WHERE LOWER(guest_email) = $1 ORDER BY created_at DESC LIMIT 20`,
        [email]
      ),
      db.query(
        `SELECT id, stay_slug, check_in, check_out, guests_count, nights_count, total_amount_inr, status, created_at
         FROM bookings WHERE LOWER(guest_email) = $1 ORDER BY created_at DESC LIMIT 20`,
        [email]
      ),
      db.query(
        `SELECT id, calf_name, plan_type, amount_inr, status, created_at
         FROM sponsorships WHERE LOWER(sponsor_email) = $1 ORDER BY created_at DESC LIMIT 20`,
        [email]
      )
    ]);

    return NextResponse.json({
      mode: "customer",
      email,
      orders: ordersRes.rows,
      bookings: bookingsRes.rows,
      sponsorships: sponsorshipsRes.rows
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : "Database unavailable";
    return NextResponse.json({ error: detail }, { status: 503 });
  }
}
