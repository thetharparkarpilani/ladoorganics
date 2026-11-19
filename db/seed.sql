-- Lado Organics 2.0 Initial Seed Data (Pilani, Rajasthan)
INSERT INTO categories (slug, name_en, name_hi, name_ma) VALUES
  ('dairy-ghee', 'A2 Bilona Ghee', 'A2 बिलोना घी', 'A2 बिलोना घी'),
  ('sacred-dhoop', 'Tharparkar Dhoop', 'थारपारकर धूप', 'थारपारकर धूप'),
  ('soil-compost', 'Pure Kechua Khad', 'केंचुआ खाद', 'केंचुआ खाद'),
  ('farm-stays', 'Bhunga Farm Stays', 'भुंगा फार्म स्टे', 'भुंगा स्टे')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (slug, name_en, name_hi, name_ma, description_en, sourcing_info, production_method, storage_instructions) VALUES
  ('a2-bilona-ghee', 'A2 Bilona Ghee', 'A2 बिलोना घी', 'A2 बिलोना घी', 'Hand-churned from indigenous Tharparkar cow curd using the Vedic Bilona method.', 'Pilani Gaushala, Rajasthan', 'Curd-churned wooden Bilona process', 'Store in a cool, dry place away from direct sunlight.')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO cow_profiles (slug, name, breed, story, sponsorship_available, monthly_amount_inr) VALUES
  ('dholi-sheri', 'Dholi Sheri', 'Tharparkar', 'Indigenous Tharparkar calf at the Pilani Gaushala.', TRUE, NULL),
  ('tara', 'Tara', 'Tharparkar', 'Indigenous Tharparkar calf at the Pilani Gaushala.', TRUE, NULL),
  ('roshni', 'Roshni', 'Tharparkar', 'Indigenous Tharparkar calf at the Pilani Gaushala.', TRUE, NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO bhunga_stays (slug, title, nightly_rate_inr, max_guests, description) VALUES
  ('deep-work-bhunga', '"Deep Work" Bhunga Stay', 4000, 2, 'Climate-responsive mud architecture in Pilani for focused work and farm living.')
ON CONFLICT (slug) DO NOTHING;
