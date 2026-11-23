-- 012_cash_on_delivery_manual_upi.sql
-- Enable COD and manually confirmed UPI orders without a payment gateway.
-- Safe to run more than once.

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_method TEXT NOT NULL DEFAULT 'cash_on_delivery',
  ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'pay_on_delivery';

ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_payment_method_check;
ALTER TABLE public.orders
  ADD CONSTRAINT orders_payment_method_check
  CHECK (payment_method IN ('cash_on_delivery', 'manual_upi'));

ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_payment_status_check;
ALTER TABLE public.orders
  ADD CONSTRAINT orders_payment_status_check
  CHECK (payment_status IN ('pay_on_delivery', 'awaiting_manual_payment', 'payment_submitted', 'paid', 'failed', 'refunded'));

ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_provider_check;
ALTER TABLE public.payments
  ADD CONSTRAINT payments_provider_check
  CHECK (provider IN ('razorpay', 'cashfree', 'whatsapp_assisted', 'cash_on_delivery', 'manual_upi'));

CREATE INDEX IF NOT EXISTS idx_orders_payment_method_status
  ON public.orders(payment_method, payment_status, created_at DESC);

COMMENT ON COLUMN public.orders.payment_method IS 'Customer-selected payment method: cash_on_delivery or manual_upi.';
COMMENT ON COLUMN public.orders.payment_status IS 'Manual payment state; staff must verify UPI receipts before marking paid.';
