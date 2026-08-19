import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, formatINR, type Category } from "@/data/products";
import { useCatalog } from "@/lib/catalog";

type Sort = "newest" | "price-asc" | "price-desc" | "popular";

interface ShopSearch {
  q?: string | undefined;
  category?: Category | undefined;
  gender?: "women" | "men" | "unisex" | undefined;
  sort?: Sort | undefined;
  maxPrice?: number | undefined;
  inStock?: boolean | undefined;
  minRating?: number | undefined;
  tag?: "new" | "bestseller" | "signature" | "gift" | undefined;
}

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    q: typeof search['q'] === "string" && search['q'] ? search['q'] : undefined,
    category: CATEGORIES.some((c) => c.slug === search['category'])
      ? (search['category'] as Category)
      : undefined,
    gender: ["women", "men", "unisex"].includes(String(search['gender']))
      ? (search['gender'] as ShopSearch["gender"])
      : undefined,
    sort: ["newest", "price-asc", "price-desc", "popular"].includes(String(search['sort']))
      ? (search['sort'] as Sort)
      : undefined,
    maxPrice: Number(search['maxPrice']) > 0 ? Number(search['maxPrice']) : undefined,
    inStock: search['inStock'] === true || search['inStock'] === "true" ? true : undefined,
    minRating: Number(search['minRating']) > 0 ? Number(search['minRating']) : undefined,
    tag: ["new", "bestseller", "signature", "gift"].includes(String(search['tag']))
      ? (search['tag'] as ShopSearch["tag"])
      : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop 925 Sterling Silver Jewellery — Argent" },
      {
        name: "description",
        content:
          "Browse hand-finished 925 sterling silver rings, earrings, necklaces, chains and bracelets. Filter by category, price and purity.",
      },
      { property: "og:title", content: "Shop 925 Sterling Silver Jewellery — Argent" },
      { property: "og:description", content: "Hand-finished sterling silver jewellery for everyday wear." },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const { products: catalogProducts } = useCatalog();

  const set = (patch: Partial<ShopSearch>) =>
    navigate({ search: (prev: ShopSearch) => ({ ...prev, ...patch }) });

  const products = useMemo(() => {
    let list = catalogProducts.slice();
    if (search['q']) {
      const q = search['q'].toLowerCase();
      list = list.filter((p) => (p.name + " " + p.category).toLowerCase().includes(q));
    }
    if (search['category']) list = list.filter((p) => p.category === search['category']);
    if (search['gender']) list = list.filter((p) => p.gender === search['gender']);
    if (search['tag']) list = list.filter((p) => p.tags.includes(search['tag']!));
    if (search['maxPrice']) list = list.filter((p) => p.price <= search['maxPrice']!);
    if (search['inStock']) list = list.filter((p) => p.stock > 0);
    if (search['minRating']) list = list.filter((p) => p.rating >= search['minRating']!);

    switch (search['sort']) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "popular":
        return list.sort((a, b) => b.reviews - a.reviews);
      case "newest":
        return list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
      default:
        return list;
    }
  }, [search, catalogProducts]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <p className="eyebrow">Jewellery</p>
      <h1 className="mt-2 text-4xl md:text-5xl">The Collection</h1>
      <p className="mt-3 max-w-xl text-sm text-muted-foreground">
        {products.length} pieces in 925 sterling silver, hand-finished and hallmarked.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-8 text-sm">
          <Filter title="Category">
            <FilterLink active={!search['category']} onClick={() => set({ category: undefined })}>
              All
            </FilterLink>
            {CATEGORIES.map((c) => (
              <FilterLink
                key={c.slug}
                active={search['category'] === c.slug}
                onClick={() => set({ category: c.slug })}
              >
                {c.label}
              </FilterLink>
            ))}
          </Filter>

          <Filter title="Wear">
            {(["women", "men", "unisex"] as const).map((g) => (
              <FilterLink
                key={g}
                active={search['gender'] === g}
                onClick={() => set({ gender: search['gender'] === g ? undefined : g })}
              >
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </FilterLink>
            ))}
          </Filter>

          <Filter title={`Max price · ${formatINR(search['maxPrice'] ?? 6000)}`}>
            <input
              type="range"
              min={1000}
              max={6000}
              step={500}
              value={search['maxPrice'] ?? 6000}
              onChange={(e) => set({ maxPrice: Number(e.target.value) })}
              className="w-full accent-foreground"
              aria-label="Maximum price"
            />
          </Filter>

          <Filter title="Purity">
            <span className="text-muted-foreground">925 Sterling Silver (all pieces)</span>
          </Filter>

          <Filter title="Availability">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!search['inStock']}
                onChange={(e) => set({ inStock: e.target.checked || undefined })}
                className="accent-foreground"
              />
              In stock only
            </label>
          </Filter>

          <Filter title="Rating">
            {[4.5, 4].map((r) => (
              <FilterLink
                key={r}
                active={search['minRating'] === r}
                onClick={() => set({ minRating: search['minRating'] === r ? undefined : r })}
              >
                {r}★ & above
              </FilterLink>
            ))}
          </Filter>

          <button
            type="button"
            onClick={() => navigate({ search: {} })}
            className="text-[11px] tracking-[0.2em] uppercase underline underline-offset-4"
          >
            Clear all
          </button>
        </aside>

        <div>
          <div className="mb-6 flex items-center justify-between gap-4 border-b border-border pb-4">
            <input
              value={search['q'] ?? ""}
              onChange={(e) => set({ q: e.target.value || undefined })}
              placeholder="Search jewellery"
              aria-label="Search jewellery"
              className="w-full max-w-xs bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <select
              value={search['sort'] ?? "popular"}
              onChange={(e) => set({ sort: e.target.value as Sort })}
              aria-label="Sort by"
              className="bg-transparent text-[11px] tracking-[0.2em] uppercase outline-none"
            >
              <option value="popular">Popularity</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {products.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-display text-2xl">Nothing matches those filters</p>
              <Link
                to="/shop"
                search={{}}
                className="mt-4 inline-block text-[11px] tracking-[0.2em] uppercase underline underline-offset-4"
              >
                Reset filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Filter({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="eyebrow">{title}</h2>
      <div className="mt-3 flex flex-col items-start gap-2">{children}</div>
    </div>
  );
}

function FilterLink({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={active ? "underline underline-offset-4" : "text-muted-foreground hover:text-foreground"}
    >
      {children}
    </button>
  );
}
