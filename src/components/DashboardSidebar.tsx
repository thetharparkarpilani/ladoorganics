"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";

export default function DashboardSidebar() {
  const { locale } = useLocale();
  const pathname = usePathname();
  const [logoLoadFailed, setLogoLoadFailed] = useState(false);
  const labels = locale === "hi"
    ? { title: "मेरा सफ़र", patron: "सत्यापित ग्राहक", overview: "अवलोकन", orders: "ऑर्डर इतिहास", reviews: "मेरी समीक्षाएँ", rewards: "Lado रिवॉर्ड", club: "एसेंशियल्स क्लब", stays: "भुंगा स्टे", gau: "गौ सेवा", profile: "मेरी प्रोफ़ाइल", support: "ग्राहक सहायता", logout: "सुरक्षित लॉगआउट" }
    : locale === "ma"
      ? { title: "म्हारो सफर", patron: "पक्को ग्राहक", overview: "एक नजर", orders: "ऑर्डर री सूची", reviews: "म्हारी राय", rewards: "Lado इनाम", club: "रोजमर्रा रो सामान", stays: "भुंगा ठहराव", gau: "गौ सेवा", profile: "म्हारी जानकारी", support: "ग्राहक मदद", logout: "सुरक्षित बाहर निकलो" }
      : { title: "My Journey", patron: "Verified Patron", overview: "Overview", orders: "Order History", reviews: "My Reviews", rewards: "Lado Rewards", club: "Essentials Club", stays: "Bhunga Stays", gau: "Gau Seva", profile: "My Profile", support: "Customer Support", logout: "Secure Logout" };

  const linkClass = (href: string) => "lado-dashboard-nav-link block rounded-xl px-4 py-3 transition " + (pathname === href ? "is-active" : "");

  return (
    <aside className="lado-dashboard-sidebar w-full md:w-72 shrink-0">
      <div className="lado-dashboard-sidebar-card bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-5 sm:p-6 sticky top-28 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--earth)]/30 bg-white p-1">
            {logoLoadFailed ? <span aria-label="Lado Organics" role="img" className="font-serif text-[10px] font-bold leading-none text-[var(--mud)]">LADO</span> : <Image src="/lado-organics-logo.svg" alt="Lado Organics — Lado Love Pure" width={96} height={64} unoptimized priority className="h-16 w-24 object-contain" onError={() => setLogoLoadFailed(true)} /> }
          </div>
          <div>
            <h2 className="font-serif font-bold text-lg text-[var(--mud)]">{labels.title}</h2>
            <span className="text-[10px] font-mono tracking-widest uppercase text-[var(--terracotta)]">{labels.patron}</span>
          </div>
        </div>
        <nav aria-label="Customer account navigation" className="lado-dashboard-nav text-sm font-semibold">
          <Link href="/dashboard" aria-current={pathname === "/dashboard" ? "page" : undefined} className={linkClass("/dashboard")}>{labels.overview}</Link>
          <Link href="/dashboard/orders" aria-current={pathname === "/dashboard/orders" ? "page" : undefined} className={linkClass("/dashboard/orders")}>{labels.orders}</Link>
          <Link href="/dashboard/reviews" aria-current={pathname === "/dashboard/reviews" ? "page" : undefined} className={linkClass("/dashboard/reviews")}>{labels.reviews}</Link>
          <Link href="/dashboard/rewards" aria-current={pathname === "/dashboard/rewards" ? "page" : undefined} className={linkClass("/dashboard/rewards")}>{labels.rewards}</Link>
          <Link href="/dashboard/subscriptions" aria-current={pathname === "/dashboard/subscriptions" ? "page" : undefined} className={linkClass("/dashboard/subscriptions")}>{labels.club}</Link>
          <Link href="/dashboard/stays" aria-current={pathname === "/dashboard/stays" ? "page" : undefined} className={linkClass("/dashboard/stays")}>{labels.stays}</Link>
          <Link href="/dashboard/sponsorships" aria-current={pathname === "/dashboard/sponsorships" ? "page" : undefined} className={linkClass("/dashboard/sponsorships")}>{labels.gau}</Link>
          <Link href="/dashboard/profile" aria-current={pathname === "/dashboard/profile" ? "page" : undefined} className={linkClass("/dashboard/profile")}>{labels.profile}</Link>
          <Link href="/dashboard/support" aria-current={pathname === "/dashboard/support" ? "page" : undefined} className={linkClass("/dashboard/support")}>{labels.support}</Link>
        </nav>
        <div className="mt-8 pt-6 border-t border-[var(--border)]">
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className="w-full text-left px-4 py-2 text-xs font-bold text-red-700 hover:text-red-900 transition flex items-center gap-2">
              <i className="fas fa-sign-out-alt" aria-hidden="true" /> {labels.logout}
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
