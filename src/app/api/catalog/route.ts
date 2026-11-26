import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { ProductDTO, ProductVariantDTO } from "@/types/domain";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CatalogRow = {
  id: string;
  slug: string;
  name_en: string;
  name_hi: string | null;
  name_ma: string | null;
  description_en: string;
  image_url: string | null;
  sourcing_info: string | null;
  production_method: string | null;
  storage_instructions: string | null;
  variants: Array<{
    id: string;
    sku: string;
    label: string;
    priceInr: number | string;
    stockQty: number | string;
    isDefault: boolean;
  }> | null;
};

export async function GET() {
  try {
    // Aggregate variants in PostgreSQL so catalogue loading is one indexed
    // relational query rather than filtering the full variant list per product.
    const result = await db.query(
      `SELECT
         p.id,
         p.slug,
         p.name_en,
         p.name_hi,
         p.name_ma,
         p.description_en,
         p.image_url,
         p.sourcing_info,
         p.production_method,
         p.storage_instructions,
         COALESCE(
           jsonb_agg(
             jsonb_build_object(
               'id', pv.id,
               'sku', pv.sku,
               'label', pv.label,
               'priceInr', pv.price_inr,
               'stockQty', pv.stock_qty,
               'isDefault', pv.is_default
             ) ORDER BY pv.is_default DESC, pv.label ASC
           ) FILTER (WHERE pv.id IS NOT NULL),
           '[]'::jsonb
         ) AS variants
       FROM products p
       LEFT JOIN product_variants pv
         ON pv.product_id = p.id AND pv.stock_qty > 0
       WHERE p.is_active = TRUE
       GROUP BY p.id
       ORDER BY p.created_at ASC`
    );

    const catalog: ProductDTO[] = (result.rows as CatalogRow[]).map((product) => ({
      id: String(product.id),
      slug: String(product.slug),
      nameEn: String(product.name_en),
      nameHi: product.name_hi,
      nameMa: product.name_ma,
      descriptionEn: String(product.description_en || ""),
      imageUrl: product.image_url,
      sourcingInfo: product.sourcing_info,
      productionMethod: product.production_method,
      storageInstructions: product.storage_instructions,
      variants: (product.variants || []).map((variant): ProductVariantDTO => ({
        id: String(variant.id),
        sku: String(variant.sku),
        label: String(variant.label),
        priceInr: Number(variant.priceInr),
        stockQty: Number(variant.stockQty),
        isDefault: Boolean(variant.isDefault),
      })),
    }));

    return NextResponse.json(
      { catalog },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
  } catch (error) {
    console.error("Catalog API error:", error);
    return NextResponse.json(
      { error: "The catalogue is temporarily unavailable. Please try again." },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}
