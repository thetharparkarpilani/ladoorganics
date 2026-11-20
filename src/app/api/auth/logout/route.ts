import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  
  // Clear customer and admin sessions completely
  cookieStore.delete("lado_secure_session");
  cookieStore.delete("lado_admin_token");

  // Redirect to home page after destruction
  return NextResponse.redirect(new URL("/", req.url));
}
