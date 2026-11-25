"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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

  // The homepage owns its editorial header and footer.
  if (pathname === "/") return null;

  const labels = locale === "hi"
    ? { shop: "उत्पाद", farm: "हमारा खेत", trace: "बैच ट्रेस", search: "खोजें", account: "मेरा खाता", contact: "संपर्क", bag: "बैग", menu: "मेन्यू", close: "बंद करें" }
    : locale === "ma"
      ? { shop: "सामान", farm: "म्हारो खेत", trace: "बैच जांच", search: "खोज", account: "म्हारो खातो", contact: "संपर्क", bag: "थैली", menu: "मेन्यू", close: "बंद" }
      : { shop: "Shop", farm: "Our farm", trace: "Trace a batch", search: "Search", account: "My account", contact: "Contact", bag: "Bag", menu: "Menu", close: "Close" };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="lado-global-header">
        <div className="lado-global-header-inner">
          <Link href="/" className="lado-global-brand" aria-label="Lado Organics home" onClick={closeMenu}>
            <Image src="/lado-organics-logo.svg" alt="Lado Organics — Lado Love Pure" width={150} height={82} priority />
          </Link>
          <button className="lado-global-menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="lado-global-nav" onClick={() => setMenuOpen(value => !value)}>
            {menuOpen ? labels.close : labels.menu}
          </button>
          <nav id="lado-global-nav" className={menuOpen ? "lado-global-nav is-open" : "lado-global-nav"} aria-label="Primary navigation">
            <Link href="/store" onClick={closeMenu}>{labels.shop}</Link>
            <Link href="/#farm-world" onClick={closeMenu}>{labels.farm}</Link>
            <Link href="/trace" onClick={closeMenu}>{labels.trace}</Link>
            <Link href="/search" onClick={closeMenu}>{labels.search}</Link>
            <Link href="/contact" onClick={closeMenu}>{labels.contact}</Link>
          </nav>
          <div className="lado-global-actions">
            <select aria-label="Choose language" value={locale} onChange={event => setLocale(event.target.value as LocaleCode)}>
              <option value="en">EN</option><option value="hi">हिंदी</option><option value="ma">मारवाड़ी</option>
            </select>
            <Link className="lado-global-account" href="/dashboard">{labels.account}</Link>
            <button className="lado-global-bag" type="button" onClick={() => setDrawerOpen(true)}>{labels.bag}<span>{itemCount}</span></button>
          </div>
        </div>
      </header>
      <footer className="lado-global-footer">
        <div className="lado-global-footer-inner">
          <Link href="/" aria-label="Lado Organics home"><Image src="/lado-organics-logo.svg" alt="Lado Organics" width={138} height={76} /></Link>
          <p>Lado Love Pure · Rooted in tradition. Close to nature.</p>
          <nav aria-label="Footer navigation">
            <Link href="/store">Shop</Link><Link href="/search">Search</Link><Link href="/trace">Batch traceability</Link><Link href="/dashboard">My account</Link><Link href="/contact">Contact</Link><Link href="/policies">Policies</Link>
          </nav>
        </div>
        <div className="lado-global-footer-bottom"><span>© {new Date().getFullYear()} Lado Organics</span><span>Pilani, Rajasthan, India</span></div>
      </footer>
      <CartCheckoutDrawer />
    </>
  );
}
