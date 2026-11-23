import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminActor } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  if (!(await getAdminActor(req, "analytics"))) return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  try {
    const [orders, products, bookings, sponsorships, customers, trend] = await Promise.all([
      db.query(`SELECT COUNT(*)::int AS total_orders,
        COALESCE(SUM(total_inr) FILTER (WHERE payment_status = 'paid'),0)::bigint AS collected_revenue,
        COUNT(*) FILTER (WHERE status IN ('pending_confirmation','paid','processing'))::int AS open_orders
        FROM orders WHERE status <> 'cancelled'`),
      db.query(`SELECT COUNT(DISTINCT p.id)::int AS total_products,
        COALESCE(SUM(v.stock_qty),0)::int AS total_stock
        FROM products p LEFT JOIN product_variants v ON v.product_id=p.id
        WHERE p.is_active=TRUE`),
      db.query(`SELECT COUNT(*) FILTER (WHERE status='confirmed')::int AS active_bookings,
        COUNT(*)::int AS total_bookings FROM bookings`),
      db.query(`SELECT COUNT(*) FILTER (WHERE status='active')::int AS active_sponsorships,
        COUNT(*)::int AS total_sponsorships FROM sponsorships`),
      db.query("SELECT COUNT(*)::int AS total_customers FROM users WHERE role='customer'"),
      db.query(`SELECT to_char(day,'DD Mon') AS day,
        COALESCE(SUM(o.total_inr) FILTER (WHERE o.payment_status='paid'),0)::bigint AS revenue,
        COUNT(o.id)::int AS orders
        FROM generate_series(current_date - INTERVAL '13 days', current_date, INTERVAL '1 day') AS calendar(day)
        LEFT JOIN orders o ON date_trunc('day',o.created_at)=calendar.day
        GROUP BY calendar.day ORDER BY calendar.day`)
    ]);
    return NextResponse.json({
      orders: Number(orders.rows[0]?.total_orders || 0),
      revenue: Number(orders.rows[0]?.collected_revenue || 0),
      openOrders: Number(orders.rows[0]?.open_orders || 0),
      products: Number(products.rows[0]?.total_products || 0),
      inventory: Number(products.rows[0]?.total_stock || 0),
      bookings: Number(bookings.rows[0]?.active_bookings || 0),
      totalBookings: Number(bookings.rows[0]?.total_bookings || 0),
      sponsorships: Number(sponsorships.rows[0]?.active_sponsorships || 0),
      totalSponsorships: Number(sponsorships.rows[0]?.total_sponsorships || 0),
      customers: Number(customers.rows[0]?.total_customers || 0),
      trend: trend.rows,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("Admin analytics query failed:", err);
    return NextResponse.json({ error: "Unable to load analytics. Check the database connection and required migrations." }, { status: 503 });
  }
}
