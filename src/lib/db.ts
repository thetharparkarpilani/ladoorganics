import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __ladoPgPool: Pool | undefined;
}

function getPool(): Pool {
  if (globalThis.__ladoPgPool) {
    return globalThis.__ladoPgPool;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not configured. Add it to your server environment before using database features."
    );
  }

  const useSsl =
    process.env.PGSSLMODE === "require" ||
    connectionString.includes("supabase.co") ||
    process.env.NODE_ENV === "production";

  const pool = new Pool({
    connectionString,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
    max: 10
  });

  globalThis.__ladoPgPool = pool;

  return pool;
}

// The pool is created only when a database property is accessed.
export const db: Pool = new Proxy({} as Pool, {
  get(_target, property) {
    const pool = getPool();
    const value = Reflect.get(pool, property, pool);

    return typeof value === "function"
      ? value.bind(pool)
      : value;
  }
});