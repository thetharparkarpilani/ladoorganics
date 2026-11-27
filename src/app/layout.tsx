import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./lado-release.css";
import "./lado-major-upgrade.css";
import "./lado-design-system.css";
import { CartProvider } from "@/context/CartContext";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import PWARegistration from "@/components/PWARegistration";
import ConciergeWidget from "@/components/ConciergeWidget";
import SiteAnnouncement from "@/components/SiteAnnouncement";
import GlobalSiteChrome from "@/components/GlobalSiteChrome";
import { LocaleProvider } from "@/context/LocaleContext";
import { getServerLocale } from "@/lib/server-locale";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ladoorganics.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Lado Organics | Lado Love Pure",
  description: "Traditional farm products and a living farm story from Pilani, Rajasthan. Discover Lado Organics.",
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/lado-organics-logo.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/lado-organics-logo.svg", type: "image/svg+xml" }],
    apple: [{ url: "/images/lado-organics/Ladologo.png", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    siteName: "Lado Organics",
    title: "Lado Organics | Lado Love Pure",
    description: "Traditional farm products and a living farm story from Pilani, Rajasthan.",
    url: siteUrl,
    images: [{ url: "/lado-organics-logo.svg", alt: "Lado Organics — Lado Love Pure" }],
  },
  twitter: { card: "summary_large_image", title: "Lado Organics | Lado Love Pure", description: "Traditional farm products and a living farm story from Rajasthan.", images: ["/lado-organics-logo.svg"] },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Lado Organics" },
};

export const viewport: Viewport = { themeColor: "#244b35", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getServerLocale();
  const documentLanguage = locale === "ma" ? "mwr" : locale;
  return (
    <html lang={documentLanguage} className="scroll-smooth">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen">
        <PWARegistration />
        <LocaleProvider>
          <AnalyticsProvider>
            <CartProvider>
              <SiteAnnouncement />
              <GlobalSiteChrome />
              <div id="main-content" className="min-h-screen" tabIndex={-1}>{children}</div>
              <ConciergeWidget whatsappNumber={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""} />
            </CartProvider>
          </AnalyticsProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
