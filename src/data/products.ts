import rings from "@/assets/cat-rings.jpg";
import earrings from "@/assets/cat-earrings.jpg";
import necklaces from "@/assets/cat-necklaces.jpg";
import bracelets from "@/assets/cat-bracelets.jpg";

export type Category =
  | "rings"
  | "earrings"
  | "necklaces"
  | "pendants"
  | "chains"
  | "bracelets"
  | "bangles"
  | "anklets";

export type Gender = "women" | "men" | "unisex";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  gender: Gender;
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  weightGrams: number;
  purity: "925" | "999";
  stone: string;
  sizes: string[];
  stock: number;
  image: string;
  gallery: string[];
  video?: string;
  tags: Array<"new" | "bestseller" | "signature" | "gift">;
  description: string;
  createdAt: string;
}

export const CATEGORY_IMAGE: Record<Category, string> = {
  rings,
  earrings,
  necklaces,
  pendants: necklaces,
  chains: bracelets,
  bracelets,
  bangles: bracelets,
  anklets: bracelets,
};

export const CATEGORIES: { slug: Category; label: string }[] = [
  { slug: "rings", label: "Rings" },
  { slug: "earrings", label: "Earrings" },
  { slug: "necklaces", label: "Necklaces" },
  { slug: "pendants", label: "Pendants" },
  { slug: "chains", label: "Chains" },
  { slug: "bracelets", label: "Bracelets" },
  { slug: "bangles", label: "Bangles" },
  { slug: "anklets", label: "Anklets" },
];

const seed: Array<
  Pick<Product, "name" | "category" | "gender" | "price" | "mrp" | "weightGrams" | "stone"> & {
    tags: Product["tags"];
    rating: number;
    reviews: number;
    stock: number;
    days: number;
  }
> = [
  { name: "Royal Solitaire Ring", category: "rings", gender: "women", price: 2490, mrp: 3200, weightGrams: 3.2, stone: "Cubic Zirconia", tags: ["new", "signature"], rating: 4.8, reviews: 126, stock: 12, days: 2 },
  { name: "Minimal Band Ring", category: "rings", gender: "unisex", price: 1290, mrp: 1790, weightGrams: 2.4, stone: "None", tags: ["bestseller"], rating: 4.6, reviews: 214, stock: 30, days: 40 },
  { name: "Oxidised Statement Ring", category: "rings", gender: "women", price: 1890, mrp: 2450, weightGrams: 4.1, stone: "None", tags: ["gift"], rating: 4.4, reviews: 61, stock: 0, days: 90 },
  { name: "Crystal Drop Earrings", category: "earrings", gender: "women", price: 2790, mrp: 3590, weightGrams: 4.6, stone: "White Topaz", tags: ["new", "bestseller"], rating: 4.9, reviews: 188, stock: 18, days: 4 },
  { name: "Classic Silver Studs", category: "earrings", gender: "women", price: 990, mrp: 1490, weightGrams: 1.8, stone: "Cubic Zirconia", tags: ["gift"], rating: 4.5, reviews: 402, stock: 44, days: 120 },
  { name: "Pearl Hoop Earrings", category: "earrings", gender: "women", price: 2190, mrp: 2790, weightGrams: 3.4, stone: "Freshwater Pearl", tags: ["signature"], rating: 4.7, reviews: 97, stock: 9, days: 25 },
  { name: "Halo Circle Pendant", category: "pendants", gender: "women", price: 1990, mrp: 2590, weightGrams: 2.9, stone: "None", tags: ["new"], rating: 4.6, reviews: 74, stock: 21, days: 6 },
  { name: "Eternity Layered Necklace", category: "necklaces", gender: "women", price: 3290, mrp: 4290, weightGrams: 6.2, stone: "None", tags: ["bestseller", "signature"], rating: 4.8, reviews: 152, stock: 7, days: 15 },
  { name: "Moonlit Charm Necklace", category: "necklaces", gender: "women", price: 2890, mrp: 3690, weightGrams: 5.4, stone: "Moonstone", tags: ["gift"], rating: 4.5, reviews: 58, stock: 14, days: 60 },
  { name: "Rope Chain 20 inch", category: "chains", gender: "men", price: 3890, mrp: 4990, weightGrams: 12.5, stone: "None", tags: ["bestseller"], rating: 4.7, reviews: 133, stock: 16, days: 30 },
  { name: "Figaro Chain 22 inch", category: "chains", gender: "men", price: 4290, mrp: 5490, weightGrams: 14.2, stone: "None", tags: ["new"], rating: 4.6, reviews: 44, stock: 5, days: 3 },
  { name: "Cable Link Bracelet", category: "bracelets", gender: "unisex", price: 2390, mrp: 2990, weightGrams: 7.1, stone: "None", tags: ["bestseller"], rating: 4.7, reviews: 176, stock: 23, days: 45 },
  { name: "Heritage Cuff Bracelet", category: "bracelets", gender: "men", price: 4590, mrp: 5890, weightGrams: 16.8, stone: "None", tags: ["signature"], rating: 4.8, reviews: 39, stock: 4, days: 70 },
  { name: "Twisted Silver Bangle", category: "bangles", gender: "women", price: 3190, mrp: 4090, weightGrams: 11.3, stone: "None", tags: ["gift"], rating: 4.4, reviews: 66, stock: 11, days: 80 },
  { name: "Paisley Bangle Pair", category: "bangles", gender: "women", price: 5290, mrp: 6790, weightGrams: 22.4, stone: "None", tags: ["signature"], rating: 4.9, reviews: 28, stock: 3, days: 100 },
  { name: "Beaded Silver Anklet", category: "anklets", gender: "women", price: 1690, mrp: 2190, weightGrams: 8.4, stone: "None", tags: ["new", "gift"], rating: 4.5, reviews: 91, stock: 26, days: 5 },
];

const slugify = (s: string) =>
  "925-sterling-silver-" + s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const sizesFor = (c: Category) =>
  c === "rings" ? ["12", "14", "16", "18", "20"] : c === "chains" || c === "necklaces" ? ["18\"", "20\"", "22\""] : ["Free Size"];

export const PRODUCTS: Product[] = seed.map((s, i) => ({
  id: String(i + 1),
  slug: slugify(s.name),
  name: s.name,
  category: s.category,
  gender: s.gender,
  price: s.price,
  mrp: s.mrp,
  rating: s.rating,
  reviews: s.reviews,
  weightGrams: s.weightGrams,
  purity: "925",
  stone: s.stone,
  sizes: sizesFor(s.category),
  stock: s.stock,
  image: CATEGORY_IMAGE[s.category],
  gallery: [CATEGORY_IMAGE[s.category], CATEGORY_IMAGE.rings, CATEGORY_IMAGE.necklaces],
  tags: s.tags,
  description: `A ${s.name.toLowerCase()} hand-finished in 925 sterling silver. Designed in-house and polished by hand for a lasting, luminous finish — an everyday heirloom made to be worn, not stored away.`,
  createdAt: new Date(Date.now() - s.days * 864e5).toISOString(),
}));

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);

export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export const discountPct = (p: Product) => Math.round(((p.mrp - p.price) / p.mrp) * 100);
