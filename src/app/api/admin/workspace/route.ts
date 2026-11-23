import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminActor } from "@/lib/admin-auth";

export const runtime = "nodejs";



const CONFIG = {
  orders: {
    table: "orders o",
    columns: "o.id, o.order_number, o.guest_name, o.guest_email, o.guest_phone, o.total_inr, o.status, o.payment_method, o.payment_status, o.shipping_summary, o.created_at, (SELECT r.status FROM order_returns r WHERE r.order_id = o.id ORDER BY r.created_at DESC LIMIT 1) AS return_status, (SELECT r.reason FROM order_returns r WHERE r.order_id = o.id ORDER BY r.created_at DESC LIMIT 1) AS return_reason, (SELECT COALESCE(SUM(f.amount_inr),0)::int FROM order_refunds f WHERE f.order_id = o.id) AS refunded_inr",
    search: "(COALESCE(order_number,'') ILIKE $1 OR COALESCE(guest_name,'') ILIKE $1 OR COALESCE(guest_email,'') ILIKE $1 OR COALESCE(guest_phone,'') ILIKE $1 OR id::text ILIKE $1)",
  },
  bookings: {
    table: "bookings",
    columns: "id, guest_name, guest_email, check_in, check_out, guests_count, nights_count, total_amount_inr, status, created_at",
    search: "(COALESCE(guest_name,'') ILIKE $1 OR COALESCE(guest_email,'') ILIKE $1 OR id::text ILIKE $1)",
  },
  sponsorships: {
    table: "sponsorships",
    columns: "id, calf_name, sponsor_name, sponsor_email, plan_type, amount_inr, status, created_at",
    search: "(COALESCE(calf_name,'') ILIKE $1 OR COALESCE(sponsor_name,'') ILIKE $1 OR COALESCE(sponsor_email,'') ILIKE $1 OR id::text ILIKE $1)",
  },
} as const;

type Kind = keyof typeof CONFIG;

export async function GET(req: NextRequest) {
  if (!(await getAdminActor(req, "operations"))) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const params = req.nextUrl.searchParams;
  const kind = params.get("kind") as Kind | null;
  if (!kind || !Object.prototype.hasOwnProperty.call(CONFIG, kind)) return NextResponse.json({ error: "Choose orders, bookings or sponsorships." }, { status: 400 });

  const page = Math.max(1, Math.min(100000, Number.parseInt(params.get("page") || "1", 10) || 1));
  const pageSize = Math.max(5, Math.min(50, Number.parseInt(params.get("pageSize") || "25", 10) || 25));
  const search = (params.get("search") || "").trim().slice(0, 120);
  const status = (params.get("status") || "").trim().slice(0, 50);
  const config = CONFIG[kind];
  const where: string[] = [];
  const values: (string | number)[] = [];
  if (search) { values.push(`%${search}%`); where.push(config.search.replaceAll("$1", "$" + values.length)); }
  if (status && status !== "all") { values.push(status); where.push(`status = $${values.length}`); }
  const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  try {
    const count = await db.query(`SELECT COUNT(*)::int AS total FROM ${config.table} ${clause}`, values);
    const offset = (page - 1) * pageSize;
    const rows = await db.query(
      `SELECT ${config.columns} FROM ${config.table} ${clause} ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
      [...values, pageSize, offset]
    );
    const total = Number(count.rows[0]?.total || 0);
    return NextResponse.json({
      kind, records: rows.rows, page, pageSize, total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      hasPrevious: page > 1, hasNext: offset + rows.rows.length < total,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Admin workspace query failed:", error);
    return NextResponse.json({ error: "Unable to load the requested records." }, { status: 503 });
  }
}
