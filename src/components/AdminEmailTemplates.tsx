"use client";

import React, { useState, useEffect } from "react";

interface EmailTemplate {
  id: string;
  subject: string;
  html_content: string;
  updated_at: string;
}

export default function AdminEmailTemplates({ adminToken }: { adminToken: string }) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [activeTemplate, setActiveTemplate] = useState<EmailTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/templates", { headers: { "x-admin-token": adminToken } })
      .then(res => res.json())
      .then(data => {
        setTemplates(data.templates || []);
        if (data.templates?.length > 0) setActiveTemplate(data.templates[0]);
        setLoading(false);
      });
  }, [adminToken]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTemplate) return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/templates", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "x-admin-token": adminToken 
        },
        body: JSON.stringify(activeTemplate)
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      setMessage({ type: "ok", text: "Template securely updated." });
    } catch {
      setMessage({ type: "err", text: "Failed to save template." });
    } finally {
      setSaving(false);
    }
  };

if (loading) return <div className="animate-pulse p-8">Loading communications matrix...</div>;

  return (
    <div className="bg-[var(--bg-ivory)] rounded-2xl border border-[var(--border-light)] p-6 shadow-sm mt-8">
      <h3 className="text-xl font-serif font-bold text-[var(--text-charcoal)] mb-6">Communication Templates</h3>
      
      <div className="grid md:grid-cols-4 gap-8">
        <div className="md:col-span-1 space-y-2">
          {templates.map(t => (
            <button
              key={t.id}
              onClick={() => { setActiveTemplate(t); setMessage(null); }}
              className={`w-full text-left p-3 rounded-xl text-sm font-bold transition ${activeTemplate?.id === t.id ? "bg-[var(--accent-forest)] text-white" : "bg-[var(--bg-sand)] text-[var(--text-muted)] hover:bg-[var(--border-light)]"}`}
            >
              {t.id.replace("_", " ").toUpperCase()}
            </button>
          ))}
        </div>

        <div className="md:col-span-3">
          {activeTemplate && (
            <form onSubmit={handleSave} className="space-y-4">
              {message && (
                <div className={`p-4 rounded-xl text-sm font-bold ${message.type === "ok" ? "bg-green-50 text-green-900" : "bg-red-50 text-red-900"}`}>
                  {message.text}
                </div>
              )}
              
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2 block">Subject Line</label>
                <input
                  type="text"
                  value={activeTemplate.subject}
                  onChange={e => setActiveTemplate({...activeTemplate, subject: e.target.value})}
                  className="w-full p-3 rounded-xl border border-[var(--border-light)] bg-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2 block">HTML Content (Use {'{{name}}'} for variables)</label>
                <textarea
                  rows={8}
                  value={activeTemplate.html_content}
                  onChange={e => setActiveTemplate({...activeTemplate, html_content: e.target.value})}
                  className="w-full p-3 rounded-xl border border-[var(--border-light)] bg-white font-mono text-xs"
                  required
                />
              </div>

              <button type="submit" disabled={saving} className="btn-forest px-8 py-3 rounded-xl font-bold text-sm">
                {saving ? "Saving..." : "Save Template"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
