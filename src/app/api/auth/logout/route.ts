import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const response = NextResponse.redirect(new URL("/", req.url));
  response.cookies.delete("lado_sb_access");
  response.cookies.delete("lado_sb_refresh");
  response.cookies.delete("lado_secure_session");
  response.cookies.delete("lado_admin_token");
  return response;
}
