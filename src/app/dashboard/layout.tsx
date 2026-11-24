import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import DashboardSidebar from "@/components/DashboardSidebar";

export const metadata: Metadata = {
  title: "My Lado Journey | Lado Organics",
  description: "Manage your A2 Bilona Ghee subscriptions, Bhunga farm stays, and Gau Seva sponsorships.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
        
        <DashboardSidebar />

        {/* Dynamic Main Content */}
        <main className="flex-1">
          {children}
        </main>
        
      </div>
    </div>
  );
}
