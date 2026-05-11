import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles, Send, X } from "lucide-react";

type Msg = { role: "user" | "bot"; text: string; suggestions?: { label: string; to: string }[] };

const intro: Msg = {
  role: "bot",
  text: "Welcome to House of Azariah Gems. I'm Aria, your private concierge. How may I help — recommendations, an order update, or sizing?",
  suggestions: [
    { label: "Bestsellers", to: "/collections" },
    { label: "Bridal", to: "/collections" },
    { label: "Track my order", to: "/contact" },
  ],
};

function reply(input: string): Msg {
  const t = input.toLowerCase();
  if (/hi|hello|hey|jambo|habari/.test(t))
    return { role: "bot", text: "Karibu! Tell me what you're looking for — earrings, a ring, a chain, a bridal set?" };
  if (/bridal|wedding/.test(t))
    return { role: "bot", text: "Our Royal Bridal Set is a 3-piece ceremonial regalia with hand-set emeralds. Would you like to view it?", suggestions: [{ label: "View Bridal Set", to: "/product/$id" }] };
  if (/ring/.test(t))
    return { role: "bot", text: "The Empress Emerald Halo Ring is the favourite of the season — a 3.2ct emerald in 18k gold.", suggestions: [{ label: "View Ring", to: "/collections" }] };
  if (/earring/.test(t))
    return { role: "bot", text: "Try the Azariah Drop Earrings for evening, or the Nairobi Hoops for daily wear.", suggestions: [{ label: "Shop Earrings", to: "/collections" }] };
  if (/chain|necklace/.test(t))
    return { role: "bot", text: "Heritage Cuban Chain in 18k solid gold — a piece you'll never take off.", suggestions: [{ label: "Shop Chains", to: "/collections" }] };
  if (/watch/.test(t))
    return { role: "bot", text: "The Maison Gold Watch is a numbered edition of 200 with Swiss movement.", suggestions: [{ label: "Shop Watches", to: "/collections" }] };
  if (/order|track|delivery|ship/.test(t))
    return { role: "bot", text: "Orders are dispatched within 24h in Kenya, 3–5 days worldwide. Share your order number with our concierge to track.", suggestions: [{ label: "WhatsApp Concierge", to: "/contact" }] };
  if (/price|cost|how much|expensive/.test(t))
    return { role: "bot", text: "Pieces start at KSh 18,500 and go up to KSh 245,000 for bridal sets. We also offer flexible payment plans.", suggestions: [{ label: "Browse Collection", to: "/collections" }] };
  if (/size|sizing|fit/.test(t))
    return { role: "bot", text: "Free resizing within 30 days on all rings. Bracelets are adjustable, chains come in 45cm and 50cm." };
  if (/payment|pay|m-?pesa|paypal|card/.test(t))
    return { role: "bot", text: "We accept M-Pesa, Visa, Mastercard and PayPal at checkout — fully secure." };
  if (/return|refund/.test(t))
    return { role: "bot", text: "14-day returns on unworn pieces. Bespoke and bridal items are final sale." };
  if (/contact|whatsapp|email|phone/.test(t))
    return { role: "bot", text: "WhatsApp +254 716 838572 or email nahelmgitonga@gmail.com — we reply within 24 hours.", suggestions: [{ label: "Contact Page", to: "/contact" }] };
  return {
    role: "bot",
    text: "I'd love to help with that. Would you like me to connect you to our human concierge on WhatsApp?",
    suggestions: [{ label: "Talk on WhatsApp", to: "/contact" }, { label: "Browse Collection", to: "/collections" }],
  };
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([intro]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setTimeout(() => setMsgs((m) => [...m, reply(text)]), 500);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open concierge chat"
        className={`fixed bottom-24 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-gold transition-transform hover:scale-110 ${
          open ? "opacity-0 pointer-events-none" : ""
        }`}
      >
        <Sparkles className="h-6 w-6" />
      </button>

      <div
        className={`fixed bottom-6 right-6 z-50 flex h-[32rem] w-[22rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-gold/40 glass shadow-deep transition-all duration-300 ${
          open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border bg-gradient-emerald px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="font-display text-sm leading-tight">Aria · Concierge</div>
              <div className="flex items-center gap-1 text-[10px] text-foreground/70">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-glow" /> Online now
              </div>
            </div>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close" className="rounded-full p-1.5 hover:bg-background/40">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
          {msgs.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : "space-y-2"}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-card border border-border rounded-bl-sm"
                }`}
              >
                {m.text}
              </div>
              {m.suggestions && (
                <div className="flex flex-wrap gap-2">
                  {m.suggestions.map((s, j) => (
                    <Link
                      key={j}
                      to={s.to as "/collections" | "/contact"}
                      onClick={() => setOpen(false)}
                      className="rounded-full border border-gold/50 px-3 py-1.5 text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="flex items-center gap-2 border-t border-border bg-background/40 p-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 rounded-full border border-border bg-card px-4 py-2 text-sm focus:border-gold focus:outline-none"
          />
          <button className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </>
  );
}
