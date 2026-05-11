import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import catEarrings from "@/assets/cat-earrings.jpg";
import catChains from "@/assets/cat-chains.jpg";
import catRings from "@/assets/cat-rings.jpg";
import catBracelets from "@/assets/cat-bracelets.jpg";

export const Route = createFileRoute("/new-arrivals")({
  head: () => ({
    meta: [
      { title: "New Arrivals — House of Azariah Gems" },
      { name: "description", content: "The latest emerald & gold drops from the Azariah atelier." },
    ],
  }),
  component: NewArrivals,
});

const drops = [
  { name: "Empress Emerald Halo Ring", price: "KSh 890", img: catRings },
  { name: "Azariah Drop Earrings", price: "KSh 329", img: catEarrings },
  { name: "Heritage Cuban Chain", price: "KSh 540", img: catChains },
  { name: "Eternity Emerald Bracelet", price: "KSh 760", img: catBracelets },
];

function NewArrivals() {
  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-6 py-24 md:px-10">
        <div className="text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-primary">This Week</span>
          <h1 className="mt-3 font-display text-5xl md:text-6xl">New Arrivals</h1>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {drops.map((d, i) => (
            <article key={d.name} className={`group relative overflow-hidden rounded-2xl border border-border shadow-deep ${i % 2 ? "md:mt-12" : ""}`}>
              <div className="aspect-[5/6] overflow-hidden">
                <img src={d.img} alt={d.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8">
                <div className="gold-divider mb-4 w-12" />
                <h3 className="font-display text-3xl">{d.name}</h3>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-primary text-lg font-semibold">{d.price}</span>
                  <Link to="/collections" className="rounded-full bg-primary px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-primary-foreground shadow-gold">
                    Shop
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}
