"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";
import { useCart } from "@/context/CartContext";
import type { LocaleCode } from "@/types/domain";
import CartCheckoutDrawer from "@/components/CartCheckoutDrawer";

export default function GlobalSiteChrome() {
  const pathname = usePathname();
  const { locale, setLocale } = useLocale();
  const { itemCount, setDrawerOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerLogoLoadFailed, setHeaderLogoLoadFailed] = useState(false);
  const [footerLogoLoadFailed, setFooterLogoLoadFailed] = useState(false);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  // The homepage owns its editorial header and footer; admin has a separate workspace shell.
  if (pathname === "/" || pathname.startsWith("/admin")) return null;

  const labels = locale === "hi"
    ? { shop: "उत्पाद", farm: "हमारा खेत", story: "हमारी कहानी", trace: "बैच ट्रेस", search: "खोजें", account: "मेरा खाता", contact: "संपर्क", bag: "बैग", menu: "मेन्यू", close: "बंद करें" }
    : locale === "ma"
      ? { shop: "सामान", farm: "म्हारो खेत", story: "म्हारी कहाणी", trace: "बैच जांच", search: "खोज", account: "म्हारो खातो", contact: "संपर्क", bag: "थैली", menu: "मेन्यू", close: "बंद" }
      : { shop: "Shop", farm: "Our farm", story: "Our story", trace: "Trace a batch", search: "Search", account: "My account", contact: "Contact", bag: "Bag", menu: "Menu", close: "Close" };

  const closeMenu = () => setMenuOpen(false);
  const isCurrent = (href: string) => href === "/store"
    ? pathname === "/store" || pathname.startsWith("/store/")
    : pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <a href="#main-content" className="lado-skip-link">Skip to content</a>
      <header className="lado-global-header">
        <div className="lado-global-header-inner">
          <Link href="/" className="lado-global-brand" aria-label="Lado Organics home" onClick={closeMenu}>
            {headerLogoLoadFailed ? <span role="img" aria-label="Lado Organics — Lado Love Pure" className="flex flex-col leading-none"><strong className="font-serif text-xl">Lado</strong><small className="mt-1 text-[8px] font-bold tracking-[0.25em]">ORGANICS</small></span> : <img src="/images/lado-organics/Ladologo.png" alt="Lado Organics — Lado Love Pure" width={150} height={82} fetchPriority="high" decoding="async" onError={() => setHeaderLogoLoadFailed(true)} />}
          </Link>
          <button className="lado-global-menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="lado-global-nav" onClick={() => setMenuOpen(value => !value)}>
            {menuOpen ? labels.close : labels.menu}
          </button>
          <nav id="lado-global-nav" className={menuOpen ? "lado-global-nav is-open" : "lado-global-nav"} aria-label="Primary navigation">
            <Link href="/store" aria-current={isCurrent("/store") ? "page" : undefined} onClick={closeMenu}>{labels.shop}</Link>
            <Link href="/#farm-world" onClick={closeMenu}>{labels.farm}</Link>
            <Link href="/our-story" aria-current={isCurrent("/our-story") ? "page" : undefined} onClick={closeMenu}>{labels.story}</Link>
            <Link href="/trace" aria-current={isCurrent("/trace") ? "page" : undefined} onClick={closeMenu}>{labels.trace}</Link>
            <Link href="/search" aria-current={isCurrent("/search") ? "page" : undefined} onClick={closeMenu}>{labels.search}</Link>
            <Link href="/contact" aria-current={isCurrent("/contact") ? "page" : undefined} onClick={closeMenu}>{labels.contact}</Link>
          </nav>
          <div className="lado-global-actions">
            <label className="sr-only" htmlFor="lado-global-locale">Choose language</label>
            <select id="lado-global-locale" value={locale} onChange={event => setLocale(event.target.value as LocaleCode)}>
              <option value="en">EN</option><option value="hi">हिंदी</option><option value="ma">मारवाड़ी</option>
            </select>
            <Link className="lado-global-account" href="/dashboard" aria-current={isCurrent("/dashboard") ? "page" : undefined}>{labels.account}</Link>
            <button className="lado-global-bag" type="button" aria-label={`${labels.bag}, ${itemCount} items`} onClick={() => setDrawerOpen(true)}>{labels.bag}<span aria-hidden="true">{itemCount}</span></button>
          </div>
        </div>
      </header>
      <footer className="lado-global-footer">
        <div className="lado-global-footer-inner">
          <Link href="/" aria-label="Lado Organics home" className="lado-footer-logo-box">{footerLogoLoadFailed ? <span role="img" aria-label="Lado Organics" className="flex flex-col items-center justify-center leading-none"><strong className="font-serif text-xl">Lado</strong><small className="mt-1 text-[8px] font-bold tracking-[0.25em]">ORGANICS</small></span> : <img src="/images/lado-organics/Ladologo.png" alt="Lado Organics" width={180} height={100} decoding="async" className="lado-footer-logo-image" loading="eager" onError={() => setFooterLogoLoadFailed(true)} />}</Link>
          <p>Lado Love Pure · Rooted in tradition. Close to nature.</p>
          <nav aria-label="Footer navigation">
            <Link href="/store">Shop</Link><Link href="/our-story">Our story</Link><Link href="/search">Search</Link><Link href="/trace">Batch traceability</Link><Link href="/dashboard">My account</Link><Link href="/contact">Contact</Link><Link href="/policies">Policies</Link>
          </nav>
        </div>
        <div className="lado-global-footer-bottom"><span>© {new Date().getFullYear()} Lado Organics</span><span>Pilani, Rajasthan, India</span></div>
      </footer>
      <CartCheckoutDrawer />
    </>
  );
}
