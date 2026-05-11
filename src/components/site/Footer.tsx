import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Music2, Twitter } from "lucide-react";

const SOCIALS = [
  { Icon: Instagram, href: "https://instagram.com/houseofazariahgems", label: "Instagram" },
  { Icon: Music2, href: "https://www.tiktok.com/@houseofazariahgems", label: "TikTok" },
  { Icon: Twitter, href: "https://x.com/azariahgems", label: "X (Twitter)" },
  { Icon: Facebook, href: "https://facebook.com/houseofazariahgems", label: "Facebook" },
];

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-border bg-background/60">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-4 md:px-10">
        <div>
          <h4 className="font-display text-2xl text-gold-gradient">Azariah</h4>
          <p className="mt-4 text-sm text-muted-foreground">
            Heirloom-grade jewelry crafted in Nairobi for women who command every room they enter.
          </p>
        </div>
        <div>
          <h5 className="text-xs uppercase tracking-[0.25em] text-primary">Shop</h5>
          <ul className="mt-4 space-y-2 text-sm text-foreground/80">
            <li><Link to="/collections" className="hover:text-primary">Collections</Link></li>
            <li><Link to="/new-arrivals" className="hover:text-primary">New Arrivals</Link></li>
            <li><Link to="/collections" className="hover:text-primary">Bridal</Link></li>
            <li><Link to="/collections" className="hover:text-primary">Offers</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="text-xs uppercase tracking-[0.25em] text-primary">House</h5>
          <ul className="mt-4 space-y-2 text-sm text-foreground/80">
            <li><Link to="/about" className="hover:text-primary">Our Story</Link></li>
            <li><Link to="/quotes" className="hover:text-primary">Daily Quotes</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="text-xs uppercase tracking-[0.25em] text-primary">Connect</h5>
          <p className="mt-4 text-sm text-muted-foreground">Nairobi, Kenya · nahelmgitonga@gmail.com</p>
          <p className="mt-1 text-sm text-muted-foreground">WhatsApp · +254 716 838572</p>
          <div className="mt-4 flex gap-3">
            {SOCIALS.map(({ Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid h-9 w-9 place-items-center rounded-full border border-border hover:border-gold hover:text-primary transition-colors">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} House of Azariah Gems · Founded by Grace Gitonga
      </div>
    </footer>
  );
}
