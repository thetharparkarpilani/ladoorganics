import React from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Lado Journey | Lado Organics",
  description: "Manage your A2 Bilona Ghee subscriptions, Bhunga farm stays, and Gau Seva sponsorships.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="lado-dashboard-layout min-h-screen pt-8 pb-16">
      <div className="lado-dashboard-layout-inner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardSidebar />
        <main className="lado-dashboard-content w-full min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
