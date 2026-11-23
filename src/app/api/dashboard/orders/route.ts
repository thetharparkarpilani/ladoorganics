import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const accessToken = req.cookies.get("lado_sb_access")?.value;

  if (!supabaseUrl || !supabaseKey || !accessToken) {
    return NextResponse.json({ error: "Please sign in to view your orders." }, { status: 401 });
  }

  const headers = {
    apikey: supabaseKey,
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  const identity = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers,
    cache: "no-store",
  });

  if (!identity.ok) {
    return NextResponse.json({ error: "Your session has expired. Please sign in again." }, { status: 401 });
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/get_my_customer_orders`, {
    method: "POST",
    headers,
    body: "{}",
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Order history is temporarily unavailable. Please try again later." },
      { status: 502 }
    );
  }

  const orders = await response.json();
  return NextResponse.json({ orders: Array.isArray(orders) ? orders : [] });
}
