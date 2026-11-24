import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import PWARegistration from "@/components/PWARegistration";
import ConciergeWidget from "@/components/ConciergeWidget";
import SiteAnnouncement from "@/components/SiteAnnouncement";

export const metadata: Metadata = {
  title: "Lado Organics | Pure Tharparkar A2 Tradition",
  description: "BITS Pilani-backed circular agriculture. Zero artificial additives, 100% indigenous A2 milk products.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Lado Organics",
  },
};

export const viewport: Viewport = {
  themeColor: "#204E36",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- App Router loads this stylesheet from the root layout. */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-[var(--bg-sand)] text-[var(--text-charcoal)] flex flex-col min-h-screen">
        <PWARegistration />
        <AnalyticsProvider>
          <CartProvider>
            <SiteAnnouncement />
            <main className="flex-1">
              {children}
            </main>
            <ConciergeWidget whatsappNumber={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919636100337"} />
          </CartProvider>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
