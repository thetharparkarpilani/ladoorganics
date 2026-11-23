"use client";
import React, { useEffect, useState } from "react";
import AdminEmailTemplates from "@/components/AdminEmailTemplates";
import { getAdminClientToken } from "@/lib/admin-client";
export default function AdminCommunicationsPage() {
  const [token, setToken] = useState("");
  useEffect(() => { let active=true; void getAdminClientToken().then(value=>{if(active)setToken(value);}); return ()=>{active=false;}; }, []);
  return <div><header><p className="text-xs uppercase tracking-[.2em] text-[var(--terracotta)]">Lado Command · Customer care</p><h1 className="mt-2 font-serif text-3xl font-bold">Communications</h1><p className="mt-2 text-sm opacity-70">Manage the email templates used for customer notifications.</p></header>{token ? <AdminEmailTemplates adminToken={token}/> : <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"><p className="text-sm">Unlock admin access on the main admin page first.</p><a href="/admin" className="primary-btn mt-4 inline-flex rounded-xl px-5 py-2">Open Admin Login</a></div>}</div>;
}
