# Testing Report & Known Limitations — Lado Organics 2.0

## 1. Verification Status Matrix
- **Tested and passed:** None in this environment (no Node.js, PostgreSQL, or browser runtime was executed in the assistant session).
- **Tested and failed:** None executed in this environment.
- **Not tested (Run locally in `PS C:\Users\aksai\Desktop\LadoOrganics_Premium`):**
  - `npm install`
  - `npm run typecheck` (`tsc --noEmit`)
  - `npm run lint` (`next lint`)
  - `npm run build` (`next build`)
  - PostgreSQL migration execution (`001`–`004` + `seed.sql`) and `/api/health` database check
  - End-to-end API tests: `/api/orders`, `/api/bookings` (including overlapping-date 409 conflict rejection), `/api/sponsorships`, `/api/corporate`, `/api/subscriptions`, `/api/trace/LO-PILANI-SAMPLE-001`, `/api/payments/webhook` (HMAC signature check), and `/api/admin/records`
- **Requires external credentials & business decisions:**
  - `DATABASE_URL`, `ADMIN_ACCESS_TOKEN`, `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` / `RAZORPAY_WEBHOOK_SECRET`, `OPENAI_API_KEY`
  - Full OAuth/OTP auth provider credentials (Supabase Auth or Firebase Auth + SMS provider)
  - Business confirmation of GST/tax rates, shipping calculation rules, live inventory quantities, verified lab report PDFs, and legal review of `/policies`

## 2. Known Limitations & Planned Expansions
1. **Authentication:** Customer dashboard currently scopes records by customer email lookup and admin operations by server-verified `ADMIN_ACCESS_TOKEN`; full Google OAuth + Mobile OTP session cookies require configuring your Supabase/Firebase project keys.
2. **Subscriptions:** `/api/subscriptions` records customer recurring preferences (`enquiry_logged`) without simulating auto-debits; live recurring charges require Razorpay/Cashfree e-mandate registration.
3. **Multilingual Coverage:** Core navigation, hero, store, calculators, and journal headers support `EN`, `हिंदी`, and `मारवाड़ी`; full translation of legal/admin subpages requires reviewed Hindi/Marwari copy.
