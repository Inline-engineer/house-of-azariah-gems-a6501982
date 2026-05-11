import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { useShop, formatKsh } from "@/lib/shop";
import { CreditCard, Smartphone, Wallet, Lock } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout, House of Azariah Gems" }, { name: "description", content: "Secure checkout with M-Pesa, Card or PayPal." }] }),
  component: Checkout,
});

type Pay = "mpesa" | "card" | "paypal";

function Checkout() {
  const { detailedCart, cartTotal, cartCount, clearCart } = useShop();
  const router = useRouter();
  const [pay, setPay] = useState<Pay>("mpesa");
  const [submitting, setSubmitting] = useState(false);

  const shipping = cartTotal > 50000 ? 0 : 800;
  const total = cartTotal + shipping;

  if (cartCount === 0) {
    return (
      <Layout>
        <div className="mx-auto max-w-xl px-6 py-32 text-center">
          <h1 className="font-display text-4xl">Your cart is empty</h1>
          <Link to="/collections" className="mt-8 inline-block rounded-full bg-primary px-6 py-3 text-sm uppercase tracking-[0.2em] text-primary-foreground">
            Browse Collection
          </Link>
        </div>
      </Layout>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      const orderId = "AZ" + Math.floor(100000 + Math.random() * 900000);
      clearCart();
      router.navigate({ to: "/thank-you", search: { order: orderId } });
    }, 1200);
  };

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-primary">Secure Checkout</span>
          <h1 className="mt-3 font-display text-5xl md:text-6xl">Almost Yours</h1>
        </div>

        <form onSubmit={submit} className="mt-14 grid gap-10 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-2xl border border-border bg-card/60 p-7 shadow-deep">
              <h3 className="font-display text-xl">Contact</h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="First name" required />
                <Field label="Last name" required />
                <Field label="Email" type="email" required />
                <Field label="Phone (M-Pesa)" type="tel" required placeholder="+254 ..." />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card/60 p-7 shadow-deep">
              <h3 className="font-display text-xl">Delivery</h3>
              <div className="mt-5 grid gap-4">
                <Field label="Address" required />
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="City" required />
                  <Field label="Region / County" required />
                  <Field label="Postal code" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-primary">Country</label>
                  <select required className="mt-2 w-full rounded-md border border-border bg-background/50 px-4 py-3 text-sm focus:border-gold focus:outline-none">
                    <option>Kenya</option><option>Uganda</option><option>Tanzania</option><option>Rwanda</option>
                    <option>Nigeria</option><option>South Africa</option><option>United Kingdom</option><option>United States</option><option>UAE</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card/60 p-7 shadow-deep">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl">Payment</h3>
                <span className="flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  <Lock className="h-3 w-3 text-primary" /> 256-bit secure
                </span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  { id: "mpesa" as Pay, label: "M-Pesa", icon: Smartphone },
                  { id: "card" as Pay, label: "Card", icon: CreditCard },
                  { id: "paypal" as Pay, label: "PayPal", icon: Wallet },
                ].map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setPay(opt.id)}
                      className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                        pay === opt.id ? "border-gold bg-primary/10" : "border-border hover:border-gold/60"
                      }`}
                    >
                      <Icon className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-sm font-semibold">{opt.label}</div>
                        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                          {opt.id === "mpesa" ? "Lipa na M-Pesa" : opt.id === "card" ? "Visa · MC" : "PayPal balance"}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6">
                {pay === "mpesa" && (
                  <div className="rounded-lg border border-border bg-background/40 p-4 text-sm text-foreground/85 space-y-1">
                    <p>Send <strong>{formatKsh(total)}</strong> via M-Pesa to <strong>+254 716 838572</strong> (Grace Gitonga).</p>
                    <p className="text-foreground/70">Use your order name as the reference. We'll confirm via WhatsApp within minutes.</p>
                  </div>
                )}
                {pay === "card" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2"><Field label="Card number" placeholder="•••• •••• •••• ••••" required /></div>
                    <Field label="Name on card" required />
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="MM/YY" required />
                      <Field label="CVC" required />
                    </div>
                  </div>
                )}
                {pay === "paypal" && (
                  <div className="rounded-lg border border-border bg-background/40 p-4 text-sm text-foreground/85">
                    You'll be redirected to PayPal to complete payment securely.
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="h-fit space-y-3 rounded-2xl border border-gold/40 bg-gradient-emerald p-7 shadow-gold">
            <h3 className="font-display text-2xl">Your Order</h3>
            <ul className="mt-2 max-h-64 space-y-3 overflow-y-auto pr-1">
              {detailedCart.map(({ product, qty }) => (
                <li key={product.id} className="flex items-center gap-3 text-sm">
                  <img src={product.img} alt={product.name} className="h-12 w-12 rounded object-cover" />
                  <div className="flex-1">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-[11px] text-foreground/70">× {qty}</div>
                  </div>
                  <div className="text-primary font-semibold">{formatKsh(product.price * qty)}</div>
                </li>
              ))}
            </ul>
            <div className="gold-divider my-4" />
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatKsh(cartTotal)}</dd></div>
              <div className="flex justify-between"><dt>Shipping</dt><dd>{shipping === 0 ? "Free" : formatKsh(shipping)}</dd></div>
              <div className="flex justify-between text-lg pt-2"><dt className="font-display">Total</dt><dd className="font-display text-primary">{formatKsh(total)}</dd></div>
            </dl>
            <button
              disabled={submitting}
              className="mt-4 w-full rounded-full bg-primary py-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-gold disabled:opacity-60"
            >
              {submitting ? "Processing..." : `Pay ${formatKsh(total)}`}
            </button>
            <p className="mt-2 text-center text-[11px] uppercase tracking-[0.2em] text-foreground/70">Order ships in 24h</p>
          </aside>
        </form>
      </section>
    </Layout>
  );
}

function Field({ label, type = "text", required, placeholder }: { label: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.2em] text-primary">{label}</label>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        maxLength={150}
        className="mt-2 w-full rounded-md border border-border bg-background/50 px-4 py-3 text-sm focus:border-gold focus:outline-none"
      />
    </div>
  );
}
