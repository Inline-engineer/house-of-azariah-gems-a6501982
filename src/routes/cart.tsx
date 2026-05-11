import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { useShop, formatKsh } from "@/lib/shop";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — House of Azariah Gems" }, { name: "description", content: "Your selected pieces." }] }),
  component: Cart,
});

function Cart() {
  const { detailedCart, setQty, removeFromCart, cartTotal, cartCount } = useShop();
  const shipping = cartTotal > 50000 ? 0 : 800;
  const total = cartTotal + shipping;

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-primary">Your Selection</span>
          <h1 className="mt-3 font-display text-5xl md:text-6xl">Cart</h1>
        </div>

        {cartCount === 0 ? (
          <div className="mt-16 rounded-2xl border border-border bg-card/60 p-16 text-center shadow-deep">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-gold/50 text-primary">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <h2 className="mt-6 font-display text-3xl">Your cart is empty</h2>
            <p className="mt-3 text-muted-foreground">Begin with a piece that finds you.</p>
            <Link to="/collections" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-sm uppercase tracking-[0.2em] text-primary-foreground shadow-gold">
              Browse Collection <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid gap-10 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {detailedCart.map(({ product, qty }) => (
                <div key={product.id} className="flex gap-4 rounded-xl border border-border bg-card/60 p-4 shadow-deep">
                  <Link to="/product/$id" params={{ id: product.id }} className="block aspect-square w-28 shrink-0 overflow-hidden rounded-lg">
                    <img src={product.img} alt={product.name} className="h-full w-full object-cover" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{product.category}</div>
                        <Link to="/product/$id" params={{ id: product.id }} className="font-display text-lg hover:text-primary">{product.name}</Link>
                      </div>
                      <button onClick={() => removeFromCart(product.id)} aria-label="Remove" className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-end justify-between pt-3">
                      <div className="flex items-center rounded-full border border-border">
                        <button onClick={() => setQty(product.id, qty - 1)} className="grid h-9 w-9 place-items-center"><Minus className="h-3.5 w-3.5" /></button>
                        <span className="w-8 text-center text-sm">{qty}</span>
                        <button onClick={() => setQty(product.id, qty + 1)} className="grid h-9 w-9 place-items-center"><Plus className="h-3.5 w-3.5" /></button>
                      </div>
                      <div className="text-primary font-semibold">{formatKsh(product.price * qty)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="h-fit rounded-2xl border border-gold/40 bg-gradient-emerald p-7 shadow-gold">
              <h3 className="font-display text-2xl">Order Summary</h3>
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between"><dt className="text-foreground/80">Subtotal</dt><dd>{formatKsh(cartTotal)}</dd></div>
                <div className="flex justify-between"><dt className="text-foreground/80">Shipping</dt><dd>{shipping === 0 ? "Free" : formatKsh(shipping)}</dd></div>
                <div className="gold-divider my-3" />
                <div className="flex justify-between text-lg"><dt className="font-display">Total</dt><dd className="font-display text-primary">{formatKsh(total)}</dd></div>
              </dl>
              <Link to="/checkout" className="mt-6 flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-gold hover:-translate-y-0.5 transition-transform">
                Checkout <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-3 text-center text-[11px] uppercase tracking-[0.2em] text-foreground/70">Free delivery over KSh 50,000</p>
            </aside>
          </div>
        )}
      </section>
    </Layout>
  );
}
