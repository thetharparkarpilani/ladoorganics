import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./lado-release.css";
import { CartProvider } from "@/context/CartContext";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import PWARegistration from "@/components/PWARegistration";
import ConciergeWidget from "@/components/ConciergeWidget";
import SiteAnnouncement from "@/components/SiteAnnouncement";
import { LocaleProvider } from "@/context/LocaleContext";
import AppSidebar from "@/components/AppSidebar";

export const metadata: Metadata = {
  metadataBase: new URL("https://ladoorganics.in"),
  applicationName: "Lado Organics",
  title: {
    default: "Lado Organics | Lado Love Pure",
    template: "%s | Lado Organics",
  },
  description: "Traditional farm products and farm experiences rooted in Pilani, Rajasthan. Explore the Lado Organics collection and story.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/lado-app-icon.svg", type: "image/svg+xml" },
      { url: "/lado-app-icon.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/lado-app-icon.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    shortcut: [{ url: "/lado-app-icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/lado-app-icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    siteName: "Lado Organics",
    title: "Lado Organics | Lado Love Pure",
    description: "Traditional farm products and farm experiences rooted in Rajasthan.",
    url: "https://ladoorganics.in",
    images: [{ url: "/lado-organics-logo.svg", alt: "Lado Organics — Lado Love Pure" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lado Organics | Lado Love Pure",
    description: "Traditional farm products and farm experiences rooted in Rajasthan.",
    images: ["/lado-organics-logo.svg"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Lado",
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
        <link rel="apple-touch-icon" href="/lado-app-icon.svg" />
        <link rel="icon" href="/lado-app-icon.svg" type="image/svg+xml" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- App Router loads this stylesheet from the root layout. */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-[var(--bg-sand)] text-[var(--text-charcoal)] flex flex-col min-h-screen">
        <PWARegistration />
        <LocaleProvider>
          <AnalyticsProvider>
            <CartProvider>
              <SiteAnnouncement />
              <div className="lado-app-shell">
                <AppSidebar />
                <div className="lado-app-main">
                  <main className="min-h-screen">{children}</main>
                </div>
              </div>
              <ConciergeWidget whatsappNumber={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919636100337"} />
            </CartProvider>
          </AnalyticsProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
