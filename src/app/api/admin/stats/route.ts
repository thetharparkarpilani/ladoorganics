import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    // SECURITY: Enforce strict server-side authorization check
    const authHeader = req.headers.get("authorization");
    const adminToken = process.env.ADMIN_ACCESS_TOKEN;
    
    if (!adminToken || authHeader !== `Bearer ${adminToken}`) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // Execute parallel queries for dashboard analytics
    const [ordersResult, productsResult, bookingsResult] = await Promise.all([
      db.query("SELECT COUNT(*) as total_orders, SUM(total_inr) as total_revenue FROM orders WHERE status != 'cancelled'"),
      db.query("SELECT COUNT(*) as total_products, SUM(stock_qty) as total_stock FROM product_variants"),
      db.query("SELECT COUNT(*) as active_bookings FROM bhunga_bookings WHERE status = 'confirmed'")
    ]);

    return NextResponse.json({
      orders: parseInt(ordersResult.rows[0]?.total_orders || "0"),
      revenue: parseInt(ordersResult.rows[0]?.total_revenue || "0"),
      products: parseInt(productsResult.rows[0]?.total_products || "0"),
      inventory: parseInt(productsResult.rows[0]?.total_stock || "0"),
      bookings: parseInt(bookingsResult.rows[0]?.active_bookings || "0")
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : "Database unavailable";
    return NextResponse.json({ error: detail }, { status: 503 });
  }
}
