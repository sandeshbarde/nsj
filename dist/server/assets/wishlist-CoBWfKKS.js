import { a as formatINR, r as PRODUCTS } from "./products-DCeX7mS0.js";
import { r as useShop } from "./store-DCX_9F1S.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { X } from "lucide-react";
//#region src/routes/wishlist.tsx?tsr-split=component
function WishlistPage() {
	const { wishlist, toggleWishlist, addToCart } = useShop();
	const items = PRODUCTS.filter((p) => wishlist.includes(p.id));
	if (items.length === 0) return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-2xl px-4 py-32 text-center",
		children: [
			/* @__PURE__ */ jsx("h1", {
				className: "text-4xl",
				children: "Your wishlist is empty"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: "Tap the heart on any piece to save it here."
			}),
			/* @__PURE__ */ jsx(Link, {
				to: "/shop",
				className: "mt-8 inline-block bg-ink px-8 py-4 text-[11px] tracking-[0.2em] uppercase text-ink-foreground",
				children: "Browse jewellery"
			})
		]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-6xl px-4 py-12 md:px-8",
		children: [
			/* @__PURE__ */ jsx("h1", {
				className: "text-4xl",
				children: "Wishlist"
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: [items.length, " saved pieces"]
			}),
			/* @__PURE__ */ jsx("ul", {
				className: "mt-10 divide-y divide-border border-y border-border",
				children: items.map((p) => /* @__PURE__ */ jsxs("li", {
					className: "flex gap-4 py-6",
					children: [/* @__PURE__ */ jsx(Link, {
						to: "/product/$slug",
						params: { slug: p.slug },
						className: "w-24 shrink-0",
						children: /* @__PURE__ */ jsx("img", {
							src: p.image,
							alt: p.name,
							loading: "lazy",
							width: 800,
							height: 1e3,
							className: "aspect-4/5 w-full object-cover"
						})
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex flex-1 flex-col justify-between",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex justify-between gap-4",
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx(Link, {
									to: "/product/$slug",
									params: { slug: p.slug },
									className: "font-display text-lg",
									children: p.name
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1 text-sm",
									children: formatINR(p.price)
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: p.stock === 0 ? "Out of stock" : "In stock"
								})
							] }), /* @__PURE__ */ jsx("button", {
								type: "button",
								"aria-label": "Remove from wishlist",
								onClick: () => toggleWishlist(p.id),
								children: /* @__PURE__ */ jsx(X, {
									className: "size-4",
									strokeWidth: 1.25
								})
							})]
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							disabled: p.stock === 0,
							onClick: () => {
								addToCart(p.id, p.sizes[0] ?? "Free Size");
								toggleWishlist(p.id);
								toast.success("Moved to bag", { description: p.name });
							},
							className: "mt-4 self-start border border-foreground px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase disabled:opacity-40",
							children: "Move to bag"
						})]
					})]
				}, p.id))
			})
		]
	});
}
//#endregion
export { WishlistPage as component };
