import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminActor } from "@/lib/admin-auth";

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
  const actor = await getAdminActor(req, "operations");
  if (!actor) {
    return NextResponse.json(
      { error: "Unauthorized: valid server ADMIN_ACCESS_TOKEN required." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json().catch(() => null);
    const action = typeof body?.action === "string" ? body.action.trim() : "";
    if (action === "create_batch" && actor.role !== "owner" && actor.role !== "manager") return NextResponse.json({ error: "Manager permission is required for batch publishing." }, { status: 403 });

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
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id) ||
          !ORDER_STATUSES.has(status) || status === "paid" || status === "refunded") {
        return NextResponse.json({ error: "Choose a valid workflow status. Payments must be confirmed through the payment controls." }, { status: 400 });
      }
      const client = await db.getClient();
      try {
        await client.query("BEGIN");
        const current = await client.query(
          "SELECT id, order_number, status, payment_status FROM orders WHERE id = $1 FOR UPDATE",
          [id]
        );
        if (!current.rows[0]) {
          await client.query("ROLLBACK");
          return NextResponse.json({ error: "Order not found." }, { status: 404 });
        }
        const previousStatus = String(current.rows[0].status);
        if (status === "cancelled" && ["shipped", "delivered", "refunded"].includes(previousStatus)) {
          await client.query("ROLLBACK");
          return NextResponse.json({ error: "A shipped, delivered or refunded order cannot be cancelled here. Contact the owner to resolve it." }, { status: 409 });
        }
        if (status === "cancelled" && current.rows[0].payment_status === "paid") {
          await client.query("ROLLBACK");
          return NextResponse.json({ error: "This order has already been paid. Resolve the refund or return first; stock will not be restored automatically." }, { status: 409 });
        }
        if (status === "cancelled" && previousStatus !== "cancelled") {
          const released = await client.query(
            "UPDATE orders SET status = 'cancelled', inventory_released_at = NOW() WHERE id = $1 AND inventory_released_at IS NULL RETURNING id",
            [id]
          );
          if (released.rowCount) {
            await client.query(
              `UPDATE product_variants pv
                  SET stock_qty = pv.stock_qty + oi.quantity
                 FROM order_items oi
                WHERE oi.order_id = $1 AND pv.sku = oi.variant_sku`,
              [id]
            );
          } else {
            await client.query("UPDATE orders SET status = 'cancelled' WHERE id = $1", [id]);
          }
        } else {
          await client.query("UPDATE orders SET status = $2 WHERE id = $1", [id, status]);
        }
        await client.query(
          `INSERT INTO audit_logs (action, entity_type, entity_id, metadata)
           VALUES ('ORDER_STATUS_UPDATED', 'order', $1, $2::jsonb)`,
          [id, JSON.stringify({ previousStatus, status, inventoryRestored: status === "cancelled" && previousStatus !== "cancelled" })]
        );
        const updated = await client.query("SELECT id, order_number, status, payment_status FROM orders WHERE id = $1", [id]);
        await client.query("COMMIT");
        return NextResponse.json({ ok: true, order: updated.rows[0] });
      } catch (error) {
        await client.query("ROLLBACK").catch(() => undefined);
        throw error;
      } finally {
        client.release();
      }
    }

    if (["approve_return", "reject_return", "receive_return", "record_refund"].includes(action)) {
      const id = typeof body?.id === "string" ? body.id.trim() : "";
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
        return NextResponse.json({ error: "A valid order UUID is required." }, { status: 400 });
      }
      const client = await db.getClient();
      try {
        await client.query("BEGIN");
        const found = await client.query(
          "SELECT r.id, r.order_id, r.status AS return_status, r.inventory_restocked_at, o.order_number, o.total_inr, o.payment_status, o.payment_method FROM order_returns r JOIN orders o ON o.id = r.order_id WHERE r.order_id = $1 FOR UPDATE OF r, o",
          [id]
        );
        if (!found.rows[0]) {
          await client.query("ROLLBACK");
          return NextResponse.json({ error: "No return request exists for this order." }, { status: 404 });
        }
        const record = found.rows[0];
        if (action === "approve_return" || action === "reject_return") {
          if (record.return_status !== "requested") {
            await client.query("ROLLBACK");
            return NextResponse.json({ error: "This return request has already been reviewed." }, { status: 409 });
          }
          const next = action === "approve_return" ? "approved" : "rejected";
          await client.query("UPDATE order_returns SET status = $2, reviewed_at = NOW(), reviewed_by = $3 WHERE id = $1", [record.id, next, actor.email || "admin"]);
          await client.query("INSERT INTO audit_logs (action, entity_type, entity_id, metadata) VALUES ($1, 'order_return', $2, $3::jsonb)", [action.toUpperCase(), record.id, JSON.stringify({ orderNumber: record.order_number })]);
          await client.query("COMMIT");
          return NextResponse.json({ ok: true, status: next });
        }
        if (action === "receive_return") {
          if (record.return_status !== "approved") {
            await client.query("ROLLBACK");
            return NextResponse.json({ error: "Only an approved return can be marked received." }, { status: 409 });
          }
          const restock = body?.restock === true;
          await client.query(
            "UPDATE order_returns SET status = 'received', received_at = NOW(), inventory_restocked_at = CASE WHEN $2 THEN NOW() ELSE NULL END WHERE id = $1",
            [record.id, restock]
          );
          if (restock) {
            await client.query(
              `UPDATE product_variants pv SET stock_qty = pv.stock_qty + oi.quantity
                 FROM order_items oi JOIN order_returns r ON r.order_id = oi.order_id
                WHERE r.id = $1 AND pv.sku = oi.variant_sku`,
              [record.id]
            );
          }
          await client.query("INSERT INTO audit_logs (action, entity_type, entity_id, metadata) VALUES ('RETURN_RECEIVED', 'order_return', $1, $2::jsonb)", [record.id, JSON.stringify({ orderNumber: record.order_number, inventoryRestocked: restock })]);
          await client.query("COMMIT");
          return NextResponse.json({ ok: true, status: "received", inventoryRestocked: restock });
        }
        const amount = Number(body?.amountInr);
        const reference = typeof body?.reference === "string" ? body.reference.trim().slice(0, 120) : "";
        const method = typeof body?.refundMethod === "string" ? body.refundMethod : "";
        if (!Number.isSafeInteger(amount) || amount <= 0 || !reference || !["upi", "bank_transfer", "cash"].includes(method)) {
          await client.query("ROLLBACK");
          return NextResponse.json({ error: "Enter a valid refund amount, refund method and transaction/reference number." }, { status: 400 });
        }
        if (!["paid", "partially_refunded"].includes(String(record.payment_status))) {
          await client.query("ROLLBACK");
          return NextResponse.json({ error: "Only money already recorded as received can be refunded. COD must first be collected." }, { status: 409 });
        }
        const sums = await client.query("SELECT COALESCE(SUM(amount_inr), 0)::int AS refunded FROM order_refunds WHERE order_id = $1", [id]);
        const remaining = Number(record.total_inr) - Number(sums.rows[0]?.refunded || 0);
        if (amount > remaining) {
          await client.query("ROLLBACK");
          return NextResponse.json({ error: `Refund exceeds the remaining refundable balance of ₹${remaining}.` }, { status: 409 });
        }
        const refund = await client.query(
          "INSERT INTO order_refunds (order_id, amount_inr, refund_method, reference, note, recorded_by) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, amount_inr, created_at",
          [id, amount, method, reference, typeof body?.note === "string" ? body.note.trim().slice(0, 500) : null, actor.email || "admin"]
        );
        const totalRefunded = Number(sums.rows[0]?.refunded || 0) + amount;
        const fullRefund = totalRefunded >= Number(record.total_inr);
        await client.query("UPDATE orders SET payment_status = $2, status = CASE WHEN $3 THEN 'refunded' ELSE status END WHERE id = $1", [id, fullRefund ? "refunded" : "partially_refunded", fullRefund]);
        if (fullRefund) await client.query("UPDATE payments SET status = 'refunded', event_type = 'manual_refund_recorded' WHERE order_id = $1 AND status = 'captured'", [id]);
        await client.query("INSERT INTO audit_logs (action, entity_type, entity_id, metadata) VALUES ('ORDER_REFUND_RECORDED', 'order', $1, $2::jsonb)", [id, JSON.stringify({ amountInr: amount, totalRefundedInr: totalRefunded, fullRefund, method, reference })]);
        await client.query("COMMIT");
        return NextResponse.json({ ok: true, refund: refund.rows[0], totalRefundedInr: totalRefunded, remainingInr: Number(record.total_inr) - totalRefunded, fullRefund });
      } catch (error) {
        await client.query("ROLLBACK").catch(() => undefined);
        throw error;
      } finally { client.release(); }
    }

    if (action === "confirm_cod_payment") {
      const id = typeof body?.id === "string" ? body.id.trim() : "";
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
        return NextResponse.json({ error: "A valid order UUID is required." }, { status: 400 });
      }
      const client = await db.getClient();
      try {
        await client.query("BEGIN");
        const updated = await client.query(
          `UPDATE orders SET payment_status = 'paid'
            WHERE id = $1 AND payment_method = 'cash_on_delivery'
              AND payment_status = 'pay_on_delivery'
              AND status IN ('delivered', 'processing', 'shipped')
            RETURNING id, order_number, status, payment_status`,
          [id]
        );
        if (!updated.rows[0]) {
          await client.query("ROLLBACK");
          return NextResponse.json({ error: "COD payment can only be recorded once the order is being fulfilled or delivered." }, { status: 409 });
        }
        await client.query(
          "UPDATE payments SET status = 'captured', event_type = 'cod_collected' WHERE order_id = $1 AND provider = 'cash_on_delivery' AND status = 'created'",
          [id]
        );
        await client.query(
          `INSERT INTO audit_logs (action, entity_type, entity_id, metadata)
           VALUES ('COD_PAYMENT_COLLECTED', 'order', $1, $2::jsonb)`,
          [id, JSON.stringify({ paymentStatus: "paid" })]
        );
        await client.query("COMMIT");
        return NextResponse.json({ ok: true, order: updated.rows[0] });
      } catch (error) {
        await client.query("ROLLBACK").catch(() => undefined);
        throw error;
      } finally {
        client.release();
      }
    }

    if (action === "confirm_manual_upi_payment") {
      const id = typeof body?.id === "string" ? body.id.trim() : "";
      if (!id) {
        return NextResponse.json({ error: "A valid order UUID is required." }, { status: 400 });
      }
      const client = await db.getClient();
      try {
        await client.query("BEGIN");
        const updated = await client.query(
          `UPDATE orders
              SET payment_status = 'paid', status = CASE WHEN status = 'pending_confirmation' THEN 'paid' ELSE status END
            WHERE id = $1
              AND payment_method = 'manual_upi'
              AND payment_status IN ('awaiting_manual_payment', 'payment_submitted')
            RETURNING id, order_number, status, payment_status`,
          [id]
        );
        if (updated.rowCount === 0) {
          await client.query("ROLLBACK");
          return NextResponse.json({ error: "Manual UPI order not found or it is already processed." }, { status: 404 });
        }
        await client.query(
          `UPDATE payments SET status = 'captured', event_type = 'manual_upi_verified'
            WHERE order_id = $1 AND provider = 'manual_upi' AND status = 'created'`,
          [id]
        );
        await client.query(
          `INSERT INTO audit_logs (action, entity_type, entity_id, metadata)
           VALUES ('MANUAL_UPI_PAYMENT_VERIFIED', 'order', $1, $2::jsonb)`,
          [id, JSON.stringify({ paymentStatus: "paid" })]
        );
        await client.query("COMMIT");
        return NextResponse.json({ ok: true, order: updated.rows[0] });
      } catch (error) {
        await client.query("ROLLBACK").catch(() => undefined);
        throw error;
      } finally {
        client.release();
      }
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
  } catch (error) {
    console.error("Admin record operation failed:", error);
    return NextResponse.json({ error: "The requested admin operation could not be completed." }, { status: 500 });
  }
}
