import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  // Protect Customer Dashboard
  if (path.startsWith("/dashboard")) {
    // Google sign-in stores the Supabase session in these HttpOnly cookies.
    // Accept either cookie here; the dashboard API validates and refreshes the token.
    const accessCookie = req.cookies.get("lado_sb_access");
    const refreshCookie = req.cookies.get("lado_sb_refresh");
    if (!accessCookie && !refreshCookie) {
      return NextResponse.redirect(new URL("/login?auth=required", req.url));
    }
  }

  // Protect Admin Dashboard
  if (path.startsWith("/admin")) {
    const adminToken = req.cookies.get("lado_admin_token");
    if (!adminToken || adminToken.value !== process.env.ADMIN_ACCESS_TOKEN) {
      return NextResponse.redirect(new URL("/?auth=admin_required", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
