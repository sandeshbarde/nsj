import { a as Route } from "./router-owmLecd6.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Check } from "lucide-react";
//#region src/routes/order-success.tsx?tsr-split=component
function OrderSuccess() {
	const { order } = Route.useSearch();
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-xl px-4 py-28 text-center",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "mx-auto grid size-14 place-items-center rounded-full border border-foreground",
				children: /* @__PURE__ */ jsx(Check, {
					className: "size-6",
					strokeWidth: 1
				})
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "mt-8 text-4xl",
				children: "Thank you"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: "Your order has been placed. A confirmation will be sent to your email shortly."
			}),
			order && /* @__PURE__ */ jsxs("p", {
				className: "mt-6 border-y border-border py-4 text-sm",
				children: ["Order number ", /* @__PURE__ */ jsx("span", {
					className: "tracking-[0.2em]",
					children: order
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-8 flex flex-wrap justify-center gap-3",
				children: [/* @__PURE__ */ jsx(Link, {
					to: "/track-order",
					search: { order },
					className: "bg-ink px-8 py-4 text-[11px] tracking-[0.2em] uppercase text-ink-foreground",
					children: "Track order"
				}), /* @__PURE__ */ jsx(Link, {
					to: "/shop",
					className: "border border-foreground px-8 py-4 text-[11px] tracking-[0.2em] uppercase",
					children: "Continue shopping"
				})]
			})
		]
	});
}
//#endregion
export { OrderSuccess as component };
