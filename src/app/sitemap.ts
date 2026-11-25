import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const configuredBase = process.env.NEXT_PUBLIC_SITE_URL || "https://ladoorganics.in";
  const baseUrl = configuredBase.replace(/\/$/, "");
  const now = new Date();

  // Only public, customer-facing routes belong in search indexes.
  // Admin, auth, checkout and customer-specific dashboard routes are excluded.
  const publicRoutes: Array<[string, MetadataRoute.Sitemap[number]["changeFrequency"], number]> = [
    ["/", "weekly", 1],
    ["/store", "daily", 0.95],
    ["/community", "weekly", 0.75],
    ["/contact", "monthly", 0.65],
    ["/trace", "monthly", 0.55],
    ["/corporate", "monthly", 0.7],
    ["/essentials-club", "monthly", 0.65],
    ["/library", "weekly", 0.7],
    ["/policies", "monthly", 0.45],
    ["/policies/privacy", "yearly", 0.3],
    ["/policies/shipping", "monthly", 0.35],
    ["/policies/refunds", "monthly", 0.35],
    ["/policies/terms", "yearly", 0.3],
  ];

  const entries: MetadataRoute.Sitemap = publicRoutes.map(([path, changeFrequency, priority]) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  // Include every active product page without making a database outage break sitemap generation.
  try {
    const result = await db.query(
      "SELECT slug FROM products WHERE is_active = TRUE AND slug IS NOT NULL ORDER BY slug ASC LIMIT 500"
    );
    for (const row of result.rows) {
      const slug = typeof row.slug === "string" ? row.slug.trim() : "";
      if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) continue;
      entries.push({
        url: `${baseUrl}/store/${slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.85,
      });
    }
  } catch (error) {
    console.warn("Sitemap product discovery unavailable; serving public route index only.", error);
  }

  return entries;
}
