-- 029: Separate food/non-food catalogue entries and persist transactional email work.
-- Apply only after testing this migration against an isolated Supabase branch.
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS business_category TEXT NOT NULL DEFAULT 'other';
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_business_category_check;
ALTER TABLE public.products ADD CONSTRAINT products_business_category_check CHECK (business_category IN ('food','non_food','experience','other'));
CREATE TABLE IF NOT EXISTS public.notification_outbox (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 channel TEXT NOT NULL DEFAULT 'email' CHECK (channel IN ('email')),
 recipient TEXT NOT NULL CHECK (length(btrim(recipient))>0),
 template_id TEXT,
 payload JSONB NOT NULL DEFAULT '{}'::jsonb,
 idempotency_key TEXT NOT NULL UNIQUE,
 status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','sent','dead')),
 attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts>=0),
 available_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 locked_at TIMESTAMPTZ,
 sent_at TIMESTAMPTZ,
 last_error TEXT,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notification_outbox_due ON public.notification_outbox(status,available_at,created_at) WHERE status IN ('pending','processing');
ALTER TABLE public.notification_outbox ENABLE ROW LEVEL SECURITY;
REVOKE ALL PRIVILEGES ON TABLE public.notification_outbox FROM anon,authenticated;
