"use client";

import React, { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductReviewsSection from "@/components/ProductReviewsSection";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";
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
  const { locale } = useLocale();
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

  const displayName = (locale === "hi" ? product?.nameHi : locale === "ma" ? product?.nameMa : product?.nameEn) || product?.nameEn || "";
  const displayDescription = locale === "hi"
    ? ({ "a2-bilona-ghee": "पिलानी में देसी थारपारकर गाय के दही से पारंपरिक बिलोना विधि द्वारा तैयार घी।", "tharparkar-dhoop": "देसी थारपारकर गाय के गोबर और प्राकृतिक वनस्पति सामग्री से तैयार धूप।", "pure-kechua-khad": "केंचुओं की मदद से तैयार जैविक खाद। सही उपयोग के लिए उत्पाद का लेबल देखें।", "deep-work-bhunga-stay": "पिलानी में पारंपरिक राजस्थानी मिट्टी की वास्तुकला वाला भुंगा ठहराव। तारीख टीम से पक्की करें।" } as Record<string,string>)[slug] || product?.descriptionEn || ""
    : locale === "ma"
      ? ({ "a2-bilona-ghee": "पिलानी में देसी थारपारकर गाय रै दही नै पुराणी बिलोना सूं मथकै बणायो घी।", "tharparkar-dhoop": "देसी थारपारकर गाय रै गोबर अर कुदरती वनस्पति सूं बणाई धूप।", "pure-kechua-khad": "केंचुआ री मदद सूं बणाई खाद। सही उपयोग खातर पैकेट रो लेबल देखो।", "deep-work-bhunga-stay": "पिलानी में राजस्थानी माटी री पुराणी बनावट वालो भुंगा ठहराव। तारीख टीम सूं पक्की करो।" } as Record<string,string>)[slug] || product?.descriptionEn || ""
      : product?.descriptionEn || "";
  const labels = locale === "hi" ? { back: "← उत्पाद संग्रह पर लौटें", trace: "बैच जानकारी पूछें ↗", choose: "अपना पैक चुनें", bring: "खेत की अच्छाई अपने घर लाएँ।", selected: "चुना गया पैक", add: "बैग में जोड़ें", order: "व्हाट्सऐप पर पूछें", unavailable: "यह उत्पाद अभी उपलब्ध नहीं है।", note: "ऑर्डर पक्का होने से पहले टीम बैच, डिलीवरी और भुगतान की पुष्टि करेगी।", know: "आप क्या घर ला रहे हैं, जानें", origin: "खेत से आपकी रोज़मर्रा तक।", sourcing: "हमारी सोर्सिंग", method: "इसे कैसे बनाया जाता है", storage: "देखभाल और भंडारण", loading: "लाइव उत्पाद जानकारी लोड हो रही है…", failed: "उत्पाद की जानकारी अभी उपलब्ध नहीं है", retry: "फिर कोशिश करें", collection: "संग्रह पर लौटें", notFound: "उत्पाद नहीं मिला", missing: "यह उत्पाद अभी लाइव कैटलॉग में सूचीबद्ध नहीं है।", explore: "उत्पाद देखें" }
    : locale === "ma" ? { back: "← सामान री सूची पर लौटो", trace: "बैच री जानकारी पूछो ↗", choose: "आपरो पैक चुनो", bring: "खेत री अच्छाई घर लावो।", selected: "चुन्यो पैक", add: "थैली में जोड़ो", order: "व्हाट्सऐप पर पूछो", unavailable: "ई सामान अभी उपलब्ध कोनी।", note: "ऑर्डर पक्को होण सूं पैली टीम बैच, भेजण अर भुगतान पक्को करैला।", know: "जाणो थां घर काई लावो हो", origin: "खेत री बात सूं रोज रै काम तक।", sourcing: "म्हारी सोर्सिंग", method: "ई कियां बणै", storage: "रखरखाव अर भंडारण", loading: "चालू सामान री जानकारी खुलै है…", failed: "सामान री जानकारी अभी उपलब्ध कोनी", retry: "फेर कोशिश करो", collection: "सामान री सूची पर लौटो", notFound: "सामान कोनी मिल्यो", missing: "ई सामान अभी चालू सूची में कोनी।", explore: "सामान देखो" }
    : { back: "← Back to the collection", trace: "Ask about batch records ↗", choose: "CHOOSE YOUR PACK", bring: "Bring a little farm goodness home.", selected: "Selected pack", add: "Add to bag", order: "Enquire on WhatsApp", unavailable: "This product is currently out of stock.", note: "The Lado team confirms batch availability, delivery and payment before an order is finalised.", know: "KNOW WHAT YOU BRING HOME", origin: "From our farm story to your everyday rituals.", sourcing: "Our sourcing", method: "How it is made", storage: "Care & storage", loading: "Loading live product details…", failed: "{labels.failed}", retry: "Try again", collection: "Back to collection", notFound: "Product not found", missing: "This product is not currently listed in the live catalogue.", explore: "Explore the collection" };
  const visual = productPresentation(slug);
  const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919636100337").replace(/\D/g, "");
  const whatsappUrl = product && activeVariant
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        `Namaste Lado Organics!\nProduct: ${displayName} (${activeVariant.label})\nCurrent listed price: ₹${activeVariant.priceInr.toLocaleString("en-IN")}\nPlease confirm batch availability, delivery and payment details.`
      )}`
    : `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Namaste Lado Organics, please help me with your product collection.")}`;

  if (loadState === "loading") {
    return <div className="min-h-[60vh] grid place-items-center px-4 text-sm text-[var(--text-muted)]" role="status">{labels.loading}</div>;
  }

  if (loadState === "error") {
    return (
      <main className="min-h-[60vh] max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-3xl font-bold">Product details are temporarily unavailable</h1>
        <p className="mt-3 text-sm opacity-75">{loadError}</p>
        <div className="mt-6 flex justify-center gap-3">
          <button type="button" onClick={() => window.location.reload()} className="primary-btn rounded-full px-5 py-3 text-sm font-bold">{labels.retry}</button>
          <Link href="/#store" className="rounded-full border border-[var(--border)] px-5 py-3 text-sm font-bold">{labels.collection}</Link>
        </div>
      </main>
    );
  }

  if (loadState === "not-found" || !product) {
    return (
      <main className="min-h-[60vh] max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-3xl font-bold">{labels.notFound}</h1>
        <p className="mt-3 text-sm opacity-75">{labels.missing}</p>
        <Link href="/#store" className="primary-btn mt-6 inline-flex rounded-full px-6 py-3 text-sm font-bold">{labels.explore}</Link>
      </main>
    );
  }

  const hasVariants = product.variants.length > 0;
  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: displayName,
    description: displayDescription,
    image: product.imageUrl || undefined,
    brand: { "@type": "Brand", name: "Lado Organics" },
    category: visual.category,
    offers: activeVariant ? {
      "@type": "Offer",
      priceCurrency: "INR",
      price: Number(activeVariant.priceInr).toFixed(2),
      availability: Number(activeVariant.stockQty) > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `https://ladoorganics.in/store/${encodeURIComponent(slug)}`,
      itemCondition: "https://schema.org/NewCondition",
    } : undefined,
  };

  return (
    <main className="product-detail-page min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">\n      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productStructuredData).replace(/</g, "\\u003c") }} />
      <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
        <Link href="/#store" className="product-detail-back">{labels.back}</Link>
        <Link href="/trace" className="product-detail-trace">{labels.trace}</Link>
      </div>

      <section className={`product-detail-hero product-detail-${visual.kind}`}>
        <div className="product-detail-art relative" aria-label={`${displayName} product artwork`}>
          {product.imageUrl ? (
            <Image src={product.imageUrl} alt={displayName} fill priority sizes="(max-width: 760px) 100vw, 45vw" className="object-cover" />
          ) : slug.includes("dhoop") ? (
            <Image src={`/images/lado-organics/${encodeURIComponent("Lado Organics Tharparkar Dhoop.png")}`} alt={displayName} fill priority sizes="(max-width: 760px) 100vw, 45vw" className="object-cover" />
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
          <h1>{displayName}</h1>
          <p className="product-detail-description">{displayDescription}</p>
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
          <p className="product-detail-kicker">{labels.choose}</p>
          <h2>{labels.bring}</h2>
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
                  <span>{labels.selected} · {activeVariant.label}</span>
                  <strong>₹{activeVariant.priceInr.toLocaleString("en-IN")}</strong>
                  <small className="block mt-1 opacity-70">{activeVariant.stockQty} currently listed in stock</small>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => addToCart({ variantId: activeVariant.id, sku: activeVariant.sku, title: `${product.nameEn} (${activeVariant.label})`, priceInr: activeVariant.priceInr, quantity: 1, maxStock: activeVariant.stockQty })} className="product-detail-order">
                    {labels.add} <span aria-hidden="true">+</span>
                  </button>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="product-detail-order">
                    {labels.order} <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="rounded-2xl border border-[var(--border)] p-5 text-sm">{labels.unavailable}</p>
        )}
        <p className="product-detail-order-note">{labels.note}</p>
      </section>

      <section className="product-detail-origin">
        <div className="product-detail-origin-heading">
          <p className="product-detail-kicker">{labels.know}</p>
          <h2>{labels.origin}</h2>
        </div>
        <div className="product-detail-origin-grid">
          <article><span>01</span><h3>{labels.sourcing}</h3><p>{product.sourcingInfo || "Please contact the Lado team for current sourcing details."}</p></article>
          <article><span>02</span><h3>{labels.method}</h3><p>{product.productionMethod || "Please contact the Lado team for verified production details."}</p></article>
          <article><span>03</span><h3>{labels.storage}</h3><p>{product.storageInstructions || "Follow the instructions on the current product label."}</p></article>
        </div>
      </section>

      <div className="product-detail-reviews">
        <ProductReviewsSection productSlug={product.slug} />
      </div>
    </main>
  );
}
