"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

interface CatalogVariant {
  priceInr: number;
  label: string;
}

interface CatalogProduct {
  slug: string;
  nameEn: string;
  descriptionEn: string;
  variants: CatalogVariant[];
}

interface RecommendationsProps {
  currentSlug: string;
}

const RELATED_SLUGS: Record<string, string[]> = {
  "a2-bilona-ghee": ["tharparkar-dhoop", "pure-kechua-khad"],
  "pure-kechua-khad": ["a2-bilona-ghee", "tharparkar-dhoop"],
  "tharparkar-dhoop": ["a2-bilona-ghee", "pure-kechua-khad"]
};

export default function ProductRecommendations({ currentSlug }: RecommendationsProps) {
  const [catalog, setCatalog] = useState<CatalogProduct[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/catalog", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Catalogue unavailable");
        return response.json();
      })
      .then((data) => {
        if (active && Array.isArray(data?.catalog)) setCatalog(data.catalog);
      })
      .catch(() => {
        if (active) setCatalog([]);
      })
      .finally(() => {
        if (active) setLoaded(true);
      });
    return () => { active = false; };
  }, []);

  const recommendations = useMemo(() => {
    const related = RELATED_SLUGS[currentSlug] || [];
    return related
      .map((slug) => catalog.find((product) => product.slug === slug))
      .filter((product): product is CatalogProduct => Boolean(product));
  }, [catalog, currentSlug]);

  if (!loaded || recommendations.length === 0) return null;

  return (
    <section className="mt-16 border-t border-[var(--border)] pt-12">
      <h3 className="mb-2 font-serif text-2xl font-bold text-[var(--mud)]">You may also explore</h3>
      <p className="mb-8 text-sm text-[var(--muted)]">Related items from the current Lado Organics catalogue. Prices appear only when a current variant price is listed.</p>
      <div className="grid gap-6 sm:grid-cols-2">
        {recommendations.map((product) => {
          const variant = product.variants.find((item) => Number(item.priceInr) > 0);
          return (
            <Link href={`/store/${product.slug}`} key={product.slug} className="card-earthy group block p-6 transition hover:border-[var(--terracotta)]">
              <div className="mb-4 flex items-start justify-between gap-4">
                <h4 className="font-serif text-lg font-bold text-[var(--mud)] transition group-hover:text-[var(--terracotta)]">{product.nameEn}</h4>
                <span className="shrink-0 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-xs font-bold text-[var(--mud)]">
                  {variant ? `₹${variant.priceInr.toLocaleString("en-IN")}` : "Price to be confirmed"}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-[var(--muted)]">{product.descriptionEn || "Explore product details and current availability."}</p>
              {variant?.label && <span className="mt-4 inline-block text-[10px] font-bold uppercase tracking-widest text-[var(--terracotta)]">{variant.label}</span>}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
