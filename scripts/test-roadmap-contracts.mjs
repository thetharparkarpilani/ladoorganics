import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const [
  checkout,
  layout,
  concierge,
  catalog,
  orders,
  trace,
  otpSend,
  otpVerify,
  paymentCreate,
  docs,
] = await Promise.all([
  read("src/components/ManualCheckout.tsx"),
  read("src/app/layout.tsx"),
  read("src/components/ConciergeWidget.tsx"),
  read("src/app/api/catalog/route.ts"),
  read("src/app/api/orders/route.ts"),
  read("src/app/api/trace/[batchCode]/route.ts"),
  read("src/app/api/auth/otp/send/route.ts"),
  read("src/app/api/auth/otp/verify/route.ts"),
  read("src/app/api/payments/create-order/route.ts"),
  read("docs/TESTING_AND_KNOWN_LIMITATIONS.md"),
]);

// Contact destinations must be explicitly configured, never silently guessed.
assert.ok(!checkout.includes("919636100337"), "Checkout must not contain an unverified WhatsApp number");
assert.ok(!layout.includes("919636100337"), "Root layout must not contain an unverified WhatsApp number");
assert.match(checkout, /whatsapp \?/);
assert.match(concierge, /\{whatsappUrl && \(/);

// The customer confirmation must reflect the server's persisted order result.
assert.match(checkout, /const confirmedMethod = result\.paymentMethod/);
assert.match(checkout, /onSuccess\(result\.orderNumber, confirmedMethod, confirmedTotal\)/);

// Catalogue response is a single aggregated query with bounded public cache lifetime.
assert.match(catalog, /jsonb_agg\(/);
assert.match(catalog, /s-maxage=30, stale-while-revalidate=60/);
assert.doesNotMatch(catalog, /variantsRes/);

// Critical checkout and traceability safeguards remain in place.
assert.match(orders, /idempotency-key/i);
assert.match(orders, /FOR UPDATE OF pv/);
assert.match(trace, /is_approved = TRUE/);
assert.match(trace, /LO-PILANI-SAMPLE-001/);

// Unconfigured phone OTP and gateway payment flows must stay closed.
assert.match(otpSend, /status: 503/);
assert.match(otpVerify, /status: 503/);
assert.match(paymentCreate, /status: 410/);
assert.match(docs, /manual UPI/i);
assert.match(docs, /does not integrate a courier service/i);

console.log("Roadmap contract checks passed: checkout, contact configuration, catalogue, payment gates and approved traceability.");
