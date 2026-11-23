import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ProductDTO, ProductVariantDTO } from "@/types/domain";

export async function GET(req: NextRequest) {
  try {
    const client = await db.getClient();
    
    try {
      // Fetch all active products and their variants
      const productsRes = await client.query(`
        SELECT 
          id, slug, name_en, name_hi, name_ma, description_en, image_url, 
          sourcing_info, production_method, storage_instructions 
        FROM products 
        WHERE is_active = TRUE 
        ORDER BY created_at ASC
      `);

      const variantsRes = await client.query(`
        SELECT 
          id, product_id, sku, label, price_inr, stock_qty, is_default 
        FROM product_variants 
        WHERE stock_qty > 0
      `);

      // Map relational data to nested DTO
      const catalog: ProductDTO[] = productsRes.rows.map(p => {
        const productVariants = variantsRes.rows
          .filter(v => v.product_id === p.id)
          .map(v => ({
            id: v.id,
            sku: v.sku,
            label: v.label,
            priceInr: v.price_inr,
            stockQty: v.stock_qty,
            isDefault: v.is_default
          }));

        return {
          id: p.id,
          slug: p.slug,
          nameEn: p.name_en,
          nameHi: p.name_hi,
          nameMa: p.name_ma,
          descriptionEn: p.description_en,
          imageUrl: p.image_url,
          sourcingInfo: p.sourcing_info,
          productionMethod: p.production_method,
          storageInstructions: p.storage_instructions,
          variants: productVariants
        };
      });

      return NextResponse.json({ catalog });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Catalog API Error:", err);
    return NextResponse.json({ error: "Failed to load catalog." }, { status: 500 });
  }
}
