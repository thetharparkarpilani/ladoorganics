import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";

export const metadata = {
  title: "Circular Store | Lado Organics",
  description: "Direct-from-farm A2 Bilona Ghee, Tharparkar Dhoop, and Kechua Khad from Pilani, Rajasthan.",
};

async function getProducts() {
  // In production, this fetches from the PostgreSQL database we set up in Phase 2
  try {
    const res = await db.query(`
      SELECT p.slug, p.name_en, p.description_en, v.sku, v.price_inr, v.label
      FROM products p
      JOIN product_variants v ON p.id = v.product_id
      WHERE p.is_active = TRUE AND v.is_default = TRUE
    `);
    return res.rows;
  } catch (e) {
    console.error("Database connection failed, falling back to static verified catalog");
    return [
      { slug: "a2-bilona-ghee", name_en: "A2 Bilona Ghee", description_en: "Hand-churned from indigenous Tharparkar cow curd using the Vedic Bilona method.", sku: "LO-GHEE-1000", price_inr: 5000, label: "1 Litre" },
      { slug: "tharparkar-dhoop", name_en: "Tharparkar Dhoop", description_en: "Zero-charcoal aromatic dhoop hand-rolled from pure indigenous cow dung.", sku: "LO-DHOOP-BOX", price_inr: 1000, label: "Box" },
      { slug: "pure-kechua-khad", name_en: "Pure Kechua Khad", description_en: "Nutrient-dense organic vermicompost enriched by biogas plant slurry.", sku: "LO-KHAD-5KG", price_inr: 2000, label: "5kg Bag" }
    ];
  }
}

export default async function StoreCatalogPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <header className="text-center mb-16">
        <span className="text-xs font-mono tracking-widest text-[var(--terracotta)] uppercase font-bold">Module D • The Circular Store</span>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[var(--mud)] mt-4">Ethical & Unadulterated</h1>
        <p className="text-[var(--muted)]/80 mt-4 max-w-2xl mx-auto text-sm sm:text-base">Direct-from-Pilani farm batches. Zero middlemen.</p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <Link href={`/store/${product.slug}`} key={product.sku} className="group bg-[var(--surface)] border border-[var(--border)] rounded-3xl overflow-hidden hover:border-[var(--terracotta)] transition shadow-sm flex flex-col">
            <div className="aspect-[4/3] bg-[#3b2314] flex items-center justify-center relative">
              <i className="fas fa-leaf text-4xl text-[#fbbf24] opacity-20"></i>
              <span className="absolute top-4 right-4 bg-white/90 text-[var(--mud)] text-[10px] font-bold tracking-widest px-3 py-1 rounded-full">FARM DIRECT</span>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h2 className="text-xl font-serif font-bold text-[var(--mud)] mb-2 group-hover:text-[var(--terracotta)] transition">{product.name_en}</h2>
              <p className="text-sm text-[var(--muted)]/80 mb-6 flex-grow leading-relaxed line-clamp-3">{product.description_en}</p>
              <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                <span className="text-xl font-serif font-bold text-[var(--terracotta)]">₹{product.price_inr.toLocaleString("en-IN")}</span>
                <span className="text-xs font-bold uppercase tracking-widest bg-[var(--bg)] px-3 py-1.5 rounded-lg border border-[var(--border)]">{product.label}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
