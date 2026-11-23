import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Lado Journey | Lado Organics",
  description: "Manage your A2 Bilona Ghee subscriptions, Bhunga farm stays, and Gau Seva sponsorships.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
        
        {/* Customer Sidebar */}
        <aside className="w-full md:w-72 shrink-0">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sticky top-28 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-full bg-[var(--earth)]/20 flex items-center justify-center text-[var(--mud)] font-serif font-bold text-xl border border-[var(--earth)]">
                L
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-[var(--mud)]">My Journey</h2>
                <span className="text-[10px] font-mono tracking-widest uppercase text-[var(--terracotta)]">Verified Patron</span>
              </div>
            </div>
            
            <nav className="space-y-2 text-sm font-semibold">
              <Link href="/dashboard" className="block px-4 py-3 rounded-xl bg-[var(--mud)] text-white shadow-md">Overview</Link>
              <Link href="/dashboard/orders" className="block px-4 py-3 rounded-xl text-[var(--muted)] hover:bg-[var(--earth)]/10 transition">Order History</Link>
              <Link href="/dashboard/reviews" className="block px-4 py-3 rounded-xl text-[var(--muted)] hover:bg-[var(--earth)]/10 transition">My Reviews</Link>
              <Link href="/dashboard/rewards" className="block px-4 py-3 rounded-xl text-[var(--muted)] hover:bg-[var(--earth)]/10 transition">Lado Rewards</Link>
              <Link href="/dashboard/subscriptions" className="block px-4 py-3 rounded-xl text-[var(--muted)] hover:bg-[var(--earth)]/10 transition">Essentials Club</Link>
              <Link href="/dashboard/stays" className="block px-4 py-3 rounded-xl text-[var(--muted)] hover:bg-[var(--earth)]/10 transition">Bhunga Stays</Link>
              <Link href="/dashboard/sponsorships" className="block px-4 py-3 rounded-xl text-[var(--muted)] hover:bg-[var(--earth)]/10 transition">Gau Seva</Link>
              <Link href="/dashboard/profile" className="block px-4 py-3 rounded-xl text-[var(--muted)] hover:bg-[var(--earth)]/10 transition">My Profile</Link>
            </nav>

            <div className="mt-8 pt-6 border-t border-[var(--border)]">
              <form action="/api/auth/logout" method="POST">
                <button type="submit" className="w-full text-left px-4 py-2 text-xs font-bold text-red-700 hover:text-red-900 transition flex items-center gap-2">
                  <i className="fas fa-sign-out-alt"></i> Secure Logout
                </button>
              </form>
            </div>
          </div>
        </aside>

        {/* Dynamic Main Content */}
        <main className="flex-1">
          {children}
        </main>
        
      </div>
    </div>
  );
}
