import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact, House of Azariah Gems" },
      { name: "description", content: "Reach the House of Azariah Gems concierge by email, WhatsApp or in-store visit in Nairobi." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-6 py-24 md:px-10">
        <div className="text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-primary">Concierge</span>
          <h1 className="mt-3 font-display text-5xl md:text-6xl">Get in Touch</h1>
          <p className="mx-auto mt-4 max-w-xl text-foreground/80">
            Private appointments, custom commissions, and bridal consultations.
          </p>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2 space-y-5">
            {[
              { icon: Mail, t: "Email", d: "nahelmgitonga@gmail.com" },
              { icon: Phone, t: "WhatsApp", d: "+254 716 838572" },
              { icon: MapPin, t: "Atelier", d: "Westlands, Nairobi · By appointment" },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="flex gap-4 rounded-xl border border-border bg-card/60 p-6">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/50 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.25em] text-primary">{t}</div>
                  <div className="mt-1 font-display text-lg">{d}</div>
                </div>
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              {[Instagram, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="grid h-11 w-11 place-items-center rounded-full border border-border hover:border-gold hover:text-primary transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            className="md:col-span-3 rounded-2xl border border-border bg-card/60 p-8 shadow-deep space-y-5"
          >
            {sent ? (
              <div className="py-12 text-center">
                <div className="mx-auto h-12 w-12 rounded-full border border-gold/50 grid place-items-center text-primary">✓</div>
                <h3 className="mt-4 font-display text-2xl">Thank you</h3>
                <p className="mt-2 text-muted-foreground">Our concierge will reply within 24 hours.</p>
              </div>
            ) : (
              <>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-primary">Name</label>
                    <input required maxLength={100} className="mt-2 w-full rounded-md border border-border bg-background/50 px-4 py-3 text-sm focus:border-gold focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-primary">Email</label>
                    <input required type="email" maxLength={255} className="mt-2 w-full rounded-md border border-border bg-background/50 px-4 py-3 text-sm focus:border-gold focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-primary">Subject</label>
                  <input maxLength={150} className="mt-2 w-full rounded-md border border-border bg-background/50 px-4 py-3 text-sm focus:border-gold focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-primary">Message</label>
                  <textarea required rows={5} maxLength={1000} className="mt-2 w-full rounded-md border border-border bg-background/50 px-4 py-3 text-sm focus:border-gold focus:outline-none" />
                </div>
                <button className="w-full rounded-full bg-primary py-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-gold hover:-translate-y-0.5 transition-transform">
                  Send Message
                </button>
              </>
            )}
          </form>
        </div>
      </section>
    </Layout>
  );
}
