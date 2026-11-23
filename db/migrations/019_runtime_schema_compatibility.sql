-- 019_runtime_schema_compatibility.sql
-- Repair schema differences between the two historical 002 migration variants.
-- Safe to run after the existing migration set; preserves all legacy records.

-- Normalize the order table even if an earlier migration stopped before 011.
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS order_number TEXT,
  ADD COLUMN IF NOT EXISTS guest_name TEXT,
  ADD COLUMN IF NOT EXISTS guest_email TEXT,
  ADD COLUMN IF NOT EXISTS guest_phone TEXT,
  ADD COLUMN IF NOT EXISTS shipping_summary TEXT,
  ADD COLUMN IF NOT EXISTS shipping_address TEXT,
  ADD COLUMN IF NOT EXISTS subtotal_inr INTEGER,
  ADD COLUMN IF NOT EXISTS total_inr INTEGER,
  ADD COLUMN IF NOT EXISTS payment_method TEXT NOT NULL DEFAULT 'cash_on_delivery',
  ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'pay_on_delivery';

ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
UPDATE public.orders
   SET status = 'pending_confirmation'
 WHERE status = 'pending';

UPDATE public.orders
   SET order_number = 'LO-LEGACY-' || upper(replace(id::text, '-', ''))
 WHERE order_number IS NULL OR btrim(order_number) = '';

UPDATE public.orders
   SET shipping_summary = COALESCE(NULLIF(shipping_summary, ''), NULLIF(shipping_address, ''), 'Address not recorded'),
       shipping_address = COALESCE(NULLIF(shipping_address, ''), NULLIF(shipping_summary, ''), 'Address not recorded')
 WHERE shipping_summary IS NULL OR btrim(shipping_summary) = ''
    OR shipping_address IS NULL OR btrim(shipping_address) = '';

UPDATE public.orders
   SET subtotal_inr = COALESCE(subtotal_inr, total_inr, 0),
       total_inr = COALESCE(total_inr, subtotal_inr, 0)
 WHERE subtotal_inr IS NULL OR total_inr IS NULL;

ALTER TABLE public.orders
  ALTER COLUMN order_number SET NOT NULL,
  ALTER COLUMN shipping_summary SET NOT NULL,
  ALTER COLUMN shipping_address SET NOT NULL,
  ALTER COLUMN subtotal_inr SET DEFAULT 0,
  ALTER COLUMN subtotal_inr SET NOT NULL,
  ALTER COLUMN total_inr SET DEFAULT 0,
  ALTER COLUMN total_inr SET NOT NULL;

ALTER TABLE public.orders
  ADD CONSTRAINT orders_status_check CHECK (
    status IN ('pending_confirmation', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')
  );
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_payment_method_check;
ALTER TABLE public.orders
  ADD CONSTRAINT orders_payment_method_check
  CHECK (payment_method IN ('cash_on_delivery', 'manual_upi'));
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_payment_status_check;
ALTER TABLE public.orders
  ADD CONSTRAINT orders_payment_status_check
  CHECK (payment_status IN ('pay_on_delivery', 'awaiting_manual_payment', 'payment_submitted', 'paid', 'failed', 'refunded'));

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_order_number_unique
  ON public.orders (order_number);
CREATE INDEX IF NOT EXISTS idx_orders_guest_email_lower
  ON public.orders (lower(guest_email));

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_slug TEXT NOT NULL,
  variant_sku TEXT NOT NULL,
  item_title TEXT NOT NULL,
  unit_price_inr INTEGER NOT NULL CHECK (unit_price_inr >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0)
);

-- Ensure the bookings table exists even when the legacy 002 file created only bhunga_bookings.
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stay_slug TEXT NOT NULL DEFAULT 'deep-work-bhunga-stay',
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests_count INTEGER NOT NULL DEFAULT 1 CHECK (guests_count > 0 AND guests_count <= 4),
  nights_count INTEGER NOT NULL CHECK (nights_count > 0),
  total_amount_inr INTEGER NOT NULL CHECK (total_amount_inr >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_booking_dates CHECK (check_out > check_in)
);

CREATE INDEX IF NOT EXISTS idx_bookings_guest_email_lower
  ON public.bookings (lower(guest_email));
CREATE INDEX IF NOT EXISTS idx_bookings_dates_status
  ON public.bookings (check_in, check_out, status);

-- The legacy sponsorship table lacks contact and plan fields. Add nullable
-- columns so historical rows remain valid; new requests populate all fields.
ALTER TABLE public.sponsorships
  ADD COLUMN IF NOT EXISTS calf_name TEXT,
  ADD COLUMN IF NOT EXISTS sponsor_name TEXT,
  ADD COLUMN IF NOT EXISTS sponsor_email TEXT,
  ADD COLUMN IF NOT EXISTS sponsor_phone TEXT,
  ADD COLUMN IF NOT EXISTS plan_type TEXT;

CREATE INDEX IF NOT EXISTS idx_sponsorships_sponsor_email_lower
  ON public.sponsorships (lower(sponsor_email))
  WHERE sponsor_email IS NOT NULL;

-- Ensure the payment ledger exists even when the legacy 002 file was used.
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  provider TEXT NOT NULL CHECK (provider IN ('razorpay', 'cashfree', 'whatsapp_assisted', 'cash_on_delivery', 'manual_upi')),
  provider_order_id TEXT,
  provider_payment_id TEXT UNIQUE,
  idempotency_key TEXT UNIQUE,
  amount_inr INTEGER NOT NULL DEFAULT 0 CHECK (amount_inr >= 0),
  status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'authorized', 'captured', 'failed', 'refunded')),
  event_type TEXT,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS provider_order_id TEXT,
  ADD COLUMN IF NOT EXISTS provider_payment_id TEXT,
  ADD COLUMN IF NOT EXISTS idempotency_key TEXT,
  ADD COLUMN IF NOT EXISTS amount_inr INTEGER,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'created',
  ADD COLUMN IF NOT EXISTS event_type TEXT,
  ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;

CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_idempotency_key_unique
  ON public.payments (idempotency_key)
  WHERE idempotency_key IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_provider_payment_id_unique
  ON public.payments (provider_payment_id)
  WHERE provider_payment_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_payments_provider_order_id
  ON public.payments (provider, provider_order_id);
