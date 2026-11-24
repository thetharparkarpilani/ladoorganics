-- 019: Private business operations, stock ledger, suppliers and expenses.
-- All writes are performed by authenticated server routes using the existing PostgreSQL connection.
CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(btrim(name)) BETWEEN 2 AND 160),
  company_name TEXT,
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  gst_number TEXT,
  address TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS suppliers_active_name_idx ON public.suppliers(is_active, name);

CREATE TABLE IF NOT EXISTS public.inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE RESTRICT,
  movement_type TEXT NOT NULL CHECK (movement_type IN (
    'opening_balance','purchase','sale','adjustment','damage','expiry',
    'production','return_restock','order_cancelled','supplier_return'
  )),
  quantity_delta INTEGER NOT NULL CHECK (quantity_delta <> 0),
  unit_cost_inr INTEGER CHECK (unit_cost_inr IS NULL OR unit_cost_inr >= 0),
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
  batch_id UUID REFERENCES public.product_batches(id) ON DELETE SET NULL,
  reference_type TEXT,
  reference_id TEXT,
  note TEXT NOT NULL DEFAULT '',
  created_by TEXT NOT NULL DEFAULT 'system',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS inventory_movements_variant_date_idx ON public.inventory_movements(product_variant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS inventory_movements_type_date_idx ON public.inventory_movements(movement_type, created_at DESC);

ALTER TABLE public.product_batches
  ADD COLUMN IF NOT EXISTS product_variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS quantity_produced INTEGER NOT NULL DEFAULT 0 CHECK (quantity_produced >= 0);
CREATE INDEX IF NOT EXISTS product_batches_variant_idx ON public.product_batches(product_variant_id);

CREATE TABLE IF NOT EXISTS public.business_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  category TEXT NOT NULL CHECK (category IN (
    'raw_materials','packaging','transport','lab_testing','utilities',
    'marketing','salaries','maintenance','rent','other'
  )),
  amount_inr INTEGER NOT NULL CHECK (amount_inr > 0),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash','upi','bank_transfer','card')),
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
  reference TEXT,
  description TEXT NOT NULL CHECK (char_length(btrim(description)) BETWEEN 2 AND 500),
  created_by TEXT NOT NULL DEFAULT 'system',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS business_expenses_date_idx ON public.business_expenses(expense_date DESC);
CREATE INDEX IF NOT EXISTS business_expenses_category_date_idx ON public.business_expenses(category, expense_date DESC);

-- Establish a truthful opening balance for the new movement ledger without changing stock.
INSERT INTO public.inventory_movements(product_variant_id, movement_type, quantity_delta, note, created_by)
SELECT pv.id, 'opening_balance', pv.stock_qty,
       'Opening balance when the inventory movement ledger was introduced', 'system'
FROM public.product_variants pv
WHERE pv.stock_qty > 0
  AND NOT EXISTS (
    SELECT 1 FROM public.inventory_movements im
    WHERE im.product_variant_id = pv.id AND im.movement_type = 'opening_balance'
  );

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_expenses ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.suppliers, public.inventory_movements, public.business_expenses FROM anon, authenticated;
