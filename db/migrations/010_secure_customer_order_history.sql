-- 010_secure_customer_order_history.sql
-- Securely expose only orders belonging to the currently authenticated customer.
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

  SELECT u.id
    INTO v_legacy_user_id
    FROM public.users AS u
   WHERE lower(u.email) = v_email
   LIMIT 1;

  SELECT coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', o.id,
        'order_number', o.order_number,
        'status', o.status,
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
              )
              ORDER BY oi.id
            ),
            '[]'::jsonb
          )
          FROM public.order_items AS oi
          WHERE oi.order_id = o.id
        )
      )
      ORDER BY o.created_at DESC
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
