"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type Announcement = { title: string; body: string };

export default function SiteAnnouncement() {
  const pathname = usePathname();
  const [item, setItem] = useState<Announcement | null>(null);

  useEffect(() => {
    if (pathname.startsWith("/admin")) {
      setItem(null);
      return;
    }

    const controller = new AbortController();
    let active = true;

    fetch("/api/site-content", { cache: "no-store", signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error("Announcement unavailable");
        return response.json();
      })
      .then(data => {
        if (!active) return;
        const items = Array.isArray(data?.items) ? data.items : [];
        const found = items.find((entry: unknown) =>
          !!entry && typeof entry === "object"
          && (entry as { content_key?: unknown }).content_key === "announcement"
          && typeof (entry as { body?: unknown }).body === "string"
        ) as { title?: unknown; body: string } | undefined;

        if (!found || !found.body.trim()) {
          setItem(null);
          return;
        }
        setItem({
          title: typeof found.title === "string" && found.title.trim() ? found.title.trim() : "Lado Organics",
          body: found.body.trim(),
        });
      })
      .catch(error => {
        if (active && error?.name !== "AbortError") setItem(null);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [pathname]);

  if (pathname.startsWith("/admin") || !item) return null;

  return (
    <aside aria-label="Lado Organics announcement" className="w-full bg-[#294b35] px-4 py-2 text-center text-sm text-[#fff8e9]">
      <strong>{item.title}</strong>
      {item.body ? <> — {item.body}</> : null}
    </aside>
  );
}
