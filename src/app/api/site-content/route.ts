import { NextResponse } from "next/server";
import { db } from "@/lib/db";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(){try{const result=await db.query("SELECT content_key,title,body FROM site_content WHERE is_published=TRUE AND body <> ''");return NextResponse.json({items:result.rows},{headers:{"Cache-Control":"no-store"}});}catch(error){console.error("Public site content unavailable:",error);return NextResponse.json({items:[]},{headers:{"Cache-Control":"no-store"}});}}
