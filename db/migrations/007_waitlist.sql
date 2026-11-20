-- Lado Organics 2.0 Pre-Launch Waitlist (Migration 007)

CREATE TABLE IF NOT EXISTS prelaunch_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  product_interest TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(email, product_interest)
);

CREATE INDEX IF NOT EXISTS idx_waitlist_interest ON prelaunch_waitlist(product_interest);
