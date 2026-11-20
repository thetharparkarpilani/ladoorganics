-- Lado Organics 2.0 Email Templates (Migration 006)

CREATE TABLE IF NOT EXISTS email_templates (
  id VARCHAR(50) PRIMARY KEY,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed default templates
INSERT INTO email_templates (id, subject, html_content) VALUES
('order_confirmation', 'Your Lado Organics Order is Confirmed', '<div style="font-family: sans-serif; color: #2D241E;"><h2>Namaste {{name}},</h2><p>Your order for pure A2 Bilona Ghee is confirmed and will be dispatched from Pilani shortly.</p></div>'),
('booking_confirmation', 'Your Bhunga Stay in Pilani is Confirmed', '<div style="font-family: sans-serif; color: #2D241E;"><h2>Namaste {{name}},</h2><p>Your Deep Work Bhunga stay is confirmed. We look forward to hosting you.</p></div>'),
('sponsorship_update', 'Gau Seva: Update on your Sponsored Calf', '<div style="font-family: sans-serif; color: #2D241E;"><h2>Namaste {{name}},</h2><p>Thank you for your continued support of our Tharparkar herd.</p></div>')
ON CONFLICT (id) DO NOTHING;
