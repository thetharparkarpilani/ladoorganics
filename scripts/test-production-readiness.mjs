import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFileSync(resolve(root, path), "utf8");

const layout = read("src/app/layout.tsx");
const locale = read("src/context/LocaleContext.tsx");
const robots = read("src/app/robots.ts");
const cart = read("src/components/CartCheckoutDrawer.tsx");
const checkout = read("src/components/ManualCheckout.tsx");

assert.match(layout, /metadataBase:\s*new URL\(siteUrl\)/, "metadata must use the configured canonical site origin");
assert.match(layout, /getServerLocale\(\)/, "root layout must read the locale cookie on the server");
assert.match(layout, /locale === "ma" \? "mwr" : locale/, "server-rendered Marwari pages must use the Marwari language tag");
assert.match(locale, /locale === "ma" \? "mwr" : locale/, "client locale changes must preserve the Marwari language tag");
assert.match(locale, /window\.location\.protocol === "https:"/, "locale preference cookies must use Secure on HTTPS");
assert.match(robots, /"\/store"/, "robots must allow the live store route");
assert.doesNotMatch(robots, /"\/products\//, "robots must not advertise a non-existent product route");
assert.match(robots, /"\/dashboard\//, "robots must exclude private dashboard routes");
assert.doesNotMatch(cart, /NEXT_PUBLIC_WHATSAPP_NUMBER\s*\|\|\s*["']\d{10,15}["']/, "checkout must not contain a hard-coded WhatsApp fallback");
assert.match(cart, /whatsappNumber\s*\?\s*\(/, "checkout must render WhatsApp support conditionally");
assert.ok(!checkout.includes(String.fromCharCode(92) + "n      {error &&"), "checkout must not contain an escaped newline in JSX text");

console.log("Production readiness contracts passed.");
