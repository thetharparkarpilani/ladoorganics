"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

interface CommandPaletteProps {
  whatsappNumber: string;
  onToggleTheme: () => void;
  onOpenBag: () => void;
}

interface PaletteAction {
  id: string;
  label: string;
  category: string;
  run: () => void;
}

export default function CommandPalette({
  whatsappNumber,
  onToggleTheme,
  onOpenBag
}: CommandPaletteProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const actions: PaletteAction[] = useMemo(
    () => [
      {
        id: "store",
        category: "Shop",
        label: "Jump to The Circular Store (A2 Ghee, Dhoop, Kechua Khad)",
        run: () => document.getElementById("store")?.scrollIntoView({ behavior: "smooth" })
      },
      {
        id: "ghee-pdp",
        category: "Product",
        label: "Open A2 Bilona Ghee Product Detail Page (₹5,000 / 1L)",
        run: () => router.push("/products/a2-bilona-ghee")
      },
      {
        id: "bag",
        category: "Shop",
        label: "Open Shopping Bag & Order Request Drawer",
        run: onOpenBag
      },
      {
        id: "essentials",
        category: "Club",
        label: "Jump to Lado Monthly Essentials Club & A1/A2 Table",
        run: () => document.getElementById("essentials-club")?.scrollIntoView({ behavior: "smooth" })
      },
      {
        id: "experience",
        category: "Pilani",
        label: "Build Your Own Farm Experience & Bhunga Stay (₹4,000/Night)",
        run: () => document.getElementById("build-experience")?.scrollIntoView({ behavior: "smooth" })
      },
      {
        id: "trace",
        category: "Transparency",
        label: "Verify QR Product Batch (LO-PILANI-SAMPLE-001)",
        run: () => router.push("/trace/LO-PILANI-SAMPLE-001")
      },
      {
        id: "journey",
        category: "Account",
        label: "Open My Lado Journey & Admin Operations",
        run: () => router.push("/dashboard")
      },
      {
        id: "corporate",
        category: "B2B",
        label: "Jump to Corporate Gifting & Bulk Enquiries",
        run: () => document.getElementById("corporate")?.scrollIntoView({ behavior: "smooth" })
      },
      {
        id: "theme",
        category: "Theme",
        label: "Toggle Sand / Desert Dusk Theme",
        run: onToggleTheme
      },
      {
        id: "whatsapp",
        category: "Support",
        label: "Chat on WhatsApp (+91 96361 00337)",
        run: () => window.open(`https://wa.me/${whatsappNumber}`, "_blank", "noopener,noreferrer")
      }
    ],
    [router, onOpenBag, onToggleTheme, whatsappNumber]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter(
      (a) => a.label.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)
    );
  }, [actions, query]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Quick Command Palette"
      onClick={() => setOpen(false)}
      className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center pt-20 px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[var(--surface)] text-[var(--mud)] border border-[var(--border)] rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-4 border-b border-[var(--border)] flex items-center gap-3">
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a destination or action (e.g. Ghee, Trace, Journey)..."
            className="flex-1 bg-transparent text-sm focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-xs font-mono px-2.5 py-1 rounded border border-[var(--border)] cursor-pointer"
          >
            ESC
          </button>
        </div>

        <ul className="max-h-80 overflow-y-auto divide-y divide-[var(--border)] text-xs">
          {filtered.length === 0 ? (
            <li className="p-6 text-center opacity-70">No matching commands.</li>
          ) : (
            filtered.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setQuery("");
                    item.run();
                  }}
                  className="w-full text-left px-5 py-3.5 hover:bg-[var(--bg)] flex items-center justify-between gap-3 cursor-pointer"
                >
                  <span className="font-semibold">{item.label}</span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-[var(--border)] opacity-75">
                    {item.category}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
