import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { Quote } from "lucide-react";

export const Route = createFileRoute("/quotes")({
  head: () => ({
    meta: [
      { title: "Daily Business Quotes, House of Azariah Gems" },
      { name: "description", content: "A daily dose of luxury, ambition and feminine power from House of Azariah Gems." },
    ],
  }),
  component: Quotes,
});

const quotes = [
  { q: "She wore her ambition the way other women wore perfume, quietly, unforgettably.", a: "Grace Gitonga" },
  { q: "Luxury is the discipline of doing ordinary things extraordinarily well.", a: "House Maxim" },
  { q: "Build the life that deserves the jewelry you'd save for one day.", a: "Azariah Journal" },
  { q: "A woman with a vision needs no permission, only patience and pearls.", a: "Grace Gitonga" },
  { q: "Your reputation is the most expensive jewel you'll ever wear. Polish it daily.", a: "House Maxim" },
  { q: "Negotiate like the gold around your neck, soft, warm, and impossible to dismiss.", a: "Azariah Journal" },
];

function Quotes() {
  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-6 py-24 md:px-10">
        <div className="text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-primary">Daily Devotion</span>
          <h1 className="mt-3 font-display text-5xl md:text-6xl">Business Quotes</h1>
          <p className="mx-auto mt-4 max-w-xl text-foreground/80">
            A daily moment of luxury for women building empires.
          </p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {quotes.map((q, i) => (
            <figure key={i} className="relative overflow-hidden rounded-2xl border border-border bg-card/60 p-10 shadow-deep">
              <Quote className="absolute -right-4 -top-4 h-24 w-24 text-primary/15" />
              <blockquote className="font-display text-2xl italic leading-snug md:text-3xl">"{q.q}"</blockquote>
              <figcaption className="mt-6 text-xs uppercase tracking-[0.3em] text-primary">,  {q.a}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </Layout>
  );
}
