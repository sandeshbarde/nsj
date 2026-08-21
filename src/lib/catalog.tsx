import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { CATEGORY_IMAGE, PRODUCTS, type Category, type Product } from "@/data/products";
import { supabase } from "@/lib/supabase";
// Static imports so Vite resolves the same hashed URL on both server and client,
// preventing the SSR hydration mismatch caused by new URL(..., import.meta.url).
import heroImg from "@/assets/hero.jpg";
import craftImg from "@/assets/craft.jpg";

type MediaKey = "hero" | "craft" | "rings" | "earrings" | "necklaces" | "bracelets";
export type SiteMedia = Record<MediaKey, string>;

const defaultMedia: SiteMedia = {
  hero: heroImg,
  craft: craftImg,
  rings: CATEGORY_IMAGE.rings,
  earrings: CATEGORY_IMAGE.earrings,
  necklaces: CATEGORY_IMAGE.necklaces,
  bracelets: CATEGORY_IMAGE.bracelets,
};

const categoryValues = new Set<Category>(["rings", "earrings", "necklaces", "pendants", "chains", "bracelets", "bangles", "anklets"]);
const tags = new Set(["new", "bestseller", "signature", "gift"]);

// Explicit row type avoids TS4111 index-signature bracket-notation errors
interface SupabaseProductRow {
  id: unknown;
  slug: unknown;
  name: unknown;
  category: unknown;
  gender: unknown;
  price: unknown;
  mrp: unknown;
  rating: unknown;
  reviews: unknown;
  weight_grams: unknown;
  weightGrams: unknown;
  purity: unknown;
  stone: unknown;
  sizes: unknown;
  stock: unknown;
  image: unknown;
  gallery: unknown;
  video: unknown;
  tags: unknown;
  description: unknown;
  created_at: unknown;
  createdAt: unknown;
}

function mapProduct(row: SupabaseProductRow): Product {
  const category = String(row.category ?? "rings").toLowerCase() as Category;
  const safeCategory = categoryValues.has(category) ? category : "rings";
  const gallery = Array.isArray(row.gallery) ? row.gallery.filter((item): item is string => typeof item === "string") : [];
  const image = typeof row.image === "string" && row.image ? row.image : gallery[0] || CATEGORY_IMAGE[safeCategory];
  const rawVideo = row.video;
  return {
    id: String(row.id), slug: String(row.slug ?? row.id), name: String(row.name ?? "Untitled product"), category: safeCategory,
    gender: ["women", "men", "unisex"].includes(String(row.gender)) ? (row.gender as "women" | "men" | "unisex") : "unisex",
    price: Number(row.price ?? 0), mrp: Number(row.mrp ?? row.price ?? 0), rating: Number(row.rating ?? 0), reviews: Number(row.reviews ?? 0),
    weightGrams: Number(row.weight_grams ?? row.weightGrams ?? 0), purity: String(row.purity ?? "925").replace(/\D/g, "") === "999" ? "999" : "925",
    stone: String(row.stone ?? "None"), sizes: Array.isArray(row.sizes) && (row.sizes as unknown[]).length ? (row.sizes as string[]) : ["Free Size"], stock: Number(row.stock ?? 0),
    image, gallery: gallery.length ? gallery : [image],
    ...(typeof rawVideo === "string" && rawVideo ? { video: rawVideo } : {}),
    tags: Array.isArray(row.tags) ? (row.tags as unknown[]).filter((tag): tag is Product["tags"][number] => tags.has(String(tag))) : [],
    description: String(row.description ?? ""), createdAt: String(row.created_at ?? row.createdAt ?? new Date().toISOString()),
  };
}


type Catalog = { products: Product[]; media: SiteMedia; loading: boolean };
const CatalogContext = createContext<Catalog>({ products: [], media: defaultMedia, loading: true });

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [media, setMedia] = useState<SiteMedia>(defaultMedia);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [productResult, mediaResult] = await Promise.all([
        supabase.from("products").select("*").eq("published", true).order("created_at", { ascending: false }),
        supabase.from("site_media").select("key, image_url"),
      ]);
      if (!productResult.error && productResult.data?.length) setProducts(productResult.data.map(mapProduct));
      if (!mediaResult.error && mediaResult.data) {
        setMedia((current) => mediaResult.data.reduce((next, row) => {
          if (row.key in next && typeof row.image_url === "string" && row.image_url) next[row.key as MediaKey] = row.image_url;
          return next;
        }, { ...current }));
      }
      setLoading(false);
    };
    void load();
    const channel = supabase.channel("storefront-content")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => void load())
      .on("postgres_changes", { event: "*", schema: "public", table: "site_media" }, () => void load())
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, []);

  const value = useMemo(() => ({ products, media, loading }), [products, media, loading]);
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() { return useContext(CatalogContext); }
