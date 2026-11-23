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


-- Include the selected payment method and its manual verification state in Order History.
CREATE OR REPLACE FUNCTION public.get_my_customer_orders()
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_email text;
  v_legacy_user_id uuid;
  v_orders jsonb;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  v_email := lower(trim(coalesce(auth.jwt() ->> 'email', '')));
  IF v_email = '' THEN
    RETURN '[]'::jsonb;
  END IF;

  SELECT u.id INTO v_legacy_user_id
    FROM public.users AS u
   WHERE lower(u.email) = v_email
   LIMIT 1;

  SELECT coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', o.id,
        'order_number', o.order_number,
        'status', o.status,
        'payment_method', o.payment_method,
        'payment_status', o.payment_status,
        'subtotal_inr', o.subtotal_inr,
        'total_inr', o.total_inr,
        'shipping_summary', o.shipping_summary,
        'created_at', o.created_at,
        'items', (
          SELECT coalesce(
            jsonb_agg(
              jsonb_build_object(
                'id', oi.id,
                'item_title', oi.item_title,
                'quantity', oi.quantity,
                'unit_price_inr', oi.unit_price_inr,
                'variant_sku', oi.variant_sku
              ) ORDER BY oi.id
            ),
            '[]'::jsonb
          )
          FROM public.order_items AS oi
          WHERE oi.order_id = o.id
        )
      ) ORDER BY o.created_at DESC
    ),
    '[]'::jsonb
  )
  INTO v_orders
  FROM public.orders AS o
  WHERE lower(coalesce(o.guest_email, '')) = v_email
     OR (v_legacy_user_id IS NOT NULL AND o.user_id = v_legacy_user_id);

  RETURN v_orders;
END;
$$;

REVOKE ALL ON FUNCTION public.get_my_customer_orders() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_my_customer_orders() FROM anon;
GRANT EXECUTE ON FUNCTION public.get_my_customer_orders() TO authenticated;
