import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex">
      <aside className="w-64 bg-[var(--surface)] border-r border-[var(--border)] hidden md:flex flex-col">
        <div className="p-6 border-b border-[var(--border)]">
          <h2 className="text-xl font-serif font-bold text-[var(--mud)]">Lado Command</h2>
          <p className="text-[10px] uppercase tracking-widest opacity-60 mt-1">Admin Center</p>
        </div>
        <nav className="flex-1 p-4 space-y-2 text-sm font-medium">
          <a href="/admin" className="block px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--terracotta)] text-[var(--terracotta)]">Dashboard</a>
          <a href="/admin/orders" className="block px-4 py-3 rounded-xl hover:bg-[var(--bg)] transition">Orders & Refunds</a>
          <a href="/admin/inventory" className="block px-4 py-3 rounded-xl hover:bg-[var(--bg)] transition">Inventory & Batches</a>
          <a href="/admin/bookings" className="block px-4 py-3 rounded-xl hover:bg-[var(--bg)] transition">Bhunga Bookings</a>
          <a href="/admin/sponsorships" className="block px-4 py-3 rounded-xl hover:bg-[var(--bg)] transition">Gaushala Seva</a>
        </nav>
        <div className="p-4 border-t border-[var(--border)]">
          <button className="w-full px-4 py-2 text-xs font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 rounded-lg transition">
            Secure Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 sm:p-10 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
