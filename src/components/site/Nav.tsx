import { Link, useNavigate } from "@tanstack/react-router";
import { Search, ShoppingBag, Heart, Menu, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useShop, formatKsh } from "@/lib/shop";
import { PRODUCTS } from "@/lib/products";

const links = [
  { to: "/", label: "Home" },
  { to: "/collections", label: "Collections" },
  { to: "/new-arrivals", label: "New Arrivals" },
  { to: "/quotes", label: "Daily Quotes" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [showResults, setShowResults] = useState(false);
  const { cartCount, wishlist } = useShop();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowResults(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    return PRODUCTS.filter((p) => p.name.toLowerCase().includes(t) || p.category.toLowerCase().includes(t)).slice(0, 5);
  }, [q]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "glass border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-10">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-gold text-primary font-display text-lg">A</span>
          <span className="font-display text-lg leading-tight">
            <span className="block text-gold-gradient tracking-widest text-[10px] uppercase">House of</span>
            <span className="block text-foreground">Azariah Gems</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm uppercase tracking-[0.18em] text-foreground/80 hover:text-primary transition-colors"
              activeProps={{ className: "text-primary" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <div ref={searchRef} className="relative">
            <div className="flex items-center gap-2 rounded-full border border-border bg-card/40 px-4 py-2">
              <Search className="h-4 w-4 text-primary" />
              <input
                value={q}
                onChange={(e) => { setQ(e.target.value); setShowResults(true); }}
                onFocus={() => setShowResults(true)}
                placeholder="Search jewelry..."
                className="w-44 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            {showResults && results.length > 0 && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-border glass shadow-deep overflow-hidden">
                {results.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { navigate({ to: "/product/$id", params: { id: p.id } }); setShowResults(false); setQ(""); }}
                    className="flex w-full items-center gap-3 p-3 text-left hover:bg-card transition-colors"
                  >
                    <img src={p.img} alt={p.name} className="h-12 w-12 rounded object-cover" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{p.name}</div>
                      <div className="text-xs text-primary">{formatKsh(p.price)}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <Link to="/collections" aria-label="Wishlist" className="relative rounded-full border border-border p-2.5 hover:border-gold transition-colors">
            <Heart className="h-4 w-4" />
            {wishlist.length > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative rounded-full border border-border p-2.5 hover:border-gold transition-colors">
            <ShoppingBag className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
              {cartCount}
            </span>
          </Link>
        </div>

        <button aria-label="Menu" onClick={() => setOpen((v) => !v)} className="lg:hidden rounded-full border border-border p-2.5">
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden glass border-t border-border">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm uppercase tracking-[0.18em] text-foreground/85 hover:bg-card hover:text-primary"
              >
                {l.label}
              </Link>
            ))}
            <Link to="/cart" onClick={() => setOpen(false)} className="rounded-md px-3 py-3 text-sm uppercase tracking-[0.18em] text-primary">
              Cart ({cartCount})
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
