import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const rateLimited = await enforceRateLimit(req, "catalog-search", 60, 60);
  if (rateLimited) return rateLimited;
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("q") || "").trim().slice(0, 80).replace(/[%_\\\\]/g, " ");

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const searchTerm = `%${query}%`;
    
    // Searches across English names, Hindi names, and descriptions concurrently
    const res = await db.query(`
      SELECT p.slug, p.name_en, p.name_hi, p.description_en, v.price_inr, v.label, v.sku
      FROM products p
      JOIN LATERAL (
        SELECT price_inr, label, sku
        FROM product_variants
        WHERE product_id = p.id AND stock_qty > 0
        ORDER BY is_default DESC, label ASC
        LIMIT 1
      ) v ON TRUE
      WHERE (p.name_en ILIKE $1 OR p.name_hi ILIKE $1 OR p.description_en ILIKE $1)
        AND p.is_active = TRUE
      ORDER BY p.created_at ASC
      LIMIT 5
    `, [searchTerm]);

    return NextResponse.json({ results: res.rows });
  } catch (err) {
    console.error("Search API Error:", err);
    return NextResponse.json({ error: "Failed to execute search." }, { status: 500 });
  }
}
