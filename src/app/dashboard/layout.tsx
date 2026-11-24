import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Lado Journey | Lado Organics",
  description: "Manage your A2 Bilona Ghee subscriptions, Bhunga farm stays, and Gau Seva sponsorships.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] pt-10 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <main className="w-full min-w-0">{children}</main>
      </div>
    </div>
  );
}
