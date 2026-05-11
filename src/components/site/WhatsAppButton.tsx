import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/254716838572?text=Hello%20House%20of%20Azariah%20Gems%2C%20I%27d%20like%20to%20enquire%20about%20a%20piece."
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
