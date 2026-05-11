import { MessageCircle } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/254716838572?text=" +
  encodeURIComponent("Hello House of Azariah Gems, I'd like to enquire about a piece.");

export function WhatsAppButton() {
  const open = (e: React.MouseEvent) => {
    e.preventDefault();
    // Open in top-level window so the preview iframe never tries to load
    // api.whatsapp.com (which blocks framing).
    window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <a
      href={WHATSAPP_URL}
      onClick={open}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-[oklch(0.62_0.16_158)] to-[oklch(0.45_0.13_158)] text-ivory shadow-gold transition-transform hover:scale-110 animate-float-slow"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary ring-2 ring-background" />
    </a>
  );
}
