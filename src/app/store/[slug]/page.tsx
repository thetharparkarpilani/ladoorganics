"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductReviewsSection from "@/components/ProductReviewsSection";
import { useLocale } from "@/context/LocaleContext";
import type { ProductDTO } from "@/types/domain";

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
  const { locale } = useLocale();
  const slug = decodeURIComponent(params.slug || "a2-bilona-ghee");
  const product = CATALOG_DETAIL[slug] ?? CATALOG_DETAIL["a2-bilona-ghee"];
  const [liveProduct, setLiveProduct] = useState<ProductDTO | null>(null);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    let active = true;
    fetch("/api/catalog", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (!active) return;
        const found = Array.isArray(data?.catalog)
          ? (data.catalog as ProductDTO[]).find((item) => item.slug === slug) || null
          : null;
        setLiveProduct(found);
        if (found) {
          const defaultIndex = found.variants.findIndex((variant) => variant.isDefault);
          setSelectedIdx(defaultIndex >= 0 ? defaultIndex : 0);
        }
      })
      .catch((error) => console.error("Live product details unavailable:", error))
      .finally(() => { if (active) setCatalogLoading(false); });
    return () => { active = false; };
  }, [slug]);

  const liveVariants = liveProduct?.variants ?? [];

  const localized = locale === "hi" ? {
    category: { "a2-bilona-ghee": "देसी थारपारकर डेयरी", "tharparkar-dhoop": "गोबर से बनी प्राकृतिक धूप", "pure-kechua-khad": "जैविक केंचुआ खाद", "deep-work-bhunga-stay": "ग्रामीण पर्यटन और भुंगा ठहराव" }[slug] || product.category,
    description: { "a2-bilona-ghee": "पिलानी में देसी थारपारकर गाय के दही से पारंपरिक बिलोना विधि द्वारा मथा गया घी।", "tharparkar-dhoop": "पिलानी में देसी गाय के गोबर और प्राकृतिक वनस्पति सामग्री से तैयार धूप।", "pure-kechua-khad": "केंचुओं की मदद से तैयार वर्मी कम्पोस्ट। सही मात्रा और उपयोग के लिए उत्पाद का लेबल देखें।", "deep-work-bhunga-stay": "पिलानी में पारंपरिक राजस्थानी मिट्टी की वास्तुकला वाला भुंगा ठहराव। तारीख और उपलब्धता टीम से पक्की करें।" }[slug] || product.description,
    sourcing: product.sourcing, productionMethod: product.productionMethod,
    storage: { "a2-bilona-ghee": "सीधी धूप से दूर ठंडी और सूखी जगह रखें। हमेशा साफ़ और सूखा चम्मच इस्तेमाल करें।", "tharparkar-dhoop": "नमी से दूर, सूखे और बंद डिब्बे में रखें।", "pure-kechua-khad": "छायादार और हवादार जगह पर रखें।", "deep-work-bhunga-stay": "आगमन की तारीख और भोजन की पसंद टीम से पहले पक्की करें।" }[slug] || product.storage,
    back: "← उत्पाद संग्रह पर लौटें", trace: "बैच की जानकारी देखें ↗", tags: ["राजस्थान में सावधानी से तैयार", "खेत से जुड़ी सोच-समझ वाली प्रक्रिया"],
    note: "Lado Organics की खेत-कहानी का हिस्सा", choose: "अपना पैक चुनें", bring: "खेत की अच्छाई अपने घर लाएँ।",
    selected: "चुना गया पैक", order: "व्हाट्सऐप पर पूछें और ऑर्डर करें", orderNote: "ऑर्डर पक्का होने से पहले टीम मौजूदा बैच, डिलीवरी और भुगतान की पुष्टि करेगी।",
    know: "आप क्या घर ला रहे हैं, जानें", origin: "हमारे खेत की कहानी से रोज़मर्रा तक।",
    sourcingTitle: "हमारी सोर्सिंग", madeTitle: "इसे कैसे बनाया जाता है", careTitle: "देखभाल और भंडारण",
    wa: "नमस्ते Lado Organics!", waProduct: "उत्पाद", waPrice: "दर्ज कीमत", waAsk: "कृपया मौजूदा बैच, डिलीवरी और भुगतान की जानकारी दें।",
  } : locale === "ma" ? {
    category: { "a2-bilona-ghee": "देसी थारपारकर दूध री चीज", "tharparkar-dhoop": "गोबर सूं बणाई कुदरती धूप", "pure-kechua-khad": "जैविक केंचुआ खाद", "deep-work-bhunga-stay": "गांव रो ठहराव अर भुंगा" }[slug] || product.category,
    description: { "a2-bilona-ghee": "पिलानी में देसी थारपारकर गाय रै दही नै पुराणी बिलोना सूं मथकै बणायो घी।", "tharparkar-dhoop": "पिलानी में देसी गाय रै गोबर अर कुदरती वनस्पति सूं बणाई धूप।", "pure-kechua-khad": "केंचुआ री मदद सूं बणाई खाद। सही मात्रा खातर पैकेट रो लेबल देखो।", "deep-work-bhunga-stay": "पिलानी में राजस्थानी माटी री पुराणी बनावट वालो भुंगा ठहराव। तारीख अर जगह टीम सूं पक्की करो।" }[slug] || product.description,
    sourcing: product.sourcing, productionMethod: product.productionMethod,
    storage: { "a2-bilona-ghee": "सीधी धूप सूं दूर ठंडी अर सूखी जगह राखो। साफ-सूखो चमचो लो।", "tharparkar-dhoop": "नमी सूं दूर सूखै अर बंद डिब्बे में राखो।", "pure-kechua-khad": "छांव अर हवा आवै ईंठै राखो।", "deep-work-bhunga-stay": "आवण री तारीख अर भोजन री बात टीम सूं पैली पक्की करो।" }[slug] || product.storage,
    back: "← सामान री सूची पर लौटो", trace: "बैच री बात देखो ↗", tags: ["राजस्थान में ध्यान सूं बणायो", "खेत री सोच सूं जुड़्यो"],
    note: "Lado Organics री खेत री कहानी रो भाग", choose: "आपरो पैक चुनो", bring: "खेत री अच्छाई घर लावो।",
    selected: "चुन्यो पैक", order: "व्हाट्सऐप पर पूछो अर ऑर्डर करो", orderNote: "ऑर्डर पक्को होण सूं पैली टीम चालू बैच, भेजण अर भुगतान पक्को करैला।",
    know: "जाणो थां घर काई लावो हो", origin: "म्हारी खेत री बात सूं रोज रै काम तक।",
    sourcingTitle: "म्हारी सोर्सिंग", madeTitle: "ई कियां बणै", careTitle: "रखरखाव अर भंडारण",
    wa: "खम्मा घणी Lado Organics!", waProduct: "सामान", waPrice: "लिख्यो भाव", waAsk: "कृपा कर चालू बैच, भेजण अर भुगतान री जानकारी देवो।",
  } : {
    category: product.category, description: product.description, sourcing: product.sourcing,
    productionMethod: product.productionMethod, storage: product.storage,
    back: "← Back to the collection", trace: "Explore batch traceability ↗",
    tags: ["Made with care in Rajasthan", "Thoughtful farm practices"],
    note: "A part of the Lado Organics farm story", choose: "CHOOSE YOUR PACK",
    bring: "Bring a little farm goodness home.", selected: "Selected pack",
    order: "Enquire & order on WhatsApp",
    orderNote: "{localized.orderNote}",
    know: "KNOW WHAT YOU BRING HOME", origin: "From our farm story to your everyday rituals.",
    sourcingTitle: "Our sourcing", madeTitle: "How it is made", careTitle: "Care & storage",
    wa: "Namaste Lado Organics!", waProduct: "Product", waPrice: "Listed Price",
    waAsk: "Please share batch availability, shipping, and payment details.",
  };
  const displayName = liveProduct
    ? locale === "hi" ? liveProduct.nameHi || liveProduct.nameEn
      : locale === "ma" ? liveProduct.nameMa || liveProduct.nameEn
      : liveProduct.nameEn
    : locale === "hi"
      ? ({ "a2-bilona-ghee": "A2 बिलोना घी", "tharparkar-dhoop": "थारपारकर धूप", "pure-kechua-khad": "शुद्ध केंचुआ खाद", "deep-work-bhunga-stay": "डीप वर्क भुंगा स्टे" }[slug] || product.name)
      : locale === "ma"
        ? ({ "a2-bilona-ghee": "A2 बिलोना घी", "tharparkar-dhoop": "थारपारकर धूप", "pure-kechua-khad": "चोखी केंचुआ खाद", "deep-work-bhunga-stay": "डीप वर्क भुंगा ठहराव" }[slug] || product.name)
        : product.name;
  const activeVariant = liveVariants[selectedIdx];
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
    `${localized.wa}\n${localized.waProduct}: ${displayName} (${activeVariant?.label || (locale === "hi" ? "पैक की कीमत उपलब्ध नहीं" : locale === "ma" ? "पैक रो भाव उपलब्ध कोनी" : "price unavailable")})\n${localized.waPrice}: ${activeVariant ? "₹" + activeVariant.priceInr.toLocaleString("en-IN") : ""}\n${localized.waAsk}`
  )}`;

  return (
    <div className="product-detail-page min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
        <Link href="/#store" className="product-detail-back">← Back to the collection</Link>
        <Link href="/trace/LO-PILANI-SAMPLE-001" className="product-detail-trace">Explore batch traceability ↗</Link>
      </div>

      <section className={`product-detail-hero product-detail-${visual.kind}`}>
        <div className="product-detail-art relative" aria-label={product.slug.includes("dhoop") ? "Lado Organics Tharparkar Dhoop product photograph" : `${displayName} illustrated product artwork`}>
          {product.slug.includes("dhoop") ? (
            <Image
              src={`/images/lado-organics/${encodeURIComponent("Lado Organics Tharparkar Dhoop.png")}`}
              alt="Lado Organics Tharparkar Dhoop"
              fill
              priority
              sizes="(max-width: 760px) 100vw, 45vw"
              className="object-cover"
            />
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
          <p className="product-detail-kicker"><span /> {localized.category}</p>
          <h1>{product.name}</h1>
          <p className="product-detail-description">{localized.description}</p>
          <div className="product-detail-tags">
            <span>{localized.tags[0]}</span>
            <span>{localized.tags[1]}</span>
          </div>
          <div className="product-detail-note">
            <span className="product-detail-note-mark">L</span>
            <span><strong>{visual.note}</strong><small>{localized.note}</small></span>
          </div>
        </div>
      </section>

      <section className="product-detail-buy">
        <div className="product-detail-buy-heading">
          <p className="product-detail-kicker">{localized.choose}</p>
          <h2>{localized.bring}</h2>
        </div>
        {liveVariants.length > 1 && (
          <div className="product-detail-variants">
            {liveVariants.map((v, idx) => (
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
            <span>{localized.selected} · {activeVariant?.label || (catalogLoading ? (locale === "hi" ? "पैक देखे जा रहे हैं…" : locale === "ma" ? "पैक देखै रिया है…" : "Loading packs…") : (locale === "hi" ? "पैक उपलब्ध नहीं" : locale === "ma" ? "पैक उपलब्ध कोनी" : "No pack available"))}</span>
            {activeVariant ? <strong>₹{activeVariant.priceInr.toLocaleString("en-IN")}</strong> : <strong>{catalogLoading ? (locale === "hi" ? "कीमत देखी जा रही है…" : locale === "ma" ? "भाव देखै रिया है…" : "Checking live price…") : (locale === "hi" ? "लाइव कीमत उपलब्ध नहीं" : locale === "ma" ? "चालू भाव उपलब्ध कोनी" : "Live price unavailable")}</strong>}
          </div>
          {activeVariant ? (
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="product-detail-order">
              {localized.order} <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <Link href="/contact" className="product-detail-order">{locale === "hi" ? "टीम से संपर्क करें" : locale === "ma" ? "टीम नै खबर करो" : "Contact the team"}</Link>
          )}
        </div>
        <p className="product-detail-order-note">We’ll confirm current batch availability, delivery and payment details with you before the order is finalised.</p>
      </section>

      <section className="product-detail-origin">
        <div className="product-detail-origin-heading">
          <p className="product-detail-kicker">KNOW WHAT YOU BRING HOME</p>
          <h2>From our farm story to your everyday rituals.</h2>
        </div>
        <div className="product-detail-origin-grid">
          <article><span>01</span><h3>Our sourcing</h3><p>{localized.sourcing}</p></article>
          <article><span>02</span><h3>How it is made</h3><p>{localized.productionMethod}</p></article>
          <article><span>03</span><h3>Care & storage</h3><p>{localized.storage}</p></article>
        </div>
      </section>

      <div className="product-detail-reviews">
        <ProductReviewsSection productSlug={product.slug} />
      </div>
    </div>
  );
}
