import { NextRequest, NextResponse } from "next/server";
import { enforceRateLimit } from "@/lib/rate-limit";

interface ShippingItem {
  quantity: number;
  priceInr: number;
}

export async function POST(req: NextRequest) {
  const rateLimited = await enforceRateLimit(req, "shipping-quotes", 60, 60);
  if (rateLimited) return rateLimited;
  try {
    const { pincode, items } = (await req.json()) as { pincode: string; items: ShippingItem[] };

    if (!pincode || pincode.length !== 6) {
      return NextResponse.json({ error: "Valid 6-digit Indian PIN code required." }, { status: 400 });
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ shippingCostInr: 0, estimatedDays: 0 });
    }

    // Baseline calculation: 
    // ₹50 base charge + ₹20 per item for standard packing weight
    const baseRate = 50;
    const itemSurcharge = items.reduce((sum: number, item: ShippingItem) => sum + (item.quantity * 20), 0);
    let shippingCostInr = baseRate + itemSurcharge;
    let estimatedDays = 5;

    // NCR & Rajasthan Subsidized Routing (Starts with 11, 12, 30, 31, 32, 33)
    const pinPrefix = pincode.substring(0, 2);
    if (["11", "12", "30", "31", "32", "33"].includes(pinPrefix)) {
      shippingCostInr = Math.max(0, shippingCostInr - 40); // ₹40 discount for local routing
      estimatedDays = 2;
    }

    // Heavy order subsidy (Orders over ₹5000 get free shipping)
    const cartSubtotal = items.reduce((sum: number, item: ShippingItem) => sum + (item.priceInr * item.quantity), 0);
    if (cartSubtotal >= 5000) {
      shippingCostInr = 0;
    }

    return NextResponse.json({ 
      shippingCostInr, 
      estimatedDays,
      message: shippingCostInr === 0 ? "Complimentary Premium Shipping Applied" : "Standard Surface Shipping"
    });

  } catch (err) {
    console.error("Shipping API Error:", err);
    return NextResponse.json({ error: "Failed to calculate shipping." }, { status: 500 });
  }
}
