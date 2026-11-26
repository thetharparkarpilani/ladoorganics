# Lado Organics — Configuration, Database & Deployment

## 1. Environment variables

Use `.env.local` for local development and Vercel Project Settings → Environment Variables for hosted deployments. Never commit real credentials or certificate contents.

Configure the variables in `.env.example` for the environments in which each feature is enabled:

- `NEXT_PUBLIC_SITE_URL`: canonical public website URL.
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: WhatsApp number in international digits, without spaces or a plus sign.
- `NEXT_PUBLIC_UPI_ID`: optional UPI payee ID used to construct a payment link for manual UPI checkout.
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Supabase Auth and browser-safe project configuration.
- `DATABASE_URL`: server-only PostgreSQL connection string. For Supabase, use the connection/pooler URL appropriate for the Vercel runtime.
- `SUPABASE_CA_CERT`: the Supabase PostgreSQL root CA PEM certificate. Required by the production PostgreSQL connection. Preserve the complete PEM including the BEGIN/END lines. Do not disable certificate verification.
- `RATE_LIMIT_SECRET`: optional dedicated secret for HMAC-based IP hashing. If omitted, the server uses the server-only database URL as the HMAC key.
- `OPENAI_API_KEY` and `OPENAI_MODEL`: optional server-side Lado AI generation configuration. Built-in verified FAQ and catalogue answers can work without an OpenAI key; open-ended generative answers require a valid key.
- `ADMIN_ACCESS_TOKEN`: optional owner break-glass credential. Normal staff access uses Supabase Auth plus an active `staff_accounts` record and role capabilities. Keep this secret server-side.
- `ADMIN_NOTIFICATION_EMAIL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`: optional outbound email and admin notification settings.
- `BHUNGA_NIGHTLY_RATE_INR`: configured base nightly rate used by stay request calculations.
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`: reserved for a future fully enabled Razorpay checkout integration. The current customer checkout intentionally supports Cash on Delivery and manually verified UPI; the Razorpay create-order endpoint remains disabled.

Never expose `DATABASE_URL`, `SUPABASE_CA_CERT`, `RATE_LIMIT_SECRET`, `ADMIN_ACCESS_TOKEN`, OpenAI credentials, SMTP credentials or payment secrets through `NEXT_PUBLIC_*` variables or client-side code.

## 2. Database migrations

The application's SQL migration source is `db/migrations/`. The migration history has evolved and includes legacy-named files; do not rely on the obsolete short list from earlier setup notes, and do not blindly re-run SQL against production.

Before changing a database:
1. Inspect the target Supabase project's migration history and compare it with the repository's migration files.
2. Identify only the migrations that are genuinely outstanding, including the later security, checkout, rate-limit, booking-expiry and corporate-enquiry changes.
3. Review each pending SQL file and its dependencies before applying it.
4. Apply approved migrations in their intended order, then verify the resulting schema and policies.
5. Do not run seed data or destructive/altering SQL against production without an explicit backup and approval.

The `supabase/migrations/` directory is not the application's current migration source; the checked-in application migrations are under `db/migrations/`.

## 3. Checkout and payments

The active storefront checkout supports:
- Cash on Delivery.
- Manual UPI, with payment status remaining pending until the Lado team verifies receipt.

Order prices and stock are recalculated on the server from the live product catalogue. Browser-submitted prices are not trusted. An order request is not a dispatch or delivery promise. Delivery fees and timing must be confirmed with the customer before dispatch.

Razorpay routes are intentionally closed until the order-reservation, capture, refund and webhook lifecycle is fully enabled and tested. Do not configure a live Razorpay webhook expecting the current checkout to accept gateway payments.

## 4. Lado AI

Lado AI uses the shared PostgreSQL rate-limit table before answering. It can answer built-in verified knowledge and live catalogue questions without OpenAI. Open-ended answers require `OPENAI_API_KEY` and a valid `OPENAI_MODEL`.

For production database access, confirm that `DATABASE_URL` and the complete `SUPABASE_CA_CERT` are present in the Vercel Production environment. Keep TLS certificate verification enabled. If either setting is missing or invalid, database-backed features (including rate limiting, checkout and Lado AI) may return a temporary-unavailable response.

## 5. Deployment and verification

- The GitHub Actions quality workflow runs TypeScript checks, ESLint and `next build`.
- Connect the repository `thetharparkarpilani/ladoorganics` to the intended Vercel project and confirm the Production branch is `main`.
- **Important: a second publishing target is present.** The repository has a root `index.html`, a `CNAME` containing `ladoorganics.in`, and a successful GitHub Pages Jekyll build/deploy workflow. That publishes the legacy static site separately from the Next.js application on Vercel. Verify the live DNS records and the domain attached in Vercel before changing or removing either host. Do not assume the custom domain is serving the Vercel app merely because the Vercel preview URL works.
- Set required Production environment variables before the production build/deployment.
- Verify the deployment itself, not just the GitHub build: home page, live catalogue, product details, cart/checkout, Google sign-in, customer order history, admin role access, Lado AI and public policies.
- Verify `/api/health` only as an application-process probe; it deliberately does not expose database or secret configuration.
- Confirm the custom domain and HTTPS after a successful production deployment.

Do not describe the site as production-ready solely because a build passes. Database connectivity, authentication, checkout, payment reconciliation, admin permissions and customer-facing flows require runtime verification.


## Transactional order email delivery

Order creation writes customer and (when configured) administrator email work to \`notification_outbox\` in the same database transaction as the order. A committed order therefore retains its notification work even when SMTP is temporarily unavailable.

Before enabling the worker:
1. Apply and verify migration \`029_catalogue_taxonomy_and_notification_outbox.sql\` on an isolated Supabase branch first.
2. Configure SMTP credentials and \`ADMIN_NOTIFICATION_EMAIL\` in the intended Vercel environments.
3. Generate a strong random \`CRON_SECRET\` (at least 32 characters) and set it as a server-only Vercel environment variable.
4. Configure a trusted scheduler to POST \`/api/internal/notifications/process\` with \`Authorization: Bearer <CRON_SECRET>\`.
5. Test a non-production order, email delivery, retry behaviour and idempotency.

No scheduler is configured by this code change: the available Vercel plan and preferred scheduler have not been confirmed. Do not expose \`CRON_SECRET\` through a \`NEXT_PUBLIC_\` variable.

## Catalogue administration

The inventory workspace now supports creating a product and its first variant. New records are created hidden from customers. An authorized inventory administrator must verify the product description, business category, SKU, pack label, price and opening stock, add the approved image, and explicitly publish the product. Food, non-food and farm-experience entries are categorized separately. Legacy JSON and seed files are not automatically imported because their prices and stock may be stale.
