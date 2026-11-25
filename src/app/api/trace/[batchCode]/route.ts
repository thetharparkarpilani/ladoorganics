import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { enforceRateLimit } from "@/lib/rate-limit";

function buildJourney(
  originLocation: string,
  productionDate: string,
  packagingDate: string | null,
  qualityChecks: string | null
) {
  const hasQualityRecord = Boolean(qualityChecks && qualityChecks.trim());
  return [
    { step: 1, stage: "Farm Origin", location: originLocation || "Pending confirmation", date: productionDate, status: originLocation ? "recorded" : "pending" },
    { step: 2, stage: "Production", location: originLocation || "Pending confirmation", date: productionDate, status: "recorded" },
    { step: 3, stage: "Quality Checks", location: originLocation || "Pending confirmation", date: hasQualityRecord ? (packagingDate || productionDate) : "Pending confirmation", status: hasQualityRecord ? "recorded" : "pending" },
    { step: 4, stage: "Packaging", location: originLocation || "Pending confirmation", date: packagingDate || "Pending confirmation", status: packagingDate ? "recorded" : "pending" },
    { step: 5, stage: "Dispatch", location: "Confirmed per order", date: "Confirmed per shipment", status: "order_dependent" },
    { step: 6, stage: "Delivery", location: "Confirmed per shipment", date: "Confirmed per shipment", status: "order_dependent" }
  ];
}

export async function GET(req: NextRequest, context: { params: Promise<{ batchCode: string }> }) {
  const rateLimited = await enforceRateLimit(req, "public-batch-trace", 30, 60);
  if (rateLimited) return rateLimited;

  const { batchCode } = await context.params;
  let normalizedCode = "";
  try {
    normalizedCode = decodeURIComponent(batchCode || "").trim().toUpperCase();
  } catch {
    return NextResponse.json({ error: "Invalid batch code." }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  if (!/^[A-Z0-9][A-Z0-9-]{2,63}$/.test(normalizedCode)) {
    return NextResponse.json({ error: "Invalid batch code." }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
  // This legacy sample record was seeded for development and is not evidence
  // of an actual production batch. Never expose it as verified traceability.
  if (normalizedCode === "LO-PILANI-SAMPLE-001") {
    return NextResponse.json(
      { error: "That is a demonstration code, not a verified production batch. Please use the batch code printed on your product label or contact the Lado team." },
      { status: 404, headers: { "Cache-Control": "no-store" } }
    );
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

    if (!result.rows[0]) {
      return NextResponse.json({ error: "Approved batch record not found." }, { status: 404, headers: { "Cache-Control": "no-store" } });
    }

    const row = result.rows[0];
    const productionDate = String(row.production_date);
    const packagingDate = row.packaging_date ? String(row.packaging_date) : null;
    const qualityChecks = typeof row.quality_checks === "string" ? row.quality_checks : null;
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
      journey: buildJourney(row.origin_location, productionDate, packagingDate, qualityChecks)
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Batch trace lookup failed:", error);
    return NextResponse.json({ error: "Batch verification is temporarily unavailable. Please try again later." }, {
      status: 503,
      headers: { "Cache-Control": "no-store" }
    });
  }
}
