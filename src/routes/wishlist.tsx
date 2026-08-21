import { createFileRoute, Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { toast } from "sonner";
import { formatINR } from "@/data/products";
import { useShop } from "@/lib/store";
import { useCatalog } from "@/lib/catalog";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — NSJ Jewellery" },
      { name: "description", content: "Your saved sterling silver jewellery pieces, ready when you are." },
      { property: "og:title", content: "Wishlist — NSJ Jewellery" },
      { property: "og:description", content: "Your saved sterling silver pieces." },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useShop();
  const { products } = useCatalog();

  // Match wishlist IDs against live Supabase catalog
  const items = products.filter((p) => wishlist.includes(p.id));

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-32 text-center">
        <h1 className="font-display text-3xl md:text-4xl">Your wishlist is empty</h1>
        <p className="mt-3 text-sm text-muted-foreground">Tap the heart on any piece to save it here.</p>
        <Link
          to="/shop"
          className="mt-8 inline-block bg-ink px-8 py-4 text-[11px] tracking-[0.2em] uppercase text-ink-foreground transition-opacity hover:opacity-90"
        >
          Browse jewellery
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 md:px-8">
      <p className="eyebrow">Saved pieces</p>
      <h1 className="mt-2 font-display text-3xl md:text-4xl">Wishlist</h1>
      <p className="mt-2 text-sm text-muted-foreground">{items.length} {items.length === 1 ? "piece" : "pieces"} saved</p>

      <ul className="mt-8 divide-y divide-border border-y border-border">
        {items.map((p) => (
          <li key={p.id} className="flex gap-4 py-5 sm:gap-6">
            <Link to="/product/$slug" params={{ slug: p.slug }} className="w-20 shrink-0 sm:w-24">
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                width={800}
                height={1000}
                className="aspect-4/5 w-full object-cover"
              />
            </Link>

            <div className="flex flex-1 flex-col justify-between min-w-0">
              <div className="flex justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    to="/product/$slug"
                    params={{ slug: p.slug }}
                    className="font-display text-base leading-snug hover:opacity-70 md:text-lg"
                  >
                    {p.name}
                  </Link>
                  <p className="mt-1 text-sm font-medium">{formatINR(p.price)}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {p.stock === 0 ? "Out of stock" : "In stock"}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Remove from wishlist"
                  onClick={() => toggleWishlist(p.id)}
                  className="shrink-0 p-2 opacity-50 transition-opacity hover:opacity-100"
                >
                  <X className="size-4" strokeWidth={1.25} />
                </button>
              </div>

              <button
                type="button"
                disabled={p.stock === 0}
                onClick={() => {
                  addToCart(p.id, p.sizes[0] ?? "Free Size");
                  toggleWishlist(p.id);
                  toast.success("Moved to bag", { description: p.name });
                }}
                className="mt-4 self-start border border-foreground px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase transition-opacity hover:opacity-70 disabled:opacity-40"
              >
                Move to bag
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
