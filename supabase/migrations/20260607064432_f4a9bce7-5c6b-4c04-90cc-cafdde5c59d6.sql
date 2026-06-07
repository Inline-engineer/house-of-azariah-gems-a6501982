CREATE TABLE public.shipping_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  region text,
  fee numeric NOT NULL DEFAULT 0,
  free_over numeric,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.shipping_zones TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shipping_zones TO authenticated;
GRANT ALL ON public.shipping_zones TO service_role;

ALTER TABLE public.shipping_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active zones" ON public.shipping_zones
  FOR SELECT TO anon, authenticated USING (is_active = true OR public.is_staff(auth.uid()));

CREATE POLICY "Staff manage zones" ON public.shipping_zones
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER trg_shipping_zones_touch BEFORE UPDATE ON public.shipping_zones
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.shipping_zones (name, region, fee, free_over, sort_order) VALUES
  ('Nairobi CBD & suburbs', 'Nairobi', 400, 50000, 1),
  ('Greater Nairobi (Kiambu, Kajiado, Machakos)', 'Nairobi Metro', 600, 50000, 2),
  ('Other major towns (Mombasa, Kisumu, Nakuru, Eldoret)', 'Kenya', 900, 50000, 3),
  ('Rest of Kenya', 'Kenya', 1200, 60000, 4),
  ('East Africa (UG, TZ, RW)', 'East Africa', 3500, NULL, 5),
  ('Rest of Africa', 'Africa', 6500, NULL, 6),
  ('International', 'Worldwide', 9500, NULL, 7);