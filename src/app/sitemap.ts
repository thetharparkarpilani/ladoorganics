import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const configuredBase = process.env.NEXT_PUBLIC_SITE_URL || "https://ladoorganics.in";
  const baseUrl = configuredBase.replace(/\/$/, "");
  const now = new Date();

  // Private customer/admin routes and synthetic demo trace codes must never be indexed.
  return [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/store`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/policies`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/policies/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/policies/shipping`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/policies/refunds`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/policies/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.4 }
  ];
}
