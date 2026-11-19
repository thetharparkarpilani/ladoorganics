-- Lado Organics 2.0 Ecosystem Schema Expansion (Migration 002)
-- Adds orders, order_items, payments, bookings, sponsorships, and audit_logs

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  guest_name TEXT,
  guest_email TEXT,
  guest_phone TEXT,
  shipping_summary TEXT NOT NULL,
  subtotal_inr INTEGER NOT NULL CHECK (subtotal_inr >= 0),
  total_inr INTEGER NOT NULL CHECK (total_inr >= 0),
  status TEXT NOT NULL DEFAULT 'pending_confirmation' CHECK (
    status IN ('pending_confirmation', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_slug TEXT NOT NULL,
  variant_sku TEXT NOT NULL,
  item_title TEXT NOT NULL,
  unit_price_inr INTEGER NOT NULL CHECK (unit_price_inr >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0)
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  provider TEXT NOT NULL CHECK (provider IN ('razorpay', 'cashfree', 'whatsapp_assisted')),
  provider_order_id TEXT,
  provider_payment_id TEXT UNIQUE,
  idempotency_key TEXT UNIQUE NOT NULL,
  amount_inr INTEGER NOT NULL CHECK (amount_inr >= 0),
  status TEXT NOT NULL DEFAULT 'created' CHECK (
    status IN ('created', 'authorized', 'captured', 'failed', 'refunded')
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
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

CREATE TABLE IF NOT EXISTS sponsorships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calf_name TEXT NOT NULL CHECK (calf_name IN ('Dholi Sheri', 'Tara', 'Roshni')),
  sponsor_name TEXT NOT NULL,
  sponsor_email TEXT NOT NULL,
  sponsor_phone TEXT,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('one_time', 'monthly', 'yearly')),
  amount_inr INTEGER NOT NULL CHECK (amount_inr > 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'paused', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(stay_slug, check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_sponsorships_calf ON sponsorships(calf_name, created_at DESC);
