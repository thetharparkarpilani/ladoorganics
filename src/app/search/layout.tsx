import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search | Lado Organics",
  description: "Search Lado Organics products, farm information and published guides.",
  robots: { index: false, follow: true },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
