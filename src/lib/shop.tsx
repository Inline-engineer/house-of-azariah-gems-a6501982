import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { PRODUCTS, type Product } from "./products";

export type CartItem = { id: string; qty: number };

type Store = {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (id: string, qty?: number) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  inWishlist: (id: string) => boolean;
  cartCount: number;
  cartTotal: number;
  detailedCart: { product: Product; qty: number }[];
};

const Ctx = createContext<Store | null>(null);

const KEY_CART = "azariah:cart";
const KEY_WISH = "azariah:wishlist";

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const c = localStorage.getItem(KEY_CART);
      const w = localStorage.getItem(KEY_WISH);
      if (c) setCart(JSON.parse(c));
      if (w) setWishlist(JSON.parse(w));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) localStorage.setItem(KEY_CART, JSON.stringify(cart)); }, [cart, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem(KEY_WISH, JSON.stringify(wishlist)); }, [wishlist, hydrated]);

  const addToCart = useCallback((id: string, qty = 1) => {
    setCart((prev) => {
      const f = prev.find((i) => i.id === id);
      if (f) return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i));
      return [...prev, { id, qty }];
    });
  }, []);
  const removeFromCart = useCallback((id: string) => setCart((p) => p.filter((i) => i.id !== id)), []);
  const setQty = useCallback((id: string, qty: number) => {
    setCart((p) => p.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)));
  }, []);
  const clearCart = useCallback(() => setCart([]), []);
  const toggleWishlist = useCallback((id: string) => {
    setWishlist((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }, []);
  const inWishlist = useCallback((id: string) => wishlist.includes(id), [wishlist]);

  const value = useMemo<Store>(() => {
    const detailedCart = cart
      .map((c) => ({ product: PRODUCTS.find((p) => p.id === c.id)!, qty: c.qty }))
      .filter((x) => !!x.product);
    const cartCount = cart.reduce((a, c) => a + c.qty, 0);
    const cartTotal = detailedCart.reduce((a, x) => a + x.product.price * x.qty, 0);
    return { cart, wishlist, addToCart, removeFromCart, setQty, clearCart, toggleWishlist, inWishlist, cartCount, cartTotal, detailedCart };
  }, [cart, wishlist, addToCart, removeFromCart, setQty, clearCart, toggleWishlist, inWishlist]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useShop() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useShop must be used inside ShopProvider");
  return ctx;
}

export const formatKsh = (n: number) => `KSh ${n.toLocaleString()}`;
