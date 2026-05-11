import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { CheckCircle2, Mail, Package } from "lucide-react";
import { z } from "zod";

const search = z.object({ order: z.string().optional() });

export const Route = createFileRoute("/thank-you")({
  validateSearch: (s) => search.parse(s),
  head: () => ({ meta: [{ title: "Thank You — House of Azariah Gems" }, { name: "description", content: "Order confirmation." }] }),
  component: ThankYou,
});

function ThankYou() {
  const { order } = Route.useSearch();
  return (
    <Layout>
      <section className="mx-auto max-w-2xl px-6 py-24 text-center md:px-10">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-gold/50 bg-card text-primary shadow-gold">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <span className="mt-8 inline-block text-xs uppercase tracking-[0.3em] text-primary">Order Confirmed</span>
        <h1 className="mt-3 font-display text-5xl md:text-6xl">Thank You</h1>
        <p className="mt-4 text-foreground/80">
          Your treasure is being prepared in our atelier. A confirmation has been sent to your inbox
          and our concierge will be in touch shortly.
        </p>

        {order && (
          <div className="mx-auto mt-10 max-w-sm rounded-2xl border border-gold/40 bg-gradient-emerald p-6 shadow-gold">
            <div className="text-xs uppercase tracking-[0.3em] text-primary">Order Reference</div>
            <div className="mt-2 font-display text-3xl text-foreground">#{order}</div>
          </div>
        )}

        <div className="mt-10 grid gap-3 text-sm sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card/60 p-5 text-left">
            <Package className="h-5 w-5 text-primary" />
            <div>
              <div className="font-display">Ships in 24 hours</div>
              <div className="text-xs text-muted-foreground">Tracking sent by email</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card/60 p-5 text-left">
            <Mail className="h-5 w-5 text-primary" />
            <div>
              <div className="font-display">Concierge ready</div>
              <div className="text-xs text-muted-foreground">concierge@azariahgems.co</div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <Link to="/collections" className="rounded-full bg-primary px-7 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-gold">
            Continue Shopping
          </Link>
          <Link to="/" className="rounded-full border border-gold/60 px-7 py-4 text-sm font-semibold uppercase tracking-[0.2em] hover:bg-card">
            Back Home
          </Link>
        </div>
      </section>
    </Layout>
  );
}
