"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { LocaleCode, ProductDTO } from "@/types/domain";
import { TRANSLATIONS } from "@/lib/i18n";

interface StorefrontSectionProps {
  products: ProductDTO[];
  locale: LocaleCode;
  searchQuery: string;
  whatsappNumber: string;
  onAddToBag: (item: { sku: string; title: string; unitPriceInr: number; quantity: number }) => void;
}

export default function StorefrontSection({
  products,
  locale,
  searchQuery,
  whatsappNumber,
  onAddToBag
}: StorefrontSectionProps) {
  const dict = TRANSLATIONS[locale] ?? TRANSLATIONS.en;
  const [selectedVariantByProduct, setSelectedVariantByProduct] = useState<Record<string, string>>({});
  const [gheeLitres, setGheeLitres] = useState<number>(1);
  const [dhoopBoxes, setDhoopBoxes] = useState<number>(0);
  const [khadBags, setKhadBags] = useState<number>(0);
  const [stayNights, setStayNights] = useState<number>(0);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => {
      const title = (locale === "hi" ? p.nameHi : locale === "ma" ? p.nameMa : p.nameEn) || p.nameEn;
      return (
        title.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.descriptionEn.toLowerCase().includes(q)
      );
    });
  }, [products, searchQuery, locale]);

  const estimatedTotal = useMemo(() => {
    return gheeLitres * 5000 + dhoopBoxes * 1000 + khadBags * 2000 + stayNights * 4000;
  }, [gheeLitres, dhoopBoxes, khadBags, stayNights]);

  const sendWhatsAppOrder = (productName: string, unitLabel: string, priceInr: number) => {
    const message = [
      "Namaste Lado Organics!",
      `Item: ${productName} (${unitLabel})`,
      `Listed Price: ₹${priceInr.toLocaleString("en-IN")}`,
      "Please share current batch availability and order details."
    ].join("\n");
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const sendCalculatorOrder = () => {
    const parts: string[] = [];
    if (gheeLitres > 0) parts.push(`${gheeLitres} x A2 Bilona Ghee (1 litre @ ₹5,000)`);
    if (dhoopBoxes > 0) parts.push(`${dhoopBoxes} x Tharparkar Dhoop (Box @ ₹1,000)`);
    if (khadBags > 0) parts.push(`${khadBags} x Pure Kechua Khad (5 kg Bag @ ₹2,000)`);
    if (stayNights > 0) parts.push(`${stayNights} x "Deep Work" Bhunga Stay (Night @ ₹4,000)`);

    const summary = parts.length > 0 ? parts.join(", ") : "Custom enquiry";
    const message = [
      "Namaste Lado Organics!",
      `Selected items: ${summary}`,
      `Estimated subtotal (before shipping/applicable taxes): ₹${estimatedTotal.toLocaleString("en-IN")}`,
      "Please confirm availability and final details."
    ].join("\n");
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <section id="store" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest uppercase text-[var(--terracotta)]">
              {dict.brand_tagline}
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold mt-2">{dict.section_store}</h2>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-10 text-center">
              <p className="font-medium">No matching items found for “{searchQuery}”.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const displayName =
                  (locale === "hi" ? product.nameHi : locale === "ma" ? product.nameMa : product.nameEn) ||
                  product.nameEn;
                const productArt = product.slug.includes("ghee") ? { kind: "ghee", symbol: "◉", label: "BILONA GHEE" }
                  : product.slug.includes("dhoop") ? { kind: "dhoop", symbol: "✺", label: "TRADITIONAL DHOOP" }
                  : product.slug.includes("khad") || product.slug.includes("compost") ? { kind: "soil", symbol: "❧", label: "LIVING SOIL" }
                  : product.slug.includes("milk") ? { kind: "milk", symbol: "◒", label: "FRESH MILK" }
                  : product.slug.includes("kesar") ? { kind: "kesar", symbol: "✿", label: "PURE KESAR" }
                  : { kind: "earth", symbol: "✳", label: "FARM COLLECTION" };
                const defaultVar =
                  product.variants.find((v) => v.isDefault) ?? product.variants[0];
                const chosenSku = selectedVariantByProduct[product.id] ?? defaultVar?.sku;
                const activeVariant =
                  product.variants.find((v) => v.sku === chosenSku) ?? defaultVar;

                return (
                  <article
                    key={product.id}
                    className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 flex flex-col justify-between shadow-sm"
                  >
                    <div>
                      {product.imageUrl || product.slug.includes("dhoop") ? (
                        <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--bg)]">
                          <Image
                            src={product.imageUrl || `/images/lado-organics/${encodeURIComponent("Lado Organics Tharparkar Dhoop.png")}`}
                            alt={displayName}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            unoptimized
                            className="object-cover transition-transform duration-700 hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div className={`product-art product-art-${productArt.kind} mb-4 aspect-[4/3] rounded-2xl`} aria-label={`${displayName} product artwork placeholder`}>
                          <span className="product-art-brand">LADO ORGANICS <i>·</i> PILANI</span>
                          <span className="product-art-symbol" aria-hidden="true">{productArt.symbol}</span>
                          <span className="product-art-name">{productArt.label}</span>
                          <span className="product-art-foot">LADO LOVE PURE</span>
                        </div>
                      )}
                      <h3 className="text-xl font-serif font-bold mb-2">{displayName}</h3>
                      <p className="text-sm opacity-80 leading-relaxed mb-4">{product.descriptionEn}</p>
                      {["a2-bilona-ghee", "tharparkar-dhoop", "pure-kechua-khad", "deep-work-bhunga-stay"].includes(product.slug) && (
                        <Link href={`/store/${product.slug}`} className="inline-flex items-center gap-2 mb-4 text-[10px] font-extrabold uppercase tracking-[.14em] text-[var(--terracotta)] hover:gap-3 transition-all">
                          Discover this product <span aria-hidden="true">↗</span>
                        </Link>
                      )}

                      {product.variants.length > 1 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {product.variants.map((variant) => {
                            const isSelected = activeVariant?.sku === variant.sku;
                            return (
                              <button
                                key={variant.sku}
                                type="button"
                                onClick={() =>
                                  setSelectedVariantByProduct((prev) => ({
                                    ...prev,
                                    [product.id]: variant.sku
                                  }))
                                }
                                className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
                                  isSelected
                                    ? "bg-[var(--mud)] text-white border-[var(--mud)]"
                                    : "border-[var(--border)] hover:border-[var(--terracotta)]"
                                }`}
                              >
                                {variant.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-[var(--border)]">
                      <div className="flex items-baseline justify-between mb-4">
                        <span className="text-xs uppercase tracking-wider opacity-70">
                          Per {activeVariant?.label ?? "Unit"}
                        </span>
                        <span className="text-2xl font-serif font-bold text-[var(--terracotta)]">
                          ₹{(activeVariant?.priceInr ?? 0).toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {activeVariant && (
                          <button
                            type="button"
                            onClick={() =>
                              onAddToBag({
                                sku: activeVariant.sku,
                                title: `${product.nameEn} (${activeVariant.label})`,
                                unitPriceInr: activeVariant.priceInr,
                                quantity: 1
                              })
                            }
                            className="w-full primary-btn py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                          >
                            Add to Bag
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            sendWhatsAppOrder(
                              product.nameEn,
                              activeVariant?.label ?? "Unit",
                              activeVariant?.priceInr ?? 0
                            )
                          }
                          className="w-full py-2.5 rounded-xl text-xs font-semibold border border-[var(--border)] hover:border-[var(--terracotta)] cursor-pointer"
                        >
                          Order via WhatsApp
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="lado-photo-story-title" className="border-t border-[var(--border)] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-[var(--terracotta)]">A glimpse of Pilani</p>
              <h2 id="lado-photo-story-title" className="mt-2 text-3xl sm:text-4xl font-serif font-bold">The farm, the craft, the collection.</h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed opacity-75">A visual introduction to the Lado Organics farm story and traditional product collection.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { file: "Lado Organics Farm-to-Table Collection.png", title: "From farm to home", alt: "Lado Organics farm-to-table product collection" },
              { file: "Lado Organics Rustic Farm Showcase.png", title: "Rooted in the farm", alt: "Lado Organics rustic farm showcase" },
              { file: "Lado Organics Natural Heritage Collection.png", title: "Tradition, thoughtfully made", alt: "Lado Organics natural heritage product collection" }
            ].map((photo) => (
              <figure key={photo.file} className="group relative aspect-[5/4] overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
                <Image
                  src={`/images/lado-organics/${encodeURIComponent(photo.file)}`}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  unoptimized
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-5 pb-5 pt-12 text-white font-serif text-xl">{photo.title}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="calculator" className="py-16 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)]">
        <div className="max-w-4xl mx-auto bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-10 shadow-sm">
          <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-2">
            Order & Bhunga Stay Estimator
          </h3>
          <p className="text-sm opacity-80 mb-6">
            Estimate quantities using listed baseline rates (₹5,000/1L Ghee, ₹1,000/Box Dhoop, ₹2,000/5kg Kechua Khad, ₹4,000/Night Bhunga Stay). Final shipping and applicable taxes are confirmed prior to order completion.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-xs font-bold uppercase mb-1">
                A2 Bilona Ghee (1 litre): {gheeLitres}
              </label>
              <input
                type="range"
                min={0}
                max={10}
                value={gheeLitres}
                onChange={(e) => setGheeLitres(Number(e.target.value))}
                className="w-full accent-[#c2410c]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">
                Tharparkar Dhoop (Box): {dhoopBoxes}
              </label>
              <input
                type="range"
                min={0}
                max={10}
                value={dhoopBoxes}
                onChange={(e) => setDhoopBoxes(Number(e.target.value))}
                className="w-full accent-[#c2410c]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">
                Pure Kechua Khad (5 kg Bag): {khadBags}
              </label>
              <input
                type="range"
                min={0}
                max={10}
                value={khadBags}
                onChange={(e) => setKhadBags(Number(e.target.value))}
                className="w-full accent-[#c2410c]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">
                “Deep Work” Bhunga Stay (Nights): {stayNights}
              </label>
              <input
                type="range"
                min={0}
                max={7}
                value={stayNights}
                onChange={(e) => setStayNights(Number(e.target.value))}
                className="w-full accent-[#c2410c]"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-[var(--border)]">
            <div>
              <span className="block text-xs uppercase tracking-wider opacity-70">
                Estimated Subtotal
              </span>
              <span className="text-3xl font-serif font-bold text-[var(--terracotta)]">
                ₹{estimatedTotal.toLocaleString("en-IN")}
              </span>
            </div>

            <button
              type="button"
              onClick={sendCalculatorOrder}
              className="primary-btn px-6 py-3.5 rounded-xl text-sm font-semibold cursor-pointer"
            >
              Send Selection on WhatsApp
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
