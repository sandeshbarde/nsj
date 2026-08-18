import { jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/jewellery-care.tsx?tsr-split=component
var BLOCKS = [
	{
		t: "Cleaning",
		items: [
			"Buff gently with the polishing cloth in your box",
			"For heavier tarnish, use warm water with a drop of mild soap and a soft brush",
			"Dry completely before storing"
		]
	},
	{
		t: "Storage",
		items: [
			"Keep pieces in the pouch provided, one per pouch",
			"Store away from humidity and direct sunlight",
			"Add a silica sachet to your jewellery box"
		]
	},
	{
		t: "What to avoid",
		items: [
			"Perfume, hairspray and lotions on the metal",
			"Swimming pools, sea water and hot springs",
			"Sleeping or working out in delicate chains"
		]
	},
	{
		t: "Maintenance",
		items: [
			"Wipe after each wear",
			"Free replating within 6 months of purchase",
			"Have prongs checked yearly on stone-set pieces"
		]
	}
];
function Care() {
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-4xl px-4 py-16 md:px-8",
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "eyebrow",
				children: "Jewellery care"
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "mt-2 text-4xl md:text-5xl",
				children: "Caring for your silver"
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-12 grid gap-10 md:grid-cols-2",
				children: BLOCKS.map((b) => /* @__PURE__ */ jsxs("section", {
					className: "border-t border-border pt-5",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "text-2xl",
						children: b.t
					}), /* @__PURE__ */ jsx("ul", {
						className: "mt-3 space-y-2 text-sm text-muted-foreground",
						children: b.items.map((i) => /* @__PURE__ */ jsxs("li", { children: ["— ", i] }, i))
					})]
				}, b.t))
			})
		]
	});
}
//#endregion
export { Care as component };
