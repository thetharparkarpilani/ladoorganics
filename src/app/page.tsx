"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { LocaleCode, ProductDTO } from "@/types/domain";
import { TRANSLATIONS } from "@/lib/i18n";
import { useCart } from "@/context/CartContext";
import StorefrontSection from "@/components/StorefrontSection";
import EssentialsClubSection from "@/components/EssentialsClubSection";
import TrustAndProcessSection from "@/components/TrustAndProcessSection";
import FarmCalculatorsSuite from "@/components/FarmCalculatorsSuite";
import FarmExperienceSection from "@/components/FarmExperienceSection";
import BuildYourOwnExperience from "@/components/BuildYourOwnExperience";
import GauSevaTransparencySection from "@/components/GauSevaTransparencySection";
import JournalLibrarySection from "@/components/JournalLibrarySection";
import CorporateGiftingSection from "@/components/CorporateGiftingSection";
import CowAsCoconutMap from "@/components/CowAsCoconutMap";
import FarmWorldSection from "@/components/FarmWorldSection";
import ConciergeWidget from "@/components/ConciergeWidget";
import CartCheckoutDrawer from "@/components/CartCheckoutDrawer";

const INITIAL_PRODUCTS: ProductDTO[] = [
  { id: "a2-ghee", slug: "a2-bilona-ghee", nameEn: "A2 Bilona Ghee", nameHi: "A2 बिलोना घी", nameMa: "A2 बिलोना घी", descriptionEn: "Hand-churned from indigenous Tharparkar cow curd using the traditional Bilona method in Pilani, Rajasthan.", sourcingInfo: "Pilani Gaushala, Rajasthan", productionMethod: "Curd-cultured Bilona process", storageInstructions: "Store in a cool, dry place away from direct sunlight.", variants: [{ id: "ghee-250ml", sku: "LO-GHEE-250", label: "250 ml", priceInr: 1350, stockQty: 10, isDefault: false }, { id: "ghee-500ml", sku: "LO-GHEE-500", label: "500 ml", priceInr: 2600, stockQty: 10, isDefault: false }, { id: "ghee-1l", sku: "LO-GHEE-1000", label: "1 litre", priceInr: 5000, stockQty: 10, isDefault: true }] },
  { id: "dhoop", slug: "tharparkar-dhoop", nameEn: "Tharparkar Dhoop", nameHi: "थारपारकर धूप", nameMa: "थारपारकर धूप", descriptionEn: "Crafted from indigenous cow dung and natural botanical binders in Pilani.", sourcingInfo: "Pilani Gaushala, Rajasthan", productionMethod: "Cow dung & natural botanicals", storageInstructions: "Keep dry in an airtight container.", variants: [{ id: "dhoop-box", sku: "LO-DHOOP-BOX", label: "Box", priceInr: 1000, stockQty: 15, isDefault: true }] },
  { id: "compost", slug: "pure-kechua-khad", nameEn: "Pure Kechua Khad", nameHi: "केंचुआ खाद", nameMa: "केंचुआ खाद", descriptionEn: "Vermicompost enriched with biogas slurry for home, terrace, and organic gardens.", sourcingInfo: "Pilani Farm Ecosystem", productionMethod: "Biogas slurry vermicomposting", storageInstructions: "Store in a shaded, breathable bag.", variants: [{ id: "khad-5kg", sku: "LO-KHAD-5KG", label: "5 kg Bag", priceInr: 2000, stockQty: 20, isDefault: true }] },
  { id: "farm-stay", slug: "deep-work-bhunga-stay", nameEn: '"Deep Work" Bhunga Stay', nameHi: '"डीप वर्क" भुंगा स्टे', nameMa: '"डीप वर्क" भुंगा स्टे', descriptionEn: "Climate-responsive Rajasthani mud architecture in Pilani designed for focused work and farm living.", sourcingInfo: "Pilani, Jhunjhunu, Rajasthan", productionMethod: "Traditional mud-house stay", storageInstructions: "Confirm stay dates and details directly with the team.", variants: [{ id: "stay-night", sku: "LO-STAY-NIGHT", label: "Night", priceInr: 4000, stockQty: 5, isDefault: true }] }
];

export default function HomePage() {
  const [locale, setLocale] = useState<LocaleCode>("en");
  const [theme, setTheme] = useState<"light" | "dusk">("light");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<ProductDTO[]>(INITIAL_PRODUCTS);
  const { addToCart, itemCount, setDrawerOpen } = useCart();
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919636100337";
  const dict = TRANSLATIONS[locale] ?? TRANSLATIONS.en;

  useEffect(() => { document.documentElement.setAttribute("data-theme", theme); }, [theme]);
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main > section, main > [data-farm-reveal]"));
    if (!("IntersectionObserver" in window)) {
      sections.forEach((section) => section.classList.add("farm-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("farm-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -48px 0px" });
    sections.forEach((section) => {
      section.classList.add("farm-reveal");
      observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    let active = true;
    fetch("/api/catalog")
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (active && Array.isArray(data?.catalog) && data.catalog.length) setProducts(data.catalog);
      })
      .catch(() => { /* Use safe starter catalogue if database is not configured. */ });
    return () => { active = false; };
  }, []);

  const handleAddToBag = (item: { sku: string; title: string; unitPriceInr: number; quantity: number }) => {
    const product = products.find(p => p.variants.some(v => v.sku === item.sku));
    const variant = product?.variants.find(v => v.sku === item.sku);
    addToCart({
      variantId: variant?.id || item.sku,
      sku: item.sku,
      title: item.title,
      priceInr: item.unitPriceInr,
      quantity: item.quantity,
      maxStock: Math.max(1, variant?.stockQty || 20)
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass-nav sticky top-0 z-40 border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <Link href="/" aria-label="Lado Organics home" className="inline-flex items-center shrink-0"><Image src="/lado-organics-logo.svg" alt="Lado Organics — Lado Love Pure" width={180} height={120} priority className="h-14 sm:h-16 w-auto object-contain" /></Link>
          <nav aria-label="Primary" className="hidden xl:flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
            <a href="#store">{dict.section_store}</a><a href="#essentials-club">Essentials Club</a><a href="#build-experience">Build Experience</a><a href="#adopt">Gau Seva</a><a href="#journal">Journal</a><a href="#corporate">Corporate</a><Link href="/contact">Help & Support</Link><Link href="/trace/LO-PILANI-SAMPLE-001">Trace Batch</Link><a href="/dashboard">My Journey</a>
          </nav>
          <div className="flex items-center gap-2">
            <input type="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search products..." aria-label="Search products" className="text-xs px-3 py-1.5 rounded-full border border-[var(--border)] bg-white/80 w-28 sm:w-36" />
            <button type="button" onClick={() => setDrawerOpen(true)} className="text-xs font-bold px-3 py-1.5 rounded-full bg-[var(--terracotta)] text-white">Bag ({itemCount})</button>
            <select aria-label="Language selector" value={locale} onChange={e => setLocale(e.target.value as LocaleCode)} className="text-xs font-bold px-2.5 py-1.5 rounded-full border border-[var(--border)] bg-white/80">
              <option value="en">EN</option><option value="hi">हिंदी</option><option value="ma">मारवाड़ी</option>
            </select>
            <button type="button" onClick={() => setTheme(t => t === "light" ? "dusk" : "light")} className="text-xs font-bold px-3 py-1.5 rounded-full border border-[var(--border)]">{theme === "light" ? "Dusk" : "Sand"}</button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="farm-hero relative isolate overflow-hidden py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
          <div className="farm-hero-scene" aria-hidden="true">
            <span className="farm-sun" />
            <span className="farm-cloud farm-cloud-one" />
            <span className="farm-cloud farm-cloud-two" />
            <span className="farm-hill farm-hill-back" />
            <span className="farm-hill farm-hill-front" />
            <span className="farm-grass farm-grass-left" />
            <span className="farm-grass farm-grass-right" />
            <span className="farm-dust farm-dust-one" />
            <span className="farm-dust farm-dust-two" />
          </div>
          <div className="farm-hero-content relative z-10 max-w-5xl mx-auto text-center">
            <p className="inline-block text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-[var(--earth)] mb-6">{dict.brand_tagline}</p>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold leading-tight mb-6">{dict.hero_title}</h1>
            <p className="text-base sm:text-xl opacity-85 max-w-2xl mx-auto mb-10 leading-relaxed">{dict.hero_subtitle}</p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-12">
              <a href="#store" className="primary-btn px-7 py-3.5 rounded-full font-bold text-sm">{dict.cta_shop}</a>
              <a href="#build-experience" className="px-7 py-3.5 rounded-full font-bold text-sm border border-[var(--border)]">Build Farm Experience</a>
              <Link href="/trace/LO-PILANI-SAMPLE-001" className="px-7 py-3.5 rounded-full font-bold text-sm border border-[var(--border)]">Verify Batch QR</Link>
              <a href="/dashboard" className="px-7 py-3.5 rounded-full font-bold text-sm border border-[var(--border)]">My Lado Journey</a>
            </div>
            <div className="farm-hero-proof max-w-3xl mx-auto">
              <span>🐄 Indigenous Tharparkar heritage</span><span>✦</span><span>🌱 Circular farm thinking</span><span>✦</span><span>🤎 Rooted in Pilani</span>
            </div>
          </div>
        </section>
        <div data-farm-reveal><FarmWorldSection /></div>
        <div data-farm-reveal><StorefrontSection products={products} locale={locale} searchQuery={searchQuery} whatsappNumber={whatsappNumber} onAddToBag={handleAddToBag} /></div>
        <div data-farm-reveal><EssentialsClubSection /></div>
        <div data-farm-reveal><TrustAndProcessSection whatsappNumber={whatsappNumber} /></div>
        <div data-farm-reveal><FarmCalculatorsSuite locale={locale} /></div>
        <section id="adopt" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)]">
          <div className="max-w-6xl mx-auto"><div className="text-center mb-12"><h2 className="text-3xl sm:text-5xl font-serif font-bold">{dict.section_adopt}</h2><p className="mt-3 max-w-2xl mx-auto opacity-80">Meet our Tharparkar calves at Pilani Gaushala and enquire about responsible sponsorship.</p></div>
            <div className="grid sm:grid-cols-3 gap-6">{["Dholi Sheri","Tara","Roshni"].map(name => <div key={name} className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 text-center"><h3 className="text-2xl font-serif font-bold text-[var(--terracotta)]">{name}</h3><p className="text-sm opacity-80 my-3">Tharparkar calf • Pilani Gaushala</p><a href="#experiences" className="primary-btn inline-block px-5 py-2.5 rounded-full text-xs font-bold">Sponsor {name}</a></div>)}</div>
          </div>
        </section>
        <div data-farm-reveal><FarmExperienceSection whatsappNumber={whatsappNumber} /></div>
        <div data-farm-reveal><BuildYourOwnExperience whatsappNumber={whatsappNumber} /></div>
        <div data-farm-reveal><GauSevaTransparencySection /></div>
        <div data-farm-reveal><JournalLibrarySection locale={locale} /></div>
        <div data-farm-reveal><CorporateGiftingSection whatsappNumber={whatsappNumber} /></div>
        <div data-farm-reveal><CowAsCoconutMap /></div>
      </main>
      <footer className="py-8 px-4 border-t border-[var(--border)] text-center text-xs opacity-75">© 2026 Lado Organics • Pilani, Rajasthan • ladoorganics.in • <a href="/contact" className="underline">Help & Support</a> • <a href="/policies" className="underline">Policies & Legal</a></footer>
      <CartCheckoutDrawer />
      <ConciergeWidget whatsappNumber={whatsappNumber} />
    </div>
  );
}
