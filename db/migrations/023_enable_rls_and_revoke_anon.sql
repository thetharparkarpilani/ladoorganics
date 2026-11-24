-- Security hardening: prevent direct Supabase REST access to application tables.
-- The Next.js server must connect with a trusted database role (normally postgres via
-- the Supabase transaction pooler). RLS remains enabled even for tables created later.
-- Existing policies (notably customer_profiles) are intentionally preserved.

DO $$
DECLARE
  table_record RECORD;
BEGIN
  FOR table_record IN
    SELECT schemaname, tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format(
      'ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY',
      table_record.schemaname,
      table_record.tablename
    );
  END LOOP;
END
$$;

-- The browser must never use the anon role to access application data directly.
-- Public catalog and checkout access is served through validated Next.js routes.
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon;

-- Prevent future objects created by the migration owner from inheriting anon grants.
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon;
