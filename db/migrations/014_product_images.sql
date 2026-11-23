-- Product image URLs managed from the admin dashboard.
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS image_url TEXT;

COMMENT ON COLUMN products.image_url IS
  'Public HTTPS image URL used for the product card and product details.';
