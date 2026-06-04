
DROP POLICY IF EXISTS "Anyone can place orders" ON public.orders;
CREATE POLICY "Authenticated users place own orders"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Insert order items" ON public.order_items;
CREATE POLICY "Insert items for own orders"
  ON public.order_items FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id AND o.user_id = auth.uid()
  ));
