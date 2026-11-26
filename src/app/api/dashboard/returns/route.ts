import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCustomerIdentity } from "@/lib/customer-auth";
import { enforceRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const customer = await getCustomerIdentity(req);
  if (!customer) return NextResponse.json({ error: "Please sign in." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  try {
    const result = await db.query(
      `SELECT r.id, r.status, r.reason, r.customer_note, r.requested_at, r.reviewed_at, r.received_at,
              o.order_number
         FROM order_returns r JOIN orders o ON o.id = r.order_id
        WHERE lower(COALESCE(o.guest_email,'')) = $1 OR o.user_id = $2::uuid
        ORDER BY r.requested_at DESC LIMIT 50`,
      [customer.email, customer.databaseUserId]
    );
    return NextResponse.json({ returns: result.rows }, { headers: { "Cache-Control": "private, no-store, max-age=0" } });
  } catch (error) {
    console.error("Customer return history failed:", error);
    return NextResponse.json({ error: "Return history is temporarily unavailable." }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  const rateLimited = await enforceRateLimit(req, "customer-returns", 5, 600);
  if (rateLimited) return rateLimited;

  const customer = await getCustomerIdentity(req);
  if (!customer) return NextResponse.json({ error: "Please sign in to request a return." }, { status: 401 });

  let body: { orderId?: string; reason?: string; note?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid return request." }, { status: 400 }); }

  const orderId = typeof body.orderId === "string" ? body.orderId.trim() : "";
  const reason = typeof body.reason === "string" ? body.reason.replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, 1000) : "";
  const note = typeof body.note === "string" ? body.note.replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, 1000) : null;

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(orderId) || reason.length < 5) {
    return NextResponse.json({ error: "Choose a valid order and provide a return reason (at least 5 characters)." }, { status: 400 });
  }

  try {
    const result = await db.query(
      `INSERT INTO order_returns (order_id, reason, customer_note)
       SELECT o.id, $3, $4 FROM orders o
        WHERE o.id = $1 AND (lower(COALESCE(o.guest_email,'')) = $2 OR o.user_id = $5::uuid)
          AND o.status = 'delivered'
       ON CONFLICT (order_id) DO NOTHING
       RETURNING id, status, reason, requested_at`,
      [orderId, customer.email, reason, note, customer.databaseUserId]
    );
    if (!result.rows[0]) return NextResponse.json({ error: "Return requests are available for delivered orders only, and each order can have one return request." }, { status: 409 });
    return NextResponse.json({ ok: true, returnRequest: result.rows[0] }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Customer return request failed:", error);
    return NextResponse.json({ error: "We could not submit your return request. Please try again later." }, { status: 503 });
  }
}
