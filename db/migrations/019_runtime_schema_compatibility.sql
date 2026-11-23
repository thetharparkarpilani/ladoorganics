-- 019_runtime_schema_compatibility.sql
-- Repair schema differences between the two historical 002 migration variants.
-- Safe to run after the existing migration set; preserves all legacy records.

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
