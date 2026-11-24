import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

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

export async function GET(_req: NextRequest, context: { params: Promise<{ batchCode: string }> }) {
  const { batchCode } = await context.params;
  let normalizedCode = "";
  try {
    normalizedCode = decodeURIComponent(batchCode || "").trim().toUpperCase();
  } catch {
    return NextResponse.json({ error: "Invalid batch code." }, { status: 400 });
  }

  if (!/^[A-Z0-9][A-Z0-9-]{2,63}$/.test(normalizedCode)) {
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

    if (!result.rows[0]) {
      return NextResponse.json({ error: "Approved batch record not found." }, { status: 404, headers: { "Cache-Control": "no-store" } });
    }

    const row = result.rows[0];
    const productionDate = String(row.production_date);
    const packagingDate = row.packaging_date ? String(row.packaging_date) : null;
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
      journey: buildJourney(row.origin_location, productionDate, packagingDate)
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Batch trace lookup failed:", error);
    return NextResponse.json({ error: "Batch verification is temporarily unavailable. Please try again later." }, {
      status: 503,
      headers: { "Cache-Control": "no-store" }
    });
  }
}
