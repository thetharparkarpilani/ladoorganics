"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const navigation = [
  { href: "/admin", label: "Overview", icon: "◫" },
  { href: "/admin/orders", label: "Orders & Payments", icon: "▤" },
  { href: "/admin/inventory", label: "Products & Inventory", icon: "◈" },
  { href: "/admin/operations", label: "Business Operations", icon: "▦" },
  { href: "/admin/bookings", label: "Bhunga Stays", icon: "⌂" },
  { href: "/admin/sponsorships", label: "Gau Seva", icon: "♡" },
  { href: "/admin/communications", label: "Communications", icon: "✉" },
  { href: "/admin/analytics", label: "Analytics", icon: "▥" },
  { href: "/admin/staff", label: "Staff Access", icon: "♙" },
  { href: "/admin/customers", label: "Customers", icon: "♙" },
  { href: "/admin/support", label: "Support Centre", icon: "?" },
  { href: "/admin/content", label: "Website Content", icon: "▧" },
  { href: "/admin/ai-knowledge", label: "Lado AI Knowledge", icon: "✦" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const logout = async () => {
    localStorage.removeItem("lado_admin_token");
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    window.location.href = "/login";
  };
  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col md:flex-row">
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3">
        <Link href="/admin" aria-label="Lado Organics Admin home" className="inline-flex items-center gap-3"><Image src="/lado-organics-logo.svg" alt="Lado Organics — Lado Love Pure" width={112} height={58} priority className="h-11 w-auto object-contain" /><span className="font-serif text-base font-bold text-[var(--mud)]">Admin</span></Link>
        <button type="button" onClick={() => setMenuOpen(v => !v)} aria-expanded={menuOpen} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-bold">{menuOpen ? "Close" : "Menu"}</button>
      </header>
      <aside className="hidden md:flex w-64 shrink-0 bg-[var(--surface)] border-r border-[var(--border)] flex-col min-h-screen sticky top-0 h-screen">
        <div className="p-6 border-b border-[var(--border)]">
          <Link href="/admin" aria-label="Lado Organics Admin home" className="inline-flex flex-col items-start gap-2"><Image src="/lado-organics-logo.svg" alt="Lado Organics — Lado Love Pure" width={156} height={82} priority className="h-[68px] w-auto object-contain object-left" /><span className="text-[10px] uppercase tracking-[.2em] font-bold opacity-60">Admin Workspace</span></Link>
        </div>
        <nav aria-label="Admin navigation" className="flex-1 p-4 space-y-2 text-sm font-medium">
          {navigation.map(item => <Link key={item.href} href={item.href} className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--muted)] hover:bg-[var(--bg)] hover:text-[var(--mud)] transition"><span aria-hidden="true" className="w-5 text-center text-[var(--terracotta)]">{item.icon}</span>{item.label}</Link>)}
        </nav>
        <div className="p-4 border-t border-[var(--border)] space-y-2">
          <Link href="/" className="block px-4 py-2 text-xs font-bold text-[var(--muted)]">View live website ↗</Link>
          <button type="button" onClick={logout} className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition">Secure Logout</button>
        </div>
      </aside>
      {menuOpen && <nav aria-label="Mobile admin navigation" className="md:hidden border-b border-[var(--border)] bg-[var(--surface)] p-3 space-y-1">{navigation.map(item => <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="block rounded-lg px-4 py-3 text-sm font-semibold hover:bg-[var(--bg)]">{item.label}</Link>)}<button type="button" onClick={logout} className="w-full text-left rounded-lg px-4 py-3 text-sm font-bold text-red-600">Secure Logout</button></nav>}
      <main className="min-w-0 flex-1 overflow-y-auto">
        <div className="p-4 sm:p-7 lg:p-10 max-w-[1500px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
