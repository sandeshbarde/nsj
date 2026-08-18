import { o as craft_default } from "./router-owmLecd6.js";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/our-craft.tsx?tsr-split=component
var STEPS = [
	{
		n: "01",
		t: "Design",
		d: "Sketched in studio, prototyped in wax, refined until the proportions feel right."
	},
	{
		n: "02",
		t: "Casting",
		d: "Poured in 925 sterling silver — 92.5% pure silver with copper for strength."
	},
	{
		n: "03",
		t: "Filing & shaping",
		d: "Each casting is hand-filed to remove seams and true the form."
	},
	{
		n: "04",
		t: "Stone setting",
		d: "Stones are set by hand under magnification, prong by prong."
	},
	{
		n: "05",
		t: "Polishing",
		d: "Multi-stage buffing and rhodium finish for an anti-tarnish lustre."
	},
	{
		n: "06",
		t: "Quality check",
		d: "Weighed, hallmarked and inspected before it's boxed."
	}
];
function Craft() {
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-5xl px-4 py-16 md:px-8",
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "eyebrow",
				children: "Our craft"
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "mt-2 text-4xl md:text-5xl",
				children: "Six hands, one piece."
			}),
			/* @__PURE__ */ jsx("img", {
				src: craft_default,
				alt: "Hand-finishing silver jewellery",
				loading: "lazy",
				width: 1400,
				height: 900,
				className: "mt-10 w-full object-cover"
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-14 grid gap-10 md:grid-cols-2",
				children: STEPS.map((s) => /* @__PURE__ */ jsxs("div", {
					className: "border-t border-border pt-5",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "eyebrow",
							children: s.n
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "mt-2 text-2xl",
							children: s.t
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: s.d
						})
					]
				}, s.n))
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "mt-16 bg-secondary p-10",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "text-3xl",
					children: "What 925 means"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground",
					children: "Sterling silver is 92.5% pure silver alloyed with 7.5% copper. Pure silver alone is too soft to hold a setting; the alloy gives strength while keeping the bright white tone. Every Argent piece is stamped 925 and independently hallmarked."
				})]
			})
		]
	});
}
//#endregion
export { Craft as component };
