-- Lado Organics customer profiles linked to Supabase Auth.
-- Run this migration in the Supabase SQL Editor for the lado-organics project.

CREATE TABLE IF NOT EXISTS public.customer_profiles (
  auth_user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT NOT NULL DEFAULT 'India',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON public.customer_profiles TO authenticated;

DROP POLICY IF EXISTS "Customers can view their own profile" ON public.customer_profiles;
CREATE POLICY "Customers can view their own profile"
  ON public.customer_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_user_id);

DROP POLICY IF EXISTS "Customers can create their own profile" ON public.customer_profiles;
CREATE POLICY "Customers can create their own profile"
  ON public.customer_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = auth_user_id);

DROP POLICY IF EXISTS "Customers can update their own profile" ON public.customer_profiles;
CREATE POLICY "Customers can update their own profile"
  ON public.customer_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_user_id)
  WITH CHECK (auth.uid() = auth_user_id);

CREATE INDEX IF NOT EXISTS idx_customer_profiles_email
  ON public.customer_profiles (LOWER(email));
