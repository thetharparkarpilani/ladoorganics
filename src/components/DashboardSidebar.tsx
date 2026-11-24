"use client";

import React from "react";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";

export default function DashboardSidebar() {
  const { locale } = useLocale();
  const labels = locale === "hi"
    ? { title: "मेरा सफ़र", patron: "सत्यापित ग्राहक", overview: "अवलोकन", orders: "ऑर्डर इतिहास", reviews: "मेरी समीक्षाएँ", rewards: "Lado रिवॉर्ड", club: "एसेंशियल्स क्लब", stays: "भुंगा स्टे", gau: "गौ सेवा", profile: "मेरी प्रोफ़ाइल", support: "ग्राहक सहायता", logout: "सुरक्षित लॉगआउट" }
    : locale === "ma"
      ? { title: "म्हारो सफर", patron: "पक्को ग्राहक", overview: "एक नजर", orders: "ऑर्डर री सूची", reviews: "म्हारी राय", rewards: "Lado इनाम", club: "रोजमर्रा रो सामान", stays: "भुंगा ठहराव", gau: "गौ सेवा", profile: "म्हारी जानकारी", support: "ग्राहक मदद", logout: "सुरक्षित बाहर निकलो" }
      : { title: "My Journey", patron: "Verified Patron", overview: "Overview", orders: "Order History", reviews: "My Reviews", rewards: "Lado Rewards", club: "Essentials Club", stays: "Bhunga Stays", gau: "Gau Seva", profile: "My Profile", support: "Customer Support", logout: "Secure Logout" };

  return (
    <aside className="w-full md:w-72 shrink-0">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sticky top-28 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full bg-[var(--earth)]/20 flex items-center justify-center text-[var(--mud)] font-serif font-bold text-xl border border-[var(--earth)]">L</div>
          <div>
            <h2 className="font-serif font-bold text-lg text-[var(--mud)]">{labels.title}</h2>
            <span className="text-[10px] font-mono tracking-widest uppercase text-[var(--terracotta)]">{labels.patron}</span>
          </div>
        </div>
        <nav className="space-y-2 text-sm font-semibold">
          <Link href="/dashboard" className="block px-4 py-3 rounded-xl bg-[var(--mud)] text-white shadow-md">{labels.overview}</Link>
          <Link href="/dashboard/orders" className="block px-4 py-3 rounded-xl text-[var(--muted)] hover:bg-[var(--earth)]/10 transition">{labels.orders}</Link>
          <Link href="/dashboard/reviews" className="block px-4 py-3 rounded-xl text-[var(--muted)] hover:bg-[var(--earth)]/10 transition">{labels.reviews}</Link>
          <Link href="/dashboard/rewards" className="block px-4 py-3 rounded-xl text-[var(--muted)] hover:bg-[var(--earth)]/10 transition">{labels.rewards}</Link>
          <Link href="/dashboard/subscriptions" className="block px-4 py-3 rounded-xl text-[var(--muted)] hover:bg-[var(--earth)]/10 transition">{labels.club}</Link>
          <Link href="/dashboard/stays" className="block px-4 py-3 rounded-xl text-[var(--muted)] hover:bg-[var(--earth)]/10 transition">{labels.stays}</Link>
          <Link href="/dashboard/sponsorships" className="block px-4 py-3 rounded-xl text-[var(--muted)] hover:bg-[var(--earth)]/10 transition">{labels.gau}</Link>
          <Link href="/dashboard/profile" className="block px-4 py-3 rounded-xl text-[var(--muted)] hover:bg-[var(--earth)]/10 transition">{labels.profile}</Link>
          <Link href="/dashboard/support" className="block px-4 py-3 rounded-xl text-[var(--muted)] hover:bg-[var(--earth)]/10 transition">{labels.support}</Link>
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
