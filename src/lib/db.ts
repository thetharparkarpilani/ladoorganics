import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;
const pool = new Pool({
  ...(databaseUrl ? { connectionString: databaseUrl } : {}),
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
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
