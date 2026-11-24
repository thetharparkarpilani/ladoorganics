import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { enforceRateLimit } from "@/lib/rate-limit";

type QuoteItem = { sku: string; quantity: number };

export async function POST(req: NextRequest) {
  const rateLimited = await enforceRateLimit(req, "shipping-quotes", 60, 60);
  if (rateLimited) return rateLimited;

  try {
    const body = await req.json().catch(() => null);
    const pincode = typeof body?.pincode === "string" ? body.pincode.trim() : "";
    const items = Array.isArray(body?.items) ? body.items as QuoteItem[] : [];

    if (!/^\d{6}$/.test(pincode)) {
      return NextResponse.json({ error: "Valid 6-digit Indian PIN code required." }, { status: 400 });
    }
    if (!items.length || items.length > 30) {
      return NextResponse.json({ error: "Add between 1 and 30 valid cart items." }, { status: 400 });
    }

    const quantities = new Map<string, number>();
    for (const item of items) {
      const sku = typeof item?.sku === "string" ? item.sku.trim().slice(0, 80) : "";
      const quantity = Number(item?.quantity);
      if (!sku || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
        return NextResponse.json({ error: "One or more cart items are invalid." }, { status: 400 });
      }
      quantities.set(sku, (quantities.get(sku) || 0) + quantity);
    }
    if ([...quantities.values()].some(quantity => quantity > 20)) {
      return NextResponse.json({ error: "Maximum 20 units per product variant." }, { status: 400 });
    }

    // Never accept unit prices or subtotal from the browser. Recalculate from
    // the active catalogue so a modified request cannot obtain free shipping.
    // Encode the SKU list as JSON because the shared DB helper accepts scalar
    // query parameters only; PostgreSQL expands the JSON array safely.
    const catalog = await db.query(
      `SELECT pv.sku, pv.price_inr
         FROM product_variants pv
         JOIN products p ON p.id = pv.product_id
        WHERE pv.sku IN (
          SELECT jsonb_array_elements_text($1::jsonb)
        ) AND p.is_active = TRUE`,
      [JSON.stringify([...quantities.keys()])]
    );
    if (catalog.rows.length !== quantities.size) {
      return NextResponse.json({ error: "A product in your cart is unavailable. Refresh your cart and try again." }, { status: 409 });
    }

    const subtotal = catalog.rows.reduce(
      (sum: number, row: { sku: string; price_inr: number | string }) =>
        sum + Number(row.price_inr) * (quantities.get(row.sku) || 0),
      0
    );
    if (!Number.isSafeInteger(subtotal) || subtotal < 0 || subtotal > 500000) {
      return NextResponse.json({ error: "Unable to calculate a valid cart subtotal." }, { status: 400 });
    }

    const baseRate = 50;
    const itemSurcharge = [...quantities.values()].reduce((sum, quantity) => sum + quantity * 20, 0);
    let shippingCostInr = baseRate + itemSurcharge;
    let estimatedDays = 5;
    if (["11", "12", "30", "31", "32", "33"].includes(pincode.slice(0, 2))) {
      shippingCostInr = Math.max(0, shippingCostInr - 40);
      estimatedDays = 2;
    }
    if (subtotal >= 5000) shippingCostInr = 0;

    return NextResponse.json({
      shippingCostInr,
      estimatedDays,
      verifiedSubtotalInr: subtotal,
      message: shippingCostInr === 0 ? "Complimentary Premium Shipping Applied" : "Standard Surface Shipping"
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Shipping quote failed:", error);
    return NextResponse.json({ error: "Failed to calculate shipping." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
