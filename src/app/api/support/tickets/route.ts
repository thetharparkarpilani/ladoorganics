import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCustomerIdentity } from "@/lib/customer-auth";
import { getAdminActor } from "@/lib/admin-auth";

export const runtime = "nodejs";

function adminAuthorized(req: NextRequest) {
  const expected = process.env.ADMIN_ACCESS_TOKEN;
  const supplied = req.headers.get("x-admin-token");
  if (!expected || !supplied) return false;
  const a = Buffer.from(supplied, "utf8");
  const b = Buffer.from(expected, "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, max) : "";
}

export async function POST(req: NextRequest) {
  try {
    const customer = await getCustomerIdentity(req);
    if (!customer) return NextResponse.json({ error: "Please sign in before sending a support request." }, { status: 401 });
    const body = await req.json().catch(() => null);
    const subject = clean(body?.subject, 140);
    const message = clean(body?.message, 4000);
    const phone = clean(body?.phone, 30);
    const name = clean(body?.name, 100) || customer.fullName;
    if (subject.length < 4 || message.length < 15) {
      return NextResponse.json({ error: "Please provide a subject and a message of at least 15 characters." }, { status: 400 });
    }
    const result = await db.query(
      `INSERT INTO support_tickets (customer_user_id, customer_name, customer_email, customer_phone, subject, message)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING id, subject, status, created_at`,
      [customer.databaseUserId, name, customer.email, phone || null, subject, message]
    );
    return NextResponse.json({ ok: true, ticket: result.rows[0] }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Support ticket submission failed:", error);
    return NextResponse.json({ error: "Support requests are temporarily unavailable. Please contact us on WhatsApp." }, { status: 503 });
  }
}

export async function GET(req: NextRequest) {
  if (!(await getAdminActor(req, "support"))) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const page = Math.max(1, Number.parseInt(req.nextUrl.searchParams.get("page") || "1", 10) || 1);
  const pageSize = Math.max(5, Math.min(50, Number.parseInt(req.nextUrl.searchParams.get("pageSize") || "25", 10) || 25));
  const search = (req.nextUrl.searchParams.get("search") || "").trim().slice(0, 120);
  const status = (req.nextUrl.searchParams.get("status") || "").trim();
  const values: (string | number)[] = [];
  const clauses: string[] = [];
  if (search) {
    values.push(`%${search}%`);
    clauses.push(`(customer_name ILIKE $1 OR customer_email ILIKE $1 OR subject ILIKE $1 OR id::text ILIKE $1)`);
  }
  if (status && status !== "all") { values.push(status); clauses.push(`status = $${values.length}`); }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  try {
    const count = await db.query(`SELECT COUNT(*)::int AS total FROM support_tickets ${where}`, values);
    const result = await db.query(
      `SELECT id, customer_name, customer_email, customer_phone, subject, message, status, priority, admin_notes, created_at, updated_at
       FROM support_tickets ${where} ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
      [...values, pageSize, (page - 1) * pageSize]
    );
    const total = Number(count.rows[0]?.total || 0);
    return NextResponse.json({ tickets: result.rows, page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Support ticket list failed:", error);
    return NextResponse.json({ error: "Unable to load support cases. Run database migration 015 first." }, { status: 503 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!adminAuthorized(req)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const body = await req.json().catch(() => null);
  const id = clean(body?.id, 50);
  const status = clean(body?.status, 30);
  const priority = clean(body?.priority, 20);
  const notes = clean(body?.adminNotes, 4000);
  const statuses = new Set(["open", "in_progress", "waiting_customer", "resolved", "closed"]);
  const priorities = new Set(["low", "normal", "high", "urgent"]);
  if (!id || !statuses.has(status) || !priorities.has(priority)) {
    return NextResponse.json({ error: "Choose a valid case, status and priority." }, { status: 400 });
  }
  try {
    const result = await db.query(
      `UPDATE support_tickets SET status=$2, priority=$3, admin_notes=$4, updated_at=NOW()
       WHERE id=$1 RETURNING id, status, priority, updated_at`,
      [id, status, priority, notes || null]
    );
    if (!result.rowCount) return NextResponse.json({ error: "Support case not found." }, { status: 404 });
    await db.query(
      `INSERT INTO audit_logs (action, entity_type, entity_id, metadata)
       VALUES ('SUPPORT_CASE_UPDATED','support_ticket',$1,$2::jsonb)`,
      [id, JSON.stringify({ status, priority })]
    );
    return NextResponse.json({ ok: true, ticket: result.rows[0] });
  } catch (error) {
    console.error("Support case update failed:", error);
    return NextResponse.json({ error: "Unable to update this support case." }, { status: 503 });
  }
}
