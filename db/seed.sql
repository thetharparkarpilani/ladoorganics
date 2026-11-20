-- seed.sql
INSERT INTO products (id, slug, name_en, description_en) VALUES
  ('11111111-1111-1111-1111-111111111111', 'a2-bilona-ghee', 'A2 Bilona Ghee', 'Ethically sourced, hand-churned from indigenous Tharparkar cow milk using the Vedic Bilona method.'),
  ('22222222-2222-2222-2222-222222222222', 'tharparkar-dhoop', 'Tharparkar Dhoop', 'Pure cow dung and natural binders for air purification.'),
  ('33333333-3333-3333-3333-333333333333', 'pure-kechua-khad', 'Pure Kechua Khad', 'Nutrient-dense organic vermicompost fed by our biogas slurry.'),
  ('44444444-4444-4444-4444-444444444444', 'deep-work-bhunga-stay', '"Deep Work" Bhunga Stay', 'Climate-responsive mud-house architecture in Pilani.')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO product_variants (product_id, sku, label, price_inr, stock_qty, is_default) VALUES
  ('11111111-1111-1111-1111-111111111111', 'LO-GHEE-1L', '1 Liter', 5000, 25, TRUE),
  ('22222222-2222-2222-2222-222222222222', 'LO-DHOOP-BOX', 'Box', 1000, 50, TRUE),
  ('33333333-3333-3333-3333-333333333333', 'LO-KHAD-5KG', '5kg Bag', 2000, 30, TRUE),
  ('44444444-4444-4444-4444-444444444444', 'LO-STAY-NIGHT', 'Night', 4000, 10, TRUE)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO cow_profiles (name, description) VALUES
  ('Dholi Sheri', 'Pure Tharparkar Calf'),
  ('Tara', 'Pure Tharparkar Calf'),
  ('Roshni', 'Pure Tharparkar Calf')
ON CONFLICT (name) DO NOTHING;
