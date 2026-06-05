
-- 1) touch_updated_at: set search_path
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- 2) Revoke EXECUTE from anon/authenticated on trigger-only functions
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.decrement_stock_on_order() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.restore_stock_on_cancel() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM anon, authenticated, PUBLIC;

-- 3) Coupons: restrict reads to authenticated users (checkout requires auth)
DROP POLICY IF EXISTS "Public read active coupons" ON public.coupons;
CREATE POLICY "Authenticated read active coupons"
  ON public.coupons FOR SELECT TO authenticated
  USING (is_active = true);
REVOKE SELECT ON public.coupons FROM anon;

-- 4) Order items: cap quantity to prevent stock-drain abuse
ALTER TABLE public.order_items
  ADD CONSTRAINT order_items_quantity_reasonable CHECK (quantity > 0 AND quantity <= 100);
