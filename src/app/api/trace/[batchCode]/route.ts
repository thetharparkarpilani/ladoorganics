import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const SAMPLE_BATCH = {
  batchCode: "LO-PILANI-SAMPLE-001",
  productSlug: "a2-bilona-ghee",
  productName: "A2 Bilona Ghee",
  variantLabel: "1 litre",
  productionDate: "2026-10-15",
  packagingDate: "2026-10-20",
  originLocation: "Pilani, Jhunjhunu, Rajasthan",
  productionProcess:
    "Curd-cultured indigenous Tharparkar milk churned via traditional wooden Bilona method.",
  qualityChecks:
    "Batch recorded in Pilani traceability ledger. Verified lab reports are attached only when published by an administrator.",
  labReportUrl: null,
  storageInstructions:
    "Store in a cool, dry place away from direct sunlight. Keep lid tightly closed.",
  bestBeforeDate: "2027-07-15",
  source: "sample_reference"
};

function buildJourney(originLocation: string, productionDate: string, packagingDate: string | null) {
  return [
    { step: 1, stage: "Farm Origin", location: originLocation, date: productionDate, status: "recorded" },
    { step: 2, stage: "Production", location: originLocation, date: productionDate, status: "recorded" },
    { step: 3, stage: "Quality Checks", location: originLocation, date: packagingDate || productionDate, status: "recorded" },
    { step: 4, stage: "Packaging", location: originLocation, date: packagingDate || "Pending confirmation", status: packagingDate ? "recorded" : "pending" },
    { step: 5, stage: "Dispatch", location: "Pilani Dispatch Hub", date: "Confirmed per order", status: "order_dependent" },
    { step: 6, stage: "Delivery", location: "Customer Address", date: "Confirmed per shipment", status: "order_dependent" }
  ];
}

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ batchCode: string }> }
) {
  const { batchCode } = await context.params;
  const normalizedCode = decodeURIComponent(batchCode || "").trim().toUpperCase();

  if (!normalizedCode || normalizedCode.length > 64) {
    return NextResponse.json({ error: "Invalid batch code." }, { status: 400 });
  }

  try {
    const result = await db.query(
      `SELECT batch_code, product_slug, product_name, variant_label,
              production_date, packaging_date, origin_location,
              production_process, quality_checks, lab_report_url,
              storage_instructions, best_before_date
       FROM product_batches
       WHERE UPPER(batch_code) = $1 AND is_approved = TRUE
       LIMIT 1`,
      [normalizedCode]
    );

    if (result.rows.length > 0) {
      const row = result.rows[0];
      return NextResponse.json({
        batch: {
          batchCode: row.batch_code,
          productSlug: row.product_slug,
          productName: row.product_name,
          variantLabel: row.variant_label,
          productionDate: row.production_date,
          packagingDate: row.packaging_date,
          originLocation: row.origin_location,
          productionProcess: row.production_process,
          qualityChecks: row.quality_checks,
          labReportUrl: row.lab_report_url,
          storageInstructions: row.storage_instructions,
          bestBeforeDate: row.best_before_date,
          source: "database"
        },
        journey: buildJourney(
          row.origin_location,
          String(row.production_date),
          row.packaging_date ? String(row.packaging_date) : null
        )
      });
    }

    if (normalizedCode === SAMPLE_BATCH.batchCode) {
      return NextResponse.json({
        batch: SAMPLE_BATCH,
        journey: buildJourney(
          SAMPLE_BATCH.originLocation,
          SAMPLE_BATCH.productionDate,
          SAMPLE_BATCH.packagingDate
        )
      });
    }

    return NextResponse.json({ error: "Approved batch record not found." }, { status: 404 });
  } catch {
    if (normalizedCode === SAMPLE_BATCH.batchCode) {
      return NextResponse.json({
        batch: SAMPLE_BATCH,
        journey: buildJourney(
          SAMPLE_BATCH.originLocation,
          SAMPLE_BATCH.productionDate,
          SAMPLE_BATCH.packagingDate
        )
      });
    }
    return NextResponse.json({ error: "Unable to verify batch record right now." }, { status: 503 });
  }
}
