"use client";

import React, { useState } from "react";
import Link from "next/link";

const navigation = [
  { href: "/admin", label: "Overview", icon: "◫" },
  { href: "/admin/orders", label: "Orders & Payments", icon: "▤" },
  { href: "/admin/inventory", label: "Products & Inventory", icon: "◈" },
  { href: "/admin/bookings", label: "Bhunga Stays", icon: "⌂" },
  { href: "/admin/sponsorships", label: "Gau Seva", icon: "♡" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const logout = () => {
    localStorage.removeItem("lado_admin_token");
    window.location.href = "/admin";
  };
  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col md:flex-row">
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3">
        <Link href="/admin" className="font-serif text-lg font-bold text-[var(--mud)]">Lado Command</Link>
        <button type="button" onClick={() => setMenuOpen(v => !v)} aria-expanded={menuOpen} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-bold">{menuOpen ? "Close" : "Menu"}</button>
      </header>
      <aside className="hidden md:flex w-64 shrink-0 bg-[var(--surface)] border-r border-[var(--border)] flex-col min-h-screen sticky top-0 h-screen">
        <div className="p-6 border-b border-[var(--border)]">
          <h2 className="text-xl font-serif font-bold text-[var(--mud)]">Lado Command</h2>
          <p className="text-[10px] uppercase tracking-widest opacity-60 mt-1">Admin Workspace</p>
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
