require('dotenv').config({ path: '.env.local' });

console.log("Lado Organics Vercel pre-flight checks...\\n");

const requiredEnvs = [
  "DATABASE_URL",
  "ADMIN_ACCESS_TOKEN",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_SITE_URL"
];

const optionalEnvs = [
  "SMTP_HOST",
  "SMTP_USER",
  "SMTP_PASS",
  "ADMIN_NOTIFICATION_EMAIL",
  "OPENAI_API_KEY",
  "NEXT_PUBLIC_UPI_ID",
  "NEXT_PUBLIC_WHATSAPP_NUMBER",
  "BHUNGA_NIGHTLY_RATE_INR",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "RAZORPAY_WEBHOOK_SECRET"
];

let errors = 0;

for (const env of requiredEnvs) {
  if (!process.env[env]) {
    console.error("MISSING REQUIRED CONFIGURATION: " + env);
    errors++;
  } else {
    console.log("CONFIGURED: " + env);
  }
}

for (const env of optionalEnvs) {
  console.log((process.env[env] ? "OPTIONAL CONFIGURED: " : "OPTIONAL NOT SET: ") + env);
}

if (errors > 0) {
  console.error("\\nPre-flight failed: " + errors + " required environment variables are missing.");
  process.exit(1);
}

console.log("\\nAll required environment variables are present.");
