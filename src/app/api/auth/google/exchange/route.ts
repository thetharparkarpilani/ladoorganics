import { NextRequest, NextResponse } from "next/server";
import { enforceRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const rateLimited = await enforceRateLimit(req, "google-auth-exchange", 10, 900);
  if (rateLimited) return rateLimited;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Supabase is not configured on the server." }, { status: 503 });
  }

  let body: { code?: string; codeVerifier?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const code = body.code?.trim();
  const codeVerifier = body.codeVerifier?.trim();
  if (!code || !codeVerifier || codeVerifier.length < 43 || codeVerifier.length > 128) {
    return NextResponse.json({ error: "The Google sign-in code or PKCE verifier is invalid." }, { status: 400 });
  }

  try {
    const tokenResponse = await fetch(
      `${supabaseUrl.replace(/\/$/, "")}/auth/v1/token?grant_type=pkce`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: supabaseKey },
        body: JSON.stringify({ auth_code: code, code_verifier: codeVerifier }),
        cache: "no-store",
      }
    );
    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok || !tokens.access_token || !tokens.refresh_token) {
      return NextResponse.json(
        { error: tokens.msg || tokens.message || tokens.error_description || "Google sign-in could not be completed. Please try again." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ ok: true });
    const secure = process.env.NODE_ENV === "production";
    response.cookies.set("lado_sb_access", tokens.access_token, {
      httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: Math.max(60, Number(tokens.expires_in) || 3600),
    });
    response.cookies.set("lado_sb_refresh", tokens.refresh_token, {
      httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30,
    });
    response.cookies.delete("lado_secure_session");
    return response;
  } catch {
    return NextResponse.json({ error: "Unable to contact the authentication service. Please try again." }, { status: 502 });
  }
}
