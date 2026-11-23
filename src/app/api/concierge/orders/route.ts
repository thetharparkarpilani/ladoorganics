import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const accessToken = req.cookies.get("lado_sb_access")?.value;

  if (!supabaseUrl || !supabaseKey || !accessToken) {
    return NextResponse.json({ error: "Please sign in with Google to view your orders.", signInRequired: true }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }

  const headers = {
    apikey: supabaseKey,
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  try {
    const identity = await fetch(`${supabaseUrl}/auth/v1/user`, { headers, cache: "no-store" });
    if (!identity.ok) {
      return NextResponse.json({ error: "Your session has expired. Please sign in again.", signInRequired: true }, { status: 401, headers: { "Cache-Control": "no-store" } });
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/get_my_customer_orders`, {
      method: "POST",
      headers,
      body: "{}",
      cache: "no-store",
    });
    if (!response.ok) {
      console.error("Lado AI customer order lookup failed:", response.status, await response.text());
      return NextResponse.json({ error: "Your order history is temporarily unavailable. Please try again later." }, { status: 502, headers: { "Cache-Control": "no-store" } });
    }

    const raw = await response.json();
    const orders = (Array.isArray(raw) ? raw : []).slice(0, 10).map((order: Record<string, unknown>) => ({
      orderNumber: typeof order.order_number === "string" ? order.order_number : "Order",
      status: typeof order.status === "string" ? order.status : "Status unavailable",
      paymentMethod: typeof order.payment_method === "string" ? order.payment_method : "Not listed",
      paymentStatus: typeof order.payment_status === "string" ? order.payment_status : "Not listed",
      totalInr: Number.isFinite(Number(order.total_inr)) ? Number(order.total_inr) : null,
      createdAt: typeof order.created_at === "string" ? order.created_at : null,
      items: (Array.isArray(order.items) ? order.items : []).slice(0, 12).map((item: Record<string, unknown>) => ({
        title: typeof item.item_title === "string" ? item.item_title : "Lado product",
        quantity: Number.isInteger(Number(item.quantity)) ? Number(item.quantity) : 1,
      })),
    }));

    return NextResponse.json({ orders }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Lado AI order lookup error:", error);
    return NextResponse.json({ error: "We couldn't retrieve your orders just now. Please try again." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
