import React from "react";
import Link from "next/link";
import StoreCatalogExperience from "@/components/StoreCatalogExperience";
import { db } from "@/lib/db";
import { getServerLocale } from "@/lib/server-locale";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Circular Store | Lado Organics",
  description: "Direct-from-farm products and farm experiences rooted in Pilani, Rajasthan.",
};

type StoreProduct = {
  slug: string; name_en: string; name_hi?: string | null; name_ma?: string | null;
  description_en: string; sku: string; price_inr: number; label: string; image_url?: string | null;
};

async function getProducts(): Promise<StoreProduct[]> {
  try {
    const res = await db.query(`
      SELECT DISTINCT ON (p.id) p.slug, p.name_en, p.name_hi, p.name_ma, p.description_en, p.image_url,
             v.sku, v.price_inr, v.label
      FROM products p
      JOIN product_variants v ON p.id = v.product_id AND v.stock_qty > 0
      WHERE p.is_active = TRUE
      ORDER BY p.id, v.is_default DESC, v.label ASC
    `);
    return res.rows as StoreProduct[];
  } catch (error) {
    console.error("Live store catalogue unavailable:", error);
    return [];
  }
}

const DESCRIPTION: Record<"hi" | "ma", Record<string, string>> = {
  hi: {
    "a2-bilona-ghee": "पिलानी, राजस्थान में देसी थारपारकर गाय के दही से पारंपरिक बिलोना विधि द्वारा तैयार घी।",
    "tharparkar-dhoop": "देसी थारपारकर गाय के गोबर और प्राकृतिक वनस्पति सामग्री से पिलानी में तैयार धूप।",
    "pure-kechua-khad": "केंचुओं की मदद से तैयार जैविक खाद। सही उपयोग और मात्रा के लिए उत्पाद का लेबल देखें।",
    "deep-work-bhunga-stay": "पिलानी में पारंपरिक राजस्थानी मिट्टी की वास्तुकला वाला भुंगा ठहराव। तारीख और उपलब्धता टीम से पक्की करें।",
  },
  ma: {
    "a2-bilona-ghee": "पिलानी में देसी थारपारकर गाय रै दही नै पुराणी लकड़ी री बिलोना सूं मथकै बणायो घी।",
    "tharparkar-dhoop": "देसी थारपारकर गाय रै गोबर अर कुदरती वनस्पति सूं पिलानी में बणाई धूप।",
    "pure-kechua-khad": "केंचुआ री मदद सूं बणाई जैविक खाद। सही उपयोग अर मात्रा खातर पैकेट रो लेबल देखो।",
    "deep-work-bhunga-stay": "पिलानी में राजस्थानी माटी री पुराणी बनावट वालो भुंगा ठहराव। तारीख अर जगह टीम सूं पक्की करो।",
  },
};

export default async function StoreCatalogPage() {
  const [products, locale] = await Promise.all([getProducts(), getServerLocale()]);
  const localized = products.map((product) => ({
    slug: product.slug,
    name: locale === "hi" ? product.name_hi || product.name_en : locale === "ma" ? product.name_ma || product.name_en : product.name_en,
    description: locale === "en" ? product.description_en : DESCRIPTION[locale][product.slug] || product.description_en,
    sku: product.sku,
    priceInr: Number(product.price_inr),
    packLabel: product.label,
    imageUrl: product.image_url || null,
  }));

  return <StoreCatalogExperience products={localized} locale={locale} />;
}
