import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import portrait from "@/assets/story-portrait.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — House of Azariah Gems" },
      { name: "description", content: "Founded by Grace Gitonga, House of Azariah Gems is Nairobi's emerald and gold luxury house." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <Layout>
      <section className="mx-auto grid max-w-7xl gap-16 px-6 py-24 md:grid-cols-2 md:px-10">
        <div className="self-center">
          <span className="text-xs uppercase tracking-[0.3em] text-primary">Our Story</span>
          <h1 className="mt-3 font-display text-5xl md:text-6xl leading-tight">
            A House Built on <span className="text-gold-gradient">Grace</span>.
          </h1>
          <p className="mt-6 text-foreground/85">
            House of Azariah Gems was founded by <strong>Grace Gitonga</strong> in Nairobi
            with a single conviction: African women deserve jewelry that meets them at the
            height of their ambition.
          </p>
          <p className="mt-4 text-foreground/80">
            Each piece is hand-set with ethically sourced emeralds and 18k gold, finished
            by artisans whose families have shaped metal for three generations. We blend the
            warmth of Africa with the discipline of European haute joaillerie.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-8 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <div><div className="font-display text-3xl text-primary">2013</div>Atelier Founded</div>
            <div><div className="font-display text-3xl text-primary">14k+</div>Women Adorned</div>
            <div><div className="font-display text-3xl text-primary">22</div>Countries Shipped</div>
          </div>
        </div>
        <div className="relative">
          <img src={portrait} alt="Editorial portrait" className="rounded-xl object-cover shadow-deep" />
          <div className="absolute -bottom-6 -left-6 hidden rounded-xl border border-gold/40 bg-card/80 p-5 backdrop-blur md:block">
            <p className="max-w-xs font-display italic">"Luxury is not what you wear. It's how you decide to be remembered."</p>
            <p className="mt-2 text-xs uppercase tracking-[0.25em] text-primary">— Grace Gitonga</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
