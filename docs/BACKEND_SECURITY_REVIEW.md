# Lado Organics backend security review

**Review date:** 26 November 2026  
**Repository baseline:** `main` at `c8eba26c4fb6f612bb3d6a3f0ea5c0c393259332`  
**Supabase project:** `aojsnhnlohakakvnnron`

## Architecture observed

- Next.js 15 App Router with TypeScript is the application/API layer.
- The server connects to PostgreSQL through the server-only `DATABASE_URL` pool in `src/lib/db.ts`.
- Supabase Auth issues the customer/staff identity token. The server validates it against `/auth/v1/user`.
- The customer profile API proxies requests to the Supabase Data API using the customer's access token. Its `customer_profiles` table is protected by ownership RLS policies.
- Order history, catalogue, checkout, payments, staff administration, inventory and traceability are handled by server-side routes and PostgreSQL transactions.
- No payment gateway or courier provider is assumed active merely because integration code exists.

## Findings confirmed against the connected database

1. RLS is enabled on public application tables. The only row policies found in the initial audit are the three ownership policies on `customer_profiles`. The absence of policies on server-only tables is intentional deny-by-default when used through the Supabase Data API; do not add broad public policies to silence the advisor.
2. Migration 023 revoked `anon` table access but did not remove all default `authenticated` privileges. Live privilege inspection found `TRUNCATE` on `ai_knowledge`, `site_content`, `staff_accounts` and `customer_profiles`. RLS does not protect a table from TRUNCATE. These privileges are unnecessary for the current application architecture.
3. `public.get_my_customer_orders()` is a `SECURITY DEFINER` function owned by `postgres`, executable by `authenticated`, and returns an account's orders based on the authenticated JWT email. The application currently reads order history through `/api/dashboard/orders`, which validates the Supabase user and queries by the mapped internal user ID and verified account email. The public RPC grant is therefore unnecessary and is revoked by migration 028.
4. Supabase's performance advisor identified eight unindexed foreign keys. Migration 028 adds the corresponding indexes.
5. Supabase's performance advisor identified repeated evaluation of `auth.uid()` in the three customer-profile policies. Migration 028 wraps the call in a scalar SELECT as recommended by current Supabase guidance.
6. Supabase Auth reports leaked-password protection disabled. This is an Auth project setting, not a SQL migration; enable it in the Supabase Auth password security settings after reviewing the user sign-in methods and policy.

## Migration 028 changes

- Revoke all Data API table and sequence privileges from `anon` and `authenticated`, then restore only the required SELECT/INSERT/UPDATE privileges on `customer_profiles`.
- Tighten default privileges for new objects created by the `postgres` migration owner.
- Revoke execution of the unused exposed `get_my_customer_orders()` SECURITY DEFINER RPC.
- Optimize the three customer profile RLS policies without changing their ownership semantics, and require the stored profile email to match the signed-in JWT email on insert/update.
- Add eight foreign-key indexes reported by the live advisor.

## Release and verification boundary

This branch contains a migration proposal and static regression contracts. The production database has **not** been modified by this review. The migration must be tested against a disposable Supabase development branch or staging database before it is applied to production. Creating a Supabase development branch requested a cost-confirmation ID, so no paid database branch was created.

The GitHub CI pipeline should run TypeScript, the existing Lado AI and roadmap checks, the new backend security contract test, ESLint and the Next.js production build. After CI, re-run Supabase security and performance advisors on the test database and verify:

- `authenticated` has no table privileges except SELECT/INSERT/UPDATE on `customer_profiles`.
- `anon` has no public application table/sequence privileges.
- `get_my_customer_orders()` is not executable by `anon`, `authenticated` or `PUBLIC`.
- The profile endpoint still supports create/read/update for the authenticated owner only.
- The eight FK indexes exist and the advisor no longer reports those missing indexes.

## Remaining roadmap

### P0 — Security and data integrity
- Test migration 028 on an isolated database.
- Enable leaked-password protection in Supabase Auth.
- Add explicit tests for staff role/capability boundaries and profile ownership.
- Review all webhook event handling for replay/idempotency and reconcile gateway events against stored payment rows.

### P1 — Commerce reliability
- Add a formal order/payment state-transition model and prohibit invalid transitions in one transactional service.
- Add durable outbox records for order email/WhatsApp/admin notifications so a post-commit mail failure cannot hide a successful order.
- Add inventory reservation expiry and reconciliation for abandoned/failed payment sessions.
- Add structured request IDs and safe operational error telemetry.

### P2 — Farm operations
- Extend the existing batch and inventory model with production input/output records, quality checks, packaging and stock reconciliation.
- Keep food and non-food production categories separated.
- Publish only reviewed/approved traceability fields.

### P3 — Business operations
- Add provider-backed shipping integration only after selecting a courier.
- Activate recurring orders only after defining billing, delivery, pause and cancellation rules.
- Add finance exports and operational dashboards based on reconciled source records.

## Non-goals of this change

- No production deployment, merge to `main`, or live database migration.
- No fabricated prices, stock, certifications, quality results, supplier data, batch origins or product claims.
- No enabling payment/shipping/subscription providers without real account configuration and end-to-end verification.
