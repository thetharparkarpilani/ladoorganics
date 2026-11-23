-- 011_checkout_orders_payments.sql
-- Bring earlier order table variants onto the schema used by secure checkout and order history.
-- Safe to run more than once.

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS order_number TEXT,
  ADD COLUMN IF NOT EXISTS guest_name TEXT,
  ADD COLUMN IF NOT EXISTS guest_email TEXT,
  ADD COLUMN IF NOT EXISTS guest_phone TEXT,
  ADD COLUMN IF NOT EXISTS shipping_summary TEXT,
  ADD COLUMN IF NOT EXISTS subtotal_inr INTEGER,
  ADD COLUMN IF NOT EXISTS total_inr INTEGER;

UPDATE public.orders
   SET order_number = 'LO-LEGACY-' || upper(replace(id::text, '-', ''))
 WHERE order_number IS NULL OR btrim(order_number) = '';

UPDATE public.orders
   SET shipping_summary = COALESCE(NULLIF(shipping_summary, ''), 'Address not recorded')
 WHERE shipping_summary IS NULL OR btrim(shipping_summary) = '';

UPDATE public.orders
   SET subtotal_inr = COALESCE(subtotal_inr, total_inr, 0),
       total_inr = COALESCE(total_inr, subtotal_inr, 0)
 WHERE subtotal_inr IS NULL OR total_inr IS NULL;

ALTER TABLE public.orders
  ALTER COLUMN order_number SET NOT NULL,
  ALTER COLUMN shipping_summary SET NOT NULL,
  ALTER COLUMN subtotal_inr SET DEFAULT 0,
  ALTER COLUMN subtotal_inr SET NOT NULL,
  ALTER COLUMN total_inr SET DEFAULT 0,
  ALTER COLUMN total_inr SET NOT NULL;

ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
UPDATE public.orders SET status = 'pending_confirmation' WHERE status = 'pending';
ALTER TABLE public.orders
  ADD CONSTRAINT orders_status_check CHECK (
    status IN ('pending_confirmation', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')
  );

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_order_number_unique ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_guest_email_lower ON public.orders(lower(guest_email));
CREATE INDEX IF NOT EXISTS idx_payments_provider_order_id ON public.payments(provider, provider_order_id);

-- Keep the order item table aligned with the fields written by checkout.
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_slug TEXT NOT NULL,
  variant_sku TEXT NOT NULL,
  item_title TEXT NOT NULL,
  unit_price_inr INTEGER NOT NULL CHECK (unit_price_inr >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0)
);

-- Payment rows retain the gateway's string order ID separately from the local UUID order ID.
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS provider_order_id TEXT,
  ADD COLUMN IF NOT EXISTS provider_payment_id TEXT,
  ADD COLUMN IF NOT EXISTS idempotency_key TEXT,
  ADD COLUMN IF NOT EXISTS amount_inr INTEGER,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'created',
  ADD COLUMN IF NOT EXISTS event_type TEXT,
  ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;

CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_idempotency_key_unique
  ON public.payments(idempotency_key)
  WHERE idempotency_key IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_provider_payment_id_unique
  ON public.payments(provider_payment_id)
  WHERE provider_payment_id IS NOT NULL;
