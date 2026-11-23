import { NextRequest,NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
export const runtime="nodejs";
export async function GET(req:NextRequest){const actor=await getAdminSession(req);if(!actor)return NextResponse.json({error:"Sign in with an approved staff Google account."},{status:401});return NextResponse.json({ok:true,actor},{headers:{"Cache-Control":"no-store"}});}
