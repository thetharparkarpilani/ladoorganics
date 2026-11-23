-- 021: Track one-time inventory restoration when an order is cancelled.
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS inventory_released_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_orders_inventory_released
  ON public.orders(status, inventory_released_at)
  WHERE status = 'cancelled';
