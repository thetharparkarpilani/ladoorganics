import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminActor } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  if (!(await getAdminActor(req, "inventory"))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  try {
    const result = await db.query(
      `SELECT p.id AS product_id, p.slug, p.name_en, p.is_active, p.image_url,
              v.id AS variant_id, v.sku, v.label, v.price_inr, v.stock_qty, v.is_default
         FROM products p
         LEFT JOIN product_variants v ON v.product_id = p.id
        ORDER BY p.created_at ASC, v.is_default DESC, v.label ASC`
    );
    return NextResponse.json({ items: result.rows });
  } catch (error) {
    console.error("Admin catalog load failed:", error);
    return NextResponse.json({ error: "Unable to load product inventory." }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await getAdminActor(req, "inventory"))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  try {
    const body = await req.json().catch(() => null);
    const action = typeof body?.action === "string" ? body.action : "";

    if (action === "update_variant") {
      const variantId = typeof body?.variantId === "string" ? body.variantId.trim() : "";
      const price = Number(body?.priceInr);
      const stock = Number(body?.stockQty);
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(variantId) ||
          !Number.isSafeInteger(price) || price < 0 || price > 100000000 ||
          !Number.isInteger(stock) || stock < 0 || stock > 1000000) {
        return NextResponse.json({ error: "Enter a valid variant, whole-rupee price and whole-number stock quantity." }, { status: 400 });
      }
      const client = await db.getClient();
      try {
        await client.query("BEGIN");
        const current = await client.query("SELECT id,sku,stock_qty FROM product_variants WHERE id=$1 FOR UPDATE",[variantId]);
        if (!current.rows[0]) {
          await client.query("ROLLBACK");
          return NextResponse.json({ error: "Product variant not found." }, { status: 404 });
        }
        const previousStock = Number(current.rows[0].stock_qty || 0);
        const result = await client.query(
          "UPDATE product_variants SET price_inr=$2,stock_qty=$3 WHERE id=$1 RETURNING id,sku,price_inr,stock_qty",
          [variantId,price,stock]
        );
        const delta = stock - previousStock;
        if (delta !== 0) {
          await client.query(
            "INSERT INTO inventory_movements(product_variant_id,movement_type,quantity_delta,reference_type,reference_id,note,created_by) VALUES($1,'adjustment',$2,'admin_catalog',$1,$3,$4)",
            [variantId,delta,"Manual stock quantity update from Product & Inventory screen","admin"]
          );
        }
        await client.query(
          "INSERT INTO audit_logs(action,entity_type,entity_id,metadata) VALUES('PRODUCT_INVENTORY_UPDATED','product_variant',$1,$2::jsonb)",
          [variantId,JSON.stringify({priceInr:price,previousStock,stockQty:stock,stockDelta:delta})]
        );
        await client.query("COMMIT");
        return NextResponse.json({ok:true,variant:result.rows[0]});
      } catch (error) {
        await client.query("ROLLBACK").catch(()=>undefined);
        throw error;
      } finally { client.release(); }
    }


    if (action === "update_product_image") {
      const productId = typeof body?.productId === "string" ? body.productId.trim() : "";
      const imageUrl = typeof body?.imageUrl === "string" ? body.imageUrl.trim() : "";
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(productId)) {
        return NextResponse.json({ error: "A valid product is required." }, { status: 400 });
      }
      if (imageUrl.length > 2048) {
        return NextResponse.json({ error: "Image URL is too long." }, { status: 400 });
      }
      if (imageUrl) {
        try {
          const parsed = new URL(imageUrl);
          if (parsed.protocol !== "https:" && parsed.protocol !== "http:") throw new Error("Invalid protocol");
        } catch {
          return NextResponse.json({ error: "Enter a valid public image URL beginning with https://." }, { status: 400 });
        }
      }
      const result = await db.query(
        "UPDATE products SET image_url = $2 WHERE id = $1 RETURNING id, slug, name_en, image_url",
        [productId, imageUrl || null]
      );
      if (!result.rowCount) return NextResponse.json({ error: "Product not found." }, { status: 404 });
      await db.query(
        `INSERT INTO audit_logs (action, entity_type, entity_id, metadata)
         VALUES ('PRODUCT_IMAGE_UPDATED', 'product', $1, $2::jsonb)`,
        [productId, JSON.stringify({ imageUrl: imageUrl || null })]
      );
      return NextResponse.json({ ok: true, product: result.rows[0] });
    }

    if (action === "update_product_status") {
      const productId = typeof body?.productId === "string" ? body.productId.trim() : "";
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(productId) ||
          typeof body?.isActive !== "boolean") {
        return NextResponse.json({ error: "A valid product and availability value are required." }, { status: 400 });
      }
      const result = await db.query(
        "UPDATE products SET is_active = $2 WHERE id = $1 RETURNING id, slug, name_en, is_active",
        [productId, body.isActive]
      );
      if (!result.rowCount) return NextResponse.json({ error: "Product not found." }, { status: 404 });
      await db.query(
        `INSERT INTO audit_logs (action, entity_type, entity_id, metadata)
         VALUES ('PRODUCT_AVAILABILITY_UPDATED', 'product', $1, $2::jsonb)`,
        [productId, JSON.stringify({ isActive: body.isActive })]
      );
      return NextResponse.json({ ok: true, product: result.rows[0] });
    }

    return NextResponse.json({ error: "Unsupported catalog action." }, { status: 400 });
  } catch (error) {
    console.error("Admin catalog update failed:", error);
    return NextResponse.json({ error: "Unable to save product changes." }, { status: 503 });
  }
}
