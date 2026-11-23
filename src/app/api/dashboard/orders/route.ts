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
        { error: "Please sign in to view your orders." },
        { status: 401, headers: { "Cache-Control": "no-store" } }
      );
    }

    const result = await db.query(
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
       WHERE lower(COALESCE(o.guest_email, '')) = $1 OR o.user_id = $2::uuid
       ORDER BY o.created_at DESC
       LIMIT 100`,
      [customer.email, customer.databaseUserId]
    );

    return NextResponse.json(
      { orders: result.rows },
      { headers: { "Cache-Control": "private, no-store, max-age=0" } }
    );
  } catch (error) {
    console.error("Customer order history failed:", error);
    return NextResponse.json(
      { error: "Order history is temporarily unavailable. Please try again later." },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}
