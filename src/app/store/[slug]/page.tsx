"use client";

import React, { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductReviewsSection from "@/components/ProductReviewsSection";
import { useCart } from "@/context/CartContext";
import type { ProductDTO, ProductVariantDTO } from "@/types/domain";

type PageProps = { params: Promise<{ slug: string }> };
type LoadState = "loading" | "ready" | "not-found" | "error";

function productPresentation(slug: string) {
  if (slug.includes("ghee")) return { kind: "ghee", symbol: "◉", label: "BILONA GHEE", note: "TRADITIONAL DAIRY", category: "Indigenous Tharparkar Dairy" };
  if (slug.includes("dhoop")) return { kind: "dhoop", symbol: "✺", label: "TRADITIONAL DHOOP", note: "NATURAL AROMATICS", category: "Traditional Farm Aromatics" };
  if (slug.includes("khad") || slug.includes("compost")) return { kind: "soil", symbol: "❧", label: "VERMICOMPOST", note: "LIVING SOIL", category: "Farm Soil & Compost" };
  if (slug.includes("stay")) return { kind: "stay", symbol: "⌂", label: "BHUNGA STAY", note: "FARM RETREAT", category: "Farm Stay Experience" };
  if (slug.includes("milk")) return { kind: "milk", symbol: "◒", label: "FARM FRESH", note: "DAIRY COLLECTION", category: "Farm Dairy" };
  if (slug.includes("kesar")) return { kind: "kesar", symbol: "✿", label: "KESAR", note: "FARM COLLECTION", category: "Farm Collection" };
  return { kind: "earth", symbol: "✳", label: "FARM COLLECTION", note: "LADO ORGANICS", category: "Lado Organics Collection" };
}

export default function ProductDetailPage(props: PageProps) {
  const params = use(props.params);
  const slug = params.slug || "";
  const { addToCart } = useCart();
  const [product, setProduct] = useState<ProductDTO | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setLoadState("loading");
    setLoadError("");
    fetch("/api/catalog", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("The live product catalogue is temporarily unavailable.");
        return response.json();
      })
      .then((data: { catalog?: ProductDTO[] }) => {
        if (controller.signal.aborted) return;
        const found = Array.isArray(data.catalog) ? data.catalog.find((item) => item.slug === slug) : undefined;
        if (!found) {
          setProduct(null);
          setLoadState("not-found");
          return;
        }
        setProduct(found);
        setSelectedVariantId(found.variants.find((variant) => variant.isDefault)?.id || found.variants[0]?.id || "");
        setLoadState("ready");
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setLoadError(error instanceof Error ? error.message : "Unable to load this product.");
        setLoadState("error");
      });
    return () => controller.abort();
  }, [slug]);

  const activeVariant: ProductVariantDTO | undefined = useMemo(
    () => product?.variants.find((variant) => variant.id === selectedVariantId) || product?.variants.find((variant) => variant.isDefault) || product?.variants[0],
    [product, selectedVariantId]
  );

  const visual = productPresentation(slug);
  const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919636100337").replace(/\D/g, "");
  const whatsappUrl = product && activeVariant
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        `Namaste Lado Organics!\nProduct: ${product.nameEn} (${activeVariant.label})\nCurrent listed price: ₹${activeVariant.priceInr.toLocaleString("en-IN")}\nPlease confirm batch availability, delivery and payment details.`
      )}`
    : `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Namaste Lado Organics, please help me with your product collection.")}`;

  if (loadState === "loading") {
    return <div className="min-h-[60vh] grid place-items-center px-4 text-sm text-[var(--text-muted)]" role="status">Loading the live product details…</div>;
  }

  if (loadState === "error") {
    return (
      <main className="min-h-[60vh] max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-3xl font-bold">Product details are temporarily unavailable</h1>
        <p className="mt-3 text-sm opacity-75">{loadError}</p>
        <div className="mt-6 flex justify-center gap-3">
          <button type="button" onClick={() => window.location.reload()} className="primary-btn rounded-full px-5 py-3 text-sm font-bold">Try again</button>
          <Link href="/#store" className="rounded-full border border-[var(--border)] px-5 py-3 text-sm font-bold">Back to collection</Link>
        </div>
      </main>
    );
  }

  if (loadState === "not-found" || !product) {
    return (
      <main className="min-h-[60vh] max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-3xl font-bold">Product not found</h1>
        <p className="mt-3 text-sm opacity-75">This product is not currently listed in the live Lado Organics catalogue.</p>
        <Link href="/#store" className="primary-btn mt-6 inline-flex rounded-full px-6 py-3 text-sm font-bold">Explore the collection</Link>
      </main>
    );
  }

  const hasVariants = product.variants.length > 0;

  return (
    <main className="product-detail-page min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
        <Link href="/#store" className="product-detail-back">← Back to the collection</Link>
        <Link href="/contact" className="product-detail-trace">Ask about batch records ↗</Link>
      </div>

      <section className={`product-detail-hero product-detail-${visual.kind}`}>
        <div className="product-detail-art relative" aria-label={`${product.nameEn} product artwork`}>
          {product.imageUrl ? (
            <Image src={product.imageUrl} alt={product.nameEn} fill priority sizes="(max-width: 760px) 100vw, 45vw" className="object-cover" />
          ) : slug.includes("dhoop") ? (
            <Image src={`/images/lado-organics/${encodeURIComponent("Lado Organics Tharparkar Dhoop.png")}`} alt="Lado Organics Tharparkar Dhoop" fill priority sizes="(max-width: 760px) 100vw, 45vw" className="object-cover" />
          ) : (
            <>
              <span className="product-detail-art-top">LADO ORGANICS <i>·</i> PILANI</span>
              <span className="product-detail-art-orbit product-detail-orbit-one" />
              <span className="product-detail-art-orbit product-detail-orbit-two" />
              <span className="product-detail-art-symbol" aria-hidden="true">{visual.symbol}</span>
              <span className="product-detail-art-name">{visual.label}</span>
              <span className="product-detail-art-bottom">LADO LOVE PURE</span>
            </>
          )}
        </div>
        <div className="product-detail-copy">
          <p className="product-detail-kicker"><span /> {visual.category}</p>
          <h1>{product.nameEn}</h1>
          <p className="product-detail-description">{product.descriptionEn}</p>
          <div className="product-detail-tags">
            <span>Rooted in Pilani, Rajasthan</span>
            <span>Product details from the live catalogue</span>
          </div>
          <div className="product-detail-note">
            <span className="product-detail-note-mark">L</span>
            <span><strong>{visual.note}</strong><small>A part of the Lado Organics farm story</small></span>
          </div>
        </div>
      </section>

      <section className="product-detail-buy">
        <div className="product-detail-buy-heading">
          <p className="product-detail-kicker">CHOOSE YOUR PACK</p>
          <h2>Bring a little farm goodness home.</h2>
        </div>
        {hasVariants ? (
          <>
            {product.variants.length > 1 && (
              <div className="product-detail-variants">
                {product.variants.map((variant) => (
                  <button key={variant.id} type="button" aria-pressed={variant.id === activeVariant?.id} onClick={() => setSelectedVariantId(variant.id)} className={variant.id === activeVariant?.id ? "is-selected" : ""}>
                    <span>{variant.label}</span>
                    <strong>₹{variant.priceInr.toLocaleString("en-IN")}</strong>
                  </button>
                ))}
              </div>
            )}
            {activeVariant && (
              <div className="product-detail-checkout">
                <div>
                  <span>Selected pack · {activeVariant.label}</span>
                  <strong>₹{activeVariant.priceInr.toLocaleString("en-IN")}</strong>
                  <small className="block mt-1 opacity-70">{activeVariant.stockQty} currently listed in stock</small>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => addToCart({ variantId: activeVariant.id, sku: activeVariant.sku, title: `${product.nameEn} (${activeVariant.label})`, priceInr: activeVariant.priceInr, quantity: 1, maxStock: activeVariant.stockQty })} className="product-detail-order">
                    Add to bag <span aria-hidden="true">+</span>
                  </button>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="product-detail-order">
                    Enquire on WhatsApp <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="rounded-2xl border border-[var(--border)] p-5 text-sm">This product is currently out of stock. Please contact the Lado team for availability.</p>
        )}
        <p className="product-detail-order-note">Prices and stock are loaded from the current store catalogue. Final availability, delivery and payment details are confirmed at checkout by the Lado team.</p>
      </section>

      <section className="product-detail-origin">
        <div className="product-detail-origin-heading">
          <p className="product-detail-kicker">KNOW WHAT YOU BRING HOME</p>
          <h2>From our farm story to your everyday rituals.</h2>
        </div>
        <div className="product-detail-origin-grid">
          <article><span>01</span><h3>Our sourcing</h3><p>{product.sourcingInfo || "Please contact the Lado team for current sourcing details."}</p></article>
          <article><span>02</span><h3>How it is made</h3><p>{product.productionMethod || "Please contact the Lado team for verified production details."}</p></article>
          <article><span>03</span><h3>Care & storage</h3><p>{product.storageInstructions || "Follow the instructions on the current product label."}</p></article>
        </div>
      </section>

      <div className="product-detail-reviews">
        <ProductReviewsSection productSlug={product.slug} />
      </div>
    </main>
  );
}
