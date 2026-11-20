"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ProductDTO } from "@/types/domain";

interface StorefrontProps {
  locale: "en" | "hi" | "ma";
  onAddToCart: (variantId: string, quantity: number) => void;
}

export default function StorefrontCatalog({ locale, onAddToCart }: StorefrontProps) {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/catalog")
      .then(res => res.json())
      .then(data => {
        setProducts(data.catalog || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getLocalizedName = (product: ProductDTO) => {
    if (locale === "hi" && product.nameHi) return product.nameHi;
    if (locale === "ma" && product.nameMa) return product.nameMa;
    return product.nameEn;
  };

  if (loading) {
    return <div className="py-20 text-center animate-pulse text-[var(--text-muted)]">Loading Pilani Ecosystem...</div>;
  }

  if (products.length === 0) {
    return <div className="py-20 text-center text-[var(--text-muted)]">Storefront is currently being updated.</div>;
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {products.map((product) => {
        const defaultVariant = product.variants.find(v => v.isDefault) || product.variants[0];
        if (!defaultVariant) return null;

        return (
          <article key={product.id} className="card-earthy overflow-hidden flex flex-col group relative">
            <Link href={`/store/${product.slug}`} className="block h-56 bg-[var(--bg-sand)] p-6 relative flex items-center justify-center overflow-hidden border-b border-[var(--border-light)]">
              {product.slug.includes("ghee") && <i className="fas fa-jar text-6xl text-[var(--accent-earth)]/20 group-hover:scale-110 transition-transform duration-700"></i>}
              {product.slug.includes("dhoop") && <i className="fas fa-fire text-6xl text-[var(--accent-terracotta)]/20 group-hover:scale-110 transition-transform duration-700"></i>}
              {product.slug.includes("khad") && <i className="fas fa-seedling text-6xl text-[var(--accent-forest)]/20 group-hover:scale-110 transition-transform duration-700"></i>}
              {product.slug.includes("stay") && <i className="fas fa-house-chimney text-6xl text-[var(--text-mud)]/20 group-hover:scale-110 transition-transform duration-700"></i>}
              
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-[var(--accent-forest)] shadow-sm">
                Farm Direct
              </div>
            </Link>
            
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-serif font-bold text-[var(--text-charcoal)] mb-2 group-hover:text-[var(--accent-terracotta)] transition-colors">
                {getLocalizedName(product)}
              </h3>
              <p className="text-[var(--text-muted)] text-sm mb-6 leading-relaxed font-light line-clamp-3 flex-grow">
                {product.descriptionEn}
              </p>
              
              <div className="flex items-end justify-between mb-6 pt-4 border-t border-[var(--border-light)]">
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-1">Per {defaultVariant.label}</span>
                  <span className="text-2xl font-serif font-bold text-[var(--text-charcoal)]">₹{defaultVariant.priceInr.toLocaleString("en-IN")}</span>
                </div>
              </div>
              
              <button 
                onClick={() => onAddToCart(defaultVariant.id, 1)}
                className="w-full btn-forest py-3.5 rounded-xl font-bold text-xs tracking-widest uppercase flex justify-center items-center gap-2"
              >
                Add to Bag
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
