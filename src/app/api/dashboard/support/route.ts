import { NextRequest,NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCustomerIdentity } from "@/lib/customer-auth";
export const runtime="nodejs";
export async function GET(req:NextRequest){try{const customer=await getCustomerIdentity(req);if(!customer)return NextResponse.json({error:"Please sign in to view your support requests."},{status:401});const result=await db.query("SELECT id,subject,status,priority,created_at,updated_at FROM support_tickets WHERE customer_user_id=$1 ORDER BY created_at DESC LIMIT 50",[customer.databaseUserId]);return NextResponse.json({tickets:result.rows},{headers:{"Cache-Control":"no-store"}});}catch(error){console.error("Customer support history failed:",error);return NextResponse.json({error:"Support history is temporarily unavailable."},{status:503});}}
