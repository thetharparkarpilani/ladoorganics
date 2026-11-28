"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ProductDTO, LocaleCode } from "@/types/domain";
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
import FarmWorldSection from "@/components/FarmWorldSection";
import CartCheckoutDrawer from "@/components/CartCheckoutDrawer";
import ImmersiveFarmScene from "@/components/ImmersiveFarmScene";

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

export default function HomePage() {
  const { locale, setLocale } = useLocale();
  const router = useRouter();
  const { addToCart, itemCount, setDrawerOpen } = useCart();
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [catalogState, setCatalogState] = useState<"loading" | "ready" | "error">("loading");
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoLoadFailed, setLogoLoadFailed] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [activeHomeTab, setActiveHomeTab] = useState("farm");

  useEffect(() => {
    const updateHeader = () => setHeaderScrolled(window.scrollY > 24);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/catalog", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Catalogue unavailable")))
      .then((data) => {
        if (!active) return;
        if (Array.isArray(data?.catalog)) {
          setProducts(data.catalog);
          setCatalogState("ready");
        } else setCatalogState("error");
      })
      .catch(() => { if (active) setCatalogState("error"); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-lado-reveal]"));
    if (!("IntersectionObserver" in window)) {
      sections.forEach((section) => section.classList.add("lado-is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("lado-is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -36px 0px" });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const addItem = (item: { sku: string; title: string; unitPriceInr: number; quantity: number }) => {
    const product = products.find((entry) => entry.variants.some((variant) => variant.sku === item.sku));
    const variant = product?.variants.find((entry) => entry.sku === item.sku);
    addToCart({
      variantId: variant?.id || item.sku,
      sku: item.sku,
      title: item.title,
      priceInr: item.unitPriceInr,
      quantity: item.quantity,
      maxStock: Math.max(1, variant?.stockQty || 1),
    });
  };

  const copy = locale === "hi" ? {
    announcement: "पिलानी, राजस्थान की परंपरा और खेत से जुड़ी शुद्धता",
    shop: "उत्पाद देखें", farm: "हमारा खेत", story: "हमारी कहानी",
    headline: "परंपरा की जड़ें। हर दिन की शुद्धता।",
    subhead: "Lado Organics में आपका स्वागत है — जहाँ पारंपरिक कारीगरी, खेत से जुड़ाव और सोच-समझकर चुने गए उत्पाद साथ आते हैं।",
    explore: "संग्रह देखें", learn: "Lado के बारे में", promise: "हमारा तरीका",
    promiseTitle: "सिर्फ उत्पाद नहीं — एक जीवंत परंपरा",
    promiseText: "हमारी कहानी खेत, पशुपालन और पारंपरिक तरीकों से जुड़ी है। हर उत्पाद की उपलब्धता और जानकारी वही दिखाई जाती है जिसे हम सत्यापित कर सकते हैं।",
    trace: "बैच ट्रेस करें", account: "मेरा खाता", help: "संपर्क", journal: "कहानियाँ और ज्ञान",
    loading: "वर्तमान उत्पाद सूची लोड हो रही है…", error: "उत्पाद सूची अभी उपलब्ध नहीं है। कृपया कुछ देर बाद पुनः प्रयास करें।",
    retry: "पुनः प्रयास", footer: "परंपरा से जुड़ा। प्रकृति के करीब।",
  } : locale === "ma" ? {
    announcement: "पिलानी, राजस्थान री परंपरा अर खेत सूं जुड़ी शुद्धता",
    shop: "सामान देखो", farm: "म्हारो खेत", story: "म्हारी कहाणी",
    headline: "परंपरा री जड़। रोज री शुद्धता।",
    subhead: "Lado Organics में पधारो — जठै पुराणी कारीगरी, खेत सूं जुड़ाव अर सोच-समझ कै चुन्या सामान साथ आवै।",
    explore: "संग्रह देखो", learn: "Lado री जानकारी", promise: "म्हारो तरीका",
    promiseTitle: "खाली सामान कोनी — जीवती परंपरा",
    promiseText: "म्हारी कहाणी खेत, पशुपालन अर पुराणी रीति सूं जुड़ी है। हर सामान री उपलब्धता अर जानकारी वही बतावां जिण नै पक्को कर सकां।",
    trace: "बैच जांचो", account: "म्हारो खातो", help: "संपर्क", journal: "कहाणी अर जानकारी",
    loading: "चालू सामान री सूची आवै है…", error: "सामान री सूची अभी उपलब्ध कोनी। थोड़ी देर बाद फेर कोशिश करो।",
    retry: "फेर कोशिश", footer: "परंपरा सूं जुड़्या। प्रकृति रै नजदीक।",
  } : {
    announcement: "Rooted in Pilani, Rajasthan · Tradition, care and everyday purity",
    shop: "Shop collection", farm: "Explore the farm", story: "Our story",
    headline: "Rooted in Tradition. Crafted with Purity.",
    subhead: "Discover the goodness of nature, traditional Indian wisdom and thoughtfully crafted products from Lado Organics, rooted in Pilani, Rajasthan.",
    explore: "Explore the collection", learn: "Discover Lado", promise: "Our approach",
    promiseTitle: "More than a product. A living tradition.",
    promiseText: "Our story is connected to the farm, animal care and traditional practices. We show product details and availability only when they can be verified.",
    trace: "Explore batch traceability", account: "My account", help: "Contact us", journal: "Journal & learning",
    loading: "Loading the current product collection…", error: "The product collection is temporarily unavailable. Please try again shortly.",
    retry: "Try again", footer: "Rooted in tradition. Close to nature.",
  };

  return (
    <div className="lado-site">
      <header className={headerScrolled ? "lado-header is-scrolled" : "lado-header"}>
        <div className="lado-header-inner">
          <Link href="/" className="lado-brand" aria-label="Lado Organics home">
            {logoLoadFailed ? <span role="img" aria-label="Lado Organics — Lado Love Pure" className="flex flex-col leading-none text-left"><strong className="font-serif text-2xl">Lado</strong><small className="mt-1 text-[9px] font-bold tracking-[0.28em]">ORGANICS</small></span> : <Image src="/images/lado-organics/Ladologo.png" alt="Lado Organics — Lado Love Pure" width={184} height={104} priority sizes="(max-width: 760px) 112px, 154px" onError={() => setLogoLoadFailed(true)} />}
          </Link>
          <button className="lado-menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="lado-primary-nav" onClick={() => setMenuOpen((value) => !value)}>{menuOpen ? "Close" : "Menu"}</button>
          <nav id="lado-primary-nav" className={menuOpen ? "lado-nav is-open" : "lado-nav"} aria-label="Main navigation">
            <a href="#collection" onClick={() => setMenuOpen(false)}>{copy.shop}</a>
            <a href="#farm-world" onClick={() => setMenuOpen(false)}>{copy.farm}</a>
            <a href="#our-approach" onClick={() => setMenuOpen(false)}>{copy.promise}</a>
            <Link href="/trace" onClick={() => setMenuOpen(false)}>{copy.trace}</Link>
            <Link href="/search" onClick={() => setMenuOpen(false)}>Search</Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)}>{copy.help}</Link>
          </nav>
          <div className="lado-header-actions">
            <select aria-label="Choose language" value={locale} onChange={(event) => setLocale(event.target.value as LocaleCode)}>
              <option value="en">EN</option><option value="hi">हिंदी</option><option value="ma">मारवाड़ी</option>
            </select>
            <Link href="/dashboard" className="lado-account-link">{copy.account}</Link>
            <button className="lado-cart-button" type="button" onClick={() => setDrawerOpen(true)}>Bag <span>{itemCount}</span></button>
          </div>
        </div>
      </header>

      <main>
        <section className="lado-hero">
          <div className="lado-hero-text">
            <p className="lado-eyebrow">LADO ORGANICS <span>·</span> LADO LOVE PURE</p>
            <h1>{copy.headline}</h1>
            <p className="lado-hero-description">{copy.subhead}</p>
            <div className="lado-hero-actions">
              <a className="lado-button lado-button-primary" href="#collection">{copy.explore}<span aria-hidden="true">↗</span></a>
              <a className="lado-button lado-button-quiet" href="#farm-world">{copy.learn}<span aria-hidden="true">↓</span></a>
            </div>
            <div className="lado-hero-footnote"><span className="lado-seal">L</span><span><strong>Lado Organics</strong><small>Pilani · Rajasthan · India</small></span></div>
          </div>
          <div className="lado-hero-art"><ImmersiveFarmScene /></div>
          <div className="lado-hero-bottom"><span>01 / THE LADO STORY</span><span>SCROLL TO EXPLORE ↓</span></div>
        </section>

        <section className="lado-intro" id="our-approach" data-lado-reveal>
          <p className="lado-eyebrow">{copy.promise}</p>
          <h2>{copy.promiseTitle}</h2>
          <p>{copy.promiseText}</p>
          <div className="lado-intro-links">
            <Link href="/trace">{copy.trace} ↗</Link><Link href="/dashboard">{copy.account} ↗</Link><Link href="/contact">{copy.help} ↗</Link>
          </div>
        </section>

        <section id="collection" className="lado-collection" data-lado-reveal>
          <div className="lado-section-heading">
            <div><p className="lado-eyebrow">THE LADO COLLECTION</p><h2>{copy.shop}</h2></div>
            <p>Explore the products currently listed in our live catalogue.</p>
          </div>
          {catalogState === "loading" ? <div className="lado-state" role="status">{copy.loading}</div> :
            catalogState === "error" ? <div className="lado-state"><p>{copy.error}</p><button className="lado-button lado-button-primary" type="button" onClick={() => window.location.reload()}>{copy.retry}</button></div> :
            <StorefrontSection products={products} locale={locale} searchQuery={query} whatsappNumber={whatsappNumber} onAddToBag={addItem} />}
          <div className="lado-catalog-tools">
            <label htmlFor="lado-product-search">Search collection</label>
            <input id="lado-product-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products…" onKeyDown={(event) => { if (event.key === "Enter" && query.trim().length > 1) router.push("/search?q=" + encodeURIComponent(query.trim())); }} />
          </div>
        </section>

        <section className="lado-home-discover" data-lado-reveal aria-labelledby="lado-home-discover-title">
          <div className="lado-home-discover-heading">
            <p className="lado-eyebrow">EXPLORE THE LADO WORLD</p>
            <h2 id="lado-home-discover-title">A little more to discover</h2>
            <p>Choose a chapter. The details are here when you need them.</p>
          </div>
          <div className="lado-home-tabs" role="tablist" aria-label="Explore Lado sections">
            <button id="home-tab-farm" type="button" role="tab" aria-selected={activeHomeTab === "farm"} aria-controls="home-tab-panel" className={activeHomeTab === "farm" ? "is-active" : ""} onClick={() => setActiveHomeTab("farm")}>Farm world</button>
            <button id="home-tab-experience" type="button" role="tab" aria-selected={activeHomeTab === "experience"} aria-controls="home-tab-panel" className={activeHomeTab === "experience" ? "is-active" : ""} onClick={() => setActiveHomeTab("experience")}>Experiences</button>
            <button id="home-tab-build" type="button" role="tab" aria-selected={activeHomeTab === "build"} aria-controls="home-tab-panel" className={activeHomeTab === "build" ? "is-active" : ""} onClick={() => setActiveHomeTab("build")}>Build your own</button>
            <button id="home-tab-club" type="button" role="tab" aria-selected={activeHomeTab === "club"} aria-controls="home-tab-panel" className={activeHomeTab === "club" ? "is-active" : ""} onClick={() => setActiveHomeTab("club")}>Essentials club</button>
            <button id="home-tab-process" type="button" role="tab" aria-selected={activeHomeTab === "process"} aria-controls="home-tab-panel" className={activeHomeTab === "process" ? "is-active" : ""} onClick={() => setActiveHomeTab("process")}>Our process</button>
            <button id="home-tab-tools" type="button" role="tab" aria-selected={activeHomeTab === "tools"} aria-controls="home-tab-panel" className={activeHomeTab === "tools" ? "is-active" : ""} onClick={() => setActiveHomeTab("tools")}>Farm tools</button>
            <button id="home-tab-seva" type="button" role="tab" aria-selected={activeHomeTab === "seva"} aria-controls="home-tab-panel" className={activeHomeTab === "seva" ? "is-active" : ""} onClick={() => setActiveHomeTab("seva")}>Gau Seva</button>
            <button id="home-tab-journal" type="button" role="tab" aria-selected={activeHomeTab === "journal"} aria-controls="home-tab-panel" className={activeHomeTab === "journal" ? "is-active" : ""} onClick={() => setActiveHomeTab("journal")}>Journal</button>
            <button id="home-tab-gifting" type="button" role="tab" aria-selected={activeHomeTab === "gifting"} aria-controls="home-tab-panel" className={activeHomeTab === "gifting" ? "is-active" : ""} onClick={() => setActiveHomeTab("gifting")}>Gifting</button>
          </div>
          <div id="home-tab-panel" className="lado-home-tab-panel" role="tabpanel" aria-labelledby={`home-tab-${activeHomeTab}`}>
            {activeHomeTab === "farm" && <FarmWorldSection /> }
            {activeHomeTab === "experience" && <FarmExperienceSection whatsappNumber={whatsappNumber} />}
            {activeHomeTab === "build" && <BuildYourOwnExperience whatsappNumber={whatsappNumber} />}
            {activeHomeTab === "club" && <EssentialsClubSection />}
            {activeHomeTab === "process" && <TrustAndProcessSection whatsappNumber={whatsappNumber} />}
            {activeHomeTab === "tools" && <FarmCalculatorsSuite locale={locale} />}
            {activeHomeTab === "seva" && <GauSevaTransparencySection />}
            {activeHomeTab === "journal" && <JournalLibrarySection locale={locale} />}
            {activeHomeTab === "gifting" && <CorporateGiftingSection whatsappNumber={whatsappNumber} />}
          </div>
        </section>

        <section className="lado-journey-strip" data-lado-reveal>
          <div><p className="lado-eyebrow">CONTINUE YOUR LADO JOURNEY</p><h2>Know your product. Follow its journey.</h2><p>Visit your account, explore available batch information or speak with our team.</p></div>
          <div className="lado-journey-actions"><Link href="/trace">Batch traceability ↗</Link><Link href="/dashboard">My account ↗</Link><Link href="/contact">Get in touch ↗</Link></div>
        </section>
      </main>

      <footer className="lado-footer">
        <div className="lado-footer-main">
          <Link href="/" aria-label="Lado Organics home" className="lado-home-footer-logo-box">{logoLoadFailed ? <span role="img" aria-label="Lado Organics" className="flex flex-col items-center justify-center leading-none text-center"><strong className="font-serif text-2xl">Lado</strong><small className="mt-1 text-[9px] font-bold tracking-[0.28em]">ORGANICS</small></span> : <Image src="/images/lado-organics/Ladologo.png" alt="Lado Organics" width={180} height={120} loading="eager" sizes="(max-width: 760px) 170px, 190px" className="lado-home-footer-logo-image" onError={() => setLogoLoadFailed(true)} />}</Link>
          <p>{copy.footer}</p>
          <nav aria-label="Footer navigation"><Link href="/contact">{copy.help}</Link><Link href="/policies">Policies</Link><Link href="/trace">{copy.trace}</Link><Link href="/dashboard">{copy.account}</Link></nav>
        </div>
        <div className="lado-footer-bottom"><span>© {new Date().getFullYear()} Lado Organics</span><span>Pilani, Rajasthan, India</span><span>Lado Love Pure</span></div>
      </footer>
      <CartCheckoutDrawer />
    </div>
  );
}
