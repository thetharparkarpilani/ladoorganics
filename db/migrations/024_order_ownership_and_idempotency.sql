-- 024: Prevent checkout retries from creating duplicate orders and stop email-only
-- order ownership. Existing guest orders remain in the database but are no longer
-- exposed to an account merely because a visitor typed that account's email address.
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS idempotency_key UUID;

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_idempotency_key
  ON public.orders(idempotency_key)
  WHERE idempotency_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_orders_user_created
  ON public.orders(user_id, created_at DESC);

-- The authenticated account may see only orders explicitly linked to its internal user id.
CREATE OR REPLACE FUNCTION public.get_my_customer_orders()
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_email text;
  v_user_id uuid;
  v_orders jsonb;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  v_email := lower(trim(coalesce(auth.jwt() ->> 'email', '')));
  IF v_email = '' THEN
    RETURN '[]'::jsonb;
  END IF;

  SELECT u.id INTO v_user_id
    FROM public.users AS u
   WHERE lower(u.email) = v_email
   LIMIT 1;

  IF v_user_id IS NULL THEN
    RETURN '[]'::jsonb;
  END IF;

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
  WHERE o.user_id = v_user_id;

  RETURN v_orders;
END;
$$;

REVOKE ALL ON FUNCTION public.get_my_customer_orders() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_my_customer_orders() FROM anon;
GRANT EXECUTE ON FUNCTION public.get_my_customer_orders() TO authenticated;
