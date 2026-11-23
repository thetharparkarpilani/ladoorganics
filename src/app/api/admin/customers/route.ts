import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

function authorized(req: NextRequest) {
  const expected = process.env.ADMIN_ACCESS_TOKEN;
  const supplied = req.headers.get("x-admin-token");
  if (!expected || !supplied) return false;
  const a = Buffer.from(supplied, "utf8");
  const b = Buffer.from(expected, "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const page = Math.max(1, Number.parseInt(req.nextUrl.searchParams.get("page") || "1", 10) || 1);
  const pageSize = Math.max(5, Math.min(50, Number.parseInt(req.nextUrl.searchParams.get("pageSize") || "25", 10) || 25));
  const search = (req.nextUrl.searchParams.get("search") || "").trim().slice(0, 120);
  const values: (string | number)[] = [];
  const where = search ? "WHERE (u.email ILIKE $1 OR u.full_name ILIKE $1 OR u.id::text ILIKE $1)" : "";
  if (search) values.push(`%${search}%`);
  try {
    const count = await db.query(`SELECT COUNT(*)::int AS total FROM users u ${where}`, values);
    const rows = await db.query(
      `SELECT u.id, u.full_name, u.email, u.role,
        (SELECT COUNT(*)::int FROM orders o WHERE lower(o.guest_email) = lower(u.email)) AS order_count,
        (SELECT COALESCE(SUM(o.total_inr),0)::bigint FROM orders o WHERE lower(o.guest_email) = lower(u.email) AND o.status NOT IN ('cancelled','refunded')) AS order_value_inr,
        (SELECT MAX(o.created_at) FROM orders o WHERE lower(o.guest_email) = lower(u.email)) AS last_order_at
       FROM users u ${where}
       ORDER BY u.full_name ASC NULLS LAST, u.email ASC
       LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
      [...values, pageSize, (page - 1) * pageSize]
    );
    const total = Number(count.rows[0]?.total || 0);
    return NextResponse.json({
      customers: rows.rows, page, pageSize, total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Admin customer directory failed:", error);
    return NextResponse.json({ error: "Unable to load the customer directory. Confirm the customer database is available." }, { status: 503 });
  }
}
