"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";

// In production, this data is fetched dynamically based on params.slug via Server Components.
// We mock the client-side hydration for architectural demonstration.
const PRODUCT_DATA = {
  slug: "a2-bilona-ghee",
  name: "A2 Bilona Ghee",
  description: "Ethically sourced, hand-churned from indigenous Tharparkar cow curd using the Vedic wooden Bilona method (~30L milk per 1L ghee).",
  variants: [
    { sku: "LO-GHEE-250", label: "250 ml", priceInr: 1350 },
    { sku: "LO-GHEE-500", label: "500 ml", priceInr: 2600 },
    { sku: "LO-GHEE-1000", label: "1 Litre", priceInr: 5000 }
  ],
  traceability: "Pilani Gaushala, Rajasthan",
  storage: "Store in a cool, dry place away from direct sunlight."
};

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { addItem } = useCart();
  const [selectedSku, setSelectedSku] = useState(PRODUCT_DATA.variants[2].sku);
  const [quantity, setQuantity] = useState(1);

  const activeVariant = PRODUCT_DATA.variants.find(v => v.sku === selectedSku)!;

  const handleAddToCart = () => {
    addItem({
      sku: activeVariant.sku,
      slug: PRODUCT_DATA.slug,
      title: `${PRODUCT_DATA.name} (${activeVariant.label})`,
      priceInr: activeVariant.priceInr
    }, quantity);
    alert("Added to Secure Cart!");
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
        <a href="/store" className="hover:text-[var(--terracotta)] transition">Store</a>
        <span className="mx-3">/</span>
        <span className="text-[var(--terracotta)]">{PRODUCT_DATA.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
        {/* Product Imagery */}
        <div className="aspect-square bg-[#2b180c] rounded-3xl flex items-center justify-center border border-[var(--border)] relative overflow-hidden shadow-sm">
           <i className="fas fa-jar text-9xl text-[#fbbf24] opacity-20"></i>
           <div className="absolute bottom-6 left-6 right-6 flex gap-4">
             <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-xl text-[#fef3c7] text-xs font-mono border border-white/20">
               Batch Traceable
             </div>
             <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-xl text-[#fef3c7] text-xs font-mono border border-white/20">
               100% A2 Beta-Casein
             </div>
           </div>
        </div>

        {/* Product Configuration */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[var(--mud)] mb-4">{PRODUCT_DATA.name}</h1>
          <p className="text-3xl font-serif font-bold text-[var(--terracotta)] mb-8">₹{activeVariant.priceInr.toLocaleString("en-IN")}</p>
          
          <p className="text-sm text-[var(--muted)]/90 leading-relaxed mb-8">{PRODUCT_DATA.description}</p>

          <div className="mb-8">
            <span className="block text-xs font-bold uppercase tracking-widest mb-3">Select Size</span>
            <div className="flex flex-wrap gap-3">
              {PRODUCT_DATA.variants.map((v) => (
                <button 
                  key={v.sku}
                  onClick={() => setSelectedSku(v.sku)}
                  className={`px-5 py-3 rounded-xl border text-sm font-bold transition ${selectedSku === v.sku ? 'border-[var(--terracotta)] bg-[var(--terracotta)]/10 text-[var(--terracotta)]' : 'border-[var(--border)] hover:border-[var(--mud)] text-[var(--muted)]'}`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mb-10">
            <div className="flex items-center border border-[var(--border)] rounded-xl bg-[var(--bg)]">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 hover:text-[var(--terracotta)] transition"><i className="fas fa-minus text-xs"></i></button>
              <span className="w-8 text-center font-bold text-sm">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(10, quantity + 1))} className="px-4 py-3 hover:text-[var(--terracotta)] transition"><i className="fas fa-plus text-xs"></i></button>
            </div>
            <button onClick={handleAddToCart} className="flex-1 primary-btn py-3 rounded-xl font-bold flex justify-center items-center gap-2">
              <i className="fas fa-shopping-bag"></i> Add to Bag
            </button>
          </div>

          <div className="space-y-4 pt-8 border-t border-[var(--border)]">
             <div className="flex gap-4">
               <i className="fas fa-map-marker-alt text-[var(--terracotta)] text-lg w-6"></i>
               <div>
                 <span className="block text-sm font-bold text-[var(--mud)] mb-1">Source Origin</span>
                 <span className="text-xs text-[var(--muted)]">{PRODUCT_DATA.traceability}</span>
               </div>
             </div>
             <div className="flex gap-4">
               <i className="fas fa-box text-[var(--terracotta)] text-lg w-6"></i>
               <div>
                 <span className="block text-sm font-bold text-[var(--mud)] mb-1">Storage</span>
                 <span className="text-xs text-[var(--muted)]">{PRODUCT_DATA.storage}</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
