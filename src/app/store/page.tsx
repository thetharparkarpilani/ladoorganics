import StoreCatalogExperience from "@/components/StoreCatalogExperience";
import { db } from "@/lib/db";
import { getServerLocale } from "@/lib/server-locale";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Shop the Collection | Lado Organics",
  description: "Explore the current Lado Organics collection and listed pack prices from Pilani, Rajasthan.",
};

type StoreProduct = {
  slug: string; name_en: string; name_hi?: string | null; name_ma?: string | null;
  description_en: string; description_hi?: string | null; description_ma?: string | null;
  sku: string; price_inr: number; label: string; image_url?: string | null;
};

async function getProducts(): Promise<{ products: StoreProduct[]; error: boolean }> {
  try {
    const res = await db.query(`
      SELECT DISTINCT ON (p.id) p.slug, p.name_en, p.name_hi, p.name_ma, p.description_en, p.description_hi, p.description_ma, p.image_url,
             v.sku, v.price_inr, v.label
      FROM products p
      JOIN product_variants v ON p.id = v.product_id AND v.stock_qty > 0
      WHERE p.is_active = TRUE
      ORDER BY p.id, v.is_default DESC, v.label ASC
    `);
    return { products: res.rows as StoreProduct[], error: false };
  } catch (error) {
    console.error("Live store catalogue unavailable:", error);
    return { products: [], error: true };
  }
}

export default async function StoreCatalogPage() {
  const [catalog, locale] = await Promise.all([getProducts(), getServerLocale()]);
  const localized = catalog.products.map((product) => ({
    slug: product.slug,
    name: locale === "hi" ? product.name_hi || product.name_en : locale === "ma" ? product.name_ma || product.name_en : product.name_en,
    description: locale === "hi" ? product.description_hi || product.description_en : locale === "ma" ? product.description_ma || product.description_en : product.description_en,
    sku: product.sku,
    priceInr: Number(product.price_inr),
    packLabel: product.label,
    imageUrl: product.image_url || null,
  }));

  return <StoreCatalogExperience products={localized} locale={locale} catalogError={catalog.error} />;
}
