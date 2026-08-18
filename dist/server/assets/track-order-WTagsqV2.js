import { r as Route } from "./router-owmLecd6.js";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/track-order.tsx?tsr-split=component
var STAGES = [
	"Confirmed",
	"Processing",
	"Packed",
	"Shipped",
	"Out for Delivery",
	"Delivered"
];
function TrackOrder() {
	const { order } = Route.useSearch();
	const [id, setId] = useState(order ?? "");
	const [contact, setContact] = useState("");
	const [result, setResult] = useState(null);
	const [error, setError] = useState("");
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-2xl px-4 py-16 md:px-8",
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "eyebrow",
				children: "Order tracking"
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "mt-2 text-4xl md:text-5xl",
				children: "Where's my order?"
			}),
			/* @__PURE__ */ jsxs("form", {
				className: "mt-10 space-y-5",
				onSubmit: (e) => {
					e.preventDefault();
					if (!/^AG\d{6,10}$/i.test(id.trim())) {
						setResult(null);
						setError("Order numbers look like AG12345678");
						return;
					}
					if (!/^\S+@\S+\.\S+$/.test(contact.trim()) && !/^[6-9]\d{9}$/.test(contact.trim())) {
						setResult(null);
						setError("Enter the email or mobile used on the order");
						return;
					}
					setError("");
					setResult({
						id: id.trim().toUpperCase(),
						stage: 2
					});
				},
				children: [
					/* @__PURE__ */ jsxs("label", {
						className: "block",
						children: [/* @__PURE__ */ jsx("span", {
							className: "eyebrow",
							children: "Order number"
						}), /* @__PURE__ */ jsx("input", {
							value: id,
							onChange: (e) => setId(e.target.value),
							maxLength: 20,
							className: "mt-1 w-full border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground"
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "block",
						children: [/* @__PURE__ */ jsx("span", {
							className: "eyebrow",
							children: "Email or mobile"
						}), /* @__PURE__ */ jsx("input", {
							value: contact,
							onChange: (e) => setContact(e.target.value),
							maxLength: 255,
							className: "mt-1 w-full border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground"
						})]
					}),
					error && /* @__PURE__ */ jsx("p", {
						className: "text-xs text-destructive",
						children: error
					}),
					/* @__PURE__ */ jsx("button", {
						type: "submit",
						className: "bg-ink px-8 py-4 text-[11px] tracking-[0.2em] uppercase text-ink-foreground",
						children: "Track order"
					})
				]
			}),
			result && /* @__PURE__ */ jsxs("section", {
				className: "mt-12 border-t border-border pt-8",
				children: [
					/* @__PURE__ */ jsxs("p", {
						className: "eyebrow",
						children: ["Order ", result.id]
					}),
					/* @__PURE__ */ jsx("ol", {
						className: "mt-6 space-y-5",
						children: STAGES.map((s, i) => /* @__PURE__ */ jsxs("li", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ jsx("span", {
								className: "grid size-6 place-items-center rounded-full border text-[10px] " + (i <= result.stage ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground"),
								children: i + 1
							}), /* @__PURE__ */ jsx("span", {
								className: i <= result.stage ? "text-sm" : "text-sm text-muted-foreground",
								children: s
							})]
						}, s))
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-6 text-xs text-muted-foreground",
						children: "Live carrier tracking connects once the shipping integration is configured."
					})
				]
			})
		]
	});
}
//#endregion
export { TrackOrder as component };
