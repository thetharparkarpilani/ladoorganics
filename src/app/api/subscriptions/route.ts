import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const ALLOWED_INTERVALS = new Set([30, 45, 60, 90]);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const subscriberEmail =
      typeof body?.subscriberEmail === "string" ? body.subscriberEmail.trim().toLowerCase() : "";
    const subscriberPhone =
      typeof body?.subscriberPhone === "string" ? body.subscriberPhone.trim() : "";
    const itemLabel = typeof body?.itemLabel === "string" ? body.itemLabel.trim() : "";
    const intervalDays = Number(body?.intervalDays ?? 30);
    const quantity = Number(body?.quantity ?? 1);

    if (!subscriberEmail || !subscriberEmail.includes("@") || !itemLabel) {
      return NextResponse.json(
        { error: "Valid subscriber email and product selection are required." },
        { status: 400 }
      );
    }

    if (!ALLOWED_INTERVALS.has(intervalDays)) {
      return NextResponse.json(
        { error: "Interval must be 30, 45, 60, or 90 days." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      return NextResponse.json(
        { error: "Quantity must be between 1 and 20." },
        { status: 400 }
      );
    }

    const res = await db.query(
      `INSERT INTO subscription_preferences (
        subscriber_email, subscriber_phone, item_label, interval_days, quantity, status
      ) VALUES ($1, $2, $3, $4, $5, 'enquiry_logged')
      RETURNING id, item_label, interval_days, quantity, status, created_at`,
      [subscriberEmail, subscriberPhone || null, itemLabel, intervalDays, quantity]
    );

    await db.query(
      `INSERT INTO audit_logs (action, entity_type, entity_id, metadata)
       VALUES ('SUBSCRIPTION_PREFERENCE_LOGGED', 'subscription_preference', $1, $2::jsonb)`,
      [res.rows[0].id, JSON.stringify({ subscriberEmail, itemLabel, intervalDays, quantity })]
    );

    return NextResponse.json(
      {
        subscription: res.rows[0],
        note: "Preference recorded. Automatic recurring charges remain disabled until payment mandate credentials are configured."
      },
      { status: 201 }
    );
  } catch (err) {
    const detail = err instanceof Error ? err.message : "Failed to save subscription preference";
    return NextResponse.json({ error: detail }, { status: 500 });
  }
}
