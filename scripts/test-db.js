const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is missing in .env.local");
    process.exit(1);
  }
  
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const client = await pool.connect();
    console.log("✅ PostgreSQL Connection Successful!");
    const res = await client.query("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'");
    console.log(`✅ Found ${res.rows[0].count} tables in the public schema.`);
    client.release();
    process.exit(0);
  } catch (err) {
    console.error("❌ Database Connection Failed:", err.message);
    process.exit(1);
  }
}
testConnection();
