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

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Namaste Lado Organics!\nProduct: ${product.name} (${activeVariant.label})\nListed Price: ₹${activeVariant.priceInr.toLocaleString("en-IN")}\nPlease share batch availability, shipping, and payment details.`
  )}`;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <Link href="/#store" className="text-sm font-bold text-[var(--terracotta)] hover:underline">
          ← Back to Circular Store
        </Link>
        <Link href="/trace/LO-PILANI-SAMPLE-001" className="text-xs font-bold underline">
          Inspect Batch Traceability →
        </Link>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">
            {product.category}
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold mt-1 mb-3">{product.name}</h1>
          <p className="text-sm sm:text-base opacity-85 leading-relaxed">{product.description}</p>
        </div>

        {product.variants.length > 1 && (
          <div>
            <p className="text-xs font-bold uppercase mb-2">Select Pack Size</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v, idx) => (
                <button
                  key={v.sku}
                  type="button"
                  onClick={() => setSelectedIdx(idx)}
                  className={`px-4 py-2 rounded-full text-xs font-bold border cursor-pointer ${
                    idx === selectedIdx
                      ? "bg-[var(--mud)] text-white border-[var(--mud)]"
                      : "border-[var(--border)] hover:border-[var(--terracotta)]"
                  }`}
                >
                  {v.label} — ₹{v.priceInr.toLocaleString("en-IN")}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="p-5 rounded-2xl bg-[var(--bg)] border border-[var(--border)] flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="block text-xs uppercase opacity-65">Selected Variant ({activeVariant.label})</span>
            <span className="text-3xl font-serif font-bold text-[var(--terracotta)]">
              ₹{activeVariant.priceInr.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="primary-btn px-6 py-3 rounded-xl text-xs font-bold"
            >
              Order via WhatsApp (+91 96361 00337)
            </a>
            <Link
              href="/#store"
              className="px-5 py-3 rounded-xl text-xs font-bold border border-[var(--border)] bg-[var(--surface)]"
            >
              Add in Main Store Bag
            </Link>
          </div>
        </div>
      </div>
      <ProductReviewsSection productSlug={product.slug} />
    </div>
  );
}
