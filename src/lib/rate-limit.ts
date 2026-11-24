import { createHmac } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function enforceRateLimit(
  req: NextRequest,
  bucket: string,
  limit: number,
  windowSeconds: number
): Promise<NextResponse | null> {
  const secret = process.env.ADMIN_ACCESS_TOKEN;
  if (!secret || !Number.isInteger(limit) || limit < 1 || !Number.isInteger(windowSeconds) || windowSeconds < 1) {
    console.error("Rate limiting is not configured safely.");
    return NextResponse.json({ error: "This service is temporarily unavailable. Please try again shortly." }, { status: 503 });
  }

  const forwarded = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const identifierHash = createHmac("sha256", secret).update(forwarded).digest("hex");
  const windowMs = windowSeconds * 1000;
  const windowStart = new Date(Math.floor(Date.now() / windowMs) * windowMs);

  try {
    const result = await db.query(
      `INSERT INTO api_rate_limits (bucket, identifier_hash, window_start, hit_count, updated_at)
       VALUES ($1, $2, $3, 1, NOW())
       ON CONFLICT (bucket, identifier_hash) DO UPDATE
         SET window_start = EXCLUDED.window_start,
             hit_count = CASE
               WHEN api_rate_limits.window_start = EXCLUDED.window_start
                 THEN api_rate_limits.hit_count + 1
               ELSE 1
             END,
             updated_at = NOW()
       RETURNING hit_count`,
      [bucket, identifierHash, windowStart]
    );

    const count = Number(result.rows[0]?.hit_count || 0);
    if (count > limit) {
      const retryAfter = Math.max(1, Math.ceil((windowStart.getTime() + windowMs - Date.now()) / 1000));
      return NextResponse.json(
        { error: "Too many requests. Please wait a little and try again." },
        { status: 429, headers: { "Retry-After": String(retryAfter), "Cache-Control": "no-store" } }
      );
    }

    if (count === 1) {
      await db.query("DELETE FROM api_rate_limits WHERE updated_at < NOW() - INTERVAL '48 hours'");
    }
    return null;
  } catch (error) {
    console.error("Shared rate limiter unavailable:", error);
    return NextResponse.json({ error: "This service is temporarily unavailable. Please try again shortly." }, { status: 503 });
  }
}
