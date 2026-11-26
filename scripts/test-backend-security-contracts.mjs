import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const [migration, profileRoute, customerOrders, adminAuth, rateLimit, orders, webhook] = await Promise.all([
  read("db/migrations/028_backend_security_and_indexes.sql"),
  read("src/app/api/dashboard/profile/route.ts"),
  read("src/app/api/dashboard/orders/route.ts"),
  read("src/lib/admin-auth.ts"),
  read("src/lib/rate-limit.ts"),
  read("src/app/api/orders/route.ts"),
  read("src/app/api/payments/webhook/route.ts"),
]);

// Only the authenticated profile endpoint retains direct Data API privileges.
assert.match(migration, /REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM anon, authenticated/i);
assert.match(migration, /GRANT SELECT, INSERT, UPDATE ON TABLE public\.customer_profiles TO authenticated/i);
assert.match(migration, /REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated/i);
assert.match(migration, /REVOKE ALL PRIVILEGES ON FUNCTION public\.get_my_customer_orders\(\)\s+FROM PUBLIC, anon, authenticated/i);
assert.match(migration, /ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public\s+REVOKE ALL ON TABLES FROM anon, authenticated/i);

// Profile access remains JWT-authenticated and owner-scoped by RLS.
assert.match(profileRoute, /Authorization: `Bearer \$\{accessToken\}`/);
assert.match(profileRoute, /rest\/v1\/customer_profiles/);
assert.match(migration, /USING \(\(SELECT auth\.uid\(\)\) = auth_user_id\)/i);
assert.equal(migration.split("lower(email) = lower((SELECT auth.jwt() ->> 'email'))").length - 1, 2);

// The public customer order route derives identity from the validated session;
// it does not accept a caller-supplied email or depend on a public RPC.
assert.match(customerOrders, /getCustomerIdentity\(req\)/);
assert.match(customerOrders, /WHERE o\.user_id = \$1::uuid/);
assert.doesNotMatch(customerOrders, /searchParams\.get\(["']email["']\)/i);

// Existing backend safety contracts must remain intact.
assert.match(adminAuth, /getAdminActor/);
assert.match(adminAuth, /ROLE_CAPABILITIES/);
assert.match(rateLimit, /createHmac\("sha256"/);
assert.match(rateLimit, /status: 503/);
assert.match(orders, /idempotency-key/i);
assert.match(orders, /FOR UPDATE OF pv/);
assert.match(webhook, /timingSafeEqual/);

// Every foreign key flagged by the live database advisor is covered.
for (const indexName of [
  "idx_bhunga_bookings_user_id",
  "idx_bookings_user_id",
  "idx_business_expenses_supplier_id",
  "idx_inventory_movements_batch_id",
  "idx_inventory_movements_supplier_id",
  "idx_reviews_user_id",
  "idx_sponsorships_cow_id",
  "idx_support_tickets_customer_user_id",
]) {
  assert.match(migration, new RegExp(`CREATE INDEX IF NOT EXISTS ${indexName}`, "i"));
}

console.log("Backend security contracts passed: least-privilege grants, profile RLS, private order history, admin authorization, rate limits, checkout idempotency, webhook signatures and FK indexes.");
