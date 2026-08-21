import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { type Product } from "@/data/products";
import { useCatalog } from "@/lib/catalog";

export interface CartLine {
  productId: string;
  size: string;
  qty: number;
}

interface ShopState {
  cart: CartLine[];
  wishlist: string[];
  addToCart: (productId: string, size: string, qty?: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  setQty: (productId: string, size: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  inWishlist: (productId: string) => boolean;
  cartCount: number;
  subtotal: number;
  lines: Array<CartLine & { product: Product }>;
}

const Ctx = createContext<ShopState | null>(null);

const read = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export function ShopProvider({ children }: { children: ReactNode }) {
  const { products } = useCatalog();
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCart(read<CartLine[]>("ag_cart", []));
    setWishlist(read<string[]>("ag_wishlist", []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem("ag_cart", JSON.stringify(cart));
  }, [cart, hydrated]);
  useEffect(() => {
    if (hydrated) window.localStorage.setItem("ag_wishlist", JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  const value = useMemo<ShopState>(() => {
    const lines = cart
      .map((l) => {
        const product = products.find((p) => p.id === l.productId);
        return product ? { ...l, product } : null;
      })
      .filter(Boolean) as Array<CartLine & { product: Product }>;

    return {
      cart,
      wishlist,
      lines,
      cartCount: cart.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.product.price * l.qty, 0),
      addToCart: (productId, size, qty = 1) =>
        setCart((prev) => {
          const product = products.find((p) => p.id === productId);
          const max = product?.stock ?? 0;
          const found = prev.find((l) => l.productId === productId && l.size === size);
          if (found) {
            return prev.map((l) =>
              l === found ? { ...l, qty: Math.min(max, l.qty + qty) } : l,
            );
          }
          return [...prev, { productId, size, qty: Math.min(max, qty) }];
        }),
      removeFromCart: (productId, size) =>
        setCart((prev) => prev.filter((l) => !(l.productId === productId && l.size === size))),
      setQty: (productId, size, qty) =>
        setCart((prev) =>
          prev.flatMap((l) => {
            if (l.productId !== productId || l.size !== size) return [l];
            const max = products.find((p) => p.id === productId)?.stock ?? 0;
            const next = Math.min(max, qty);
            return next <= 0 ? [] : [{ ...l, qty: next }];
          }),
        ),
      clearCart: () => setCart([]),
      toggleWishlist: (productId) =>
        setWishlist((prev) =>
          prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
        ),
      inWishlist: (productId) => wishlist.includes(productId),
    };
  }, [cart, wishlist, products]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useShop() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}

// ⚠️ SECURITY NOTE: These coupon codes are in the frontend JS bundle and visible
// to anyone who inspects the source. In production, coupon validation should be
// moved to a server-side Edge Function so codes cannot be enumerated by users.
export const COUPONS: Record<string, { type: "pct" | "flat"; value: number; min: number }> = {
  SILVER10: { type: "pct", value: 10, min: 1500 },
  FIRST500: { type: "flat", value: 500, min: 3000 },
};

export function applyCoupon(code: string, subtotal: number) {
  const c = COUPONS[code.trim().toUpperCase()];
  if (!c) return { ok: false as const, message: "Invalid coupon code", discount: 0 };
  if (subtotal < c.min)
    return { ok: false as const, message: `Minimum order ₹${c.min} required`, discount: 0 };
  const discount = c.type === "pct" ? Math.round((subtotal * c.value) / 100) : c.value;
  return { ok: true as const, message: "Coupon applied", discount };
}
