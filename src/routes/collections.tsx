import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { PRODUCTS } from "@/lib/products";
import { useShop, formatKsh } from "@/lib/shop";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title: "Collections — House of Azariah Gems" },
      { name: "description", content: "Explore earrings, chains, rings, watches, bridal jewelry and more from House of Azariah Gems." },
    ],
  }),
  component: Collections,
});

const categories = ["All", "Earrings", "Chains", "Rings", "Bracelets", "Watches", "Bridal"] as const;
const sorts = ["Latest", "Popularity", "Price: Low → High", "Price: High → Low"] as const;

function Collections() {
  const [cat, setCat] = useState<(typeof categories)[number]>("All");
  const [sort, setSort] = useState<(typeof sorts)[number]>("Latest");
  const { addToCart } = useShop();

  const list = useMemo(() => {
    let l = cat === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat);
    if (sort === "Price: Low → High") l = [...l].sort((a, b) => a.price - b.price);
    if (sort === "Price: High → Low") l = [...l].sort((a, b) => b.price - a.price);
    if (sort === "Popularity") l = [...l].sort((a, b) => b.popularity - a.popularity);
    if (sort === "Latest") l = [...l].sort((a, b) => b.createdAt - a.createdAt);
    return l;
  }, [cat, sort]);

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-primary">The Boutique</span>
          <h1 className="mt-3 font-display text-5xl md:text-6xl">Collections</h1>
          <p className="mx-auto mt-4 max-w-xl text-foreground/80">Filter by category and find the piece that finds you.</p>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors ${
                  cat === c ? "border-gold bg-primary text-primary-foreground" : "border-border hover:border-gold"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as (typeof sorts)[number])}
            className="rounded-full border border-border bg-card px-4 py-2 text-xs uppercase tracking-[0.2em] focus:border-gold focus:outline-none"
          >
            {sorts.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <article key={p.id} className="group overflow-hidden rounded-xl border border-border bg-card/60 transition-all hover:-translate-y-1 hover:border-gold shadow-deep">
              <Link to="/product/$id" params={{ id: p.id }} className="relative block aspect-[4/5] overflow-hidden">
                <img src={p.img} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                {p.badge && (
                  <span className="absolute left-4 top-4 rounded-full border border-gold/60 bg-background/70 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-primary backdrop-blur">
                    {p.badge}
                  </span>
                )}
              </Link>
              <div className="p-5">
                <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{p.category}</div>
                <Link to="/product/$id" params={{ id: p.id }} className="mt-1 block font-display text-xl hover:text-primary">
                  {p.name}
                </Link>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-semibold text-primary">{formatKsh(p.price)}</span>
                  <button
                    onClick={() => addToCart(p.id, 1)}
                    className="rounded-full border border-gold/50 px-4 py-2 text-[11px] uppercase tracking-[0.2em] hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}
