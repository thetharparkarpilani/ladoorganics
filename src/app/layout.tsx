import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Lado Organics 2.0 | Pure Tharparkar A2 Tradition from Pilani",
  description:
    "Direct from Pilani, Rajasthan. Tharparkar A2 Bilona Ghee, Cow Dung Dhoop, Biogas Vermicompost, and Deep Work Bhunga Farm Stays."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={${inter.variable} }>
      <body className="font-sans antialiased selection:bg-[#c2410c] selection:text-white">
        {children}
      </body>
    </html>
  );
}
