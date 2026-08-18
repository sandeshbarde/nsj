import { a as formatINR, r as PRODUCTS, t as CATEGORIES } from "./products-DCeX7mS0.js";
import { i as Route, s as ProductCard } from "./router-owmLecd6.js";
import { useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/shop.tsx?tsr-split=component
function ShopPage() {
	const search = Route.useSearch();
	const navigate = useNavigate({ from: "/shop" });
	const set = (patch) => navigate({ search: (prev) => ({
		...prev,
		...patch
	}) });
	const products = useMemo(() => {
		let list = PRODUCTS.slice();
		if (search["q"]) {
			const q = search["q"].toLowerCase();
			list = list.filter((p) => (p.name + " " + p.category).toLowerCase().includes(q));
		}
		if (search["category"]) list = list.filter((p) => p.category === search["category"]);
		if (search["gender"]) list = list.filter((p) => p.gender === search["gender"]);
		if (search["tag"]) list = list.filter((p) => p.tags.includes(search["tag"]));
		if (search["maxPrice"]) list = list.filter((p) => p.price <= search["maxPrice"]);
		if (search["inStock"]) list = list.filter((p) => p.stock > 0);
		if (search["minRating"]) list = list.filter((p) => p.rating >= search["minRating"]);
		switch (search["sort"]) {
			case "price-asc": return list.sort((a, b) => a.price - b.price);
			case "price-desc": return list.sort((a, b) => b.price - a.price);
			case "popular": return list.sort((a, b) => b.reviews - a.reviews);
			case "newest": return list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
			default: return list;
		}
	}, [search]);
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-7xl px-4 py-12 md:px-8",
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "eyebrow",
				children: "Jewellery"
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "mt-2 text-4xl md:text-5xl",
				children: "The Collection"
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "mt-3 max-w-xl text-sm text-muted-foreground",
				children: [products.length, " pieces in 925 sterling silver, hand-finished and hallmarked."]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-10 grid gap-10 lg:grid-cols-[220px_1fr]",
				children: [/* @__PURE__ */ jsxs("aside", {
					className: "space-y-8 text-sm",
					children: [
						/* @__PURE__ */ jsxs(Filter, {
							title: "Category",
							children: [/* @__PURE__ */ jsx(FilterLink, {
								active: !search["category"],
								onClick: () => set({ category: void 0 }),
								children: "All"
							}), CATEGORIES.map((c) => /* @__PURE__ */ jsx(FilterLink, {
								active: search["category"] === c.slug,
								onClick: () => set({ category: c.slug }),
								children: c.label
							}, c.slug))]
						}),
						/* @__PURE__ */ jsx(Filter, {
							title: "Wear",
							children: [
								"women",
								"men",
								"unisex"
							].map((g) => /* @__PURE__ */ jsx(FilterLink, {
								active: search["gender"] === g,
								onClick: () => set({ gender: search["gender"] === g ? void 0 : g }),
								children: g.charAt(0).toUpperCase() + g.slice(1)
							}, g))
						}),
						/* @__PURE__ */ jsx(Filter, {
							title: `Max price · ${formatINR(search["maxPrice"] ?? 6e3)}`,
							children: /* @__PURE__ */ jsx("input", {
								type: "range",
								min: 1e3,
								max: 6e3,
								step: 500,
								value: search["maxPrice"] ?? 6e3,
								onChange: (e) => set({ maxPrice: Number(e.target.value) }),
								className: "w-full accent-foreground",
								"aria-label": "Maximum price"
							})
						}),
						/* @__PURE__ */ jsx(Filter, {
							title: "Purity",
							children: /* @__PURE__ */ jsx("span", {
								className: "text-muted-foreground",
								children: "925 Sterling Silver (all pieces)"
							})
						}),
						/* @__PURE__ */ jsx(Filter, {
							title: "Availability",
							children: /* @__PURE__ */ jsxs("label", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("input", {
									type: "checkbox",
									checked: !!search["inStock"],
									onChange: (e) => set({ inStock: e.target.checked || void 0 }),
									className: "accent-foreground"
								}), "In stock only"]
							})
						}),
						/* @__PURE__ */ jsx(Filter, {
							title: "Rating",
							children: [4.5, 4].map((r) => /* @__PURE__ */ jsxs(FilterLink, {
								active: search["minRating"] === r,
								onClick: () => set({ minRating: search["minRating"] === r ? void 0 : r }),
								children: [r, "★ & above"]
							}, r))
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => navigate({ search: {} }),
							className: "text-[11px] tracking-[0.2em] uppercase underline underline-offset-4",
							children: "Clear all"
						})
					]
				}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
					className: "mb-6 flex items-center justify-between gap-4 border-b border-border pb-4",
					children: [/* @__PURE__ */ jsx("input", {
						value: search["q"] ?? "",
						onChange: (e) => set({ q: e.target.value || void 0 }),
						placeholder: "Search jewellery",
						"aria-label": "Search jewellery",
						className: "w-full max-w-xs bg-transparent text-sm outline-none placeholder:text-muted-foreground"
					}), /* @__PURE__ */ jsxs("select", {
						value: search["sort"] ?? "popular",
						onChange: (e) => set({ sort: e.target.value }),
						"aria-label": "Sort by",
						className: "bg-transparent text-[11px] tracking-[0.2em] uppercase outline-none",
						children: [
							/* @__PURE__ */ jsx("option", {
								value: "popular",
								children: "Popularity"
							}),
							/* @__PURE__ */ jsx("option", {
								value: "newest",
								children: "Newest"
							}),
							/* @__PURE__ */ jsx("option", {
								value: "price-asc",
								children: "Price: Low to High"
							}),
							/* @__PURE__ */ jsx("option", {
								value: "price-desc",
								children: "Price: High to Low"
							})
						]
					})]
				}), products.length === 0 ? /* @__PURE__ */ jsxs("div", {
					className: "py-24 text-center",
					children: [/* @__PURE__ */ jsx("p", {
						className: "font-display text-2xl",
						children: "Nothing matches those filters"
					}), /* @__PURE__ */ jsx(Link, {
						to: "/shop",
						search: {},
						className: "mt-4 inline-block text-[11px] tracking-[0.2em] uppercase underline underline-offset-4",
						children: "Reset filters"
					})]
				}) : /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-4",
					children: products.map((p, i) => /* @__PURE__ */ jsx(ProductCard, {
						product: p,
						index: i
					}, p.id))
				})] })]
			})
		]
	});
}
function Filter({ title, children }) {
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
		className: "eyebrow",
		children: title
	}), /* @__PURE__ */ jsx("div", {
		className: "mt-3 flex flex-col items-start gap-2",
		children
	})] });
}
function FilterLink({ active, onClick, children }) {
	return /* @__PURE__ */ jsx("button", {
		type: "button",
		onClick,
		className: active ? "underline underline-offset-4" : "text-muted-foreground hover:text-foreground",
		children
	});
}
//#endregion
export { ShopPage as component };
