-- Dedicated storage for corporate enquiries. Do not use audit_logs as a customer CRM.
CREATE TABLE IF NOT EXISTS public.corporate_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL CHECK (char_length(company_name) BETWEEN 1 AND 160),
  gst_number text CHECK (gst_number IS NULL OR char_length(gst_number) = 15),
  contact_name text NOT NULL CHECK (char_length(contact_name) BETWEEN 1 AND 120),
  phone text NOT NULL CHECK (char_length(phone) BETWEEN 7 AND 24),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 254),
  partnership_type text NOT NULL CHECK (char_length(partnership_type) BETWEEN 1 AND 80),
  message text CHECK (message IS NULL OR char_length(message) <= 2000),
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'closed', 'spam')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.corporate_enquiries ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.corporate_enquiries FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.corporate_enquiries TO service_role;

CREATE INDEX IF NOT EXISTS corporate_enquiries_created_at_idx
  ON public.corporate_enquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS corporate_enquiries_status_created_at_idx
  ON public.corporate_enquiries (status, created_at DESC);
