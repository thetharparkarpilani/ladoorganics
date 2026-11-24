-- 025: Shared API rate limits and expiring pending Bhunga requests.
CREATE TABLE IF NOT EXISTS public.api_rate_limits (
  bucket TEXT NOT NULL,
  identifier_hash CHAR(64) NOT NULL,
  window_start TIMESTAMPTZ NOT NULL,
  hit_count INTEGER NOT NULL DEFAULT 0 CHECK (hit_count >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (bucket, identifier_hash)
);

CREATE INDEX IF NOT EXISTS idx_api_rate_limits_updated
  ON public.api_rate_limits(updated_at);

ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.api_rate_limits FROM anon, authenticated;

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_bookings_pending_expiry
  ON public.bookings(status, expires_at, check_in, check_out);
