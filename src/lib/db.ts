import "server-only";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

const pool = new Pool({
  ...(databaseUrl ? { connectionString: databaseUrl } : {}),
  max: 3,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  statement_timeout: 15000,
  query_timeout: 20000,
  application_name: "lado-organics-web",
});

pool.on("error", (error) => {
  // Do not let an idle pooled-client error crash a serverless invocation.
  console.error("Unexpected PostgreSQL pool error:", error);
});

function assertDatabaseConfigured() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured for this deployment.");
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
