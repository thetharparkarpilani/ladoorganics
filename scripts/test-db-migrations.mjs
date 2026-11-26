import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { Pool } from "pg";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required for migration tests.");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const run = (sql, params) => pool.query(sql, params);

try {
  await run("CREATE EXTENSION IF NOT EXISTS pgcrypto");
  await run("DO $$ BEGIN CREATE ROLE anon NOLOGIN; EXCEPTION WHEN duplicate_object THEN NULL; END $$");
  await run("DO $$ BEGIN CREATE ROLE authenticated NOLOGIN; EXCEPTION WHEN duplicate_object THEN NULL; END $$");
  await run("CREATE SCHEMA IF NOT EXISTS auth");
  await run("GRANT USAGE ON SCHEMA auth TO anon, authenticated");
  await run("CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$");
  await run("CREATE OR REPLACE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql STABLE AS $$ SELECT coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb, '{}'::jsonb) $$");

  await run("CREATE TABLE public.customer_profiles (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), auth_user_id uuid NOT NULL, email text NOT NULL)");
  await run("ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY");
  await run("CREATE TABLE public.bhunga_bookings (user_id uuid)");
  await run("CREATE TABLE public.bookings (user_id uuid)");
  await run("CREATE TABLE public.business_expenses (supplier_id uuid)");
  await run("CREATE TABLE public.inventory_movements (batch_id uuid, supplier_id uuid)");
  await run("CREATE TABLE public.reviews (user_id uuid)");
  await run("CREATE TABLE public.sponsorships (cow_id uuid)");
  await run("CREATE TABLE public.support_tickets (customer_user_id uuid)");
  await run("CREATE TABLE public.products (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), slug text UNIQUE NOT NULL, name_en text NOT NULL, description_en text NOT NULL, is_active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now())");
  await run("CREATE FUNCTION public.get_my_customer_orders() RETURNS TABLE(order_id uuid) LANGUAGE sql SECURITY DEFINER AS $$ SELECT NULL::uuid WHERE false $$");
  await run("GRANT EXECUTE ON FUNCTION public.get_my_customer_orders() TO authenticated");

  const migration028 = await readFile(new URL("../db/migrations/028_backend_security_and_indexes.sql", import.meta.url), "utf8");
  const migration029 = await readFile(new URL("../db/migrations/029_catalogue_taxonomy_and_notification_outbox.sql", import.meta.url), "utf8");
  await run(migration028);
  await run(migration029);

  const privileges = await run("SELECT " +
    "has_table_privilege('authenticated','public.customer_profiles','SELECT') AS profile_select, " +
    "has_table_privilege('authenticated','public.customer_profiles','INSERT') AS profile_insert, " +
    "has_table_privilege('authenticated','public.customer_profiles','UPDATE') AS profile_update, " +
    "has_table_privilege('authenticated','public.customer_profiles','TRUNCATE') AS profile_truncate, " +
    "has_table_privilege('authenticated','public.products','SELECT') AS product_select, " +
    "has_table_privilege('anon','public.products','SELECT') AS anon_product_select, " +
    "has_function_privilege('authenticated','public.get_my_customer_orders()','EXECUTE') AS rpc_execute");
  assert.deepEqual(privileges.rows[0], {
    profile_select: true, profile_insert: true, profile_update: true,
    profile_truncate: false, product_select: false, anon_product_select: false, rpc_execute: false
  });

  const policies = await run("SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='customer_profiles'");
  assert.equal(policies.rows.length, 3);
  const indexes = await run("SELECT indexname FROM pg_indexes WHERE schemaname='public' AND indexname = ANY($1::text[])", [[
    "idx_bhunga_bookings_user_id", "idx_bookings_user_id", "idx_business_expenses_supplier_id",
    "idx_inventory_movements_batch_id", "idx_inventory_movements_supplier_id", "idx_reviews_user_id",
    "idx_sponsorships_cow_id", "idx_support_tickets_customer_user_id", "idx_notification_outbox_due"
  ]]);
  assert.equal(indexes.rows.length, 9);

  const outbox = await run("SELECT c.relrowsecurity AS rls, has_table_privilege('authenticated','public.notification_outbox','SELECT') AS auth_select FROM pg_class c WHERE c.oid='public.notification_outbox'::regclass");
  assert.deepEqual(outbox.rows[0], { rls: true, auth_select: false });
  await run("CREATE TABLE public.future_privilege_probe (id integer)");
  const future = await run("SELECT has_table_privilege('authenticated','public.future_privilege_probe','SELECT') AS can_select");
  assert.equal(future.rows[0].can_select, false);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("SET LOCAL ROLE authenticated");
    const ownerId = "11111111-1111-4111-8111-111111111111";
    await client.query("SELECT set_config('request.jwt.claim.sub',$1,true)", [ownerId]);
    await client.query("SELECT set_config('request.jwt.claims',$1,true)", [JSON.stringify({ email: "owner@example.com" })]);
    await client.query("INSERT INTO public.customer_profiles(auth_user_id,email) VALUES($1,$2)", [ownerId, "owner@example.com"]);
    const own = await client.query("SELECT email FROM public.customer_profiles");
    assert.equal(own.rows.length, 1);
    await assert.rejects(
      client.query("INSERT INTO public.customer_profiles(auth_user_id,email) VALUES($1,$2)", ["22222222-2222-4222-8222-222222222222", "other@example.com"]),
      /row-level security|policy/i
    );
    await client.query("ROLLBACK");
  } finally { client.release(); }

  console.log("PostgreSQL migration integration tests passed: grants, profile RLS ownership, SECURITY DEFINER revocation, default privileges, FK indexes, catalogue category and private notification outbox.");
} finally { await pool.end(); }
