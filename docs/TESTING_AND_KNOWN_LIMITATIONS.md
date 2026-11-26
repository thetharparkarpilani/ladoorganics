# Lado Organics — Verification Status & Known Limitations

## 1. Verification status

### Automated checks

The GitHub Actions quality workflow completed successfully for main commit `7bfe11a0d2e4594367cc9bb8c4caa26fb798db5e` on 24 November 2026. The run completed `npm ci`, TypeScript, ESLint and the Next.js production build.

The audit candidate in PR #15, commit `9da971e010548b33e3c1d1861f68add1f9356f08`, also passed TypeScript, ESLint and the Next.js production build.

These results apply only to those exact commits. They do not establish that the current roadmap branch has passed checks, nor do they verify production environment variables, database connectivity, live AI responses or browser workflows.

### Deployment status

A successful Vercel Production deployment and live runtime verification for the current roadmap branch have not been established. No production deployment is initiated by this work.

### Runtime checks still required

The following must be verified against a successful deployment and the real production environment:

- PostgreSQL connection using `DATABASE_URL` and the trusted `SUPABASE_CA_CERT`.
- Lado AI FAQ answers, live product lookup, OpenAI generation (if configured), and customer-facing error handling.
- Live catalogue, product detail pages, cart, server-side price/stock validation and order creation.
- Google sign-in, session refresh, customer profile and order-history ownership, including guest orders matched to the same verified account email.
- Admin login, staff roles/capabilities, finance actions, audit logging and support workspace.
- Booking date conflicts and expiry, sponsorship enquiries, corporate enquiries, traceability and review moderation.
- Email delivery, WhatsApp links, mobile layout, accessibility and browser-console errors.

Do not mark these items passed based only on a successful build.

## 2. Known product and integration limitations

1. **Mobile OTP:** Intentionally unavailable until a real SMS provider is configured. The API rejects OTP requests rather than issuing demo or insecure codes.
2. **Razorpay:** Gateway checkout remains disabled. Current checkout supports Cash on Delivery and manually verified UPI. Never treat a manual UPI request as paid until the Lado team verifies it.
3. **Essentials Club:** The form records repeat-delivery interest only. It does not create a paid subscription, auto-debit mandate, scheduled delivery, confirmed price or reserved stock. The team must confirm availability, pack options, price and delivery details.
4. **Customer identity:** Customer sign-in uses Supabase Auth with Google. Order history is scoped to the verified signed-in customer identity and can include guest orders using the same verified account email. An arbitrary email supplied by the browser is never used for this lookup.
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


## 4. Roadmap implementation boundary

The current application already contains substantial modules for storefront catalogue and checkout, Google customer sign-in, customer order/profile/support/review/returns pages, staff role-based admin workspaces, bookings, sponsorships, corporate enquiries, batch traceability, Lado AI, and the farm/community content areas. A module being present in the repository does not by itself mean its production workflow has been configured or accepted by the business.

The current upgrade adds:
- A single aggregated catalogue query with a short shared-cache window. Checkout remains the authority for current price and stock.
- Checkout confirmation validation that uses the payment method and total returned by the order API, including idempotent repeat responses.
- Removal of the unverified hard-coded WhatsApp destination. WhatsApp entry points appear only when `NEXT_PUBLIC_WHATSAPP_NUMBER` is explicitly configured.
- Automated roadmap contract checks for checkout confirmation, contact configuration, catalogue response behavior, payment gates and approved-only traceability.
- Quality workflow execution for all pushed branches, including the roadmap feature branch.

The following roadmap items remain intentionally gated on real-world configuration or business approval:
- **Payments:** keep Cash on Delivery and manually verified UPI. Enable Razorpay only after a complete reservation/capture/refund/reconciliation lifecycle and live webhook verification.
- **Shipping:** choose a courier, configure credentials and serviceable PIN codes, then test quotes, labels, tracking and exception handling. Until then, do not promise rates or delivery dates.
- **Subscriptions:** confirm products, recurring prices, stock allocation, cancellation, delivery schedules and payment mandate requirements before converting interest forms into paid subscriptions.
- **Traceability:** publish only batch records backed by actual production, quality and packaging evidence and explicitly approved by the team.
- **Compliance and claims:** review food labels, FSSAI details, nutrition, product claims, privacy and legal policies against current source documents.
- **Customer communications:** configure and test the real WhatsApp number, transactional email sender and (if desired) an SMS OTP provider.

A successful automated build is a code-quality signal, not proof of production readiness. Use the verification checklist above for each deployment candidate.
