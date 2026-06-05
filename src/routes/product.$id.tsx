import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { findProduct, relatedProducts, type Product } from "@/lib/products";
import { useShop, formatKsh } from "@/lib/shop";
import { Heart, ShieldCheck, Truck, RotateCcw, Sparkles, Minus, Plus, ZoomIn } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/product/$id")({
  head: ({ params }) => {
    const p = findProduct(params.id);
    return {
      meta: [
        { title: p ? `${p.name}, House of Azariah Gems` : "Product, House of Azariah Gems" },
        { name: "description", content: p?.description ?? "Luxury jewelry by House of Azariah Gems." },
        { property: "og:title", content: p?.name ?? "House of Azariah Gems" },
        { property: "og:description", content: p?.description ?? "Luxury jewelry." },
        ...(p ? [{ property: "og:image" as const, content: p.img }] : []),
      ],
    };
  },
  loader: ({ params }) => {
    const product = findProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  notFoundComponent: () => (
    <Layout>
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <h1 className="font-display text-4xl">Piece not found</h1>
        <p className="mt-3 text-muted-foreground">It may have been part of a private collection.</p>
        <Link to="/collections" className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm uppercase tracking-[0.2em] text-primary-foreground">
          Browse collection
        </Link>
      </div>
    </Layout>
  ),
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    console.error(error);
    return (
      <Layout>
        <div className="mx-auto max-w-xl px-6 py-32 text-center">
          <h1 className="font-display text-3xl">Something went wrong</h1>
          <p className="mt-3 text-sm text-muted-foreground">We couldn't load this product right now.</p>
          <button onClick={() => { router.invalidate(); reset(); }} className="mt-6 rounded-full border border-gold/60 px-6 py-3 text-sm uppercase tracking-[0.2em]">
            Try again
          </button>
        </div>
      </Layout>
    );
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData() as { product: Product };
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 });
  const { addToCart, toggleWishlist, inWishlist } = useShop();
  const router = useRouter();
  const related = relatedProducts(product.id);

  const buyNow = () => {
    addToCart(product.id, qty);
    router.navigate({ to: "/checkout" });
  };

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-20 md:px-10">
        <nav className="mb-8 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="px-2">/</span>
          <Link to="/collections" className="hover:text-primary">{product.category}</Link>
          <span className="px-2">/</span>
          <span className="text-foreground/80">{product.name}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <div
              className="relative aspect-square overflow-hidden rounded-2xl border border-border shadow-deep cursor-zoom-in"
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                setZoom({ on: true, x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
              }}
              onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))}
            >
              <img
                src={product.gallery[active]}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-300"
                style={zoom.on ? { transformOrigin: `${zoom.x}% ${zoom.y}%`, transform: "scale(2)" } : undefined}
              />
              <div className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-background/70 text-primary backdrop-blur">
                <ZoomIn className="h-4 w-4" />
              </div>
              {product.badge && (
                <span className="absolute left-4 top-4 rounded-full border border-gold/60 bg-background/70 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-primary backdrop-blur">
                  {product.badge}
                </span>
              )}
            </div>
            {product.gallery.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {product.gallery.map((g, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`aspect-square overflow-hidden rounded-lg border transition-all ${i === active ? "border-gold" : "border-border opacity-60 hover:opacity-100"}`}
                  >
                    <img src={g} alt={`${product.name} ${i + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-primary">{product.category}</span>
            <h1 className="mt-3 font-display text-4xl md:text-5xl leading-tight">{product.name}</h1>
            <div className="mt-3 flex items-center gap-2 text-primary text-sm">
              ★★★★★ <span className="text-muted-foreground">(128 reviews)</span>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-3xl text-primary">{formatKsh(product.price)}</span>
              {product.oldPrice && (
                <span className="text-sm text-muted-foreground line-through">{formatKsh(product.oldPrice)}</span>
              )}
              {product.oldPrice && (
                <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-accent">
                  Save {formatKsh(product.oldPrice - product.price)}
                </span>
              )}
            </div>

            <p className="mt-6 text-foreground/85 leading-relaxed">{product.description}</p>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center rounded-full border border-border">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-11 w-11 place-items-center hover:text-primary">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-display text-lg">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="grid h-11 w-11 place-items-center hover:text-primary">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={() => toggleWishlist(product.id)}
                aria-label="Wishlist"
                className={`grid h-11 w-11 place-items-center rounded-full border transition-colors ${
                  inWishlist(product.id) ? "border-accent bg-accent/15 text-accent" : "border-border hover:border-gold"
                }`}
              >
                <Heart className="h-4 w-4" fill={inWishlist(product.id) ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => addToCart(product.id, qty)}
                className="rounded-full border border-gold/60 px-7 py-4 text-sm font-semibold uppercase tracking-[0.2em] hover:bg-card"
              >
                Add to Cart
              </button>
              <button
                onClick={buyNow}
                className="rounded-full bg-primary px-7 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-gold hover:-translate-y-0.5 transition-transform"
              >
                Buy Now
              </button>
            </div>

            <ul className="mt-8 grid gap-2 rounded-xl border border-border bg-card/40 p-5 text-sm">
              {product.details.map((d) => (
                <li key={d} className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 mt-0.5 text-primary" /> <span>{d}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 grid gap-3 sm:grid-cols-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" />Lifetime care</div>
              <div className="flex items-center gap-2"><Truck className="h-4 w-4 text-primary" />Free KE delivery</div>
              <div className="flex items-center gap-2"><RotateCcw className="h-4 w-4 text-primary" />14-day returns</div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-24">
            <h2 className="mb-8 font-display text-3xl">You may also love</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to="/product/$id"
                  params={{ id: r.id }}
                  className="group overflow-hidden rounded-xl border border-border bg-card/60 transition-all hover:-translate-y-1 hover:border-gold shadow-deep"
                >
                  <div className="aspect-[4/5] overflow-hidden">
                    <img src={r.img} alt={r.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div className="p-5">
                    <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{r.category}</div>
                    <h3 className="mt-1 font-display text-xl">{r.name}</h3>
                    <div className="mt-2 text-primary font-semibold">{formatKsh(r.price)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}
