import { n as CATEGORY_IMAGE, t as CATEGORIES } from "./products-DCeX7mS0.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/collections.tsx?tsr-split=component
var EDITS = [
	{
		tag: "new",
		title: "New Arrivals",
		text: "The latest pieces from the workbench."
	},
	{
		tag: "bestseller",
		title: "Best Sellers",
		text: "Most loved by our community."
	},
	{
		tag: "signature",
		title: "Signature Collection",
		text: "Our defining silhouettes."
	},
	{
		tag: "gift",
		title: "Gifts",
		text: "Considered pieces, beautifully boxed."
	}
];
function Collections() {
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-7xl px-4 py-16 md:px-8",
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "eyebrow",
				children: "Collections"
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "mt-2 text-4xl md:text-5xl",
				children: "Edits & Categories"
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-12 grid gap-6 md:grid-cols-2",
				children: EDITS.map((e) => /* @__PURE__ */ jsxs(Link, {
					to: "/shop",
					search: { tag: e.tag },
					className: "group block bg-secondary p-8",
					children: [
						/* @__PURE__ */ jsx("h2", {
							className: "text-3xl",
							children: e.title
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: e.text
						}),
						/* @__PURE__ */ jsx("span", {
							className: "mt-6 inline-block text-[11px] tracking-[0.2em] uppercase underline underline-offset-8",
							children: "Shop the edit"
						})
					]
				}, e.tag))
			}),
			/* @__PURE__ */ jsx("h2", {
				className: "mt-20 text-3xl",
				children: "By category"
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-8 grid grid-cols-2 gap-4 md:grid-cols-4",
				children: CATEGORIES.map((c) => /* @__PURE__ */ jsxs(Link, {
					to: "/shop",
					search: { category: c.slug },
					className: "group block",
					children: [/* @__PURE__ */ jsx("div", {
						className: "overflow-hidden bg-secondary",
						children: /* @__PURE__ */ jsx("img", {
							src: CATEGORY_IMAGE[c.slug],
							alt: c.label,
							loading: "lazy",
							width: 800,
							height: 1e3,
							className: "aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
						})
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-3 text-center text-[11px] tracking-[0.2em] uppercase",
						children: c.label
					})]
				}, c.slug))
			})
		]
	});
}
//#endregion
export { Collections as component };
