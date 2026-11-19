import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __ladoPgPool: Pool | undefined;
}

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured in environment variables.");
  }

  const useSsl =
    process.env.PGSSLMODE === "require" ||
    connectionString.includes("supabase.co") ||
    process.env.NODE_ENV === "production";

  return new Pool({
    connectionString,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
    max: 10
  });
}

export const db: Pool =
  globalThis.__ladoPgPool ??
  (globalThis.__ladoPgPool = createPool());
