import { a as formatINR, i as discountPct, r as PRODUCTS } from "./products-DCeX7mS0.js";
import { r as useShop } from "./store-DCX_9F1S.js";
import { c as cn, n as Route, s as ProductCard } from "./router-owmLecd6.js";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Heart, Minus, Plus, RotateCcw, ShieldCheck, Star, Truck } from "lucide-react";
//#region src/routes/product.$slug.tsx?tsr-split=component
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
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-7xl px-4 py-10 md:px-8",
		children: [
			/* @__PURE__ */ jsxs("nav", {
				className: "eyebrow flex gap-2",
				"aria-label": "Breadcrumb",
				children: [
					/* @__PURE__ */ jsx(Link, {
						to: "/",
						children: "Home"
					}),
					" / ",
					/* @__PURE__ */ jsx(Link, {
						to: "/shop",
						children: "Shop"
					}),
					" /",
					" ",
					/* @__PURE__ */ jsx(Link, {
						to: "/shop",
						search: { category: product.category },
						children: product.category
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-8 grid gap-10 lg:grid-cols-2",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "grid gap-4 sm:grid-cols-[80px_1fr]",
					children: [/* @__PURE__ */ jsx("div", {
						className: "order-2 flex gap-3 sm:order-1 sm:flex-col",
						children: product.gallery.map((g, i) => /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setActive(i),
							"aria-label": `View image ${i + 1}`,
							className: cn("w-20 overflow-hidden border", active === i ? "border-foreground" : "border-transparent"),
							children: /* @__PURE__ */ jsx("img", {
								src: g,
								alt: "",
								loading: "lazy",
								width: 800,
								height: 1e3,
								className: "aspect-4/5 w-full object-cover"
							})
						}, i))
					}), /* @__PURE__ */ jsx("div", {
						className: "order-1 overflow-hidden bg-secondary sm:order-2",
						children: /* @__PURE__ */ jsx("img", {
							src: product.gallery[active],
							alt: product.name,
							width: 800,
							height: 1e3,
							className: "aspect-4/5 w-full object-cover transition-transform duration-700 hover:scale-125"
						})
					})]
				}), /* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("p", {
						className: "eyebrow",
						children: "925 Sterling Silver"
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "mt-2 text-4xl",
						children: product.name
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-3 flex items-center gap-2 text-sm text-muted-foreground",
						children: [
							/* @__PURE__ */ jsx(Star, {
								className: "size-3.5 fill-foreground text-foreground",
								strokeWidth: 0
							}),
							product.rating.toFixed(1),
							" · ",
							product.reviews,
							" reviews"
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-5 flex items-baseline gap-3",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "text-2xl",
								children: formatINR(product.price)
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-muted-foreground line-through",
								children: formatINR(product.mrp)
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "text-sm",
								children: [discountPct(product), "% off"]
							})
						]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Inclusive of all taxes"
					}),
					/* @__PURE__ */ jsxs("p", {
						className: cn("mt-4 text-sm", oos ? "text-destructive" : "text-muted-foreground"),
						children: [
							oos ? "Out of stock" : product.stock <= 5 ? `Only ${product.stock} left` : "In stock",
							" · SKU AG-",
							product.id.padStart(4, "0")
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-6",
						children: [
							/* @__PURE__ */ jsx("p", {
								className: "eyebrow",
								children: "Size"
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-2 flex flex-wrap gap-2",
								children: product.sizes.map((s) => /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setSize(s),
									className: cn("border px-4 py-2 text-sm", size === s ? "border-foreground bg-foreground text-background" : "border-border"),
									children: s
								}, s))
							}),
							product.category === "rings" && /* @__PURE__ */ jsx(Link, {
								to: "/ring-size-guide",
								className: "mt-2 inline-block text-xs underline underline-offset-4",
								children: "Ring size guide"
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-6 flex items-center gap-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center border border-border",
							children: [
								/* @__PURE__ */ jsx("button", {
									type: "button",
									"aria-label": "Decrease quantity",
									className: "px-3 py-3",
									onClick: () => setQty((q) => Math.max(1, q - 1)),
									children: /* @__PURE__ */ jsx(Minus, {
										className: "size-3.5",
										strokeWidth: 1.5
									})
								}),
								/* @__PURE__ */ jsx("span", {
									className: "w-8 text-center text-sm",
									children: qty
								}),
								/* @__PURE__ */ jsx("button", {
									type: "button",
									"aria-label": "Increase quantity",
									className: "px-3 py-3",
									onClick: () => setQty((q) => Math.min(product.stock, q + 1)),
									children: /* @__PURE__ */ jsx(Plus, {
										className: "size-3.5",
										strokeWidth: 1.5
									})
								})
							]
						}), /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => toggleWishlist(product.id),
							className: "flex items-center gap-2 border border-border px-4 py-3 text-[11px] tracking-[0.2em] uppercase",
							children: [/* @__PURE__ */ jsx(Heart, {
								className: cn("size-4", inWishlist(product.id) && "fill-foreground"),
								strokeWidth: 1.25
							}), "Wishlist"]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-4 flex flex-col gap-3 sm:flex-row",
						children: [/* @__PURE__ */ jsx("button", {
							type: "button",
							disabled: oos,
							onClick: add,
							className: "flex-1 bg-ink px-6 py-4 text-[11px] tracking-[0.2em] uppercase text-ink-foreground disabled:opacity-40",
							children: oos ? "Sold out" : "Add to bag"
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							disabled: oos,
							onClick: () => {
								add();
								navigate({ to: "/checkout" });
							},
							className: "flex-1 border border-foreground px-6 py-4 text-[11px] tracking-[0.2em] uppercase disabled:opacity-40",
							children: "Buy now"
						})]
					}),
					/* @__PURE__ */ jsxs("dl", {
						className: "mt-8 grid grid-cols-2 gap-y-3 border-t border-border pt-6 text-sm",
						children: [
							/* @__PURE__ */ jsx(Spec, {
								label: "Purity",
								value: `${product.purity} Silver`
							}),
							/* @__PURE__ */ jsx(Spec, {
								label: "Weight",
								value: `${product.weightGrams} g`
							}),
							/* @__PURE__ */ jsx(Spec, {
								label: "Material",
								value: "Sterling silver, rhodium polish"
							}),
							/* @__PURE__ */ jsx(Spec, {
								label: "Stone",
								value: product.stone
							})
						]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-6 text-sm leading-relaxed text-muted-foreground",
						children: product.description
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-8 grid gap-4 border-t border-border pt-6 text-sm sm:grid-cols-3",
						children: [
							/* @__PURE__ */ jsx(Perk, {
								icon: /* @__PURE__ */ jsx(Truck, {
									className: "size-4",
									strokeWidth: 1.25
								}),
								title: "Free shipping",
								text: "Dispatched in 24–48 hrs"
							}),
							/* @__PURE__ */ jsx(Perk, {
								icon: /* @__PURE__ */ jsx(RotateCcw, {
									className: "size-4",
									strokeWidth: 1.25
								}),
								title: "30-day returns",
								text: "Easy pickup"
							}),
							/* @__PURE__ */ jsx(Perk, {
								icon: /* @__PURE__ */ jsx(ShieldCheck, {
									className: "size-4",
									strokeWidth: 1.25
								}),
								title: "6-month warranty",
								text: "Free replating"
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-6 text-sm text-muted-foreground",
						children: [
							/* @__PURE__ */ jsx(Link, {
								to: "/jewellery-care",
								className: "underline underline-offset-4",
								children: "Jewellery care"
							}),
							" · ",
							/* @__PURE__ */ jsx(Link, {
								to: "/policies",
								className: "underline underline-offset-4",
								children: "Shipping & returns"
							})
						]
					})
				] })]
			}),
			/* @__PURE__ */ jsx(Section, {
				title: "You may also like",
				products: related
			}),
			/* @__PURE__ */ jsx(Section, {
				title: "Complete the look",
				products: complete
			})
		]
	});
}
function Spec({ label, value }) {
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", {
		className: "eyebrow",
		children: label
	}), /* @__PURE__ */ jsx("dd", {
		className: "mt-1",
		children: value
	})] });
}
function Perk({ icon, title, text }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex gap-3",
		children: [icon, /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", { children: title }), /* @__PURE__ */ jsx("p", {
			className: "text-xs text-muted-foreground",
			children: text
		})] })]
	});
}
function Section({ title, products }) {
	if (products.length === 0) return null;
	return /* @__PURE__ */ jsxs("section", {
		className: "mt-20",
		children: [/* @__PURE__ */ jsx("h2", {
			className: "text-3xl",
			children: title
		}), /* @__PURE__ */ jsx("div", {
			className: "mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4",
			children: products.map((p, i) => /* @__PURE__ */ jsx(ProductCard, {
				product: p,
				index: i
			}, p.id))
		})]
	});
}
//#endregion
export { ProductPage as component };
