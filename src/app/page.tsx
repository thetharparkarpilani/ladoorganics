"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ProductDTO, LocaleCode } from "@/types/domain";
import { TRANSLATIONS } from "@/lib/i18n";
import { useLocale } from "@/context/LocaleContext";
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
import CartCheckoutDrawer from "@/components/CartCheckoutDrawer";

export default function HomePage() {
  const { locale, setLocale } = useLocale();
  const [theme, setTheme] = useState<"light" | "dusk">("light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [catalogStatus, setCatalogStatus] = useState<"loading" | "ready" | "error">("loading");
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
    fetch("/api/catalog", { cache: "no-store" })
      .then((res) => res.ok ? res.json() : Promise.reject(new Error("Catalogue unavailable")))
      .then((data) => {
        if (!active) return;
        if (Array.isArray(data?.catalog)) {
          setProducts(data.catalog);
          setCatalogStatus("ready");
        } else {
          setCatalogStatus("error");
        }
      })
      .catch(() => {
        if (active) setCatalogStatus("error");
      });
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
            <a href="#store">{dict.section_store}</a><a href="#essentials-club">{dict.nav_essentials}</a><a href="#build-experience">{dict.nav_experience}</a><a href="#adopt">{dict.nav_gau}</a><a href="#journal">{dict.nav_journal}</a><a href="#corporate">{dict.nav_corporate}</a><Link href="/contact">{dict.nav_help}</Link><Link href="/trace/LO-PILANI-SAMPLE-001">{dict.nav_trace}</Link><a href="/dashboard">{dict.nav_journey}</a>
          </nav>
          <div className="flex items-center gap-2">
            <button type="button" className="xl:hidden text-xs font-bold px-3 py-2 rounded-full border border-[var(--border)]" aria-expanded={mobileMenuOpen} aria-controls="lado-mobile-navigation" onClick={() => setMobileMenuOpen(open => !open)}>{mobileMenuOpen ? dict.nav_close : dict.nav_menu}</button>
            <input type="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={dict.search} aria-label={dict.search} className="text-xs px-3 py-1.5 rounded-full border border-[var(--border)] bg-white/80 w-28 sm:w-36" />
            <button type="button" onClick={() => setDrawerOpen(true)} className="text-xs font-bold px-3 py-1.5 rounded-full bg-[var(--terracotta)] text-white">{dict.bag} ({itemCount})</button>
            <select aria-label="Language selector" value={locale} onChange={e => setLocale(e.target.value as LocaleCode)} className="text-xs font-bold px-2.5 py-1.5 rounded-full border border-[var(--border)] bg-white/80">
              <option value="en">EN</option><option value="hi">हिंदी</option><option value="ma">मारवाड़ी</option>
            </select>
            <button type="button" onClick={() => setTheme(t => t === "light" ? "dusk" : "light")} className="text-xs font-bold px-3 py-1.5 rounded-full border border-[var(--border)]">{theme === "light" ? dict.theme_dusk : dict.theme_sand}</button>
          </div>
        </div>
        {mobileMenuOpen && (
          <nav id="lado-mobile-navigation" aria-label="Mobile primary" className="lado-mobile-navigation xl:hidden">
            <a href="#store" onClick={() => setMobileMenuOpen(false)}>{dict.mobile_shop}</a>
            <a href="#farm-world" onClick={() => setMobileMenuOpen(false)}>{dict.mobile_farm}</a>
            <a href="#essentials-club" onClick={() => setMobileMenuOpen(false)}>Essentials Club</a>
            <a href="#adopt" onClick={() => setMobileMenuOpen(false)}>Gau Seva</a>
            <a href="#journal" onClick={() => setMobileMenuOpen(false)}>Journal</a>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>Help & Support</Link>
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>My Lado Journey</Link>
          </nav>
        )}
      </header>
      <main className="flex-1">
        <section className="farm-hero farm-hero-editorial relative isolate overflow-hidden px-4 sm:px-6 lg:px-8">
          <div className="farm-hero-shade" aria-hidden="true" />
          <div className="farm-hero-content relative z-10 max-w-7xl mx-auto">
            <div className="farm-hero-copy">
              <p className="farm-hero-kicker"><span /> {dict.hero_kicker}</p>
              <h1>{dict.hero_title}</h1>
              <p className="farm-hero-description">{dict.hero_subtitle}</p>
              <div className="farm-hero-actions">
                <a href="#store" className="farm-hero-primary">{dict.cta_shop} <span aria-hidden="true">↗</span></a>
                <a href="#farm-world" className="farm-hero-secondary">{dict.hero_cta_farm} <span aria-hidden="true">↓</span></a>
              </div>
              <div className="farm-hero-signature"><span className="farm-signature-mark">L</span><span><strong>Lado Organics</strong><small>Lado Love Pure</small></span></div>
            </div>
            <div className="farm-hero-side-note"><span className="farm-side-line" /><span>{dict.hero_side}</span></div>
          </div>
          <a className="farm-hero-scroll" href="#farm-world"><span /> {dict.scroll}</a>
        </section>
        <div data-farm-reveal><FarmWorldSection /></div>
        <div data-farm-reveal>
          {catalogStatus === "loading" ? (
            <section id="store" className="py-20 px-4 text-center border-t border-[var(--border)]" role="status">Loading the live Lado Organics catalogue…</section>
          ) : catalogStatus === "error" ? (
            <section id="store" className="py-20 px-4 text-center border-t border-[var(--border)]">
              <h2 className="text-3xl font-serif font-bold">The store is temporarily unavailable</h2>
              <p className="mt-3 text-sm opacity-75">We could not verify current product prices and stock. Please try again shortly or contact our team.</p>
              <button type="button" onClick={() => window.location.reload()} className="primary-btn mt-5 rounded-full px-5 py-3 text-sm font-bold">Try again</button>
            </section>
          ) : (
            <StorefrontSection products={products} locale={locale} searchQuery={searchQuery} whatsappNumber={whatsappNumber} onAddToBag={handleAddToBag} />
          )}
        </div>
        <div data-farm-reveal><EssentialsClubSection /></div>
        <div data-farm-reveal><TrustAndProcessSection whatsappNumber={whatsappNumber} /></div>
        <div data-farm-reveal><FarmCalculatorsSuite locale={locale} /></div>
        <section id="adopt" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)]">
          <div className="max-w-6xl mx-auto"><div className="text-center mb-12"><h2 className="text-3xl sm:text-5xl font-serif font-bold">{dict.section_adopt}</h2><p className="mt-3 max-w-2xl mx-auto opacity-80">{dict.adopt_description}</p></div>
            <div className="grid sm:grid-cols-3 gap-6">{["Dholi Sheri","Tara","Roshni"].map(name => <div key={name} className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 text-center"><h3 className="text-2xl font-serif font-bold text-[var(--terracotta)]">{name}</h3><p className="text-sm opacity-80 my-3">{dict.calf_tag}</p><a href="#experiences" className="primary-btn inline-block px-5 py-2.5 rounded-full text-xs font-bold">{dict.sponsor} {name}</a></div>)}</div>
          </div>
        </section>
        <div data-farm-reveal><FarmExperienceSection whatsappNumber={whatsappNumber} /></div>
        <div data-farm-reveal><BuildYourOwnExperience whatsappNumber={whatsappNumber} /></div>
        <div data-farm-reveal><GauSevaTransparencySection /></div>
        <div data-farm-reveal><JournalLibrarySection locale={locale} /></div>
        <div data-farm-reveal><CorporateGiftingSection whatsappNumber={whatsappNumber} /></div>
        <div data-farm-reveal><CowAsCoconutMap /></div>
      </main>
      <footer className="py-8 px-4 border-t border-[var(--border)] text-center text-xs opacity-75">© 2026 Lado Organics • Pilani, Rajasthan • ladoorganics.in • <a href="/contact" className="underline">{dict.footer_help}</a> • <a href="/policies" className="underline">{dict.footer_policies}</a></footer>
      <CartCheckoutDrawer />
    </div>
  );
}
