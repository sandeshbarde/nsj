import { a as formatINR } from "./products-DCeX7mS0.js";
import { n as applyCoupon, r as useShop } from "./store-DCX_9F1S.js";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Minus, Plus, X } from "lucide-react";
//#region src/routes/cart.tsx?tsr-split=component
function CartPage() {
	const { lines, setQty, removeFromCart, subtotal } = useShop();
	const [code, setCode] = useState("");
	const [discount, setDiscount] = useState(0);
	const shipping = subtotal > 0 && subtotal < 1500 ? 99 : 0;
	const total = Math.max(0, subtotal - discount) + shipping;
	if (lines.length === 0) return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-2xl px-4 py-32 text-center",
		children: [
			/* @__PURE__ */ jsx("h1", {
				className: "text-4xl",
				children: "Your bag is empty"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: "Discover pieces made to be worn every day."
			}),
			/* @__PURE__ */ jsx(Link, {
				to: "/shop",
				className: "mt-8 inline-block bg-ink px-8 py-4 text-[11px] tracking-[0.2em] uppercase text-ink-foreground",
				children: "Shop the collection"
			})
		]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-6xl px-4 py-12 md:px-8",
		children: [/* @__PURE__ */ jsx("h1", {
			className: "text-4xl",
			children: "Shopping Bag"
		}), /* @__PURE__ */ jsxs("div", {
			className: "mt-10 grid gap-12 lg:grid-cols-[1fr_360px]",
			children: [/* @__PURE__ */ jsx("ul", {
				className: "divide-y divide-border border-y border-border",
				children: lines.map((l) => /* @__PURE__ */ jsxs("li", {
					className: "flex gap-4 py-6",
					children: [/* @__PURE__ */ jsx(Link, {
						to: "/product/$slug",
						params: { slug: l.product.slug },
						className: "w-24 shrink-0",
						children: /* @__PURE__ */ jsx("img", {
							src: l.product.image,
							alt: l.product.name,
							loading: "lazy",
							width: 800,
							height: 1e3,
							className: "aspect-4/5 w-full object-cover"
						})
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex justify-between gap-4",
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx(Link, {
									to: "/product/$slug",
									params: { slug: l.product.slug },
									className: "font-display text-lg",
									children: l.product.name
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: [
										"Size ",
										l.size,
										" · 925 Silver · ",
										l.product.weightGrams,
										" g"
									]
								}),
								l.qty >= l.product.stock && /* @__PURE__ */ jsx("p", {
									className: "mt-1 text-xs text-destructive",
									children: "Maximum available quantity reached"
								})
							] }), /* @__PURE__ */ jsx("button", {
								type: "button",
								"aria-label": "Remove item",
								onClick: () => removeFromCart(l.productId, l.size),
								children: /* @__PURE__ */ jsx(X, {
									className: "size-4",
									strokeWidth: 1.25
								})
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "mt-4 flex items-center justify-between",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center border border-border",
								children: [
									/* @__PURE__ */ jsx("button", {
										type: "button",
										"aria-label": "Decrease quantity",
										className: "px-3 py-2",
										onClick: () => setQty(l.productId, l.size, l.qty - 1),
										children: /* @__PURE__ */ jsx(Minus, {
											className: "size-3",
											strokeWidth: 1.5
										})
									}),
									/* @__PURE__ */ jsx("span", {
										className: "w-8 text-center text-sm",
										children: l.qty
									}),
									/* @__PURE__ */ jsx("button", {
										type: "button",
										"aria-label": "Increase quantity",
										className: "px-3 py-2",
										onClick: () => setQty(l.productId, l.size, l.qty + 1),
										children: /* @__PURE__ */ jsx(Plus, {
											className: "size-3",
											strokeWidth: 1.5
										})
									})
								]
							}), /* @__PURE__ */ jsx("span", {
								className: "text-sm",
								children: formatINR(l.product.price * l.qty)
							})]
						})]
					})]
				}, l.productId + l.size))
			}), /* @__PURE__ */ jsxs("aside", {
				className: "h-fit bg-secondary p-6",
				children: [
					/* @__PURE__ */ jsx("h2", {
						className: "eyebrow",
						children: "Order summary"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-5 flex gap-2",
						children: [/* @__PURE__ */ jsx("input", {
							value: code,
							onChange: (e) => setCode(e.target.value),
							maxLength: 20,
							placeholder: "Coupon code",
							"aria-label": "Coupon code",
							className: "w-full border border-border bg-background px-3 py-2 text-sm outline-none"
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => {
								const res = applyCoupon(code, subtotal);
								setDiscount(res.discount);
								res.ok ? toast.success(res.message) : toast.error(res.message);
							},
							className: "border border-foreground px-4 text-[11px] tracking-[0.2em] uppercase",
							children: "Apply"
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: "Try SILVER10 or FIRST500"
					}),
					/* @__PURE__ */ jsxs("dl", {
						className: "mt-6 space-y-2 border-t border-border pt-4 text-sm",
						children: [
							/* @__PURE__ */ jsx(Row, {
								label: "Subtotal",
								value: formatINR(subtotal)
							}),
							discount > 0 && /* @__PURE__ */ jsx(Row, {
								label: "Discount",
								value: `− ${formatINR(discount)}`
							}),
							/* @__PURE__ */ jsx(Row, {
								label: "Shipping",
								value: shipping === 0 ? "Free" : formatINR(shipping)
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between border-t border-border pt-3 text-base",
								children: [/* @__PURE__ */ jsx("dt", { children: "Total" }), /* @__PURE__ */ jsx("dd", { children: formatINR(total) })]
							})
						]
					}),
					/* @__PURE__ */ jsx(Link, {
						to: "/checkout",
						className: "mt-6 block bg-ink px-6 py-4 text-center text-[11px] tracking-[0.2em] uppercase text-ink-foreground",
						children: "Proceed to checkout"
					}),
					/* @__PURE__ */ jsx(Link, {
						to: "/shop",
						className: "mt-3 block text-center text-xs underline underline-offset-4",
						children: "Continue shopping"
					})
				]
			})]
		})]
	});
}
function Row({ label, value }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex justify-between",
		children: [/* @__PURE__ */ jsx("dt", {
			className: "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ jsx("dd", { children: value })]
	});
}
//#endregion
export { CartPage as component };
