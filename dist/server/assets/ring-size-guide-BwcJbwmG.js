import { jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/ring-size-guide.tsx?tsr-split=component
var SIZES = [
	{
		in: "10",
		dia: "15.3",
		circ: "48.0"
	},
	{
		in: "12",
		dia: "16.1",
		circ: "50.6"
	},
	{
		in: "14",
		dia: "16.9",
		circ: "53.1"
	},
	{
		in: "16",
		dia: "17.8",
		circ: "55.7"
	},
	{
		in: "18",
		dia: "18.6",
		circ: "58.3"
	},
	{
		in: "20",
		dia: "19.4",
		circ: "60.8"
	},
	{
		in: "22",
		dia: "20.2",
		circ: "63.4"
	}
];
function SizeGuide() {
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-3xl px-4 py-16 md:px-8",
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "eyebrow",
				children: "Ring size guide"
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "mt-2 text-4xl md:text-5xl",
				children: "Find your size"
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "mt-10 text-sm leading-relaxed text-muted-foreground",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "text-2xl text-foreground",
					children: "How to measure"
				}), /* @__PURE__ */ jsxs("ol", {
					className: "mt-3 space-y-2",
					children: [
						/* @__PURE__ */ jsx("li", { children: "1. Wrap a thin strip of paper snugly around the base of your finger." }),
						/* @__PURE__ */ jsx("li", { children: "2. Mark where the paper overlaps and measure the length in millimetres." }),
						/* @__PURE__ */ jsx("li", { children: "3. Match that circumference to the chart below." }),
						/* @__PURE__ */ jsx("li", { children: "4. Measure at the end of the day, when fingers are largest." })
					]
				})]
			}),
			/* @__PURE__ */ jsxs("table", {
				className: "mt-10 w-full border-t border-border text-sm",
				children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
					className: "eyebrow",
					children: [
						/* @__PURE__ */ jsx("th", {
							className: "py-3 text-left",
							children: "Indian size"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "py-3 text-left",
							children: "Diameter (mm)"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "py-3 text-left",
							children: "Circumference (mm)"
						})
					]
				}) }), /* @__PURE__ */ jsx("tbody", { children: SIZES.map((s) => /* @__PURE__ */ jsxs("tr", {
					className: "border-t border-border",
					children: [
						/* @__PURE__ */ jsx("td", {
							className: "py-3",
							children: s.in
						}),
						/* @__PURE__ */ jsx("td", {
							className: "py-3",
							children: s.dia
						}),
						/* @__PURE__ */ jsx("td", {
							className: "py-3",
							children: s.circ
						})
					]
				}, s.in)) })]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-8 text-xs text-muted-foreground",
				children: "Between two sizes? Choose the larger one — especially for wide bands."
			})
		]
	});
}
//#endregion
export { SizeGuide as component };
