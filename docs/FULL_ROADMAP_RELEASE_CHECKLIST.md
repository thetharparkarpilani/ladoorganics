# Lado Organics — Full Roadmap Release Checklist

This checklist defines the release gates for the website recovery and platform roadmap. A code change is not considered production-ready until its applicable runtime and business checks have passed.

## P0 — Store recovery and brand assets

- [ ] Run migrations 028 and 029 through `npm run test:db-migrations` on local/CI PostgreSQL (no paid Supabase branch required).
- [ ] Before any live migration, verify a current backup, compare live migration history/schema, review the exact SQL and obtain explicit production-change approval.
- [ ] Add real approved product records through the admin inventory workspace.
- [ ] Confirm each product's food / non-food / experience category.
- [ ] Verify product name, description, SKU, pack label, price, stock, image and active status.
- [ ] Publish products only after the Lado team approves the information.
- [ ] Confirm the homepage and /store show the same live products and variants.
- [ ] Verify the original logo SVG and fallback in the live browser at desktop and mobile sizes.
- [ ] Confirm no stale seed prices or demo batches are shown.

## P1 — Commerce and customer accounts

- [ ] Test customer registration, Google sign-in, session refresh and logout.
- [ ] Test cart updates, variant selection and checkout validation.
- [ ] Test order idempotency and concurrent stock locking.
- [ ] Confirm inventory deductions and inventory movement records.
- [ ] Verify COD order state and manually verified UPI reconciliation.
- [ ] Verify customer order history is scoped to the verified account identity.
- [ ] Verify admin order visibility and role/capability boundaries.
- [ ] Test cancellation, returns and refund records without triggering real payment actions.
- [ ] Confirm transactional email rows are created atomically with orders.
- [ ] Configure SMTP, ADMIN_NOTIFICATION_EMAIL and a server-only CRON_SECRET.
- [ ] Configure a trusted scheduler for /api/internal/notifications/process.
- [ ] Test successful email delivery, duplicate prevention, retry/backoff and dead-letter handling.

## P2 — UI, accessibility and performance

- [ ] Browser-test all customer and admin routes.
- [ ] Test 360, 390, 430, 768, 1024, 1440 and 1920 pixel viewport widths.
- [ ] Check keyboard navigation, focus visibility, form labels and screen-reader names.
- [ ] Check image loading, broken links, empty states and API error states.
- [ ] Record Lighthouse performance, accessibility, best-practice and SEO scores.
- [ ] Verify no console errors and no hydration warnings on critical pages.

## P3 — Integrations and growth

- [ ] Configure Google Analytics and/or Meta Pixel only with approved IDs and consent.
- [ ] Configure the real WhatsApp number and verify every CTA.
- [ ] Configure the Lado AI provider key if model-backed responses are required; test the local fallback.
- [ ] Select a payment provider and complete a sandbox lifecycle before enabling gateway checkout.
- [ ] Select a courier provider, credentials and serviceable PIN codes before promising shipping.
- [ ] Define subscription prices, schedules, mandates, pause/cancel rules and stock allocation before activating paid subscriptions.
- [ ] Publish traceability only from approved production, quality and packaging records.
- [ ] Review legal, privacy, food-label and product claims with the responsible professional.

## Release boundary

- The migration in this branch is a proposal until tested on an isolated database.
- No live product prices, stock quantities, certifications, lab reports, suppliers or batch data may be invented.
- No production database migration, environment change, merge or deployment is implied by this checklist.
- Keep production main unchanged until the owner explicitly approves release.
