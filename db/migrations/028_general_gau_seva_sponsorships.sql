-- Replace unverified animal-specific sponsorship options with a general Gau Seva enquiry.
-- The sponsorships table was confirmed empty before this constraint change.
ALTER TABLE public.sponsorships
  DROP CONSTRAINT IF EXISTS sponsorships_calf_name_check;

ALTER TABLE public.sponsorships
  ADD CONSTRAINT sponsorships_calf_name_check
  CHECK (calf_name = 'General Gau Seva');
