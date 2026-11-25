"use client";
import React,{useEffect,useState} from "react";
import { usePathname } from "next/navigation";
export default function SiteAnnouncement(){const pathname=usePathname();const [item,setItem]=useState<{title:string;body:string}|null>(null);useEffect(()=>{if(pathname.startsWith("/admin"))return;fetch("/api/site-content",{cache:"no-store"}).then(r=>r.json()).then(d=>{const found=(d.items||[]).find((x:{content_key:string})=>x.content_key==="announcement");if(found?.body)setItem(found);}).catch(()=>undefined);},[pathname]);if(pathname.startsWith("/admin")||!item)return null;return <aside aria-label="Lado Organics announcement" className="w-full bg-[#294b35] px-4 py-2 text-center text-sm text-[#fff8e9]"><strong>{item.title}</strong>{item.body?" — "+item.body:""}</aside>;}
