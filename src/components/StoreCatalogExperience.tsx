"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export interface StoreCatalogItem {
  slug: string;
  name: string;
  description: string;
  sku: string;
  priceInr: number;
  packLabel: string;
  imageUrl?: string | null;
}

type Locale = "en" | "hi" | "ma";
type Category = "all" | "dairy" | "dhoop" | "soil" | "kesar" | "stays";

function categoryFor(slug: string): Exclude<Category, "all"> | "other" {
  if (slug.includes("ghee") || slug.includes("milk")) return "dairy";
  if (slug.includes("dhoop")) return "dhoop";
  if (slug.includes("khad") || slug.includes("compost")) return "soil";
  if (slug.includes("kesar")) return "kesar";
  if (slug.includes("stay")) return "stays";
  return "other";
}

function artworkFor(slug: string) {
  if (slug.includes("ghee")) return { symbol: "◉", label: "BILONA GHEE", kind: "ghee" };
  if (slug.includes("dhoop")) return { symbol: "✺", label: "TRADITIONAL DHOOP", kind: "dhoop" };
  if (slug.includes("khad") || slug.includes("compost")) return { symbol: "❧", label: "VERMICOMPOST", kind: "soil" };
  if (slug.includes("milk")) return { symbol: "◒", label: "THARPARKAR MILK", kind: "milk" };
  if (slug.includes("kesar")) return { symbol: "✿", label: "KESAR", kind: "kesar" };
  if (slug.includes("stay")) return { symbol: "⌂", label: "BHUNGA STAY", kind: "stay" };
  return { symbol: "✳", label: "LADO ORGANICS", kind: "earth" };
}

export default function StoreCatalogExperience({ products, locale }: { products: StoreCatalogItem[]; locale: Locale }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("all");
  const [sort, setSort] = useState("featured");

  const copy = locale === "hi" ? {
    kicker: "मॉड्यूल D · देसी स्टोर", title: "खेत से सीधे, सोच-समझकर चुने उत्पाद", subtitle: "पिलानी से उपलब्ध मौजूदा उत्पाद और दर्ज पैक कीमतें।",
    search: "उत्पाद खोजें", all: "सभी उत्पाद", dairy: "डेयरी", dhoop: "धूप", soil: "मिट्टी की देखभाल", kesar: "केसर", stays: "भुंगा स्टे",
    count: "उत्पाद", sort: "क्रम", featured: "विशेष", low: "कम कीमत पहले", high: "अधिक कीमत पहले", az: "नाम A–Z",
    direct: "पिलानी संग्रह", view: "उत्पाद देखें", noResults: "इस खोज से मिलता-जुलता कोई उत्पाद नहीं मिला।", clear: "फ़िल्टर हटाएँ",
    empty: "लाइव स्टोर सूची अभी उपलब्ध नहीं है। पुरानी या अनुमानित कीमत दिखाने के बजाय टीम से पुष्टि करें।", contact: "टीम से संपर्क करें",
    intro: "साफ़ जानकारी · मौजूदा पैक · लाइव कैटलॉग"
  } : locale === "ma" ? {
    kicker: "मॉड्यूल D · देसी हाट", title: "खेत सूं सीधो, सोच-समझ कै चुन्यो सामान", subtitle: "पिलानी सूं चालू सामान अर लिख्या पैक भाव।",
    search: "सामान खोजो", all: "सगळो सामान", dairy: "दूध-घी", dhoop: "धूप", soil: "माटी री देखभाल", kesar: "केसर", stays: "भुंगा ठहराव",
    count: "सामान", sort: "क्रम", featured: "खास", low: "कम भाव पैली", high: "ज्यादा भाव पैली", az: "नांव A–Z",
    direct: "पिलानी संग्रह", view: "सामान देखो", noResults: "थारी खोज सूं मेल खातो सामान कोनी मिल्यो।", clear: "छंटाई हटाओ",
    empty: "चालू स्टोर री सूची अभी कोनी मिलै। पुराणो या अंदाजी भाव बतावण री जगह टीम सूं पक्को करावो।", contact: "टीम नै खबर करो",
    intro: "साफ जानकारी · चालू पैक · लाइव सूची"
  } : {
    kicker: "MODULE D · THE CIRCULAR STORE", title: "Thoughtful products, direct from Pilani", subtitle: "Explore the current collection and listed pack prices from the Pilani farm.",
    search: "Search the collection", all: "All products", dairy: "Dairy", dhoop: "Dhoop", soil: "Soil care", kesar: "Kesar", stays: "Farm stays",
    count: "products", sort: "Sort", featured: "Featured", low: "Price: low to high", high: "Price: high to low", az: "Name: A to Z",
    direct: "PILANI COLLECTION", view: "Discover product", noResults: "No products match your search and filters.", clear: "Clear filters",
    empty: "The live store catalogue is temporarily unavailable. We won't show old or estimated prices. Please contact the team to confirm current products and prices.",
    contact: "Contact the team", intro: "CLEAR PRODUCT DETAILS · CURRENT PACKS · LIVE CATALOGUE"
  };

  const categories: { key: Category; label: string }[] = [
    { key: "all", label: copy.all }, { key: "dairy", label: copy.dairy }, { key: "dhoop", label: copy.dhoop },
    { key: "soil", label: copy.soil }, { key: "kesar", label: copy.kesar }, { key: "stays", label: copy.stays }
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    const result = products.filter((product) => {
      const matchesCategory = category === "all" || categoryFor(product.slug) === category;
      const matchesQuery = !q || [product.name, product.description, product.slug, product.packLabel].some((value) => value.toLocaleLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
    if (sort === "low") result.sort((a, b) => a.priceInr - b.priceInr);
    if (sort === "high") result.sort((a, b) => b.priceInr - a.priceInr);
    if (sort === "az") result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [products, query, category, sort]);

  return (
    <main className="store-page min-h-screen px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="store-editorial-hero mb-10 sm:mb-14">
          <div className="store-editorial-copy">
            <span className="store-eyebrow">{copy.kicker}</span>
            <h1>{copy.title}</h1>
            <p>{copy.subtitle}</p>
            <span className="store-editorial-note">{copy.intro}</span>
          </div>
          <div className="store-editorial-mark" aria-hidden="true">
            <Image src="/lado-organics-logo.svg" alt="" width={230} height={126} priority />
          </div>
        </header>

        {products.length === 0 ? (
          <div className="mx-auto max-w-2xl rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-9 text-center sm:p-12">
            <p className="text-sm leading-7 text-[var(--muted)]">{copy.empty}</p>
            <Link href="/contact" className="primary-btn mt-6 inline-flex rounded-full px-6 py-3 text-xs font-bold">{copy.contact}</Link>
          </div>
        ) : (
          <>
            <section className="store-toolbar" aria-label="Product search and filters">
              <label className="store-search-field">
                <span aria-hidden="true">⌕</span>
                <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.search} aria-label={copy.search} />
              </label>
              <label className="store-sort-field">
                <span>{copy.sort}</span>
                <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label={copy.sort}>
                  <option value="featured">{copy.featured}</option>
                  <option value="low">{copy.low}</option>
                  <option value="high">{copy.high}</option>
                  <option value="az">{copy.az}</option>
                </select>
              </label>
            </section>

            <div className="store-category-tabs" role="group" aria-label="Filter products by category">
              {categories.map((item) => (
                <button key={item.key} type="button" aria-pressed={category === item.key} className={category === item.key ? "is-active" : ""} onClick={() => setCategory(item.key)}>
                  {item.label}
                </button>
              ))}
            </div>

            <div className="store-results-heading">
              <p><strong>{filtered.length}</strong> {copy.count}</p>
              {(query || category !== "all" || sort !== "featured") && <button type="button" onClick={() => { setQuery(""); setCategory("all"); setSort("featured"); }}>{copy.clear}</button>}
            </div>

            {filtered.length ? (
              <div className="store-product-grid grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((product) => {
                  const artwork = artworkFor(product.slug);
                  return (
                    <Link href={`/store/${product.slug}`} key={product.sku} className="store-product-card group flex flex-col overflow-hidden">
                      <div className={`store-product-media store-product-media-${artwork.kind}`}>
                        {product.imageUrl ? (
                          <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-700 group-hover:scale-[1.035]" />
                        ) : (
                          <div className="store-product-art" aria-hidden="true">
                            <span className="store-product-art-symbol">{artwork.symbol}</span>
                            <small>LADO ORGANICS · PILANI</small>
                            <strong>{artwork.label}</strong>
                            <em>LADO LOVE PURE</em>
                          </div>
                        )}
                        <span className="store-product-ribbon">{copy.direct}</span>
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <h2 className="mt-1 font-serif text-2xl font-bold text-[var(--mud)] transition group-hover:text-[var(--terracotta)]">{product.name}</h2>
                        <p className="mt-3 mb-6 flex-grow text-sm leading-7 text-[var(--muted)] line-clamp-3">{product.description}</p>
                        <div className="flex items-end justify-between gap-3 border-t border-[var(--border)] pt-4">
                          <div><span className="block text-[9px] font-bold uppercase tracking-[.16em] text-[var(--muted)]">{product.packLabel}</span><strong className="mt-1 block font-serif text-2xl text-[var(--terracotta)]">₹{product.priceInr.toLocaleString("en-IN")}</strong></div>
                          <span className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">{copy.view} ↗</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="store-no-results rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-10 text-center">
                <p className="font-serif text-xl font-bold text-[var(--mud)]">{copy.noResults}</p>
                <button type="button" className="primary-btn mt-5 rounded-full px-6 py-3 text-xs font-bold" onClick={() => { setQuery(""); setCategory("all"); }}>{copy.clear}</button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
