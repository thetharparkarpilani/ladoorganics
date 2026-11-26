-- 028: Tighten Supabase Data API privileges and optimize core foreign-key lookups.
--
-- The application uses the Next.js server as its trusted data-access layer.
-- The only intentional browser-to-Data-API table access is customer_profiles,
-- protected by auth.uid()-scoped RLS policies and the user's access token.
--
-- Migration 023 revoked anon privileges but left broad default Supabase
-- authenticated grants on several public tables. In particular, authenticated
-- had TRUNCATE on ai_knowledge, site_content, staff_accounts and customer_profiles.
-- RLS does not protect against TRUNCATE, so remove all unnecessary table grants.

REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM anon, authenticated;

-- Keep the profile endpoint working: it uses the signed-in user's JWT and
-- customer_profiles RLS policies to read/create/update only that user's row.
GRANT SELECT, INSERT, UPDATE ON TABLE public.customer_profiles TO authenticated;

REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;

-- New application tables created by the postgres migration owner must not
-- inherit broad Data API privileges.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL ON TABLES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL ON SEQUENCES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC, anon, authenticated;

-- The application retrieves order history through its authenticated Next.js
-- API route, not through PostgREST RPC. Close the unused SECURITY DEFINER RPC
-- surface so signed-in users cannot invoke a privileged database function.
REVOKE ALL PRIVILEGES ON FUNCTION public.get_my_customer_orders()
  FROM PUBLIC, anon, authenticated;

-- Cache auth.uid() once per statement in profile RLS checks.
DROP POLICY IF EXISTS "Customers can view their own profile" ON public.customer_profiles;
CREATE POLICY "Customers can view their own profile"
  ON public.customer_profiles FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = auth_user_id);

DROP POLICY IF EXISTS "Customers can create their own profile" ON public.customer_profiles;
CREATE POLICY "Customers can create their own profile"
  ON public.customer_profiles FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = auth_user_id);

DROP POLICY IF EXISTS "Customers can update their own profile" ON public.customer_profiles;
CREATE POLICY "Customers can update their own profile"
  ON public.customer_profiles FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = auth_user_id)
  WITH CHECK ((SELECT auth.uid()) = auth_user_id);

-- Cover the foreign keys reported by Supabase's performance advisor.
CREATE INDEX IF NOT EXISTS idx_bhunga_bookings_user_id
  ON public.bhunga_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id
  ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_business_expenses_supplier_id
  ON public.business_expenses(supplier_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_batch_id
  ON public.inventory_movements(batch_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_supplier_id
  ON public.inventory_movements(supplier_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id
  ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_sponsorships_cow_id
  ON public.sponsorships(cow_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_customer_user_id
  ON public.support_tickets(customer_user_id);
