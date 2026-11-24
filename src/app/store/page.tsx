import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { getServerLocale } from "@/lib/server-locale";
import { TRANSLATIONS } from "@/lib/i18n";

export const metadata = {
  title: "Circular Store | Lado Organics",
  description: "Direct-from-farm products and farm experiences rooted in Pilani, Rajasthan.",
};

type StoreProduct = {
  slug: string; name_en: string; name_hi?: string | null; name_ma?: string | null;
  description_en: string; sku: string; price_inr: number; label: string;
};

async function getProducts(): Promise<StoreProduct[]> {
  try {
    const res = await db.query(`
      SELECT p.slug, p.name_en, p.name_hi, p.name_ma, p.description_en,
             v.sku, v.price_inr, v.label
      FROM products p
      JOIN product_variants v ON p.id = v.product_id
      WHERE p.is_active = TRUE AND v.is_default = TRUE AND v.stock_qty > 0
      ORDER BY p.created_at ASC
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
  const dict = TRANSLATIONS[locale];
  const copy = locale === "hi"
    ? { kicker: "मॉड्यूल D • देसी स्टोर", title: "खेत से सीधे, सोच-समझकर चुने उत्पाद", subtitle: "पिलानी से सीधे उपलब्ध मौजूदा उत्पाद और दर्ज पैक कीमतें।", direct: "खेत से सीधे", view: "उत्पाद देखें", unavailable: "लाइव स्टोर सूची अभी उपलब्ध नहीं है। पुरानी या अनुमानित कीमत दिखाने के बजाय हम टीम से पुष्टि करने की सलाह देते हैं।", contact: "टीम से संपर्क करें" }
    : locale === "ma"
      ? { kicker: "मॉड्यूल D • देसी हाट", title: "खेत सूं सीधो, सोच-समझ कै चुन्यो सामान", subtitle: "पिलानी सूं चालू सामान अर लिख्या पैक भाव।", direct: "खेत सूं सीधो", view: "सामान देखो", unavailable: "चालू स्टोर री सूची अभी कोनी मिलै। पुराणो या अंदाजी भाव बतावण री जगह टीम सूं पक्को करावो।", contact: "टीम नै खबर करो" }
      : { kicker: "MODULE D • THE CIRCULAR STORE", title: "Thoughtful products, direct from Pilani", subtitle: "Current products and listed pack prices from the Pilani farm.", direct: "FARM DIRECT", view: "Discover product", unavailable: "The live store catalogue is temporarily unavailable. We won't show old or estimated prices. Please contact the team to confirm current products and prices.", contact: "Contact the team" };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <header className="text-center mb-16">
        <span className="text-xs font-mono tracking-widest text-[var(--terracotta)] uppercase font-bold">{copy.kicker}</span>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[var(--mud)] mt-4">{copy.title}</h1>
        <p className="text-[var(--muted)]/80 mt-4 max-w-2xl mx-auto text-sm sm:text-base">{copy.subtitle}</p>
      </header>

      {products.length === 0 ? (
        <div className="max-w-2xl mx-auto text-center rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-10">
          <p className="text-sm leading-relaxed">{copy.unavailable}</p>
          <Link href="/contact" className="inline-flex mt-6 primary-btn px-6 py-3 rounded-xl text-xs font-bold">{copy.contact}</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => {
            const name = locale === "hi" ? product.name_hi || product.name_en : locale === "ma" ? product.name_ma || product.name_en : product.name_en;
            const description = locale === "en" ? product.description_en : DESCRIPTION[locale][product.slug] || product.description_en;
            return (
              <Link href={`/store/${product.slug}`} key={product.sku} className="group bg-[var(--surface)] border border-[var(--border)] rounded-3xl overflow-hidden hover:border-[var(--terracotta)] transition shadow-sm flex flex-col">
                <div className="aspect-[4/3] bg-[#3b2314] flex items-center justify-center relative">
                  <i className="fas fa-leaf text-4xl text-[#fbbf24] opacity-20" aria-hidden="true"></i>
                  <span className="absolute top-4 right-4 bg-white/90 text-[var(--mud)] text-[10px] font-bold tracking-widest px-3 py-1 rounded-full">{copy.direct}</span>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-xl font-serif font-bold text-[var(--mud)] mb-2 group-hover:text-[var(--terracotta)] transition">{name}</h2>
                  <p className="text-sm text-[var(--muted)]/80 mb-6 flex-grow leading-relaxed line-clamp-3">{description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                    <span className="text-xl font-serif font-bold text-[var(--terracotta)]">₹{Number(product.price_inr).toLocaleString("en-IN")}</span>
                    <span className="text-xs font-bold uppercase tracking-widest bg-[var(--bg)] px-3 py-1.5 rounded-lg border border-[var(--border)]">{product.label}</span>
                  </div>
                  <span className="mt-5 text-xs font-bold text-[var(--terracotta)]">{copy.view} ↗</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
