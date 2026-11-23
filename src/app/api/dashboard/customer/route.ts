import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCustomerIdentity } from "@/lib/customer-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const customer = await getCustomerIdentity(req);
    if (!customer) {
      return NextResponse.json(
        { error: "Please sign in to view your customer account." },
        { status: 401, headers: { "Cache-Control": "no-store" } }
      );
    }

    const [ordersResult, bookingsResult, sponsorshipsResult] = await Promise.all([
      db.query(
        `SELECT o.id, o.order_number, o.status, o.payment_method, o.payment_status,
                o.subtotal_inr, o.total_inr, o.shipping_summary, o.created_at,
                COALESCE((
                  SELECT jsonb_agg(jsonb_build_object(
                    'id', oi.id,
                    'item_title', oi.item_title,
                    'quantity', oi.quantity,
                    'unit_price_inr', oi.unit_price_inr,
                    'variant_sku', oi.variant_sku
                  ) ORDER BY oi.id)
                  FROM order_items oi WHERE oi.order_id = o.id
                ), '[]'::jsonb) AS items
         FROM orders o
         WHERE lower(COALESCE(o.guest_email, '')) = $1
         ORDER BY o.created_at DESC
         LIMIT 20`,
        [customer.email]
      ),
      db.query(
        `SELECT id, stay_slug, check_in, check_out, guests_count, nights_count,
                total_amount_inr, status, created_at
         FROM bookings
         WHERE lower(COALESCE(guest_email, '')) = $1
         ORDER BY created_at DESC
         LIMIT 20`,
        [customer.email]
      ),
      db.query(
        `SELECT id, calf_name, plan_type, amount_inr, status, created_at
         FROM sponsorships
         WHERE lower(COALESCE(sponsor_email, '')) = $1
         ORDER BY created_at DESC
         LIMIT 20`,
        [customer.email]
      ),
    ]);

    return NextResponse.json({
      profile: { name: customer.fullName, email: customer.email },
      orders: ordersResult.rows,
      bookings: bookingsResult.rows,
      sponsorships: sponsorshipsResult.rows,
    }, {
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    });
  } catch (error) {
    console.error("Customer dashboard request failed:", error);
    return NextResponse.json(
      { error: "Your account records are temporarily unavailable. Please try again later." },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}
