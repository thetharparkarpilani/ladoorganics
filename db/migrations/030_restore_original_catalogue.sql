-- 030: Restore the original Lado Organics starter catalogue after the live
-- catalogue was cleared. Product names, descriptions, SKUs, pack labels and
-- prices are taken from the repository's original db/seed.sql. Stock is set
-- to the owner's confirmed quantity of 100 for every restored variant.
-- Existing prices and variant metadata are preserved on conflict.
BEGIN;

INSERT INTO public.products (id, slug, name_en, description_en, business_category, is_active)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'a2-bilona-ghee', 'A2 Bilona Ghee',
   'Ethically sourced, hand-churned from indigenous Tharparkar cow milk using the Vedic Bilona method.',
   'food', TRUE),
  ('22222222-2222-2222-2222-222222222222', 'tharparkar-dhoop', 'Tharparkar Dhoop',
   'Pure cow dung and natural binders for air purification.',
   'non_food', TRUE),
  ('33333333-3333-3333-3333-333333333333', 'pure-kechua-khad', 'Pure Kechua Khad',
   'Nutrient-dense organic vermicompost fed by our biogas slurry.',
   'non_food', TRUE),
  ('44444444-4444-4444-4444-444444444444', 'deep-work-bhunga-stay', '"Deep Work" Bhunga Stay',
   'Climate-responsive mud-house architecture in Pilani.',
   'experience', TRUE)
ON CONFLICT (slug) DO UPDATE
SET is_active = TRUE,
    business_category = EXCLUDED.business_category;

INSERT INTO public.product_variants (product_id, sku, label, price_inr, stock_qty, is_default)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'LO-GHEE-1L', '1 Liter', 5000, 100, TRUE),
  ('22222222-2222-2222-2222-222222222222', 'LO-DHOOP-BOX', 'Box', 1000, 100, TRUE),
  ('33333333-3333-3333-3333-333333333333', 'LO-KHAD-5KG', '5kg Bag', 2000, 100, TRUE),
  ('44444444-4444-4444-4444-444444444444', 'LO-STAY-NIGHT', 'Night', 4000, 100, TRUE)
ON CONFLICT (sku) DO UPDATE
SET stock_qty = 100;

COMMIT;
