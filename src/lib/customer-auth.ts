import { NextRequest } from "next/server";
import { db } from "@/lib/db";

export type CustomerIdentity = { authUserId: string; email: string; fullName: string; databaseUserId: string };

export async function getCustomerIdentity(req: NextRequest): Promise<CustomerIdentity | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const accessToken = req.cookies.get("lado_sb_access")?.value;
  if (!supabaseUrl || !supabaseKey || !accessToken) return null;

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { apikey: supabaseKey, Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!response.ok) return null;

  const user = await response.json();
  const email = typeof user.email === "string" ? user.email.trim().toLowerCase() : "";
  if (!user.id || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  const metadata = user.user_metadata || {};
  const fullName = String(metadata.full_name || metadata.name || email.split("@")[0] || "Customer").trim().slice(0, 100) || "Customer";

  // Preserve the customer's chosen profile name. Google metadata is used only
  // when a database identity must be created for the first time.
  let result = await db.query("SELECT id, full_name FROM users WHERE lower(email) = lower($1) LIMIT 1", [email]);
  if (!result.rows[0]?.id) {
    await db.query(
      `INSERT INTO users (email, full_name, role)
       VALUES ($1, $2, 'customer')
       ON CONFLICT (email) DO NOTHING`,
      [email, fullName]
    );
    result = await db.query("SELECT id, full_name FROM users WHERE lower(email) = lower($1) LIMIT 1", [email]);
  }

  if (!result.rows[0]?.id) throw new Error("Unable to map the signed-in customer account.");
  return {
    authUserId: String(user.id),
    email,
    fullName: String(result.rows[0].full_name || fullName),
    databaseUserId: String(result.rows[0].id),
  };
}
