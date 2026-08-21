import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { discountPct, formatINR, type Product } from "@/data/products";
import { useShop } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addToCart, toggleWishlist, inWishlist } = useShop();
  const wished = inWishlist(product.id);
  const oos = product.stock === 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: Math.min(index, 6) * 0.05 }}
      className="group"
    >
      <div className="relative overflow-hidden bg-secondary">
        <Link to="/product/$slug" params={{ slug: product.slug }} aria-label={product.name}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={800}
            height={1000}
            className="aspect-4/5 w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        <div className="absolute left-3 top-3 flex flex-col gap-1">
          {product.tags.includes("new") && (
            <span className="bg-background/90 px-2 py-1 text-[10px] tracking-[0.2em] uppercase">New</span>
          )}
          {oos && (
            <span className="bg-ink px-2 py-1 text-[10px] tracking-[0.2em] uppercase text-ink-foreground">
              Sold out
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            toggleWishlist(product.id);
            toast(wished ? "Removed from wishlist" : "Added to wishlist");
          }}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-background/85 backdrop-blur transition-colors hover:bg-background"
        >
          <Heart className={cn("size-4", wished && "fill-foreground")} strokeWidth={1.25} />
        </button>

        {/* Mobile: always visible. Desktop (sm+): slides up on hover */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-2 sm:translate-y-full sm:p-3 sm:transition-transform sm:duration-300 sm:group-hover:translate-y-0 sm:group-focus-within:translate-y-0">
          <button
            type="button"
            disabled={oos}
            onClick={() => {
              addToCart(product.id, product.sizes[0] ?? "Free Size");
              toast.success("Added to bag", { description: product.name });
            }}
            className="pointer-events-auto flex w-full items-center justify-center gap-2 bg-ink px-3 py-3 text-[10px] tracking-[0.18em] uppercase text-ink-foreground transition-opacity active:opacity-70 disabled:opacity-40 sm:px-4 sm:text-[11px] sm:tracking-[0.2em]"
          >
            <ShoppingBag className="size-3.5" strokeWidth={1.5} />
            {oos ? "Sold out" : "Add to bag"}
          </button>
        </div>
      </div>

      <div className="pt-4">
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="font-display text-lg leading-snug hover:opacity-70"
        >
          {product.name}
        </Link>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="size-3 fill-foreground text-foreground" strokeWidth={0} />
          {product.rating.toFixed(1)} <span className="opacity-60">({product.reviews})</span>
        </div>
        <div className="mt-2 flex items-baseline gap-2 text-sm">
          <span>{formatINR(product.price)}</span>
          <span className="text-muted-foreground line-through">{formatINR(product.mrp)}</span>
          <span className="text-xs text-muted-foreground">{discountPct(product)}% off</span>
        </div>
      </div>
    </motion.article>
  );
}
