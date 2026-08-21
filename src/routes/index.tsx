import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Gem, Sparkles, Truck, RotateCcw } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, CATEGORY_IMAGE, type Product } from "@/data/products";
import { useCatalog } from "@/lib/catalog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Argent — The Art of Silver | 925 Sterling Silver Jewellery" },
      {
        name: "description",
        content:
          "Timeless 925 sterling silver jewellery, thoughtfully designed and hand-finished in India. Rings, earrings, necklaces, chains and more.",
      },
      { property: "og:title", content: "Argent — The Art of Silver" },
      { property: "og:description", content: "Timeless jewellery, thoughtfully designed." },
    ],
  }),
  component: Home,
});

const REVIEWS = [
  { name: "Ananya R.", city: "Bengaluru", text: "The finish is far better than I expected. It genuinely looks like a luxury piece." },
  { name: "Rhea M.", city: "Mumbai", text: "Wore the layered necklace daily for months — still no tarnish. Beautifully made." },
  { name: "Karan S.", city: "Delhi", text: "Bought the rope chain as a gift. Packaging alone made the moment special." },
];

// NOTE: Not exported — TanStack Router references this via component:Home above.
// Exporting route-file components prevents code splitting.
function Home() {
  const { products, media } = useCatalog();

  // Tagged products take priority. If no tags exist, fall back using
  // different sort orders so all 3 sections always show real products.
  const taggedNew        = products.filter((p) => p.tags.includes("new"));
  const taggedBestSeller = products.filter((p) => p.tags.includes("bestseller"));
  const taggedSignature  = products.filter((p) => p.tags.includes("signature"));

  // Fallback sorts — ISO date strings compare correctly as plain strings
  // (avoids new Date() which can cause SSR/client hydration mismatches)
  const byNewest  = [...products].sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
  const byReviews = [...products].sort((a, b) => b.reviews - a.reviews);
  const byRating  = [...products].sort((a, b) => b.rating - a.rating);

  const newArrivals = taggedNew.length        > 0 ? taggedNew.slice(0, 4)        : byNewest.slice(0, 4);
  const bestSellers = taggedBestSeller.length > 0 ? taggedBestSeller.slice(0, 4) : byReviews.slice(0, 4);
  const signature   = taggedSignature.length  > 0 ? taggedSignature.slice(0, 4)  : byRating.slice(0, 4);

  const categoryImages = { ...CATEGORY_IMAGE, rings: media.rings, earrings: media.earrings, necklaces: media.necklaces, bracelets: media.bracelets };
  return (
    <>
      <section className="relative">
        <img
          src={media.hero}
          alt="Model wearing 925 sterling silver necklace and rings"
          width={1600}
          height={1200}
          className="h-[70vh] min-h-[460px] w-full object-cover md:h-[82vh]"
        />
        <div className="absolute inset-0 flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto w-full max-w-7xl px-6 md:px-8"
          >
            <p className="eyebrow text-foreground/60">NSJ · Est. 2016</p>
            <h1 className="mt-4 max-w-xl font-display text-[clamp(2.5rem,8vw,5.5rem)] leading-[1.02] tracking-wide">
              THE ART OF SILVER
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-foreground/60 md:text-base">
              Timeless jewellery, thoughtfully designed.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="bg-ink px-8 py-4 text-[11px] tracking-[0.2em] uppercase text-ink-foreground transition-opacity hover:opacity-90"
              >
                Shop now
              </Link>
              <Link
                to="/collections"
                className="border border-foreground px-8 py-4 text-[11px] tracking-[0.2em] uppercase transition-colors hover:bg-foreground hover:text-background"
              >
                Explore collection
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <Heading eyebrow="Shop by category" title="Find your piece" />
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {CATEGORIES.slice(0, 8).map((c, i) => (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
            >
              <Link to="/shop" search={{ category: c.slug }} className="group block">
                <div className="overflow-hidden bg-secondary">
                  <img
                    src={categoryImages[c.slug]}
                    alt={c.label}
                    loading="lazy"
                    width={800}
                    height={1000}
                    className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="mt-3 text-center text-[11px] tracking-[0.2em] uppercase">{c.label}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <ProductRow eyebrow="Just landed" title="New Arrivals" products={newArrivals} to={{ sort: "newest" as const }} />
      <ProductRow eyebrow="Loved most" title="Best Sellers" products={bestSellers} to={{ tag: "bestseller" as const }} />

      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto grid max-w-7xl items-center gap-0 md:grid-cols-2">
          <div className="overflow-hidden">
            <img
              src={media.craft}
              alt="Silversmith hand-finishing a piece"
              loading="lazy"
              width={1400}
              height={900}
              className="aspect-[4/3] w-full object-cover md:aspect-auto md:h-full"
            />
          </div>
          <div className="px-6 py-12 md:px-12 md:py-16">
            <p className="eyebrow text-ink-foreground/60">Our story</p>
            <h2 className="mt-3 font-display text-[clamp(2rem,6vw,3.5rem)] leading-[1.06]">Silver, shaped slowly.</h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-foreground/70 md:text-base">
              Every NSJ piece begins at a workbench in Jaipur, where our silversmiths cast, file and polish
              by hand. We work only in 925 sterling silver — never plated brass — so each design keeps its
              lustre for years, not seasons.
            </p>
            <Link
              to="/our-craft"
              className="mt-8 inline-block border border-ink-foreground/40 px-8 py-4 text-[11px] tracking-[0.2em] uppercase transition-colors hover:bg-ink-foreground hover:text-ink"
            >
              Discover our craft
            </Link>
          </div>
        </div>
      </section>

      <ProductRow eyebrow="The signature edit" title="Signature Collection" products={signature} to={{ tag: "signature" as const }} />

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid gap-8 border-y border-border py-12 md:grid-cols-4">
          <Why icon={<Gem className="size-5" strokeWidth={1} />} title="925 Sterling Silver" text="Hallmarked purity on every piece." />
          <Why icon={<Sparkles className="size-5" strokeWidth={1} />} title="Anti-tarnish finish" text="Rhodium polished for lasting shine." />
          <Why icon={<Truck className="size-5" strokeWidth={1} />} title="Free shipping" text="Across India, insured and tracked." />
          <Why icon={<RotateCcw className="size-5" strokeWidth={1} />} title="30-day returns" text="No-questions-asked pickup." />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
        <Heading eyebrow="Kind words" title="Customer Reviews" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="bg-secondary p-8">
              <blockquote className="font-display text-xl leading-relaxed">“{r.text}”</blockquote>
              <figcaption className="eyebrow mt-6">
                {r.name} · {r.city}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
        <Heading eyebrow="@argentsilver" title="From the community" />
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {products.slice(0, 4).map((p) => (
            <Link key={p.id} to="/product/$slug" params={{ slug: p.slug }} className="overflow-hidden bg-secondary">
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                width={800}
                height={1000}
                className="aspect-square w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

function Heading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="text-center">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 font-display text-[clamp(2rem,6vw,3.5rem)]">{title}</h2>
    </div>
  );
}

function ProductRow({
  eyebrow,
  title,
  products,
  to,
}: {
  eyebrow: string;
  title: string;
  products: Product[];
  to: Record<string, string>;
}) {
  if (products.length === 0) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
      <Heading eyebrow={eyebrow} title={title} />
      <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 md:mt-10 md:grid-cols-4 md:gap-x-6 md:gap-y-10">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
      <div className="mt-8 text-center md:mt-10">
        <Link to="/shop" search={to} className="text-[11px] tracking-[0.2em] uppercase underline underline-offset-8">
          View all
        </Link>
      </div>
    </section>
  );
}

function Why({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="text-center">
      <div className="flex justify-center">{icon}</div>
      <h3 className="mt-4 text-lg">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{text}</p>
    </div>
  );
}
