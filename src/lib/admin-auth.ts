import crypto from "crypto";
import { NextRequest } from "next/server";
import { db } from "@/lib/db";

export type AdminCapability = "dashboard" | "analytics" | "operations" | "inventory" | "support" | "content" | "communications" | "staff";
export type AdminActor = { email: string; role: "owner" | "manager" | "orders" | "inventory" | "support" | "content" | "communications" | "viewer" };

function safeEqual(aValue: string, bValue: string) {
  const a=Buffer.from(aValue,"utf8");const b=Buffer.from(bValue,"utf8");
  return a.length===b.length&&crypto.timingSafeEqual(a,b);
}

const ROLE_CAPABILITIES: Record<Exclude<AdminActor["role"],"owner">,AdminCapability[]> = {
  manager:["dashboard","analytics","operations","inventory","support","content","communications","staff"],
  orders:["dashboard","analytics","operations"],
  inventory:["dashboard","analytics","inventory"],
  support:["dashboard","support"],
  content:["dashboard","content"],
  communications:["dashboard","communications"],
  viewer:["dashboard","analytics"],
};

export async function getAdminActor(req:NextRequest, capability:AdminCapability):Promise<AdminActor|null>{
  const expected=process.env.ADMIN_ACCESS_TOKEN||"";
  const header=req.headers.get("x-admin-token")||"";
  const bearer=(req.headers.get("authorization")||"").replace(/^Bearer\s+/i,"");
  if(expected&&(header&&safeEqual(header,expected)||bearer&&safeEqual(bearer,expected)))return {email:"owner",role:"owner"};

  const accessToken=req.cookies.get("lado_sb_access")?.value;
  const supabaseUrl=process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/,"");
  const supabaseKey=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if(!accessToken||!supabaseUrl||!supabaseKey)return null;
  try{
    const identity=await fetch(supabaseUrl+"/auth/v1/user",{headers:{apikey:supabaseKey,Authorization:"Bearer "+accessToken},cache:"no-store"});
    if(!identity.ok)return null;
    const user=await identity.json();
    const email=typeof user.email==="string"?user.email.trim().toLowerCase():"";
    if(!email)return null;
    const result=await db.query("SELECT role FROM staff_accounts WHERE lower(email)=lower($1) AND is_active=TRUE LIMIT 1",[email]);
    const role=result.rows[0]?.role as AdminActor["role"]|undefined;
    if(!role||role==="owner")return null;
    if(!ROLE_CAPABILITIES[role as Exclude<AdminActor["role"],"owner">]?.includes(capability))return null;
    return {email,role};
  }catch(error){console.error("Staff authorization failed:",error);return null;}
}

export async function getAdminSession(req:NextRequest){
  const token=req.headers.get("x-admin-token")||"";
  const expected=process.env.ADMIN_ACCESS_TOKEN||"";
  if(expected&&token&&safeEqual(token,expected))return {email:"owner",role:"owner" as const};
  const accessToken=req.cookies.get("lado_sb_access")?.value;
  const supabaseUrl=process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/,"");
  const supabaseKey=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if(!accessToken||!supabaseUrl||!supabaseKey)return null;
  try{
    const identity=await fetch(supabaseUrl+"/auth/v1/user",{headers:{apikey:supabaseKey,Authorization:"Bearer "+accessToken},cache:"no-store"});
    if(!identity.ok)return null;
    const user=await identity.json();
    const email=typeof user.email==="string"?user.email.trim().toLowerCase():"";
    if(!email)return null;
    const result=await db.query("SELECT role FROM staff_accounts WHERE lower(email)=lower($1) AND is_active=TRUE LIMIT 1",[email]);
    const role=result.rows[0]?.role as AdminActor["role"]|undefined;
    return role?{email,role}:null;
  }catch{return null;}
}
