import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { enforceRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const cleanExcerpt = (value: unknown, max = 220) =>
  String(value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);

export async function GET(req: NextRequest) {
  const rateLimited = await enforceRateLimit(req, "catalog-search", 60, 60);
  if (rateLimited) return rateLimited;

  const { searchParams } = new URL(req.url);
  const query = (searchParams.get("q") || "")
    .trim()
    .slice(0, 80)
    .replace(/[%_\\]/g, " ")
    .replace(/\s+/g, " ");

  if (query.length < 2) {
    return NextResponse.json({ results: [], products: [], pages: [] }, {
      headers: { "Cache-Control": "no-store" },
    });
  }

  const searchTerm = `%${query}%`;

  try {
    const [productsResult, pagesResult] = await Promise.all([
      db.query(
        `SELECT p.slug, p.name_en, p.name_hi, p.name_ma, p.description_en,
                v.price_inr, v.label, v.sku
           FROM products p
           JOIN LATERAL (
             SELECT price_inr, label, sku
               FROM product_variants
              WHERE product_id = p.id AND stock_qty > 0
              ORDER BY is_default DESC, label ASC
              LIMIT 1
           ) v ON TRUE
          WHERE p.is_active = TRUE
            AND (p.name_en ILIKE $1 OR p.name_hi ILIKE $1
              OR p.name_ma ILIKE $1 OR p.description_en ILIKE $1)
          ORDER BY p.created_at ASC
          LIMIT 12`,
        [searchTerm]
      ),
      db.query(
        `SELECT content_key, title, body
           FROM site_content
          WHERE is_published = TRUE AND body <> ''
            AND (title ILIKE $1 OR body ILIKE $1)
          LIMIT 8`,
        [searchTerm]
      ),
    ]);

    const products = productsResult.rows.map((row) => ({
      slug: String(row.slug),
      nameEn: String(row.name_en || ""),
      nameHi: row.name_hi ? String(row.name_hi) : null,
      nameMa: row.name_ma ? String(row.name_ma) : null,
      description: cleanExcerpt(row.description_en, 240),
      priceInr: Number(row.price_inr),
      variantLabel: String(row.label || ""),
      sku: String(row.sku || ""),
    }));

    const pages = pagesResult.rows.map((row) => ({
      title: String(row.title || "Lado Organics guide"),
      excerpt: cleanExcerpt(row.body),
      // Public editorial content is collected in the learning library.
      href: "/library",
      key: String(row.content_key || row.title || "guide"),
    }));

    return NextResponse.json({ results: productsResult.rows, products, pages }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Unified public search failed:", error);
    return NextResponse.json(
      { error: "Search is temporarily unavailable. Please try again." },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
