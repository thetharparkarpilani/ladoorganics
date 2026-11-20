# Configuration, Security & Deployment Guide — Lado Organics 2.0

## 1. Environment Variables (`.env.local`)
Copy `.env.example` to `.env.local` (never commit `.env.local` to GitHub):
- `NEXT_PUBLIC_SITE_URL=https://ladoorganics.in`
- `NEXT_PUBLIC_WHATSAPP_NUMBER=919636100337`
- `DATABASE_URL` — PostgreSQL connection string (Supabase Postgres or managed PostgreSQL)
- `ADMIN_ACCESS_TOKEN` — Strong random secret used server-side by `/api/dashboard?mode=admin` and `/api/admin/records`
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` — Server-side Razorpay credentials for webhook verification (`/api/payments/webhook`)
- `OPENAI_API_KEY`, `OPENAI_MODEL` — Optional server-side OpenAI credentials for `/api/concierge`

## 2. Database Setup (PostgreSQL)
Apply the SQL files sequentially:
1. `db/migrations/001_init.sql`
2. `db/migrations/002_ecosystem_modules.sql`
3. `db/migrations/003_traceability_and_payments.sql`
4. `db/migrations/004_corporate_and_subscriptions.sql`
5. `db/seed.sql`

## 3. Payment & Webhook Setup
- Configure your Razorpay webhook endpoint to `https://ladoorganics.in/api/payments/webhook`.
- Subscribe to `payment.captured`, `payment.failed`, `order.paid`, and `refund.processed`.
- Keep `RAZORPAY_WEBHOOK_SECRET` strictly in server environment variables. Browser-only payment messages are never trusted.

## 4. GitHub & Vercel Deployment (Safe Cutover)
- Never run `git push --force` against `main`.
- Connect the GitHub repository (`thetharparkarpilani/ladoorganics`) to Vercel.
- Add all production environment variables in Vercel Project Settings -> Environment Variables.
- Verify the Vercel preview deployment (`/`, `/trace/LO-PILANI-SAMPLE-001`, `/dashboard`, `/policies`, `/api/health`) before pointing `ladoorganics.in` DNS records to Vercel with HTTPS enabled.
