import type { Metadata } from "next";
import "./globals.css";
import PremiumHeader from "@/components/PremiumHeader";

export const metadata: Metadata = {
  title: "Lado Organics | Pure Tharparkar A2 Tradition",
  description: "BITS Pilani-backed circular agriculture. Zero artificial additives, 100% indigenous A2 milk products.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-[var(--bg)] text-[var(--mud)] flex flex-col min-h-screen">
        <PremiumHeader />
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
