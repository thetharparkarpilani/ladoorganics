-- 022: Auditable return requests and manual refund ledger.
ALTER TABLE public.orders
  DROP CONSTRAINT IF EXISTS orders_payment_status_check;
ALTER TABLE public.orders
  ADD CONSTRAINT orders_payment_status_check
  CHECK (payment_status IN ('pay_on_delivery', 'awaiting_manual_payment', 'payment_submitted', 'paid', 'partially_refunded', 'failed', 'refunded'));

CREATE TABLE IF NOT EXISTS public.order_returns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE RESTRICT,
  reason TEXT NOT NULL CHECK (length(btrim(reason)) BETWEEN 5 AND 1000),
  customer_note TEXT,
  status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'approved', 'rejected', 'received')),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  received_at TIMESTAMPTZ,
  inventory_restocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
  amount_inr INTEGER NOT NULL CHECK (amount_inr > 0),
  refund_method TEXT NOT NULL CHECK (refund_method IN ('upi', 'bank_transfer', 'cash')),
  reference TEXT NOT NULL,
  note TEXT,
  recorded_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_returns_status ON public.order_returns(status, requested_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_refunds_order ON public.order_refunds(order_id, created_at DESC);

ALTER TABLE public.order_returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_refunds ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.order_returns FROM anon, authenticated;
REVOKE ALL ON public.order_refunds FROM anon, authenticated;
