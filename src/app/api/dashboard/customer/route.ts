import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const accessToken = req.cookies.get("lado_sb_access")?.value;
  const refreshToken = req.cookies.get("lado_sb_refresh")?.value;

  if (!supabaseUrl || !supabaseKey || !accessToken) {
    return NextResponse.json({ error: "Please sign in to view your customer account." }, { status: 401 });
  }

  const baseUrl = supabaseUrl.replace(/\/$/, "");
  let activeAccessToken = accessToken;
  let userResponse = await fetch(`${baseUrl}/auth/v1/user`, {
    headers: { apikey: supabaseKey, Authorization: `Bearer ${activeAccessToken}` },
    cache: "no-store",
  });

  let refreshedTokens: { access_token?: string; refresh_token?: string; expires_in?: number } | null = null;
  if (!userResponse.ok && refreshToken) {
    const refreshResponse = await fetch(`${baseUrl}/auth/v1/token?grant_type=refresh_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: supabaseKey },
      body: JSON.stringify({ refresh_token: refreshToken }),
      cache: "no-store",
    });
    if (refreshResponse.ok) {
      refreshedTokens = await refreshResponse.json();
      if (refreshedTokens?.access_token && refreshedTokens.refresh_token) {
        activeAccessToken = refreshedTokens.access_token;
        userResponse = await fetch(`${baseUrl}/auth/v1/user`, {
          headers: { apikey: supabaseKey, Authorization: `Bearer ${activeAccessToken}` },
          cache: "no-store",
        });
      }
    }
  }

  if (!userResponse.ok) {
    const response = NextResponse.json({ error: "Your session has expired. Please sign in again." }, { status: 401 });
    response.cookies.delete("lado_sb_access");
    response.cookies.delete("lado_sb_refresh");
    response.cookies.delete("lado_secure_session");
    return response;
  }

  const user = await userResponse.json();
  const metadata = user.user_metadata || {};
  const name = metadata.full_name || metadata.name || user.email?.split("@")[0] || "Customer";
  let orders: unknown[] = [];
  const ordersResponse = await fetch(`${baseUrl}/rest/v1/rpc/get_my_customer_orders`, {
    method: "POST",
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${activeAccessToken}`,
      "Content-Type": "application/json",
    },
    body: "{}",
    cache: "no-store",
  });
  if (ordersResponse.ok) {
    const result = await ordersResponse.json();
    if (Array.isArray(result)) orders = result;
  }

  const response = NextResponse.json({
    profile: { name, email: user.email || null },
    orders,
    bookings: [],
    sponsorships: [],
  });

  if (refreshedTokens?.access_token && refreshedTokens.refresh_token) {
    const secure = process.env.NODE_ENV === "production";
    response.cookies.set("lado_sb_access", refreshedTokens.access_token, {
      httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: Math.max(60, Number(refreshedTokens.expires_in) || 3600),
    });
    response.cookies.set("lado_sb_refresh", refreshedTokens.refresh_token, {
      httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30,
    });
  }

  return response;
}
