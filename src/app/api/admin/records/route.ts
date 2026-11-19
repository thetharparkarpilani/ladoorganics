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

const ORDER_STATUSES = new Set([
  "pending_confirmation",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded"
]);

const BOOKING_STATUSES = new Set(["pending", "confirmed", "cancelled", "completed"]);
const SPONSORSHIP_STATUSES = new Set(["pending", "active", "paused", "cancelled"]);

export async function POST(req: NextRequest) {
  const token = req.headers.get("x-admin-token");
  if (!isAuthorizedAdmin(token)) {
    return NextResponse.json(
      { error: "Unauthorized: valid server ADMIN_ACCESS_TOKEN required." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json().catch(() => null);
    const action = typeof body?.action === "string" ? body.action.trim() : "";

    if (action === "create_batch") {
      const batchCode = typeof body?.batchCode === "string" ? body.batchCode.trim().toUpperCase() : "";
      const productSlug = typeof body?.productSlug === "string" ? body.productSlug.trim() : "a2-bilona-ghee";
      const productName = typeof body?.productName === "string" ? body.productName.trim() : "";
      const variantLabel = typeof body?.variantLabel === "string" ? body.variantLabel.trim() : "1 litre";
      const productionDate = typeof body?.productionDate === "string" ? body.productionDate.trim() : "";
      const packagingDate = typeof body?.packagingDate === "string" ? body.packagingDate.trim() : "";
      const productionProcess =
        typeof body?.productionProcess === "string" ? body.productionProcess.trim() : "";
      const qualityChecks = typeof body?.qualityChecks === "string" ? body.qualityChecks.trim() : "";
      const storageInstructions =
        typeof body?.storageInstructions === "string" ? body.storageInstructions.trim() : "";
      const bestBeforeDate = typeof body?.bestBeforeDate === "string" ? body.bestBeforeDate.trim() : "";
      const labReportUrl =
        typeof body?.labReportUrl === "string" && body.labReportUrl.trim().startsWith("https://")
          ? body.labReportUrl.trim()
          : null;

      if (!batchCode || !productName || !productionDate || !productionProcess || !qualityChecks || !storageInstructions) {
        return NextResponse.json(
          {
            error:
              "Batch code, product name, production date, production process, quality checks, and storage instructions are required."
          },
          { status: 400 }
        );
      }

      const res = await db.query(
        `INSERT INTO product_batches (
          batch_code, product_slug, product_name, variant_label,
          production_date, packaging_date, origin_location,
          production_process, quality_checks, lab_report_url,
          storage_instructions, best_before_date, is_approved
        ) VALUES ($1, $2, $3, $4, $5::date, $6, 'Pilani, Jhunjhunu, Rajasthan', $7, $8, $9, $10, $11, TRUE)
        ON CONFLICT (batch_code) DO UPDATE SET
          product_name = EXCLUDED.product_name,
          variant_label = EXCLUDED.variant_label,
          production_date = EXCLUDED.production_date,
          packaging_date = EXCLUDED.packaging_date,
          production_process = EXCLUDED.production_process,
          quality_checks = EXCLUDED.quality_checks,
          lab_report_url = EXCLUDED.lab_report_url,
          storage_instructions = EXCLUDED.storage_instructions,
          best_before_date = EXCLUDED.best_before_date,
          is_approved = TRUE
        RETURNING id, batch_code, product_name, variant_label`,
        [
          batchCode,
          productSlug,
          productName,
          variantLabel,
          productionDate,
          packagingDate || null,
          productionProcess,
          qualityChecks,
          labReportUrl,
          storageInstructions,
          bestBeforeDate || null
        ]
      );

      await db.query(
        `INSERT INTO audit_logs (action, entity_type, entity_id, metadata)
         VALUES ('BATCH_PUBLISHED', 'product_batch', $1, $2::jsonb)`,
        [res.rows[0].id, JSON.stringify({ batchCode, productName, variantLabel })]
      );

      return NextResponse.json({ ok: true, batch: res.rows[0] }, { status: 201 });
    }

    if (action === "update_order_status") {
      const id = typeof body?.id === "string" ? body.id.trim() : "";
      const status = typeof body?.status === "string" ? body.status.trim() : "";
      if (!id || !ORDER_STATUSES.has(status)) {
        return NextResponse.json({ error: "Valid order id and status are required." }, { status: 400 });
      }
      const res = await db.query(
        `UPDATE orders SET status = $2 WHERE id = $1 RETURNING id, order_number, status`,
        [id, status]
      );
      if (res.rowCount === 0) {
        return NextResponse.json({ error: "Order not found." }, { status: 404 });
      }
      await db.query(
        `INSERT INTO audit_logs (action, entity_type, entity_id, metadata)
         VALUES ('ORDER_STATUS_UPDATED', 'order', $1, $2::jsonb)`,
        [id, JSON.stringify({ status })]
      );
      return NextResponse.json({ ok: true, order: res.rows[0] });
    }

    if (action === "update_booking_status") {
      const id = typeof body?.id === "string" ? body.id.trim() : "";
      const status = typeof body?.status === "string" ? body.status.trim() : "";
      if (!id || !BOOKING_STATUSES.has(status)) {
        return NextResponse.json({ error: "Valid booking id and status are required." }, { status: 400 });
      }
      const res = await db.query(
        `UPDATE bookings SET status = $2 WHERE id = $1 RETURNING id, status`,
        [id, status]
      );
      if (res.rowCount === 0) {
        return NextResponse.json({ error: "Booking not found." }, { status: 404 });
      }
      await db.query(
        `INSERT INTO audit_logs (action, entity_type, entity_id, metadata)
         VALUES ('BOOKING_STATUS_UPDATED', 'booking', $1, $2::jsonb)`,
        [id, JSON.stringify({ status })]
      );
      return NextResponse.json({ ok: true, booking: res.rows[0] });
    }

    if (action === "update_sponsorship_status") {
      const id = typeof body?.id === "string" ? body.id.trim() : "";
      const status = typeof body?.status === "string" ? body.status.trim() : "";
      if (!id || !SPONSORSHIP_STATUSES.has(status)) {
        return NextResponse.json({ error: "Valid sponsorship id and status are required." }, { status: 400 });
      }
      const res = await db.query(
        `UPDATE sponsorships SET status = $2 WHERE id = $1 RETURNING id, calf_name, status`,
        [id, status]
      );
      if (res.rowCount === 0) {
        return NextResponse.json({ error: "Sponsorship not found." }, { status: 404 });
      }
      await db.query(
        `INSERT INTO audit_logs (action, entity_type, entity_id, metadata)
         VALUES ('SPONSORSHIP_STATUS_UPDATED', 'sponsorship', $1, $2::jsonb)`,
        [id, JSON.stringify({ status })]
      );
      return NextResponse.json({ ok: true, sponsorship: res.rows[0] });
    }

    return NextResponse.json({ error: "Unsupported admin action." }, { status: 400 });
  } catch (err) {
    const detail = err instanceof Error ? err.message : "Admin operation failed";
    return NextResponse.json({ error: detail }, { status: 500 });
  }
}
