-- Restrict coupon SELECT to staff only
DROP POLICY IF EXISTS "Authenticated read active coupons" ON public.coupons;

-- Customers can read payments for their own orders
CREATE POLICY "Customers read own payments" ON public.payments
FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = payments.order_id AND (o.user_id = auth.uid() OR public.is_staff(auth.uid()))));