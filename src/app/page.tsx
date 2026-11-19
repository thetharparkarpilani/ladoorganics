"use client";

import React, { useEffect, useState } from "react";
import type { LocaleCode, ProductDTO } from "@/types/domain";
import { TRANSLATIONS } from "@/lib/i18n";
import StorefrontSection from "@/components/StorefrontSection";
import FarmExperienceSection from "@/components/FarmExperienceSection";
import FarmCalculatorsSuite from "@/components/FarmCalculatorsSuite";
import JournalLibrarySection from "@/components/JournalLibrarySection";
import ConciergeWidget from "@/components/ConciergeWidget";
import CartCheckoutDrawer, { type CartBagItem } from "@/components/CartCheckoutDrawer";

const INITIAL_PRODUCTS: ProductDTO[] = [
  {
    id: "a2-ghee",
    slug: "a2-bilona-ghee",
    nameEn: "A2 Bilona Ghee",
    nameHi: "A2 बिलोना घी",
    nameMa: "A2 बिलोना घी",
    descriptionEn:
      "Hand-churned from indigenous Tharparkar cow curd using the traditional Bilona method in Pilani, Rajasthan.",
    sourcingInfo: "Pilani Gaushala, Rajasthan",
    productionMethod: "Curd-cultured Bilona process",
    storageInstructions: "Store in a cool, dry place away from direct sunlight.",
    variants: [
      { id: "ghee-250ml", sku: "LO-GHEE-250", label: "250 ml", priceInr: 1350, stockQty: 10, isDefault: false },
      { id: "ghee-500ml", sku: "LO-GHEE-500", label: "500 ml", priceInr: 2600, stockQty: 10, isDefault: false },
      { id: "ghee-1l", sku: "LO-GHEE-1000", label: "1 litre", priceInr: 5000, stockQty: 10, isDefault: true }
    ]
  },
  {
    id: "dhoop",
    slug: "tharparkar-dhoop",
    nameEn: "Tharparkar Dhoop",
    nameHi: "थारपारकर धूप",
    nameMa: "थारपारकर धूप",
    descriptionEn: "Crafted from indigenous cow dung and natural botanical binders in Pilani.",
    sourcingInfo: "Pilani Gaushala, Rajasthan",
    productionMethod: "Cow dung & natural botanicals",
    storageInstructions: "Keep dry in an airtight container.",
    variants: [
      { id: "dhoop-box", sku: "LO-DHOOP-BOX", label: "Box", priceInr: 1000, stockQty: 15, isDefault: true }
    ]
  },
  {
    id: "compost",
    slug: "pure-kechua-khad",
    nameEn: "Pure Kechua Khad",
    nameHi: "केंचुआ खाद",
    nameMa: "केंचुआ खाद",
    descriptionEn: "Vermicompost enriched with biogas slurry for home, terrace, and organic gardens.",
    sourcingInfo: "Pilani Farm Ecosystem",
    productionMethod: "Biogas slurry vermicomposting",
    storageInstructions: "Store in a shaded, breathable bag.",
    variants: [
      { id: "khad-5kg", sku: "LO-KHAD-5KG", label: "5 kg Bag", priceInr: 2000, stockQty: 20, isDefault: true }
    ]
  },
  {
    id: "farm-stay",
    slug: "deep-work-bhunga-stay",
    nameEn: '"Deep Work" Bhunga Stay',
    nameHi: '"डीप वर्क" भुंगा स्टे',
    nameMa: '"डीप वर्क" भुंगा स्टे',
    descriptionEn:
      "Climate-responsive Rajasthani mud architecture in Pilani designed for focused work and farm living.",
    sourcingInfo: "Pilani, Jhunjhunu, Rajasthan",
    productionMethod: "Traditional mud-house stay",
    storageInstructions: "Confirm stay dates and details directly with the team.",
    variants: [
      { id: "stay-night", sku: "LO-STAY-NIGHT", label: "Night", priceInr: 4000, stockQty: 5, isDefault: true }
    ]
  }
];

const CALVES = [
  { name: "Dholi Sheri", note: "Tharparkar calf • Pilani Gaushala" },
  { name: "Tara", note: "Tharparkar calf • Pilani Gaushala" },
  { name: "Roshni", note: "Tharparkar calf • Pilani Gaushala" }
];

export default function HomePage() {
  const [locale, setLocale] = useState<LocaleCode>("en");
  const [theme, setTheme] = useState<"light" | "dusk">("light");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<ProductDTO[]>(INITIAL_PRODUCTS);
  const [bagItems, setBagItems] = useState<CartBagItem[]>([]);
  const [bagOpen, setBagOpen] = useState(false);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919636100337";
  const dict = TRANSLATIONS[locale] ?? TRANSLATIONS.en;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    let active = true;
    fetch("/api/products")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && Array.isArray(data?.products) && data.products.length > 0) {
          setProducts(data.products);
        }
      })
      .catch(() => {
        // Keep initial catalog safely
      });
    return () => {
      active = false;
    };
  }, []);

  const handleAddToBag = (newItem: CartBagItem) => {
    setBagItems((prev) => {
      const existing = prev.find((x) => x.sku === newItem.sku);
      if (existing) {
        return prev.map((x) =>
          x.sku === newItem.sku ? { ...x, quantity: x.quantity + newItem.quantity } : x
        );
      }
      return [...prev, newItem];
    });
    setBagOpen(true);
  };

  const handleUpdateQty = (sku: string, delta: number) => {
    setBagItems((prev) =>
      prev
        .map((x) => (x.sku === sku ? { ...x, quantity: x.quantity + delta } : x))
        .filter((x) => x.quantity > 0)
    );
  };

  const handleRemoveItem = (sku: string) => {
    setBagItems((prev) => prev.filter((x) => x.sku !== sku));
  };

  const totalBagCount = bagItems.reduce((sum, x) => sum + x.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass-nav sticky top-0 z-40 border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <a href="#" className="text-xl sm:text-2xl font-serif font-bold tracking-wider">
            LADO <span className="text-[var(--terracotta)] font-normal">ORGANICS</span>
          </a>

          <nav aria-label="Primary" className="hidden lg:flex items-center gap-5 text-xs font-bold uppercase tracking-widest">
            <a href="#store" className="hover:text-[var(--terracotta)] transition">{dict.section_store}</a>
            <a href="#adopt" className="hover:text-[var(--terracotta)] transition">{dict.section_adopt}</a>
            <a href="#experiences" className="hover:text-[var(--terracotta)] transition">Stays & Seva</a>
            <a href="#calculators-suite" className="hover:text-[var(--terracotta)] transition">Calculators</a>
            <a href="#journal" className="hover:text-[var(--terracotta)] transition">Journal</a>
            <a href="/trace/LO-PILANI-SAMPLE-001" className="hover:text-[var(--terracotta)] transition">Trace Batch</a>
            <a href="/dashboard" className="hover:text-[var(--terracotta)] transition">My Journey</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ghee, stay..."
              aria-label="Search products"
              className="text-xs px-3 py-1.5 rounded-full border border-[var(--border)] bg-white/80 text-[#78350f] w-28 sm:w-36 focus:outline-none focus:border-[var(--terracotta)]"
            />

            <button
              type="button"
              onClick={() => setBagOpen(true)}
              className="text-xs font-bold px-3 py-1.5 rounded-full bg-[var(--terracotta)] text-white cursor-pointer"
            >
              Bag ({totalBagCount})
            </button>

            <select
              aria-label="Language selector"
              value={locale}
              onChange={(e) => setLocale(e.target.value as LocaleCode)}
              className="text-xs font-bold px-2.5 py-1.5 rounded-full border border-[var(--border)] bg-white/80 text-[#78350f] cursor-pointer"
            >
              <option value="en">EN</option>
              <option value="hi">हिंदी</option>
              <option value="ma">मारवाड़ी</option>
            </select>

            <button
              type="button"
              onClick={() => setTheme((prev) => (prev === "light" ? "dusk" : "light"))}
              className="text-xs font-bold px-3 py-1.5 rounded-full border border-[var(--border)] cursor-pointer"
            >
              {theme === "light" ? "Dusk" : "Sand"}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <p className="inline-block text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-[var(--earth)] mb-6">
              {dict.brand_tagline}
            </p>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold leading-tight mb-6">
              {dict.hero_title}
            </h1>
            <p className="text-base sm:text-xl opacity-85 max-w-2xl mx-auto mb-10 leading-relaxed">
              {dict.hero_subtitle}
            </p>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-12">
              <a href="#store" className="primary-btn px-7 py-3.5 rounded-full font-bold text-sm">
                {dict.cta_shop}
              </a>
              <a
                href="/trace/LO-PILANI-SAMPLE-001"
                className="px-7 py-3.5 rounded-full font-bold text-sm border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--terracotta)] transition"
              >
                Verify Batch QR
              </a>
              <a
                href="/dashboard"
                className="px-7 py-3.5 rounded-full font-bold text-sm border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--terracotta)] transition"
              >
                My Lado Journey
              </a>
              <a
                href="https://www.youtube.com/@TheTharparkar"
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3.5 rounded-full font-bold text-sm border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--terracotta)] transition"
              >
                @TheTharparkar on YouTube
              </a>
            </div>

            <div className="max-w-3xl mx-auto rounded-3xl overflow-hidden border border-[var(--border)] shadow-xl bg-black">
              <div className="aspect-video w-full">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/JAhshRN6F28?si=Aym6zruA0iyXk4hh"
                  title="Lado Organics Pilani - Build in Public"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>

        <StorefrontSection
          products={products}
          locale={locale}
          searchQuery={searchQuery}
          whatsappNumber={whatsappNumber}
          onAddToBag={handleAddToBag}
        />

        <FarmCalculatorsSuite locale={locale} />

        <section id="adopt" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-5xl font-serif font-bold">{dict.section_adopt}</h2>
              <p className="text-sm sm:text-base opacity-80 mt-3 max-w-2xl mx-auto">
                Connect with our indigenous Tharparkar calves in Pilani—Dholi Sheri, Tara, and Roshni—and submit a sponsorship request below.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {CALVES.map((calf) => (
                <div
                  key={calf.name}
                  className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 text-center shadow-sm"
                >
                  <h3 className="text-2xl font-serif font-bold text-[var(--terracotta)] mb-2">{calf.name}</h3>
                  <p className="text-sm opacity-80 mb-5">{calf.note}</p>
                  <a
                    href="#experiences"
                    className="primary-btn inline-block px-5 py-2.5 rounded-full text-xs font-bold"
                  >
                    Sponsor {calf.name}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FarmExperienceSection whatsappNumber={whatsappNumber} />

        <JournalLibrarySection locale={locale} />

        <section id="blueprint" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">{dict.section_blueprint}</h2>
            <p className="text-sm sm:text-base opacity-80 max-w-3xl mx-auto mb-8 leading-relaxed">
              Founded by Akash Saini (BITS Pilani) in Pilani, Rajasthan, Lado Organics applies a zero-waste circular approach inspired by traditional farm systems—connecting A2 Bilona dairy, biogas slurry vermicompost, and Tharparkar Dhoop with local farming families.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-xs font-bold">
              <span className="px-4 py-2 rounded-full border border-[var(--border)]">MSME: UDYAM-RJ-21-0104324</span>
              <span className="px-4 py-2 rounded-full border border-[var(--border)]">ZED Bronze Certified</span>
              <span className="px-4 py-2 rounded-full border border-[var(--border)]">Pilani, Rajasthan</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 px-4 border-t border-[var(--border)] text-center text-xs opacity-75">
        <p>© 2026 Lado Organics • Pilani, Rajasthan • ladoorganics.in</p>
      </footer>

      <CartCheckoutDrawer
        isOpen={bagOpen}
        onClose={() => setBagOpen(false)}
        items={bagItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearBag={() => setBagItems([])}
        whatsappNumber={whatsappNumber}
      />

      <ConciergeWidget whatsappNumber={whatsappNumber} />
    </div>
  );
}
