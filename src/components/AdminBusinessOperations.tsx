"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getAdminClientToken } from "@/lib/admin-client";

type Variant = { product_id:string; slug:string; name_en:string; variant_id:string; sku:string; label:string; price_inr:number|string; stock_qty:number|string; is_default:boolean };
type Supplier = { id:string; name:string; company_name?:string|null; contact_name?:string|null; phone?:string|null; email?:string|null; gst_number?:string|null; category:string; is_active:boolean; created_at:string };
type Movement = { id:string; movement_type:string; quantity_delta:number|string; unit_cost_inr?:number|string|null; reference_type?:string|null; reference_id?:string|null; note:string; created_by:string; created_at:string; product_name:string; sku:string; label:string; supplier_name?:string|null; batch_code?:string|null };
type Expense = { id:string; expense_date:string; category:string; amount_inr:number|string; payment_method:string; reference?:string|null; description:string; created_by:string; created_at:string; supplier_name?:string|null };
type Batch = { id:string; batch_code:string; product_slug:string; product_name:string; variant_label:string; production_date:string; packaging_date?:string|null; best_before_date?:string|null; production_process:string; quality_checks:string; storage_instructions:string; lab_report_url?:string|null; is_approved:boolean; quantity_produced:number|string; sku?:string|null };
type Snapshot = { inventory:Variant[]; suppliers:Supplier[]; movements:Movement[]; batches:Batch[]; expenses:Expense[]; audit:Array<{id:string;action:string;entity_type:string;entity_id?:string;metadata?:unknown;created_at:string}>; permissions:{finance:boolean}; summary:{products:number;variants:number;stockUnits:number;lowStockVariants:number;suppliers:number;expensesInr:number} };

const TABS = [
  ["inventory","Inventory & Stock"],
  ["suppliers","Suppliers"],
  ["expenses","Expenses"],
  ["batches","Production Batches"],
  ["activity","Activity Log"]
] as const;
type Tab = typeof TABS[number][0];
const EMPTY_VARIANTS: Variant[] = [];
const money = (value:unknown) => "₹" + Number(value || 0).toLocaleString("en-IN");
const date = (value?:string|null) => value ? new Date(value).toLocaleDateString("en-IN") : "—";
const field = "mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm";
const button = "rounded-xl bg-[var(--mud)] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50";
const secondary = "rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-bold disabled:opacity-50";

export default function AdminBusinessOperations() {
  const [tab,setTab] = useState<Tab>("inventory");
  const [token,setToken] = useState("");
  const [data,setData] = useState<Snapshot|null>(null);
  const [loading,setLoading] = useState(true);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState("");
  const [notice,setNotice] = useState("");
  const [threshold,setThreshold] = useState("5");

  const load = useCallback(async (adminToken:string) => {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/admin/operations",{headers:{"x-admin-token":adminToken},cache:"no-store",credentials:"same-origin"});
      const payload = await response.json();
      if(!response.ok) throw new Error(payload?.error || "Unable to load business operations.");
      setData(payload as Snapshot);
    } catch(e) { setError(e instanceof Error ? e.message : "Unable to load business operations."); }
    finally { setLoading(false); }
  },[]);

  useEffect(()=>{
    let active=true;
    void getAdminClientToken().then(value=>{
      if(!active)return;
      setToken(value);
      if(value) void load(value); else setLoading(false);
    });
    return ()=>{active=false;};
  },[load]);

  const save = async (action:string,payload:Record<string,unknown>) => {
    if(!token)return;
    setBusy(true);setError("");setNotice("");
    try {
      const response=await fetch("/api/admin/operations",{
        method:"POST",
        headers:{"Content-Type":"application/json","x-admin-token":token},
        body:JSON.stringify({action,...payload})
      });
      const result=await response.json();
      if(!response.ok)throw new Error(result?.error || "Unable to save this change.");
      setNotice("Saved successfully. Your records have been updated.");
      await load(token);
      return true;
    } catch(e) { setError(e instanceof Error?e.message:"Unable to save this change.");return false; }
    finally { setBusy(false); }
  };

  const submit = (action:string,after?:()=>void) => async (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form=event.currentTarget;
    const values=Object.fromEntries(new FormData(form).entries());
    const ok=await save(action,values);
    if(ok){form.reset();after?.();}
  };

  const variants = data?.inventory ?? EMPTY_VARIANTS;
  const productChoices = useMemo(() => Array.from(new Map(variants.map(v => [v.product_id, { id: v.product_id, name: v.name_en }])).values()), [variants]);
  const lowStock = useMemo(()=>variants.filter(v=>Number(v.stock_qty)<=Math.max(0,Number(threshold)||0)),[variants,threshold]);
  const totalStock = data?.summary.stockUnits || 0;

  const exportCsv = (rows:Array<Array<unknown>>,filename:string) => {
    const csv=rows.map(row=>row.map(v=>'"'+String(v??"").replace(/"/g,'""')+'"').join(",")).join("\n");
    const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
    const a=document.createElement("a");a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url);
  };

  if(!token) return <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7"><h1 className="font-serif text-3xl font-bold">Business Operations</h1><p className="mt-3 text-sm opacity-70">Sign in with an approved Lado Organics staff account to use this private workspace.</p><a href="/login?next=/admin/operations" className="primary-btn mt-5 inline-flex rounded-xl px-5 py-3">Staff sign in</a></section>;

  return <div className="space-y-6">
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-xs uppercase tracking-[.2em] text-[var(--terracotta)]">Lado Command · Operations</p><h1 className="mt-2 font-serif text-3xl font-bold">Business Operations</h1><p className="mt-2 max-w-2xl text-sm opacity-70">One place to manage products, stock movements, suppliers, expenses and production batches. Updates are saved to your website database.</p></div>
      <button type="button" onClick={()=>void load(token)} disabled={loading||busy} className={secondary}>{loading?"Refreshing…":"Refresh data"}</button>
    </header>
    {error&&<p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    {notice&&<p role="status" className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-900">{notice}</p>}
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"><p className="text-xs opacity-60">Active product variants</p><p className="mt-1 text-2xl font-serif font-bold">{data?.summary.variants??"—"}</p></article>
      <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"><p className="text-xs opacity-60">Units currently in stock</p><p className="mt-1 text-2xl font-serif font-bold">{totalStock.toLocaleString("en-IN")}</p></article>
      <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"><p className="text-xs opacity-60">Low-stock variants</p><p className="mt-1 text-2xl font-serif font-bold">{lowStock.length}</p></article>
      <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"><p className="text-xs opacity-60">Suppliers on record</p><p className="mt-1 text-2xl font-serif font-bold">{data?.summary.suppliers??"—"}</p></article>
    </div>
    <nav className="flex gap-2 overflow-x-auto border-b border-[var(--border)] pb-2" aria-label="Business operations sections">
      {TABS.map(([id,label])=><button key={id} type="button" onClick={()=>setTab(id)} className={"shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold "+(tab===id?"bg-[var(--mud)] text-white":"border border-[var(--border)] bg-[var(--surface)]")}>{label}</button>)}
    </nav>
    {loading&&!data?<p className="py-12 text-center text-sm opacity-60">Loading your business records…</p>:null}

    {tab==="inventory"&&<div className="space-y-6">
      <div className="grid gap-5 xl:grid-cols-2">
        <form onSubmit={submit("create_product")} className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <div><h2 className="font-serif text-xl font-bold">Add a product and first variant</h2><p className="mt-1 text-xs opacity-65">Create a product for the storefront. Use your actual approved pack size, SKU and selling price; nothing is pre-filled.</p></div>
          <label className="block text-xs font-semibold">Product name<input name="name" required minLength={2} maxLength={160} placeholder="e.g. Bilona Ghee" className={field}/></label>
          <label className="block text-xs font-semibold">URL slug<input name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="e.g. bilona-ghee" className={field}/></label>
          <label className="block text-xs font-semibold">Product description<textarea name="description" required minLength={2} maxLength={2000} rows={2} className={field}/></label>
          <div className="grid gap-3 sm:grid-cols-2"><label className="block text-xs font-semibold">Pack size / variant label<input name="variantLabel" required placeholder="e.g. 500 g" className={field}/></label><label className="block text-xs font-semibold">SKU<input name="sku" required placeholder="e.g. GHEE-500G" className={field}/></label></div>
          <div className="grid gap-3 sm:grid-cols-2"><label className="block text-xs font-semibold">Selling price (₹)<input name="priceInr" type="number" min="0" step="1" required className={field}/></label><label className="block text-xs font-semibold">Opening stock (units)<input name="openingStock" type="number" min="0" step="1" defaultValue="0" required className={field}/></label></div>
          <button className={button} disabled={busy}>{busy?"Saving…":"Create product"}</button>
        </form>
        <form onSubmit={submit("stock_movement")} className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <div><h2 className="font-serif text-xl font-bold">Receive or adjust stock</h2><p className="mt-1 text-xs opacity-65">Every change is recorded in the stock ledger. Use a negative quantity for damage, expiry or supplier returns.</p></div>
          <label className="block text-xs font-semibold">Product variant<select name="variantId" required className={field}><option value="">Choose a product and size</option>{variants.map(v=><option key={v.variant_id} value={v.variant_id}>{v.name_en} · {v.label} · Stock: {v.stock_qty}</option>)}</select></label>
          <div className="grid gap-3 sm:grid-cols-2"><label className="block text-xs font-semibold">Movement type<select name="movementType" className={field}><option value="purchase">Purchase / stock received</option><option value="adjustment">Manual correction</option><option value="damage">Damaged stock</option><option value="expiry">Expired stock</option><option value="supplier_return">Returned to supplier</option></select></label><label className="block text-xs font-semibold">Quantity change (+ / −)<input name="quantityDelta" type="number" step="1" required placeholder="e.g. 25 or -2" className={field}/></label></div>
          <div className="grid gap-3 sm:grid-cols-2"><label className="block text-xs font-semibold">Supplier (optional)<select name="supplierId" className={field}><option value="">No supplier selected</option>{(data?.suppliers||[]).filter(s=>s.is_active).map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label><label className="block text-xs font-semibold">Unit cost (₹, optional)<input name="unitCostInr" type="number" min="0" step="1" className={field}/></label></div>
          <label className="block text-xs font-semibold">Invoice / reference (optional)<input name="reference" maxLength={120} className={field}/></label>
          <label className="block text-xs font-semibold">Reason / notes<input name="note" required minLength={3} maxLength={500} placeholder="e.g. Received 25 sealed jars from supplier" className={field}/></label>
          <button className={button} disabled={busy||variants.length===0}>{busy?"Saving…":"Save stock movement"}</button>
        </form>
      </div>
      <form onSubmit={submit("add_variant")} className="grid gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 md:grid-cols-2">
        <div className="md:col-span-2"><h2 className="font-serif text-xl font-bold">Add another size or variant</h2><p className="mt-1 text-xs opacity-65">Add a new pack size under an existing product, for example a second jar size or bag weight.</p></div>
        <label className="block text-xs font-semibold">Existing product<select name="productId" required className={field}><option value="">Choose a product</option>{productChoices.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
        <label className="block text-xs font-semibold">Pack size / variant label<input name="variantLabel" required placeholder="e.g. 1 kg" className={field}/></label>
        <label className="block text-xs font-semibold">SKU<input name="sku" required placeholder="e.g. GHEE-1KG" className={field}/></label>
        <div className="grid grid-cols-2 gap-3"><label className="block text-xs font-semibold">Price (₹)<input name="priceInr" type="number" min="0" step="1" required className={field}/></label><label className="block text-xs font-semibold">Opening stock<input name="openingStock" type="number" min="0" step="1" defaultValue="0" required className={field}/></label></div>
        <div className="md:col-span-2"><button className={button} disabled={busy||productChoices.length===0}>{busy?"Saving…":"Add variant"}</button></div>
      </form>
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-serif text-xl font-bold">Current inventory</h2><p className="mt-1 text-xs opacity-65">Live quantities from the product catalogue.</p></div><label className="text-xs font-semibold">Low-stock threshold<input value={threshold} onChange={e=>setThreshold(e.target.value)} type="number" min="0" step="1" className="ml-2 w-20 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5"/></label></div>
        {!variants.length?<p className="py-8 text-center text-sm opacity-60">No products or variants have been created yet. Use &ldquo;Add a product&rdquo; above when your first product details are ready.</p>:<div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead><tr className="border-b border-[var(--border)] text-xs opacity-60"><th className="p-3">Product</th><th className="p-3">SKU</th><th className="p-3">Price</th><th className="p-3">Stock</th><th className="p-3">Status</th></tr></thead><tbody>{variants.map(v=><tr key={v.variant_id} className="border-b border-[var(--border)] last:border-0"><td className="p-3 font-semibold">{v.name_en}<span className="block text-xs font-normal opacity-60">{v.label}</span></td><td className="p-3 font-mono text-xs">{v.sku}</td><td className="p-3">{money(v.price_inr)}</td><td className="p-3 font-bold">{Number(v.stock_qty).toLocaleString("en-IN")}</td><td className="p-3">{Number(v.stock_qty)<=Math.max(0,Number(threshold)||0)?<span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-900">Low stock</span>:<span className="text-xs opacity-65">Available</span>}</td></tr>)}</tbody></table></div>}
      </section>
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-serif text-xl font-bold">Stock movement history</h2><p className="mt-1 text-xs opacity-65">Latest 150 entries, including opening stock, purchases, sales, adjustments and returns.</p></div><button type="button" className={secondary} onClick={()=>exportCsv([["Date","Product","SKU","Movement","Quantity change","Unit cost","Supplier","Reference","Notes"],...(data?.movements||[]).map(m=>[m.created_at,m.product_name,m.sku,m.movement_type,m.quantity_delta,m.unit_cost_inr,m.supplier_name,m.reference_id,m.note])],"lado-inventory-ledger.csv")}>Export CSV</button></div>
        {!data?.movements.length?<p className="py-6 text-center text-sm opacity-60">No stock movements recorded yet.</p>:<div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-xs"><thead><tr className="border-b border-[var(--border)] opacity-60"><th className="p-3">Date</th><th className="p-3">Product</th><th className="p-3">Type</th><th className="p-3">Change</th><th className="p-3">Supplier / Batch</th><th className="p-3">Notes</th></tr></thead><tbody>{data.movements.map(m=><tr key={m.id} className="border-b border-[var(--border)] last:border-0"><td className="p-3">{date(m.created_at)}</td><td className="p-3 font-semibold">{m.product_name}<span className="block font-mono font-normal opacity-60">{m.sku}</span></td><td className="p-3">{m.movement_type.replace(/_/g," ")}</td><td className={"p-3 font-bold "+(Number(m.quantity_delta)>0?"text-green-700":"text-red-700")}>{Number(m.quantity_delta)>0?"+":""}{m.quantity_delta}</td><td className="p-3">{m.supplier_name||m.batch_code||"—"}</td><td className="max-w-xs p-3">{m.note}</td></tr>)}</tbody></table></div>}
      </section>
    </div>}

    {tab==="suppliers"&&<div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <form onSubmit={submit("create_supplier")} className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="font-serif text-xl font-bold">Add supplier</h2>
        <label className="block text-xs font-semibold">Supplier / contact name<input name="name" required minLength={2} maxLength={160} className={field}/></label>
        <label className="block text-xs font-semibold">Business name<input name="companyName" maxLength={160} className={field}/></label>
        <div className="grid gap-3 sm:grid-cols-2"><label className="block text-xs font-semibold">Contact person<input name="contactName" maxLength={120} className={field}/></label><label className="block text-xs font-semibold">Category<input name="category" defaultValue="general" maxLength={60} className={field}/></label></div>
        <div className="grid gap-3 sm:grid-cols-2"><label className="block text-xs font-semibold">Phone<input name="phone" maxLength={30} className={field}/></label><label className="block text-xs font-semibold">Email<input name="email" type="email" maxLength={254} className={field}/></label></div>
        <label className="block text-xs font-semibold">GST number (optional)<input name="gstNumber" maxLength={15} className={field}/></label>
        <label className="block text-xs font-semibold">Address<input name="address" maxLength={500} className={field}/></label>
        <label className="block text-xs font-semibold">Notes<textarea name="notes" rows={2} maxLength={1000} className={field}/></label>
        <button className={button} disabled={busy}>{busy?"Saving…":"Save supplier"}</button>
      </form>
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"><h2 className="font-serif text-xl font-bold">Supplier directory</h2><p className="mb-4 mt-1 text-xs opacity-65">Supplier contacts are private to authorised staff.</p>{!data?.suppliers.length?<p className="py-8 text-center text-sm opacity-60">No suppliers added yet.</p>:<div className="space-y-3">{data.suppliers.map(s=><article key={s.id} className="rounded-xl border border-[var(--border)] p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-bold">{s.name}</h3><p className="text-xs opacity-65">{s.company_name||s.category}</p><p className="mt-2 text-xs">{s.phone||"No phone"}{s.email?" · "+s.email:""}</p><p className="text-xs opacity-60">{s.gst_number?"GST: "+s.gst_number:"GST not recorded"}</p></div><button type="button" disabled={busy} onClick={()=>void save("update_supplier",{supplierId:s.id,isActive:!s.is_active})} className={secondary}>{s.is_active?"Deactivate":"Reactivate"}</button></div></article>)}</div>}</section>
    </div>}

    {tab==="expenses"&&<div className="space-y-5">
      {!data?.permissions.finance?<div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">Your staff role does not have finance permission. The owner or a manager can access expenses and payment records.</div>:<>
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <form onSubmit={submit("record_expense")} className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h2 className="font-serif text-xl font-bold">Record a business expense</h2>
            <div className="grid gap-3 sm:grid-cols-2"><label className="block text-xs font-semibold">Date<input name="expenseDate" type="date" required defaultValue={new Date().toISOString().slice(0,10)} className={field}/></label><label className="block text-xs font-semibold">Amount (₹)<input name="amountInr" type="number" min="1" step="1" required className={field}/></label></div>
            <label className="block text-xs font-semibold">Category<select name="category" className={field}><option value="raw_materials">Raw materials</option><option value="packaging">Packaging</option><option value="transport">Transport</option><option value="lab_testing">Lab testing</option><option value="utilities">Utilities</option><option value="marketing">Marketing</option><option value="salaries">Salaries</option><option value="maintenance">Maintenance</option><option value="rent">Rent</option><option value="other">Other</option></select></label>
            <div className="grid gap-3 sm:grid-cols-2"><label className="block text-xs font-semibold">Payment method<select name="paymentMethod" className={field}><option value="upi">UPI</option><option value="bank_transfer">Bank transfer</option><option value="cash">Cash</option><option value="card">Card</option></select></label><label className="block text-xs font-semibold">Supplier (optional)<select name="supplierId" className={field}><option value="">Not linked</option>{(data?.suppliers||[]).map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label></div>
            <label className="block text-xs font-semibold">Bill / transaction reference<input name="reference" maxLength={120} className={field}/></label>
            <label className="block text-xs font-semibold">Description<input name="description" required minLength={2} maxLength={500} placeholder="What was this expense for?" className={field}/></label>
            <button className={button} disabled={busy}>{busy?"Saving…":"Save expense"}</button>
          </form>
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-serif text-xl font-bold">Expense records</h2><p className="mt-1 text-xs opacity-65">Latest 150 entries, not a complete statutory accounting statement.</p></div><button type="button" className={secondary} onClick={()=>exportCsv([["Date","Category","Amount INR","Payment","Supplier","Reference","Description"],...(data?.expenses||[]).map(e=>[e.expense_date,e.category,e.amount_inr,e.payment_method,e.supplier_name,e.reference,e.description])],"lado-business-expenses.csv")}>Export CSV</button></div>
            <p className="mb-4 text-2xl font-serif font-bold">{money(data?.summary.expensesInr)} <span className="text-xs font-normal opacity-60">sum of latest 150 entries</span></p>
            {!data?.expenses.length?<p className="py-8 text-center text-sm opacity-60">No expenses recorded yet.</p>:<div className="space-y-2">{data.expenses.map(e=><article key={e.id} className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-[var(--border)] p-3"><div><p className="font-semibold">{e.description}</p><p className="text-xs opacity-60">{date(e.expense_date)} · {e.category.replace(/_/g," ")} · {e.payment_method.replace(/_/g," ")}{e.supplier_name?" · "+e.supplier_name:""}</p></div><strong>{money(e.amount_inr)}</strong></article>)}</div>}
          </section>
        </div>
      </>}
    </div>}

    {tab==="batches"&&<div className="space-y-5">
      <form onSubmit={submit("create_batch")} className="grid gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 md:grid-cols-2">
        <div className="md:col-span-2"><h2 className="font-serif text-xl font-bold">Create a production batch</h2><p className="mt-1 text-xs opacity-65">Enter real production and quality details only. A batch stays unpublished until the owner or manager confirms it is verified.</p></div>
        <label className="block text-xs font-semibold">Batch code<input name="batchCode" required minLength={4} maxLength={40} placeholder="e.g. LO-GHEE-2026-001" className={field}/></label>
        <label className="block text-xs font-semibold">Product variant<select name="variantId" required className={field}><option value="">Choose product / size</option>{variants.map(v=><option key={v.variant_id} value={v.variant_id}>{v.name_en} · {v.label}</option>)}</select></label>
        <label className="block text-xs font-semibold">Production date<input name="productionDate" type="date" required className={field}/></label>
        <label className="block text-xs font-semibold">Packaging date<input name="packagingDate" type="date" className={field}/></label>
        <label className="block text-xs font-semibold">Best before date (if applicable)<input name="bestBeforeDate" type="date" className={field}/></label>
        <label className="block text-xs font-semibold">Quantity produced (units)<input name="quantityProduced" type="number" min="0" step="1" defaultValue="0" required className={field}/></label>
        <label className="block text-xs font-semibold md:col-span-2">Production process<textarea name="productionProcess" required minLength={5} maxLength={2000} rows={2} className={field}/></label>
        <label className="block text-xs font-semibold md:col-span-2">Quality checks<textarea name="qualityChecks" required minLength={5} maxLength={2000} rows={2} className={field}/></label>
        <label className="block text-xs font-semibold md:col-span-2">Storage instructions<textarea name="storageInstructions" required minLength={3} maxLength={1000} rows={2} className={field}/></label>
        <label className="block text-xs font-semibold md:col-span-2">Verified lab report URL (optional)<input name="labReportUrl" type="url" placeholder="https://…" className={field}/></label>
        <label className="flex items-start gap-2 text-xs md:col-span-2"><input name="approveBatch" type="checkbox" value="true" className="mt-0.5"/> I have verified these batch details and approve this record for public QR traceability.</label>
        <p className="text-xs opacity-60 md:col-span-2">If quantity produced is above zero, that amount is added to the selected variant&apos;s live stock and recorded in the stock ledger. Do not enter planned or estimated production as completed stock.</p>
        <div className="md:col-span-2"><button className={button} disabled={busy||variants.length===0}>{busy?"Saving…":"Save production batch"}</button></div>
      </form>
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"><h2 className="mb-4 font-serif text-xl font-bold">Batch register</h2>{!data?.batches.length?<p className="py-8 text-center text-sm opacity-60">No production batches have been entered yet.</p>:<div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-xs"><thead><tr className="border-b border-[var(--border)] opacity-60"><th className="p-3">Batch</th><th className="p-3">Product</th><th className="p-3">Production date</th><th className="p-3">Quantity</th><th className="p-3">Traceability</th></tr></thead><tbody>{data.batches.map(b=><tr key={b.id} className="border-b border-[var(--border)] last:border-0"><td className="p-3 font-mono font-bold">{b.batch_code}</td><td className="p-3">{b.product_name}<span className="block opacity-60">{b.variant_label}</span></td><td className="p-3">{date(b.production_date)}</td><td className="p-3">{Number(b.quantity_produced).toLocaleString("en-IN")}</td><td className="p-3">{b.is_approved?<span className="font-bold text-green-700">Published</span>:<span className="font-bold text-amber-700">Draft / not public</span>}</td></tr>)}</tbody></table></div>}</section>
    </div>}

    {tab==="activity"&&<section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"><h2 className="font-serif text-xl font-bold">Admin activity log</h2><p className="mb-4 mt-1 text-xs opacity-65">Latest 50 recorded administrative actions. This is an audit trail, not a replacement for statutory books.</p>{!data?.audit.length?<p className="py-8 text-center text-sm opacity-60">No admin activity has been recorded yet.</p>:<div className="space-y-2">{data.audit.map(a=><article key={a.id} className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--border)] py-3 last:border-0"><div><p className="font-semibold">{a.action.replace(/_/g," ")}</p><p className="text-xs opacity-60">{a.entity_type}{a.entity_id?" · "+a.entity_id:""}</p></div><time className="text-xs opacity-60">{new Date(a.created_at).toLocaleString("en-IN")}</time></article>)}</div>}</section>}
    <p className="text-xs opacity-55">Private admin workspace. Product and stock updates affect the live catalogue. Payment verification, refunds and order processing remain in their dedicated Orders & Payments section.</p>
  </div>;
}
