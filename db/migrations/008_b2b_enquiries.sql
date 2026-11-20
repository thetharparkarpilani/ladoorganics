-- Lado Organics 2.0 Corporate & B2B Leads (Migration 008)

CREATE TABLE IF NOT EXISTS b2b_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  event_type TEXT,
  estimated_quantity TEXT NOT NULL,
  target_delivery_date DATE,
  requirements TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'negotiating', 'closed_won', 'closed_lost')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_b2b_status ON b2b_enquiries(status);
