-- Prevent reuse of a manually verified UPI transaction reference across orders.
CREATE UNIQUE INDEX IF NOT EXISTS payments_manual_upi_reference_unique
  ON public.payments (provider_payment_id)
  WHERE provider = 'manual_upi' AND provider_payment_id IS NOT NULL;
