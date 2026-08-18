import { r as PRODUCTS } from "./products-DCeX7mS0.js";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { jsx } from "react/jsx-runtime";
//#region src/lib/store.tsx
var Ctx = createContext(null);
var read = (key, fallback) => {
	if (typeof window === "undefined") return fallback;
	try {
		const raw = window.localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
};
function ShopProvider({ children }) {
	const [cart, setCart] = useState([]);
	const [wishlist, setWishlist] = useState([]);
	const [hydrated, setHydrated] = useState(false);
	useEffect(() => {
		setCart(read("ag_cart", []));
		setWishlist(read("ag_wishlist", []));
		setHydrated(true);
	}, []);
	useEffect(() => {
		if (hydrated) window.localStorage.setItem("ag_cart", JSON.stringify(cart));
	}, [cart, hydrated]);
	useEffect(() => {
		if (hydrated) window.localStorage.setItem("ag_wishlist", JSON.stringify(wishlist));
	}, [wishlist, hydrated]);
	const value = useMemo(() => {
		const lines = cart.map((l) => {
			const product = PRODUCTS.find((p) => p.id === l.productId);
			return product ? {
				...l,
				product
			} : null;
		}).filter(Boolean);
		return {
			cart,
			wishlist,
			lines,
			cartCount: cart.reduce((n, l) => n + l.qty, 0),
			subtotal: lines.reduce((n, l) => n + l.product.price * l.qty, 0),
			addToCart: (productId, size, qty = 1) => setCart((prev) => {
				const max = PRODUCTS.find((p) => p.id === productId)?.stock ?? 0;
				const found = prev.find((l) => l.productId === productId && l.size === size);
				if (found) return prev.map((l) => l === found ? {
					...l,
					qty: Math.min(max, l.qty + qty)
				} : l);
				return [...prev, {
					productId,
					size,
					qty: Math.min(max, qty)
				}];
			}),
			removeFromCart: (productId, size) => setCart((prev) => prev.filter((l) => !(l.productId === productId && l.size === size))),
			setQty: (productId, size, qty) => setCart((prev) => prev.flatMap((l) => {
				if (l.productId !== productId || l.size !== size) return [l];
				const max = PRODUCTS.find((p) => p.id === productId)?.stock ?? 0;
				const next = Math.min(max, qty);
				return next <= 0 ? [] : [{
					...l,
					qty: next
				}];
			})),
			clearCart: () => setCart([]),
			toggleWishlist: (productId) => setWishlist((prev) => prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]),
			inWishlist: (productId) => wishlist.includes(productId)
		};
	}, [cart, wishlist]);
	return /* @__PURE__ */ jsx(Ctx.Provider, {
		value,
		children
	});
}
function useShop() {
	const ctx = useContext(Ctx);
	if (!ctx) throw new Error("useShop must be used within ShopProvider");
	return ctx;
}
var COUPONS = {
	SILVER10: {
		type: "pct",
		value: 10,
		min: 1500
	},
	FIRST500: {
		type: "flat",
		value: 500,
		min: 3e3
	}
};
function applyCoupon(code, subtotal) {
	const c = COUPONS[code.trim().toUpperCase()];
	if (!c) return {
		ok: false,
		message: "Invalid coupon code",
		discount: 0
	};
	if (subtotal < c.min) return {
		ok: false,
		message: `Minimum order ₹${c.min} required`,
		discount: 0
	};
	return {
		ok: true,
		message: "Coupon applied",
		discount: c.type === "pct" ? Math.round(subtotal * c.value / 100) : c.value
	};
}
//#endregion
export { applyCoupon as n, useShop as r, ShopProvider as t };
