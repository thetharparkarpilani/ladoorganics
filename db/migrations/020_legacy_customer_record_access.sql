-- 020: Preserve access to legacy customer-linked records.
-- Safe to run repeatedly after migration 019.

ALTER TABLE public.sponsorships
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE SET NULL;

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE SET NULL;

UPDATE public.sponsorships s
   SET sponsor_name = COALESCE(NULLIF(s.sponsor_name, ''), u.full_name),
       sponsor_email = COALESCE(NULLIF(s.sponsor_email, ''), u.email)
  FROM public.users u
 WHERE s.user_id = u.id
   AND (s.sponsor_name IS NULL OR s.sponsor_name = '' OR s.sponsor_email IS NULL OR s.sponsor_email = '');

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = 'sponsorships' AND column_name = 'cow_id'
  ) AND to_regclass('public.cow_profiles') IS NOT NULL THEN
    EXECUTE $sql$
      UPDATE public.sponsorships s
         SET calf_name = COALESCE(NULLIF(s.calf_name, ''), c.name)
        FROM public.cow_profiles c
       WHERE s.cow_id = c.id
         AND (s.calf_name IS NULL OR s.calf_name = '')
    $sql$;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_sponsorships_user_id
  ON public.sponsorships(user_id)
  WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_bookings_user_id
  ON public.bookings(user_id)
  WHERE user_id IS NOT NULL;
