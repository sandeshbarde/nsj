import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { formatINR } from "@/data/products";
import { applyCoupon, useShop } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Bag — NSJ Jewellery" },
      { name: "description", content: "Review the sterling silver pieces in your shopping bag before checkout." },
      { property: "og:title", content: "Your Bag — NSJ Jewellery" },
      { property: "og:description", content: "Review your sterling silver selection." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, setQty, removeFromCart, subtotal } = useShop();
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const shipping = subtotal > 0 && subtotal < 1500 ? 99 : 0;
  const total = Math.max(0, subtotal - discount) + shipping;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-32 text-center">
        <h1 className="text-4xl">Your bag is empty</h1>
        <p className="mt-3 text-sm text-muted-foreground">Discover pieces made to be worn every day.</p>
        <Link
          to="/shop"
          className="mt-8 inline-block bg-ink px-8 py-4 text-[11px] tracking-[0.2em] uppercase text-ink-foreground"
        >
          Shop the collection
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 md:px-8">
      <h1 className="font-display text-3xl md:text-4xl">Shopping Bag</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y divide-border border-y border-border">
          {lines.map((l) => (
            <li key={l.productId + l.size} className="flex gap-4 py-5">
              <Link to="/product/$slug" params={{ slug: l.product.slug }} className="w-20 shrink-0 sm:w-24">
                <img
                  src={l.product.image}
                  alt={l.product.name}
                  loading="lazy"
                  width={800}
                  height={1000}
                  className="aspect-4/5 w-full object-cover"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-3">
                  <div className="min-w-0">
                    <Link to="/product/$slug" params={{ slug: l.product.slug }} className="font-display text-base leading-snug hover:opacity-70 md:text-lg">
                      {l.product.name}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Size {l.size} · 925 Silver · {l.product.weightGrams} g
                    </p>
                    {l.qty >= l.product.stock && (
                      <p className="mt-1 text-xs text-destructive">Maximum available quantity reached</p>
                    )}
                  </div>
                  <button
                    type="button"
                    aria-label="Remove item"
                    onClick={() => removeFromCart(l.productId, l.size)}
                    className="shrink-0 p-1 opacity-50 transition-opacity hover:opacity-100"
                  >
                    <X className="size-4" strokeWidth={1.25} />
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center border border-border">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      className="px-3 py-2.5"
                      onClick={() => setQty(l.productId, l.size, l.qty - 1)}
                    >
                      <Minus className="size-3" strokeWidth={1.5} />
                    </button>
                    <span className="w-8 text-center text-sm">{l.qty}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      className="px-3 py-2.5"
                      onClick={() => setQty(l.productId, l.size, l.qty + 1)}
                    >
                      <Plus className="size-3" strokeWidth={1.5} />
                    </button>
                  </div>
                  <span className="text-sm font-medium">{formatINR(l.product.price * l.qty)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-sm border border-border bg-secondary p-6">
          <h2 className="eyebrow">Order summary</h2>
          <div className="mt-5 flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={20}
              placeholder="Coupon code"
              aria-label="Coupon code"
              className="w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground"
            />
            <button
              type="button"
              onClick={() => {
                const res = applyCoupon(code, subtotal);
                setDiscount(res.discount);
                res.ok ? toast.success(res.message) : toast.error(res.message);
              }}
              className="shrink-0 border border-foreground px-4 text-[11px] tracking-[0.2em] uppercase"
            >
              Apply
            </button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Try SILVER10 or FIRST500</p>

          <dl className="mt-6 space-y-2.5 border-t border-border pt-4 text-sm">
            <Row label="Subtotal" value={formatINR(subtotal)} />
            {discount > 0 && <Row label="Discount" value={`− ${formatINR(discount)}`} />}
            <Row label="Shipping" value={shipping === 0 ? "Free" : formatINR(shipping)} />
            <div className="flex justify-between border-t border-border pt-3 text-base font-medium">
              <dt>Total</dt>
              <dd>{formatINR(total)}</dd>
            </div>
          </dl>

          <Link
            to="/checkout"
            className="mt-6 block bg-ink px-6 py-4 text-center text-[11px] tracking-[0.2em] uppercase text-ink-foreground transition-opacity hover:opacity-90"
          >
            Proceed to checkout
          </Link>
          <Link to="/shop" className="mt-3 block text-center text-xs underline underline-offset-4">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
