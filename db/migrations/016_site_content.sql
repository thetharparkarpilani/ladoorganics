-- 016: Small, safe website content controls.
CREATE TABLE IF NOT EXISTS public.site_content (
  content_key TEXT PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.site_content (content_key, title, body, is_published)
VALUES
  ('announcement', 'A note from Lado Organics', '', FALSE),
  ('farm_note', 'A note from our farm', '', FALSE)
ON CONFLICT (content_key) DO NOTHING;
