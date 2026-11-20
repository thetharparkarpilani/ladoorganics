const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

console.log("🚀 Initiating Lado Organics Vercel Pre-Flight Checks...\n");

const requiredEnvs = [
  "DATABASE_URL",
  "ADMIN_ACCESS_TOKEN",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "RAZORPAY_WEBHOOK_SECRET",
  "NEXT_PUBLIC_SITE_URL"
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

if (errors > 0) {
  console.error(`\n🚨 Pre-flight failed. You must add ${errors} missing secrets to Vercel before deploying.`);
  process.exit(1);
} else {
  console.log("\n✅ All critical secrets verified. Ready for Vercel production deployment.");
  process.exit(0);
}
