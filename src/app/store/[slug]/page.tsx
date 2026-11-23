"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import ProductReviewsSection from "@/components/ProductReviewsSection";

interface ProductRecord {
  slug: string;
  name: string;
  category: string;
  description: string;
  sourcing: string;
  productionMethod: string;
  storage: string;
  variants: Array<{ sku: string; label: string; priceInr: number }>;
}

const CATALOG_DETAIL: Record<string, ProductRecord> = {
  "a2-bilona-ghee": {
    slug: "a2-bilona-ghee",
    name: "A2 Bilona Ghee",
    category: "Indigenous Tharparkar Dairy",
    description: "Hand-churned from indigenous Tharparkar cow curd using the traditional Bilona process in Pilani, Rajasthan.",
    sourcing: "Pilani Gaushala, Jhunjhunu, Rajasthan (MSME: UDYAM-RJ-21-0104324)",
    productionMethod: "Whole A2 milk cultured into curd and hand-churned via traditional wooden Bilona",
    storage: "Store in a cool, dry place away from direct sunlight. Always use a clean, dry spoon.",
    variants: [
      { sku: "LO-GHEE-250", label: "250 ml", priceInr: 1350 },
      { sku: "LO-GHEE-500", label: "500 ml", priceInr: 2600 },
      { sku: "LO-GHEE-1000", label: "1 litre", priceInr: 5000 }
    ]
  },
  "tharparkar-dhoop": {
    slug: "tharparkar-dhoop",
    name: "Tharparkar Dhoop",
    category: "Sacred Cow-Dung Aromatics",
    description: "Crafted from indigenous Tharparkar cow dung and natural botanical binders in Pilani.",
    sourcing: "Pilani Gaushala, Rajasthan",
    productionMethod: "Sun-dried indigenous cow dung blended with natural botanicals",
    storage: "Keep dry in an airtight container away from moisture.",
    variants: [{ sku: "LO-DHOOP-BOX", label: "Box", priceInr: 1000 }]
  },
  "pure-kechua-khad": {
    slug: "pure-kechua-khad",
    name: "Pure Kechua Khad",
    category: "Biogas-Slurry Vermicompost",
    description: "Organic vermicompost enriched with biogas slurry from the Pilani circular ecosystem.",
    sourcing: "Pilani Farm Ecosystem, Rajasthan",
    productionMethod: "Anaerobic biogas slurry converted via vermicomposting beds",
    storage: "Store in a shaded, ventilated place.",
    variants: [{ sku: "LO-KHAD-5KG", label: "5 kg Bag", priceInr: 2000 }]
  },
  "deep-work-bhunga-stay": {
    slug: "deep-work-bhunga-stay",
    name: '"Deep Work" Bhunga Stay',
    category: "Agro-Tourism & Rural Retreat",
    description: "Climate-responsive Rajasthani mud architecture in Pilani designed for focused work and farm immersion.",
    sourcing: "Pilani, Jhunjhunu, Rajasthan",
    productionMethod: "Traditional mud-house accommodation with farm access",
    storage: "Dates and meal preferences confirmed directly prior to arrival.",
    variants: [{ sku: "LO-STAY-NIGHT", label: "Night", priceInr: 4000 }]
  }
};

// NEXT.JS 15 FIX: Type params as a Promise and unwrap with React.use()
export default function ProductDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = use(props.params);
  const slug = decodeURIComponent(params.slug || "a2-bilona-ghee");
  const product = CATALOG_DETAIL[slug] ?? CATALOG_DETAIL["a2-bilona-ghee"];
  const [selectedIdx, setSelectedIdx] = useState(product.variants.length - 1);

  const activeVariant = product.variants[selectedIdx] ?? product.variants[0];
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919636100337";

  const visual = product.slug.includes("ghee")
    ? { kind: "ghee", symbol: "◉", label: "BILONA GHEE", note: "TRADITIONAL DAIRY" }
    : product.slug.includes("dhoop")
    ? { kind: "dhoop", symbol: "✺", label: "COW-DUNG DHOOP", note: "NATURAL AROMATICS" }
    : product.slug.includes("khad") || product.slug.includes("compost")
    ? { kind: "soil", symbol: "❧", label: "VERMICOMPOST", note: "LIVING SOIL" }
    : product.slug.includes("stay")
    ? { kind: "stay", symbol: "⌂", label: "BHUNGA STAY", note: "FARM RETREAT" }
    : { kind: "earth", symbol: "✳", label: "FARM COLLECTION", note: "LADO ORGANICS" };


  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Namaste Lado Organics!\nProduct: ${product.name} (${activeVariant.label})\nListed Price: ₹${activeVariant.priceInr.toLocaleString("en-IN")}\nPlease share batch availability, shipping, and payment details.`
  )}`;

  return (
    <div className="product-detail-page min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
        <Link href="/#store" className="product-detail-back">← Back to the collection</Link>
        <Link href="/trace/LO-PILANI-SAMPLE-001" className="product-detail-trace">Explore batch traceability ↗</Link>
      </div>

      <section className={`product-detail-hero product-detail-${visual.kind}`}>
        <div className="product-detail-art" aria-label={`${product.name} illustrated product artwork`}>
          <span className="product-detail-art-top">LADO ORGANICS <i>·</i> PILANI</span>
          <span className="product-detail-art-orbit product-detail-orbit-one" />
          <span className="product-detail-art-orbit product-detail-orbit-two" />
          <span className="product-detail-art-symbol" aria-hidden="true">{visual.symbol}</span>
          <span className="product-detail-art-name">{visual.label}</span>
          <span className="product-detail-art-bottom">LADO LOVE PURE</span>
        </div>
        <div className="product-detail-copy">
          <p className="product-detail-kicker"><span /> {product.category}</p>
          <h1>{product.name}</h1>
          <p className="product-detail-description">{product.description}</p>
          <div className="product-detail-tags">
            <span>Made with care in Rajasthan</span>
            <span>Thoughtful farm practices</span>
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
        {product.variants.length > 1 && (
          <div className="product-detail-variants">
            {product.variants.map((v, idx) => (
              <button
                key={v.sku}
                type="button"
                aria-pressed={idx === selectedIdx}
                onClick={() => setSelectedIdx(idx)}
                className={idx === selectedIdx ? "is-selected" : ""}
              >
                <span>{v.label}</span>
                <strong>₹{v.priceInr.toLocaleString("en-IN")}</strong>
              </button>
            ))}
          </div>
        )}
        <div className="product-detail-checkout">
          <div>
            <span>Selected pack · {activeVariant.label}</span>
            <strong>₹{activeVariant.priceInr.toLocaleString("en-IN")}</strong>
          </div>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="product-detail-order">
            Enquire & order on WhatsApp <span aria-hidden="true">↗</span>
          </a>
        </div>
        <p className="product-detail-order-note">We’ll confirm current batch availability, delivery and payment details with you before the order is finalised.</p>
      </section>

      <section className="product-detail-origin">
        <div className="product-detail-origin-heading">
          <p className="product-detail-kicker">KNOW WHAT YOU BRING HOME</p>
          <h2>From our farm story to your everyday rituals.</h2>
        </div>
        <div className="product-detail-origin-grid">
          <article><span>01</span><h3>Our sourcing</h3><p>{product.sourcing}</p></article>
          <article><span>02</span><h3>How it is made</h3><p>{product.productionMethod}</p></article>
          <article><span>03</span><h3>Care & storage</h3><p>{product.storage}</p></article>
        </div>
      </section>

      <div className="product-detail-reviews">
        <ProductReviewsSection productSlug={product.slug} />
      </div>
    </div>
  );
}
