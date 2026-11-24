# Lado Organics — Verification Status & Known Limitations

## 1. Verification status

### Automated checks

The GitHub Actions quality workflow completed successfully for main commit `7bfe11a0d2e4594367cc9bb8c4caa26fb798db5e` on 24 November 2026. The run completed all of these steps:

- `npm ci`
- `npm run typecheck`
- `npm run lint`
- `npm run build`

Run: https://github.com/thetharparkarpilani/ladoorganics/actions/runs/45409839336

This verifies the code at that exact main commit. It does not automatically verify later changes on the `audit/complete-site-readiness` branch, production environment variables, database connectivity or browser workflows.

### Deployment status

The Vercel status reported `Deployment rate limited — retry in 24 hours` for the same main commit. A successful Vercel Production deployment and live runtime verification have therefore not been established by that status.

### Runtime checks still required

The following must be verified against a successful deployment and the real production environment:

- PostgreSQL connection using `DATABASE_URL` and the trusted `SUPABASE_CA_CERT`.
- Lado AI FAQ answers, live product lookup, OpenAI generation (if configured), and customer-facing error handling.
- Live catalogue, product detail pages, cart, server-side price/stock validation and order creation.
- Google sign-in, session refresh, customer profile and order-history ownership.
- Admin login, staff roles/capabilities, finance actions, audit logging and support workspace.
- Booking date conflicts and expiry, sponsorship enquiries, corporate enquiries, traceability and review moderation.
- Email delivery, WhatsApp links, mobile layout, accessibility and browser-console errors.

Do not mark these items passed based only on a successful build.

## 2. Known product and integration limitations

1. **Mobile OTP:** Intentionally unavailable until a real SMS provider is configured. The API rejects OTP requests rather than issuing demo or insecure codes.
2. **Razorpay:** Gateway checkout remains disabled. Current checkout supports Cash on Delivery and manually verified UPI. Never treat a manual UPI request as paid until the Lado team verifies it.
3. **Essentials Club:** The current form records repeat-delivery interest only. It does not create a paid subscription, auto-debit mandate or scheduled delivery.
4. **Customer identity:** Customer sign-in uses Supabase Auth with Google. Order history is scoped to the verified signed-in customer identity; guest orders are not automatically attached to a Google account.
5. **Shipping:** The current checkout does not integrate a courier service or provide a carrier-verified delivery promise. Shipping charges and delivery timing must be confirmed before dispatch.
6. **Legal policies:** The Policies & Legal pages are draft templates requiring review by a qualified legal professional before being represented as final terms.
7. **Multilingual coverage:** Core navigation and selected content support English, Hindi and Marwari. Not every admin, policy and support page is fully translated.
8. **Product evidence:** Product ingredients, nutritional details, certifications and lab reports must come from current approved labels or batch records. The website and Lado AI must not infer or invent them.

## 3. Production readiness criteria

The site should be called ready for customers only after:

- The current candidate commit passes TypeScript, lint and production build checks.
- Vercel reports a successful Production deployment for that candidate.
- Production database TLS and all required environment variables are verified without exposing their values.
- Critical customer and admin workflows are tested end to end.
- Checkout totals, inventory changes, payment status and order ownership are confirmed against production-safe test records.
- Any remaining business decisions (prices, stock, shipping rules, approved claims, legal text and payment operations) are confirmed by the Lado team.

Never execute production migrations, alter live data, weaken security controls or enable payment processing as part of a code-only verification.
