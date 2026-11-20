import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  // Protect Customer Dashboard
  if (path.startsWith("/dashboard")) {
    const sessionCookie = req.cookies.get("lado_secure_session");
    if (!sessionCookie) {
      // In production, redirect to a proper /login page. For now, redirect home with an auth flag.
      return NextResponse.redirect(new URL("/?auth=required", req.url));
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
