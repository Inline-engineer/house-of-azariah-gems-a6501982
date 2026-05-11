import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import heroImg from "@/assets/hero-jewelry.jpg";
import catEarrings from "@/assets/cat-earrings.jpg";
import catChains from "@/assets/cat-chains.jpg";
import catRings from "@/assets/cat-rings.jpg";
import catWatches from "@/assets/cat-watches.jpg";
import catBridal from "@/assets/cat-bridal.jpg";
import catBracelets from "@/assets/cat-bracelets.jpg";
import { ArrowRight, Gem, Sparkles, ShieldCheck, Truck, Quote } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "House of Azariah Gems — Luxury Jewelry by Grace Gitonga" },
      {
        name: "description",
        content:
          "Discover heirloom-grade earrings, chains, rings, watches and bridal jewelry from House of Azariah Gems — Nairobi's house of emerald and gold luxury.",
      },
      { property: "og:title", content: "House of Azariah Gems" },
      { property: "og:description", content: "Emerald & gold luxury jewelry, handcrafted in Nairobi." },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: Home,
});

const categories = [
  { name: "Earrings", img: catEarrings, to: "/collections" },
  { name: "Chains", img: catChains, to: "/collections" },
  { name: "Rings", img: catRings, to: "/collections" },
  { name: "Watches", img: catWatches, to: "/collections" },
  { name: "Bridal", img: catBridal, to: "/collections" },
  { name: "Bracelets", img: catBracelets, to: "/collections" },
];

import { PRODUCTS } from "@/lib/products";
import { formatKsh } from "@/lib/shop";

const arrivals = [...PRODUCTS].sort((a, b) => b.createdAt - a.createdAt).slice(0, 4);

const quotes = [
  { q: "She wore her ambition the way other women wore perfume — quietly, unforgettably.", a: "Grace Gitonga" },
  { q: "Luxury is the discipline of doing ordinary things extraordinarily well.", a: "House Maxim" },
  { q: "Build the life that deserves the jewelry you'd save for one day.", a: "Azariah Journal" },
];

const testimonials = [
  { name: "Wanjiru K.", role: "Nairobi", text: "The emerald halo ring stopped conversations at my engagement dinner. Worth every shilling." },
  { name: "Aisha M.", role: "Mombasa", text: "Service felt like a private atelier. My bridal set arrived in a velvet box I almost cried over." },
  { name: "Tasha O.", role: "Kigali", text: "I have never owned jewelry that feels this alive. Azariah is now the only house I shop." },
];

function Home() {
  const [quoteIdx, setQuoteIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setQuoteIdx((i) => (i + 1) % quotes.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <Layout>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroImg}
            alt="Emerald and gold necklace on black silk"
            width={1920}
            height={1280}
            className="h-full w-full object-cover scale-110 animate-[fade-up_1.4s_ease-out]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,oklch(0.45_0.13_158/0.35),transparent_60%)]" />
        </div>

        <div className="mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-6 py-32 md:px-10">
          <div className="max-w-3xl animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-card/30 px-4 py-1.5 text-[11px] uppercase tracking-[0.3em] text-primary">
              <Sparkles className="h-3 w-3" /> Founded by Grace Gitonga
            </span>
            <h1 className="mt-6 font-display text-5xl leading-[1.05] sm:text-6xl md:text-7xl lg:text-[5.5rem]">
              Where <span className="text-gold-gradient">Emerald</span>
              <br />Meets <span className="italic text-accent">Eternity</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-foreground/85">
              House of Azariah Gems crafts heirloom jewelry for the woman who
              wears confidence as her first accessory.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/collections"
                className="group inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-gold transition-transform hover:-translate-y-0.5"
              >
                Shop Collection
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/new-arrivals"
                className="inline-flex items-center gap-3 rounded-full border border-gold/60 px-7 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-foreground hover:bg-card"
              >
                New Arrivals
              </Link>
            </div>

            <div className="mt-16 grid max-w-lg grid-cols-3 gap-6 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <div><div className="font-display text-2xl text-primary">12y</div>Atelier Heritage</div>
              <div><div className="font-display text-2xl text-primary">18k</div>Solid Gold</div>
              <div><div className="font-display text-2xl text-primary">∞</div>Lifetime Care</div>
            </div>
          </div>
        </div>

        {/* Floating gem accents */}
        <div className="pointer-events-none absolute right-10 top-32 hidden h-24 w-24 rounded-full bg-emerald/30 blur-2xl animate-float-slow md:block" />
        <div className="pointer-events-none absolute bottom-32 left-1/3 hidden h-32 w-32 rounded-full bg-primary/20 blur-3xl animate-float-slow md:block" style={{ animationDelay: "1.5s" }} />
      </section>

      {/* MARQUEE */}
      <div className="overflow-hidden border-y border-border bg-background/60 py-5">
        <div className="flex animate-marquee gap-16 whitespace-nowrap font-display text-2xl text-primary/70">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex shrink-0 gap-16">
              {["Heirloom Atelier", "✦", "Hand Set Emeralds", "✦", "18k Solid Gold", "✦", "Made in Nairobi", "✦", "Worldwide Delivery", "✦"].map((t, i) => (
                <span key={i} className="italic">{t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-6 py-28 md:px-10">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-primary">The Maison</span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Curated Categories</h2>
          </div>
          <Link to="/collections" className="text-sm uppercase tracking-[0.2em] text-foreground/80 hover:text-primary">
            View All →
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <Link
              key={c.name}
              to={c.to}
              className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-deep"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={c.img}
                  alt={c.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="gold-divider mb-4 w-12" />
                <h3 className="font-display text-2xl">{c.name}</h3>
                <span className="mt-1 inline-flex items-center gap-1 text-xs uppercase tracking-[0.25em] text-primary">
                  Discover <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="bg-gradient-emerald">
        <div className="mx-auto max-w-7xl px-6 py-28 md:px-10">
          <div className="mb-14 text-center">
            <span className="text-xs uppercase tracking-[0.3em] text-primary">Just In</span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">New Arrivals</h2>
            <p className="mx-auto mt-4 max-w-xl text-foreground/80">
              Limited drops, handcrafted weekly in our Nairobi atelier.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {arrivals.map((p) => (
              <Link
                key={p.id}
                to="/product/$id"
                params={{ id: p.id }}
                className="group block rounded-xl border border-border bg-background/40 p-3 backdrop-blur transition-all hover:-translate-y-1 hover:border-gold"
              >
                <div className="aspect-square overflow-hidden rounded-lg">
                  <img src={p.img} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="p-3">
                  <h3 className="font-display text-lg leading-snug">{p.name}</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-primary font-semibold">{formatKsh(p.price)}</span>
                    <span className="rounded-full border border-gold/50 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em]">
                      View
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* STORY / VALUES */}
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-28 md:grid-cols-2 md:px-10">
        <div className="grid grid-cols-2 gap-3">
          <img src={catBridal} alt="Bridal jewelry" loading="lazy" className="aspect-[3/4] w-full rounded-xl object-cover shadow-deep" />
          <img src={catRings} alt="Emerald ring" loading="lazy" className="mt-12 aspect-[3/4] w-full rounded-xl object-cover shadow-deep" />
        </div>
        <div className="self-center">
          <span className="text-xs uppercase tracking-[0.3em] text-primary">Our Promise</span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Crafted with Reverence</h2>
          <p className="mt-5 text-foreground/80">
            Every Azariah piece begins with an ethically sourced emerald and ends in
            the hands of a woman ready to write her own legacy. Our atelier blends
            African craftsmanship with global standards of luxury.
          </p>
          <div className="mt-8 grid gap-5">
            {[
              { icon: Gem, t: "Conflict-free Gemstones", d: "Traceable from mine to setting." },
              { icon: ShieldCheck, t: "Lifetime Restoration", d: "Polish, replate, and repair — always on the house." },
              { icon: Truck, t: "Concierge Delivery", d: "White-glove worldwide shipping in signature emerald box." },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="flex gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/50 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display text-lg">{t}</div>
                  <div className="text-sm text-muted-foreground">{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE OF THE DAY */}
      <section className="border-y border-border bg-background/70">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center md:px-10">
          <Quote className="mx-auto h-10 w-10 text-primary" />
          <blockquote key={quoteIdx} className="mt-6 animate-fade-up font-display text-2xl italic leading-snug md:text-4xl">
            “{quotes[quoteIdx].q}”
          </blockquote>
          <div className="mt-6 text-xs uppercase tracking-[0.3em] text-primary">— {quotes[quoteIdx].a}</div>
          <Link to="/quotes" className="mt-8 inline-block text-sm uppercase tracking-[0.2em] text-foreground/80 hover:text-primary">
            More Daily Quotes →
          </Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-6 py-28 md:px-10">
        <div className="mb-14 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-primary">Loved By</span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Women of the Maison</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="rounded-xl border border-border bg-card/60 p-8 shadow-deep">
              <div className="text-primary text-2xl">★★★★★</div>
              <blockquote className="mt-4 font-display text-xl italic leading-snug">“{t.text}”</blockquote>
              <figcaption className="mt-6 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                {t.name} · {t.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="mx-auto max-w-5xl px-6 pb-28 md:px-10">
        <div className="relative overflow-hidden rounded-2xl border border-gold/40 bg-gradient-emerald p-10 text-center shadow-gold md:p-16">
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
          <span className="text-xs uppercase tracking-[0.3em] text-primary">Private Circle</span>
          <h2 className="mt-3 font-display text-3xl md:text-5xl">First Look. Always.</h2>
          <p className="mx-auto mt-4 max-w-lg text-foreground/85">
            Subscribe for private previews, drops and a daily moment of luxury in your inbox.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              placeholder="your@email.com"
              className="flex-1 rounded-full border border-border bg-background/50 px-5 py-3 text-sm placeholder:text-muted-foreground focus:border-gold focus:outline-none"
            />
            <button className="rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-gold hover:-translate-y-0.5 transition-transform">
              Join
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
