import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://ladoorganics.in").replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/store/", "/products/", "/our-story", "/trace/", "/library", "/community", "/contact", "/corporate", "/essentials-club", "/policies"],
        disallow: ["/admin", "/api", "/auth", "/dashboard", "/checkout", "/login", "/search"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
