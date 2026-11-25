"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";

type Item = { label: string; href: string; icon: string; externalPage?: boolean };

export default function AppSidebar() {
  const { locale, setLocale } = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Admin has its own role-aware navigation shell; do not render the customer menu there.
  if (pathname.startsWith("/admin")) return <span className="lado-admin-route-marker" aria-hidden="true" />;
  const copy = locale === "hi" ? {
    menu: "मेन्यू", home: "होम", shop: "खरीदारी", orders: "मेरे ऑर्डर", explore: "खेत की दुनिया",
    featured: "मुख्य उत्पाद", club: "एसेंशियल्स क्लब", experiences: "खेत अनुभव और भुंगा स्टे",
    gau: "गौ सेवा", journal: "कहानियाँ और ज्ञान", corporate: "कॉर्पोरेट गिफ्टिंग",
    trace: "बैच ट्रेसबिलिटी", journey: "मेरा Lado सफ़र", profile: "प्रोफ़ाइल और सेटिंग्स",
    support: "सहायता केंद्र", ai: "Lado AI से पूछें", language: "भाषा", close: "मेन्यू बंद करें",
    account: "आपका Lado Organics", tagline: "शुद्ध परंपरा • जीवंत खेत",
  } : locale === "ma" ? {
    menu: "मेन्यू", home: "घर", shop: "खरीदारी", orders: "म्हारा ऑर्डर", explore: "खेत री दुनिया",
    featured: "खास सामान", club: "रोजमर्रा रो क्लब", experiences: "खेत अनुभव अर भुंगा ठहराव",
    gau: "गौ सेवा", journal: "कहाणी अर जानकारी", corporate: "कंपनी खातर उपहार",
    trace: "बैच री जांच", journey: "म्हारो Lado सफर", profile: "म्हारी जानकारी अर सेटिंग",
    support: "मदद केंद्र", ai: "Lado AI सूं पूछो", language: "भाषा", close: "मेन्यू बंद करो",
    account: "थारो Lado Organics", tagline: "चोखी परंपरा • जीवतो खेत",
  } : {
    menu: "Menu", home: "Home", shop: "Shop & Products", orders: "My Orders", explore: "Explore the Farm",
    featured: "Featured Products", club: "Essentials Club", experiences: "Farm Experiences & Bhunga Stays",
    gau: "Gau Seva", journal: "Journal & Learning", corporate: "Corporate Gifting",
    trace: "Batch Traceability", journey: "My Lado Journey", profile: "Profile & Settings",
    support: "Help Centre", ai: "Ask Lado AI", language: "Language", close: "Close navigation",
    account: "Your Lado Organics", tagline: "Pure tradition • Living farm",
  };
  const groups: { title: string; items: Item[] }[] = [
    { title: locale === "hi" ? "मुख्य" : locale === "ma" ? "मुख्य" : "MAIN", items: [
      { label: copy.home, href: "/", icon: "⌂" },
      { label: copy.shop, href: "/#store", icon: "▦" },
      { label: locale === "hi" ? "खोजें" : locale === "ma" ? "खोजो" : "Search everything", href: "/search", icon: "⌕", externalPage: true },
      { label: copy.orders, href: "/dashboard/orders", icon: "▤", externalPage: true },
      { label: copy.explore, href: "/#farm-world", icon: "⌖" },
      { label: copy.featured, href: "/#store", icon: "✧" },
    ]},
    { title: locale === "hi" ? "खेत और समुदाय" : locale === "ma" ? "खेत अर समाज" : "FARM & COMMUNITY", items: [
      { label: copy.club, href: "/#essentials-club", icon: "◈" },
      { label: copy.experiences, href: "/#experiences", icon: "⌂" },
      { label: copy.gau, href: "/#adopt", icon: "♡" },
      { label: copy.journal, href: "/#journal", icon: "▧" },
      { label: copy.corporate, href: "/#corporate", icon: "▣" },
      { label: copy.trace, href: "/trace", icon: "◎", externalPage: true }
    ]},
    { title: locale === "hi" ? "आपका खाता" : locale === "ma" ? "थारो खातो" : "YOUR ACCOUNT", items: [
      { label: copy.journey, href: "/dashboard", icon: "◉", externalPage: true },
      { label: copy.profile, href: "/dashboard/profile", icon: "⚙", externalPage: true },
      { label: copy.support, href: "/contact", icon: "☏", externalPage: true },
    ]},
  ];
  const isActive = (item: Item) => item.href === "/" ? pathname === "/" : item.externalPage ? pathname === item.href || (item.href === "/dashboard" && pathname.startsWith("/dashboard")) : false;
  const closeMobile = () => setMobileOpen(false);
  return (
    <>
      <Link href="/" className="lado-mobile-brand" aria-label="Lado Organics home"><Image src="/lado-organics-logo.svg" alt="Lado Organics — Lado Love Pure" width={132} height={72} priority /></Link>
      <button type="button" className="lado-mobile-menu-trigger" aria-label={mobileOpen ? copy.close : copy.menu} aria-expanded={mobileOpen} onClick={() => setMobileOpen((value) => !value)}>
        <span aria-hidden="true">{mobileOpen ? "×" : "☰"}</span><span>{copy.menu}</span>
      </button>
      {mobileOpen && <button type="button" className="lado-sidebar-backdrop" aria-label={copy.close} onClick={closeMobile} />}
      <aside className={"lado-sidebar " + (mobileOpen ? "is-open" : "")} aria-label="Lado Organics navigation">
        <div className="lado-sidebar-brand">
          <Link href="/" onClick={closeMobile} aria-label="Lado Organics home">
            <Image src="/lado-organics-logo.svg" alt="Lado Organics" width={168} height={92} priority />
          </Link>
          <p>{copy.tagline}</p>
        </div>
        <div className="lado-sidebar-account">
          <span className="lado-sidebar-avatar">L</span>
          <span><strong>{copy.account}</strong><small>Pilani · Rajasthan</small></span>
        </div>
        <nav className="lado-sidebar-nav">
          {groups.map((group) => (
            <section key={group.title} className="lado-sidebar-group">
              <h2>{group.title}</h2>
              {group.items.map((item) => (
                <Link key={item.label} href={item.href} onClick={closeMobile} aria-current={isActive(item) ? "page" : undefined} className={"lado-sidebar-link " + (isActive(item) ? "is-active" : "")}>
                  <span className="lado-sidebar-icon" aria-hidden="true">{item.icon}</span><span>{item.label}</span>
                </Link>
              ))}
            </section>
          ))}
        </nav>
        <div className="lado-sidebar-language">
          <label htmlFor="lado-sidebar-language">{copy.language}</label>
          <select id="lado-sidebar-language" value={locale} onChange={(event) => setLocale(event.target.value as "en" | "hi" | "ma")}>
            <option value="en">English</option><option value="hi">हिन्दी</option><option value="ma">मारवाड़ी</option>
          </select>
        </div>
      </aside>
    </>
  );
}
