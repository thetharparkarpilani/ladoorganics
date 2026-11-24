import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminActor } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const clean = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";

export async function GET(req: NextRequest) {
  const actor = await getAdminActor(req, "inventory");
  if (!actor) return NextResponse.json({ error: "Inventory access is required." }, { status: 401 });
  const finance = Boolean(await getAdminActor(req, "finance"));
  try {
    const [inventory, suppliers, movements, batches, expenses, audit] = await Promise.all([
      db.query(
        "SELECT p.id AS product_id,p.slug,p.name_en,v.id AS variant_id,v.sku,v.label,v.price_inr,v.stock_qty,v.is_default " +
        "FROM products p JOIN product_variants v ON v.product_id=p.id ORDER BY p.name_en,v.is_default DESC,v.label"
      ),
      db.query("SELECT id,name,company_name,contact_name,phone,email,gst_number,category,is_active,created_at FROM suppliers ORDER BY is_active DESC,name LIMIT 200"),
      db.query(
        "SELECT im.id,im.movement_type,im.quantity_delta,im.unit_cost_inr,im.reference_type,im.reference_id,im.note,im.created_by,im.created_at," +
        "p.name_en AS product_name,p.slug,v.sku,v.label,s.name AS supplier_name,b.batch_code " +
        "FROM inventory_movements im JOIN product_variants v ON v.id=im.product_variant_id " +
        "JOIN products p ON p.id=v.product_id LEFT JOIN suppliers s ON s.id=im.supplier_id " +
        "LEFT JOIN product_batches b ON b.id=im.batch_id ORDER BY im.created_at DESC LIMIT 150"
      ),
      db.query(
        "SELECT b.id,b.batch_code,b.product_slug,b.product_name,b.variant_label,b.production_date,b.packaging_date,b.best_before_date," +
        "b.production_process,b.quality_checks,b.storage_instructions,b.lab_report_url,b.is_approved,b.quantity_produced," +
        "p.name_en AS live_product_name,v.sku FROM product_batches b LEFT JOIN product_variants v ON v.id=b.product_variant_id " +
        "LEFT JOIN products p ON p.slug=b.product_slug ORDER BY b.created_at DESC LIMIT 100"
      ),
      finance ? db.query(
        "SELECT e.id,e.expense_date,e.category,e.amount_inr,e.payment_method,e.reference,e.description,e.created_by,e.created_at,s.name AS supplier_name " +
        "FROM business_expenses e LEFT JOIN suppliers s ON s.id=e.supplier_id ORDER BY e.expense_date DESC,e.created_at DESC LIMIT 150"
      ) : Promise.resolve({ rows: [] }),
      db.query("SELECT id,action,entity_type,entity_id,created_at FROM audit_logs WHERE action IN ('PRODUCT_CREATED','PRODUCT_VARIANT_CREATED','PRODUCT_INVENTORY_UPDATED','PRODUCT_AVAILABILITY_UPDATED','PRODUCT_IMAGE_UPDATED','STOCK_MOVEMENT_RECORDED','SUPPLIER_CREATED','SUPPLIER_STATUS_UPDATED','BATCH_CREATED','BATCH_PUBLISHED','BATCH_DRAFT_CREATED') ORDER BY created_at DESC LIMIT 50")
    ]);
    const stockUnits = inventory.rows.reduce((sum, row) => sum + Number(row.stock_qty || 0), 0);
    const lowStock = inventory.rows.filter(row => Number(row.stock_qty || 0) <= 5).length;
    const expenseTotal = expenses.rows.reduce((sum, row) => sum + Number(row.amount_inr || 0), 0);
    return NextResponse.json({
      inventory: inventory.rows, suppliers: suppliers.rows, movements: movements.rows,
      batches: batches.rows, expenses: expenses.rows, audit: audit.rows,
      permissions: { finance }, summary: {
        products: new Set(inventory.rows.map(row => row.product_id)).size,
        variants: inventory.rows.length, stockUnits, lowStockVariants: lowStock,
        suppliers: suppliers.rows.length, expensesInr: expenseTotal
      }
    }, { headers: { "Cache-Control": "private, no-store, max-age=0" } });
  } catch (error) {
    console.error("Business operations read failed:", error);
    return NextResponse.json({ error: "Business operations are not ready. Apply database migration 019 and try again." }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  const actor = await getAdminActor(req, "inventory");
  if (!actor) return NextResponse.json({ error: "Inventory access is required." }, { status: 401 });
  const body = await req.json().catch(() => null);
  const action = clean(body?.action, 40);
  const financeActor = action === "record_expense" || action === "update_expense" ? await getAdminActor(req, "finance") : null;
  if ((action === "record_expense" || action === "update_expense") && !financeActor) {
    return NextResponse.json({ error: "Finance permission is required to manage expenses." }, { status: 403 });
  }

  try {
    if (action === "create_product") {
      const slug = clean(body?.slug, 100).toLowerCase();
      const name = clean(body?.name, 160);
      const description = clean(body?.description, 2000);
      const sku = clean(body?.sku, 80).toUpperCase();
      const label = clean(body?.variantLabel, 100);
      const price = Number(body?.priceInr);
      const openingStock = Number(body?.openingStock);
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || name.length < 2 || description.length < 2 ||
          !/^[A-Z0-9._-]{2,80}$/.test(sku) || label.length < 1 ||
          !Number.isSafeInteger(price) || price < 0 || price > 100000000 ||
          !Number.isSafeInteger(openingStock) || openingStock < 0 || openingStock > 1000000) {
        return NextResponse.json({ error: "Enter a valid product name, URL slug, description, variant, SKU, whole-rupee price and opening stock." }, { status: 400 });
      }
      const client = await db.getClient();
      try {
        await client.query("BEGIN");
        const product = await client.query(
          "INSERT INTO products(slug,name_en,description_en,is_active) VALUES($1,$2,$3,TRUE) RETURNING id,slug,name_en",
          [slug,name,description]
        );
        const variant = await client.query(
          "INSERT INTO product_variants(product_id,sku,label,price_inr,stock_qty,is_default) VALUES($1,$2,$3,$4,$5,TRUE) RETURNING id,sku,label,price_inr,stock_qty",
          [product.rows[0].id,sku,label,price,openingStock]
        );
        if (openingStock > 0) await client.query(
          "INSERT INTO inventory_movements(product_variant_id,movement_type,quantity_delta,note,created_by) VALUES($1,'opening_balance',$2,$3,$4)",
          [variant.rows[0].id,openingStock,"Opening stock entered when product was created",actor.email]
        );
        await client.query(
          "INSERT INTO audit_logs(action,entity_type,entity_id,metadata) VALUES('PRODUCT_CREATED','product',$1,$2::jsonb)",
          [product.rows[0].id,JSON.stringify({slug,sku,priceInr:price,openingStock,createdBy:actor.email})]
        );
        await client.query("COMMIT");
        return NextResponse.json({ ok:true, product:product.rows[0], variant:variant.rows[0] },{status:201});
      } catch (error) {
        await client.query("ROLLBACK").catch(()=>undefined);
        throw error;
      } finally { client.release(); }
    }

    if (action === "add_variant") {
      const productId = clean(body?.productId,50);
      const sku = clean(body?.sku,80).toUpperCase();
      const label = clean(body?.variantLabel,100);
      const price = Number(body?.priceInr);
      const openingStock = Number(body?.openingStock);
      if (!UUID.test(productId) || !/^[A-Z0-9._-]{2,80}$/.test(sku) || label.length < 1 ||
          !Number.isSafeInteger(price) || price < 0 || price > 100000000 ||
          !Number.isSafeInteger(openingStock) || openingStock < 0 || openingStock > 1000000) {
        return NextResponse.json({error:"Choose a product and enter a valid pack size, SKU, whole-rupee price and opening stock."},{status:400});
      }
      const client = await db.getClient();
      try {
        await client.query("BEGIN");
        const product = await client.query("SELECT id,name_en FROM products WHERE id=$1 FOR UPDATE",[productId]);
        if (!product.rows[0]) {
          await client.query("ROLLBACK");
          return NextResponse.json({error:"Product not found."},{status:404});
        }
        const count = await client.query("SELECT COUNT(*)::int AS total FROM product_variants WHERE product_id=$1",[productId]);
        const variant = await client.query(
          "INSERT INTO product_variants(product_id,sku,label,price_inr,stock_qty,is_default) VALUES($1,$2,$3,$4,$5,$6) RETURNING id,sku,label,price_inr,stock_qty,is_default",
          [productId,sku,label,price,openingStock,Number(count.rows[0]?.total||0)===0]
        );
        if (openingStock > 0) await client.query(
          "INSERT INTO inventory_movements(product_variant_id,movement_type,quantity_delta,note,created_by) VALUES($1,'opening_balance',$2,$3,$4)",
          [variant.rows[0].id,openingStock,"Opening stock entered when product variant was created",actor.email]
        );
        await client.query(
          "INSERT INTO audit_logs(action,entity_type,entity_id,metadata) VALUES('PRODUCT_VARIANT_CREATED','product_variant',$1,$2::jsonb)",
          [variant.rows[0].id,JSON.stringify({productId,productName:product.rows[0].name_en,sku,label,priceInr:price,openingStock,createdBy:actor.email})]
        );
        await client.query("COMMIT");
        return NextResponse.json({ok:true,variant:variant.rows[0]},{status:201});
      } catch (error) {
        await client.query("ROLLBACK").catch(()=>undefined);
        throw error;
      } finally { client.release(); }
    }

    if (action === "stock_movement") {
      const variantId = clean(body?.variantId, 50);
      const type = clean(body?.movementType, 30);
      const delta = Number(body?.quantityDelta);
      const note = clean(body?.note, 500);
      const supplierId = clean(body?.supplierId, 50) || null;
      const unitCost = body?.unitCostInr === "" || body?.unitCostInr === null || body?.unitCostInr === undefined ? null : Number(body.unitCostInr);
      const reference = clean(body?.reference, 120);
      const allowed = new Set(["purchase","adjustment","damage","expiry","supplier_return"]);
      if (!UUID.test(variantId) || !allowed.has(type) || !Number.isSafeInteger(delta) || delta === 0 || Math.abs(delta) > 1000000 ||
          note.length < 3 || (supplierId && !UUID.test(supplierId)) ||
          (unitCost !== null && (!Number.isSafeInteger(unitCost) || unitCost < 0 || unitCost > 100000000))) {
        return NextResponse.json({ error: "Enter a valid stock movement, quantity, note and optional supplier/cost." }, { status: 400 });
      }
      if ((type === "purchase" && delta < 0) || (["damage","expiry","supplier_return"].includes(type) && delta > 0)) {
        return NextResponse.json({ error: "The quantity sign does not match this movement type." }, { status: 400 });
      }
      const client = await db.getClient();
      try {
        await client.query("BEGIN");
        const updated = await client.query(
          "UPDATE product_variants SET stock_qty=stock_qty+$2 WHERE id=$1 AND stock_qty+$2>=0 RETURNING id,sku,stock_qty",
          [variantId,delta]
        );
        if (!updated.rows[0]) {
          await client.query("ROLLBACK");
          return NextResponse.json({ error: "Variant not found or this movement would make stock negative." }, { status: 409 });
        }
        const movement = await client.query(
          "INSERT INTO inventory_movements(product_variant_id,movement_type,quantity_delta,unit_cost_inr,supplier_id,reference_type,reference_id,note,created_by) " +
          "VALUES($1,$2,$3,$4,$5,'manual',$6,$7,$8) RETURNING id,created_at",
          [variantId,type,delta,unitCost,supplierId,reference || null,note,actor.email]
        );
        await client.query(
          "INSERT INTO audit_logs(action,entity_type,entity_id,metadata) VALUES('STOCK_MOVEMENT_RECORDED','product_variant',$1,$2::jsonb)",
          [variantId,JSON.stringify({movementType:type,quantityDelta:delta,reference,createdBy:actor.email})]
        );
        await client.query("COMMIT");
        return NextResponse.json({ok:true,variant:updated.rows[0],movement:movement.rows[0]});
      } catch (error) {
        await client.query("ROLLBACK").catch(()=>undefined);
        throw error;
      } finally { client.release(); }
    }

    if (action === "create_supplier") {
      const name = clean(body?.name,160);
      const company = clean(body?.companyName,160);
      const contact = clean(body?.contactName,120);
      const phone = clean(body?.phone,30);
      const email = clean(body?.email,254).toLowerCase();
      const gst = clean(body?.gstNumber,15).toUpperCase();
      const category = clean(body?.category,60) || "general";
      const address = clean(body?.address,500);
      const notes = clean(body?.notes,1000);
      if (name.length < 2 || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) || (gst && !/^[0-9A-Z]{15}$/.test(gst))) {
        return NextResponse.json({error:"Enter a supplier name and valid optional email/GST number."},{status:400});
      }
      const result = await db.query(
        "INSERT INTO suppliers(name,company_name,contact_name,phone,email,gst_number,category,address,notes) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id,name,category,is_active",
        [name,company||null,contact||null,phone||null,email||null,gst||null,category,address||null,notes||null]
      );
      await db.query("INSERT INTO audit_logs(action,entity_type,entity_id,metadata) VALUES('SUPPLIER_CREATED','supplier',$1,$2::jsonb)",[result.rows[0].id,JSON.stringify({name,category,createdBy:actor.email})]);
      return NextResponse.json({ok:true,supplier:result.rows[0]},{status:201});
    }

    if (action === "update_supplier") {
      const id = clean(body?.supplierId,50);
      if (!UUID.test(id) || typeof body?.isActive !== "boolean") return NextResponse.json({error:"Choose a valid supplier and active status."},{status:400});
      const result = await db.query("UPDATE suppliers SET is_active=$2,updated_at=NOW() WHERE id=$1 RETURNING id,name,is_active",[id,body.isActive]);
      if (!result.rows[0]) return NextResponse.json({error:"Supplier not found."},{status:404});
      await db.query("INSERT INTO audit_logs(action,entity_type,entity_id,metadata) VALUES('SUPPLIER_STATUS_UPDATED','supplier',$1,$2::jsonb)",[id,JSON.stringify({isActive:body.isActive,updatedBy:actor.email})]);
      return NextResponse.json({ok:true,supplier:result.rows[0]});
    }

    if (action === "record_expense" || action === "update_expense") {
      const id = clean(body?.expenseId,50);
      const category = clean(body?.category,40);
      const amount = Number(body?.amountInr);
      const date = clean(body?.expenseDate,10);
      const method = clean(body?.paymentMethod,30);
      const supplierId = clean(body?.supplierId,50) || null;
      const reference = clean(body?.reference,120);
      const description = clean(body?.description,500);
      const categories = new Set(["raw_materials","packaging","transport","lab_testing","utilities","marketing","salaries","maintenance","rent","other"]);
      if (!categories.has(category) || !Number.isSafeInteger(amount) || amount <= 0 || amount > 100000000 ||
          !/^\d{4}-\d{2}-\d{2}$/.test(date) || !["cash","upi","bank_transfer","card"].includes(method) ||
          (supplierId && !UUID.test(supplierId)) || description.length < 2 ||
          (action === "update_expense" && !UUID.test(id))) {
        return NextResponse.json({error:"Enter a valid expense date, category, amount, payment method and description."},{status:400});
      }
      const values = [date,category,amount,method,supplierId,reference||null,description,financeActor?.email||actor.email];
      const result = action === "record_expense"
        ? await db.query(
            "INSERT INTO business_expenses(expense_date,category,amount_inr,payment_method,supplier_id,reference,description,created_by) VALUES($1::date,$2,$3,$4,$5,$6,$7,$8) RETURNING id,expense_date,category,amount_inr,payment_method,description",
            values
          )
        : await db.query(
            "UPDATE business_expenses SET expense_date=$1::date,category=$2,amount_inr=$3,payment_method=$4,supplier_id=$5,reference=$6,description=$7,updated_at=NOW() WHERE id=$9 RETURNING id,expense_date,category,amount_inr,payment_method,description",
            [...values,id]
          );
      if (!result.rows[0]) return NextResponse.json({error:"Expense not found."},{status:404});
      await db.query("INSERT INTO audit_logs(action,entity_type,entity_id,metadata) VALUES($1,'business_expense',$2,$3::jsonb)",[action==="record_expense"?"EXPENSE_RECORDED":"EXPENSE_UPDATED",result.rows[0].id,JSON.stringify({amountInr:amount,category,updatedBy:financeActor?.email||actor.email})]);
      return NextResponse.json({ok:true,expense:result.rows[0]},{status:action==="record_expense"?201:200});
    }

    if (action === "create_batch") {
      const batchCode = clean(body?.batchCode,40).toUpperCase();
      const variantId = clean(body?.variantId,50);
      const productionDate = clean(body?.productionDate,10);
      const packagingDate = clean(body?.packagingDate,10);
      const bestBefore = clean(body?.bestBeforeDate,10);
      const process = clean(body?.productionProcess,2000);
      const quality = clean(body?.qualityChecks,2000);
      const storage = clean(body?.storageInstructions,1000);
      const labUrl = clean(body?.labReportUrl,2048);
      const quantity = Number(body?.quantityProduced || 0);
      const approve = body?.approveBatch === true || body?.approveBatch === "true";
      if (!/^[A-Z0-9-]{4,40}$/.test(batchCode) || !UUID.test(variantId) ||
          !/^\d{4}-\d{2}-\d{2}$/.test(productionDate) || (packagingDate && !/^\d{4}-\d{2}-\d{2}$/.test(packagingDate)) ||
          (bestBefore && !/^\d{4}-\d{2}-\d{2}$/.test(bestBefore)) ||
          process.length < 5 || quality.length < 5 || storage.length < 3 ||
          !Number.isSafeInteger(quantity) || quantity < 0 || quantity > 1000000 ||
          (labUrl && !/^https:\/\//i.test(labUrl))) {
        return NextResponse.json({error:"Enter a valid batch code, variant, dates, production process, quality checks and storage instructions."},{status:400});
      }
      if (approve && actor.role !== "owner" && actor.role !== "manager") return NextResponse.json({error:"Only the owner or manager can publish a verified batch."},{status:403});
      const client = await db.getClient();
      try {
        await client.query("BEGIN");
        const variant = await client.query(
          "SELECT v.id,v.label,v.sku,p.slug,p.name_en FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.id=$1 FOR UPDATE OF v",
          [variantId]
        );
        if (!variant.rows[0]) {
          await client.query("ROLLBACK");
          return NextResponse.json({error:"Choose an existing product variant."},{status:404});
        }
        const p = variant.rows[0];
        const batch = await client.query(
          "INSERT INTO product_batches(batch_code,product_slug,product_name,variant_label,production_date,packaging_date,origin_location,production_process,quality_checks,lab_report_url,storage_instructions,best_before_date,is_approved,product_variant_id,quantity_produced) " +
          "VALUES($1,$2,$3,$4,$5::date,$6::date,'Pilani, Jhunjhunu, Rajasthan',$7,$8,$9,$10,$11::date,$12,$13,$14) RETURNING id,batch_code,is_approved,quantity_produced",
          [batchCode,p.slug,p.name_en,p.label,productionDate,packagingDate||null,process,quality,labUrl||null,storage,bestBefore||null,approve,variantId,quantity]
        );
        if (quantity > 0) {
          await client.query("UPDATE product_variants SET stock_qty=stock_qty+$2 WHERE id=$1",[variantId,quantity]);
          await client.query(
            "INSERT INTO inventory_movements(product_variant_id,movement_type,quantity_delta,batch_id,note,created_by) VALUES($1,'production',$2,$3,$4,$5)",
            [variantId,quantity,batch.rows[0].id,"Production output recorded for batch "+batchCode,actor.email]
          );
        }
        await client.query("INSERT INTO audit_logs(action,entity_type,entity_id,metadata) VALUES('BATCH_CREATED','product_batch',$1,$2::jsonb)",[batch.rows[0].id,JSON.stringify({batchCode,quantityProduced:quantity,isApproved:approve,createdBy:actor.email})]);
        await client.query("COMMIT");
        return NextResponse.json({ok:true,batch:batch.rows[0]},{status:201});
      } catch (error) {
        await client.query("ROLLBACK").catch(()=>undefined);
        throw error;
      } finally { client.release(); }
    }

    return NextResponse.json({error:"Unsupported business operations action."},{status:400});
  } catch (error) {
    console.error("Business operations update failed:",error);
    return NextResponse.json({error:"Unable to save this business operation. Check the required database migration and try again."},{status:503});
  }
}
