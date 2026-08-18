import { o as craft_default } from "./router-owmLecd6.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/about.tsx?tsr-split=component
function About() {
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-4xl px-4 py-16 md:px-8",
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "eyebrow",
				children: "About us"
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "mt-2 text-4xl md:text-5xl",
				children: "Jewellery made to be lived in."
			}),
			/* @__PURE__ */ jsx("img", {
				src: craft_default,
				alt: "Silversmith at work",
				loading: "lazy",
				width: 1400,
				height: 900,
				className: "mt-10 w-full object-cover"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-12 space-y-8 text-sm leading-relaxed text-muted-foreground",
				children: [
					/* @__PURE__ */ jsx("p", { children: "Argent began in 2016 with a single bench in Jaipur and one belief: silver deserves the same care as gold. We design in small batches, cast in 925 sterling silver, and finish every surface by hand." }),
					/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h2", {
						className: "text-2xl text-foreground",
						children: "Our mission"
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-2",
						children: "To make heirloom-quality silver accessible — pieces that hold their shine, their shape and their meaning far beyond a season."
					})] }),
					/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h2", {
						className: "text-2xl text-foreground",
						children: "Our values"
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-2",
						children: "Honest materials, fair workshops, restrained design. No plated brass, no hidden alloys, no manufactured urgency."
					})] }),
					/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h2", {
						className: "text-2xl text-foreground",
						children: "Our philosophy"
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-2",
						children: "Jewellery should feel personal, not performative. We design quiet pieces that layer, travel and age gracefully."
					})] })
				]
			}),
			/* @__PURE__ */ jsx(Link, {
				to: "/our-craft",
				className: "mt-12 inline-block bg-ink px-8 py-4 text-[11px] tracking-[0.2em] uppercase text-ink-foreground",
				children: "See how it's made"
			})
		]
	});
}
//#endregion
export { About as component };
