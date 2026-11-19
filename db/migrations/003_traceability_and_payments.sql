-- Lado Organics 2.0 Traceability & Payment Hardening (Migration 003)

CREATE TABLE IF NOT EXISTS product_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_code TEXT UNIQUE NOT NULL,
  product_slug TEXT NOT NULL,
  product_name TEXT NOT NULL,
  variant_label TEXT NOT NULL,
  production_date DATE NOT NULL,
  packaging_date DATE,
  origin_location TEXT NOT NULL DEFAULT 'Pilani, Jhunjhunu, Rajasthan',
  production_process TEXT NOT NULL,
  quality_checks TEXT NOT NULL,
  lab_report_url TEXT,
  storage_instructions TEXT NOT NULL,
  best_before_date DATE,
  is_approved BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS event_type TEXT,
  ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_product_batches_code ON product_batches(batch_code);

INSERT INTO product_batches (
  batch_code,
  product_slug,
  product_name,
  variant_label,
  production_date,
  packaging_date,
  origin_location,
  production_process,
  quality_checks,
  lab_report_url,
  storage_instructions,
  best_before_date,
  is_approved
) VALUES (
  'LO-PILANI-SAMPLE-001',
  'a2-bilona-ghee',
  'A2 Bilona Ghee',
  '1 litre',
  '2026-10-15',
  '2026-10-20',
  'Pilani, Jhunjhunu, Rajasthan',
  'Curd-cultured indigenous Tharparkar milk churned via traditional wooden Bilona method.',
  'Batch inspected at Pilani unit; lab report link populated only when uploaded by an authorized admin.',
  NULL,
  'Store in a cool, dry place away from direct sunlight. Use a dry spoon.',
  '2027-07-15',
  TRUE
) ON CONFLICT (batch_code) DO NOTHING;
