"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname.startsWith("/auth") || pathname === "/login") return null;

  return (
    <footer className="lado-site-footer">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.35fr_1fr_1fr_1fr] lg:py-16">
        <div className="lado-footer-brand">
          <Link href="/" aria-label="Lado Organics home" className="lado-footer-logo">
            <Image src="/lado-organics-logo.svg" alt="Lado Organics — Lado Love Pure" width={230} height={126} />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-7">Lado Love Pure. Rooted in Pilani, Rajasthan.</p>
          <span className="lado-footer-location">PILANI · RAJASTHAN · INDIA</span>
        </div>
        <nav aria-label="Explore Lado Organics" className="lado-footer-links">
          <h2>Explore</h2>
          <Link href="/store">Shop products</Link>
          <Link href="/#farm-world">Our farm story</Link>
          <Link href="/trace">Batch traceability</Link>
          <Link href="/library">Journal & learning</Link>
        </nav>
        <nav aria-label="Customer care" className="lado-footer-links">
          <h2>Customer care</h2>
          <Link href="/contact">Help & support</Link>
          <Link href="/dashboard">My Lado Journey</Link>
          <Link href="/corporate">Corporate enquiries</Link>
          <Link href="/essentials-club">Essentials Club</Link>
        </nav>
        <nav aria-label="Policies and information" className="lado-footer-links">
          <h2>Information</h2>
          <Link href="/policies">Policies</Link>
          <Link href="/policies/shipping">Shipping policy</Link>
          <Link href="/policies/refunds">Returns & refunds</Link>
          <Link href="/policies/privacy">Privacy policy</Link>
        </nav>
      </div>
      <div className="lado-footer-bottom">
        <span>© {new Date().getFullYear()} Lado Organics. All rights reserved.</span>
        <span>Made with care in Pilani, Rajasthan · <strong>Lado Love Pure</strong></span>
      </div>
    </footer>
  );
}
