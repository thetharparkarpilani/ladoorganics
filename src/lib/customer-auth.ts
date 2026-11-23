import { NextRequest } from "next/server";
import { db } from "@/lib/db";

export type CustomerIdentity = {
  authUserId: string;
  email: string;
  fullName: string;
  databaseUserId: string;
};

/**
 * Verify the Supabase access token from the HttpOnly cookie and map the
 * verified identity to the legacy PostgreSQL users table.
 * Never trust an email or user ID supplied in the request body/query string.
 */
export async function getCustomerIdentity(req: NextRequest): Promise<CustomerIdentity | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const accessToken = req.cookies.get("lado_sb_access")?.value;

  if (!supabaseUrl || !supabaseKey || !accessToken) return null;

  const response = await fetch(\`\${supabaseUrl}/auth/v1/user\`, {
    headers: {
      apikey: supabaseKey,
      Authorization: \`Bearer \${accessToken}\`,
    },
    cache: "no-store",
  });

  if (!response.ok) return null;

  const user = await response.json();
  const email = typeof user.email === "string" ? user.email.trim().toLowerCase() : "";
  if (!user.id || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;

  const metadata = user.user_metadata || {};
  const fullName = String(
    metadata.full_name || metadata.name || email.split("@")[0] || "Customer"
  ).trim().slice(0, 100) || "Customer";

  const result = await db.query(
    \`INSERT INTO users (email, full_name, role)
     VALUES ($1, $2, 'customer')
     ON CONFLICT (email) DO UPDATE
       SET full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), users.full_name)
     RETURNING id\`,
    [email, fullName]
  );

  if (!result.rows[0]?.id) throw new Error("Unable to map the signed-in customer account.");

  return {
    authUserId: String(user.id),
    email,
    fullName,
    databaseUserId: String(result.rows[0].id),
  };
}
