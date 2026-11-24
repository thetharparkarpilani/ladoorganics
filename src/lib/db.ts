import "server-only";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;
const isProduction = process.env.NODE_ENV === "production";
const supabaseCaCert = process.env.SUPABASE_CA_CERT;

function getConnectionString() {
  if (!databaseUrl) return undefined;

  // node-postgres lets SSL query parameters in the URL override the ssl
  // object. Remove them so the explicitly trusted CA below is always used.
  const url = new URL(databaseUrl);
  ["sslmode", "sslcert", "sslkey", "sslrootcert"].forEach((key) => {
    url.searchParams.delete(key);
  });
  return url.toString();
}

const pool = new Pool({
  ...(databaseUrl ? { connectionString: getConnectionString() } : {}),
  max: 3,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  statement_timeout: 15000,
  query_timeout: 20000,
  application_name: "lado-organics-web",
  ssl: isProduction
    ? { ca: supabaseCaCert, rejectUnauthorized: true }
    : undefined,
});

pool.on("error", (error) => {
  // Do not let an idle pooled-client error crash a serverless invocation.
  console.error("Unexpected PostgreSQL pool error:", error);
});

function assertDatabaseConfigured() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured for this deployment.");
  }
  // Validate at query time, not module import time: Next.js imports API
  // route modules during build-time page-data collection.
  if (isProduction && !supabaseCaCert) {
    throw new Error("SUPABASE_CA_CERT is not configured for this production deployment.");
  }
}

export const db = {
  query: async (text: string, params?: (string | number | boolean | Date | null)[]) => {
    assertDatabaseConfigured();
    return pool.query(text, params);
  },
  getClient: async () => {
    assertDatabaseConfigured();
    return pool.connect();
  },
};
