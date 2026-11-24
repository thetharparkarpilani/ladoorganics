import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ACCESS_COOKIE = "lado_sb_access";
const REFRESH_COOKIE = "lado_sb_refresh";

function tokenExpiry(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")));
    return typeof decoded.exp === "number" ? decoded.exp : null;
  } catch {
    return null;
  }
}

function setForwardedCookies(req: NextRequest, accessToken: string, refreshToken: string) {
  const headers = new Headers(req.headers);
  const cookies = new Map(req.cookies.getAll().map((cookie) => [cookie.name, cookie.value]));
  cookies.set(ACCESS_COOKIE, accessToken);
  cookies.set(REFRESH_COOKIE, refreshToken);
  headers.set("cookie", Array.from(cookies.entries()).map(([name, value]) => name + "=" + value).join("; "));
  return headers;
}

function clearSession(response: NextResponse) {
  response.cookies.set(ACCESS_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
  response.cookies.set(REFRESH_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isDashboardPage = path.startsWith("/dashboard");
  const isDashboardApi = path.startsWith("/api/dashboard");
  const accessToken = req.cookies.get(ACCESS_COOKIE)?.value || "";
  const refreshToken = req.cookies.get(REFRESH_COOKIE)?.value || "";
  const expiry = accessToken ? tokenExpiry(accessToken) : null;
  const needsRefresh = Boolean(refreshToken) && (!expiry || expiry <= Math.floor(Date.now() / 1000) + 60);

  if (needsRefresh) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const response = await fetch(supabaseUrl + "/auth/v1/token?grant_type=refresh_token", {
          method: "POST",
          headers: { "Content-Type": "application/json", apikey: supabaseKey },
          body: JSON.stringify({ refresh_token: refreshToken }),
          cache: "no-store",
        });
        const tokens = await response.json();

        if (response.ok && typeof tokens.access_token === "string" && typeof tokens.refresh_token === "string") {
          const headers = setForwardedCookies(req, tokens.access_token, tokens.refresh_token);
          const next = NextResponse.next({ request: { headers } });
          const secure = process.env.NODE_ENV === "production";
          next.cookies.set(ACCESS_COOKIE, tokens.access_token, {
            httpOnly: true, secure, sameSite: "lax", path: "/",
            maxAge: Math.max(60, Number(tokens.expires_in) || 3600),
          });
          next.cookies.set(REFRESH_COOKIE, tokens.refresh_token, {
            httpOnly: true, secure, sameSite: "lax", path: "/",
            maxAge: 60 * 60 * 24 * 30,
          });
          return next;
        }
      } catch (error) {
        console.error("Supabase session refresh failed:", error);
      }
    }

    const expired = NextResponse.next();
    clearSession(expired);
    if (isDashboardPage) {
      const login = NextResponse.redirect(new URL("/login?auth=required", req.url));
      clearSession(login);
      return login;
    }
    if (isDashboardApi) {
      clearSession(expired);
      return NextResponse.json({ error: "Your session has expired. Please sign in again." }, {
        status: 401,
        headers: { "Cache-Control": "no-store" },
      });
    }
    return expired;
  }

  if (isDashboardPage && (!accessToken || !expiry || expiry <= Math.floor(Date.now() / 1000))) {
    return NextResponse.redirect(new URL("/login?auth=required", req.url));
  }

  // Admin pages render the sign-in experience. Every admin data API performs
  // its own server-side role/capability check before returning protected data.
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/api/:path*"],
};
