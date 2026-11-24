const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

console.log("🚀 Initiating Lado Organics Vercel Pre-Flight Checks...
");

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
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "RAZORPAY_WEBHOOK_SECRET"
];

let errors = 0;

requiredEnvs.forEach(env => {
  if (!process.env[env]) {
    console.error(`❌ MISSING SECRET: ${env}`);
    errors++;
  } else {
    console.log(`✅ FOUND: ${env}`);
  }
});

optionalEnvs.forEach(env => {
  console.log(process.env[env] ? `ℹ️ CONFIGURED: ${env}` : `ℹ️ OPTIONAL: ${env} not set`);
});

if (errors > 0) {
  console.error(`
🚨 Pre-flight failed. You must add ${errors} missing secrets to Vercel before deploying.`);
  process.exit(1);
} else {
  console.log("
✅ All critical secrets verified. Ready for Vercel production deployment.");
  process.exit(0);
}
