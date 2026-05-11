import catEarrings from "@/assets/cat-earrings.jpg";
import catChains from "@/assets/cat-chains.jpg";
import catRings from "@/assets/cat-rings.jpg";
import catWatches from "@/assets/cat-watches.jpg";
import catBridal from "@/assets/cat-bridal.jpg";
import catBracelets from "@/assets/cat-bracelets.jpg";

export type Product = {
  id: string;
  name: string;
  category: "Earrings" | "Chains" | "Rings" | "Bracelets" | "Watches" | "Bridal";
  price: number;
  oldPrice?: number;
  img: string;
  gallery: string[];
  badge?: string;
  description: string;
  details: string[];
  popularity: number; // for sort
  createdAt: number;
};

export const PRODUCTS: Product[] = [
  {
    id: "empress-emerald-halo-ring",
    name: "Empress Emerald Halo Ring",
    category: "Rings",
    price: 890,
    oldPrice: 990,
    img: catRings,
    gallery: [catRings, catBracelets, catBridal],
    badge: "Bestseller",
    description:
      "A 3.2ct Zambian emerald enthroned by a halo of brilliant-cut diamonds, hand-set in 18k yellow gold. Designed to catch every conversation in the room.",
    details: ["18k Yellow Gold · 4.6g", "Center stone: 3.2ct Zambian Emerald", "32 brilliant-cut diamonds (0.48ct total)", "Free resizing within 30 days"],
    popularity: 98,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
  },
  {
    id: "azariah-drop-earrings",
    name: "Azariah Drop Earrings",
    category: "Earrings",
    price: 329,
    img: catEarrings,
    gallery: [catEarrings, catBridal],
    badge: "New",
    description: "Faceted emerald-cut crystals suspended on slender 18k gold hooks. The everyday earring that always feels like an event.",
    details: ["18k Gold-Plated Sterling Silver", "Hand-cut crystal drops", "Hypoallergenic posts", "Length: 4.2cm"],
    popularity: 86,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: "heritage-cuban-chain",
    name: "Heritage Cuban Chain",
    category: "Chains",
    price: 540,
    img: catChains,
    gallery: [catChains, catBracelets],
    badge: "New",
    description: "A modern weight on a classic silhouette. Solid 18k gold links, polished by hand and finished with our signature lobster clasp.",
    details: ["18k Solid Gold · 22g", "Length: 50cm", "Width: 5mm", "Lifetime polishing included"],
    popularity: 80,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  {
    id: "eternity-emerald-bracelet",
    name: "Eternity Emerald Bracelet",
    category: "Bracelets",
    price: 760,
    img: catBracelets,
    gallery: [catBracelets, catRings],
    description: "Twenty-four prong-set emeralds wrap the wrist in a single fluid line of green fire and gold.",
    details: ["18k Yellow Gold", "24 oval emeralds (5.2ct total)", "Adjustable 16-19cm", "Includes velvet pouch"],
    popularity: 91,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
  },
  {
    id: "maison-gold-watch",
    name: "Maison Gold Watch",
    category: "Watches",
    price: 950,
    oldPrice: 990,
    img: catWatches,
    gallery: [catWatches, catChains],
    badge: "Limited",
    description: "Swiss movement housed in a sculpted gold case with emerald hour markers. A keepsake for the woman who runs her own time.",
    details: ["Swiss quartz movement", "Sapphire crystal", "Water resistant 5 ATM", "Numbered edition of 200"],
    popularity: 95,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
  {
    id: "royal-bridal-set",
    name: "Royal Bridal Set",
    category: "Bridal",
    price: 1000,
    img: catBridal,
    gallery: [catBridal, catEarrings, catRings],
    badge: "Bridal",
    description: "Necklace, earrings and head-piece. Ceremonial regalia for the woman who knows her wedding day is the first chapter, not the climax.",
    details: ["3-piece set", "18k Gold with Zambian emeralds", "Hand-engraved details", "Bespoke fitting in our atelier"],
    popularity: 88,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 6,
  },
  {
    id: "nairobi-hoops",
    name: "Nairobi Hoops",
    category: "Earrings",
    price: 185,
    img: catEarrings,
    gallery: [catEarrings],
    description: "Featherweight gold hoops, sized for daily wear and impossible to take off.",
    details: ["18k Gold-Plated", "Diameter: 3.2cm", "Lever-back closure"],
    popularity: 78,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
  },
  {
    id: "pave-tennis-bracelet",
    name: "Pavé Tennis Bracelet",
    category: "Bracelets",
    price: 920,
    img: catBracelets,
    gallery: [catBracelets, catRings],
    description: "A river of pavé-set diamonds on 18k gold. The piece you pass down.",
    details: ["18k Gold", "120 round-cut diamonds (3.4ct)", "Length: 18cm", "Double-safety clasp"],
    popularity: 84,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8,
  },
  {
    id: "solitaire-promise-ring",
    name: "Solitaire Promise Ring",
    category: "Rings",
    price: 640,
    img: catRings,
    gallery: [catRings, catBridal],
    description: "A single 1.2ct solitaire on a tapered band. Quiet, certain, forever.",
    details: ["18k Gold", "Center: 1.2ct Lab-grown diamond", "VVS clarity, F color", "Free engraving inside the band"],
    popularity: 82,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 9,
  },
];

export const findProduct = (id: string) => PRODUCTS.find((p) => p.id === id);
export const relatedProducts = (id: string, n = 3) => {
  const p = findProduct(id);
  if (!p) return [];
  return PRODUCTS.filter((x) => x.id !== id && x.category === p.category).slice(0, n);
};
