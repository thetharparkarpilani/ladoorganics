"use client";
import React, { useEffect, useState } from "react";
import AdminProductInventory from "@/components/AdminProductInventory";
import { getAdminClientToken } from "@/lib/admin-client";
export default function AdminInventoryPage() {
  const [token, setToken] = useState("");
  useEffect(() => { let active=true; void getAdminClientToken().then(value=>{if(active)setToken(value);}); return ()=>{active=false;}; }, []);
  return <div className="space-y-5"><header><p className="text-xs uppercase tracking-[.2em] text-[var(--terracotta)]">Lado Command · Catalogue</p><h1 className="mt-2 font-serif text-3xl font-bold">Product & Inventory</h1><p className="mt-2 text-sm opacity-70">Manage product availability, variant pricing, stock and product imagery.</p></header>{token ? <AdminProductInventory adminToken={token}/> : <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"><p className="text-sm">Unlock admin access on the main admin page first.</p><a href="/admin" className="primary-btn mt-4 inline-flex rounded-xl px-5 py-2">Open Admin Login</a></div>}</div>;
}
