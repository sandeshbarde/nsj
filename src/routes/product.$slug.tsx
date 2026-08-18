import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { Heart, Minus, Plus, Star, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS, discountPct, formatINR, getProduct } from "@/data/products";
import { useShop } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: [{ title: "Product unavailable — Argent" }, { name: "robots", content: "noindex" }] };
    const p = loaderData.product;
    return {
      meta: [
        { title: `${p.name} — 925 Sterling Silver | Argent` },
        { name: "description", content: p.description.slice(0, 155) },
        { property: "og:title", content: `${p.name} — Argent` },
        { property: "og:description", content: p.description.slice(0, 155) },
        { property: "og:type", content: "product" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="px-4 py-32 text-center">
      <h1 className="text-3xl">Piece not found</h1>
      <Link to="/shop" className="mt-4 inline-block text-sm underline underline-offset-4">
        Back to the collection
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div role="alert" className="px-4 py-32 text-center text-sm">
      {error.message}
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addToCart, toggleWishlist, inWishlist } = useShop();
  const navigate = useNavigate();
  const [size, setSize] = useState(product.sizes[0] ?? "Free Size");
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const oos = product.stock === 0;

  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const complete = PRODUCTS.filter((p) => p.category !== product.category).slice(0, 4);

  const add = () => {
    addToCart(product.id, size, qty);
    toast.success("Added to bag", { description: `${product.name} · ${size}` });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <nav className="eyebrow flex gap-2" aria-label="Breadcrumb">
        <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> /{" "}
        <Link to="/shop" search={{ category: product.category }}>
          {product.category}
        </Link>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div className="grid gap-4 sm:grid-cols-[80px_1fr]">
          <div className="order-2 flex gap-3 sm:order-1 sm:flex-col">
            {product.gallery.map((g: string, i: number) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`View image ${i + 1}`}
                className={cn("w-20 overflow-hidden border", active === i ? "border-foreground" : "border-transparent")}
              >
                <img src={g} alt="" loading="lazy" width={800} height={1000} className="aspect-4/5 w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="order-1 overflow-hidden bg-secondary sm:order-2">
            <img
              src={product.gallery[active]}
              alt={product.name}
              width={800}
              height={1000}
              className="aspect-4/5 w-full object-cover transition-transform duration-700 hover:scale-125"
            />
          </div>
        </div>

        <div>
          <p className="eyebrow">925 Sterling Silver</p>
          <h1 className="mt-2 text-4xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="size-3.5 fill-foreground text-foreground" strokeWidth={0} />
            {product.rating.toFixed(1)} · {product.reviews} reviews
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-2xl">{formatINR(product.price)}</span>
            <span className="text-muted-foreground line-through">{formatINR(product.mrp)}</span>
            <span className="text-sm">{discountPct(product)}% off</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes</p>

          <p className={cn("mt-4 text-sm", oos ? "text-destructive" : "text-muted-foreground")}>
            {oos ? "Out of stock" : product.stock <= 5 ? `Only ${product.stock} left` : "In stock"} · SKU AG-
            {product.id.padStart(4, "0")}
          </p>

          <div className="mt-6">
            <p className="eyebrow">Size</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.sizes.map((s: string) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={cn(
                    "border px-4 py-2 text-sm",
                    size === s ? "border-foreground bg-foreground text-background" : "border-border",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
            {product.category === "rings" && (
              <Link to="/ring-size-guide" className="mt-2 inline-block text-xs underline underline-offset-4">
                Ring size guide
              </Link>
            )}
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center border border-border">
              <button type="button" aria-label="Decrease quantity" className="px-3 py-3" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                <Minus className="size-3.5" strokeWidth={1.5} />
              </button>
              <span className="w-8 text-center text-sm">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                className="px-3 py-3"
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
              >
                <Plus className="size-3.5" strokeWidth={1.5} />
              </button>
            </div>
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className="flex items-center gap-2 border border-border px-4 py-3 text-[11px] tracking-[0.2em] uppercase"
            >
              <Heart className={cn("size-4", inWishlist(product.id) && "fill-foreground")} strokeWidth={1.25} />
              Wishlist
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled={oos}
              onClick={add}
              className="flex-1 bg-ink px-6 py-4 text-[11px] tracking-[0.2em] uppercase text-ink-foreground disabled:opacity-40"
            >
              {oos ? "Sold out" : "Add to bag"}
            </button>
            <button
              type="button"
              disabled={oos}
              onClick={() => {
                add();
                navigate({ to: "/checkout" });
              }}
              className="flex-1 border border-foreground px-6 py-4 text-[11px] tracking-[0.2em] uppercase disabled:opacity-40"
            >
              Buy now
            </button>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-y-3 border-t border-border pt-6 text-sm">
            <Spec label="Purity" value={`${product.purity} Silver`} />
            <Spec label="Weight" value={`${product.weightGrams} g`} />
            <Spec label="Material" value="Sterling silver, rhodium polish" />
            <Spec label="Stone" value={product.stone} />
          </dl>

          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="mt-8 grid gap-4 border-t border-border pt-6 text-sm sm:grid-cols-3">
            <Perk icon={<Truck className="size-4" strokeWidth={1.25} />} title="Free shipping" text="Dispatched in 24–48 hrs" />
            <Perk icon={<RotateCcw className="size-4" strokeWidth={1.25} />} title="30-day returns" text="Easy pickup" />
            <Perk icon={<ShieldCheck className="size-4" strokeWidth={1.25} />} title="6-month warranty" text="Free replating" />
          </div>

          <div className="mt-6 text-sm text-muted-foreground">
            <Link to="/jewellery-care" className="underline underline-offset-4">Jewellery care</Link>
            {" · "}
            <Link to="/policies" className="underline underline-offset-4">Shipping & returns</Link>
          </div>
        </div>
      </div>

      <Section title="You may also like" products={related} />
      <Section title="Complete the look" products={complete} />
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="eyebrow">{label}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}

function Perk({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex gap-3">
      {icon}
      <div>
        <p>{title}</p>
        <p className="text-xs text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}

function Section({ title, products }: { title: string; products: typeof PRODUCTS }) {
  if (products.length === 0) return null;
  return (
    <section className="mt-20">
      <h2 className="text-3xl">{title}</h2>
      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}
