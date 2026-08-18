import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/account.tsx?tsr-split=component
function Account() {
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-3xl px-4 py-20 md:px-8",
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "eyebrow",
				children: "Account"
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "mt-2 text-4xl md:text-5xl",
				children: "Your Argent account"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-4 max-w-xl text-sm text-muted-foreground",
				children: "Accounts, saved orders and addresses need a secure backend. Once Lovable Cloud is switched on for this project, sign-in, registration, password reset, order history and the admin dashboard all connect here — no placeholder logins in the meantime."
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-10 grid gap-4 sm:grid-cols-2",
				children: [
					{
						title: "Wishlist",
						text: "Saved pieces, available now",
						to: "/wishlist"
					},
					{
						title: "Track an order",
						text: "Status by order number",
						to: "/track-order"
					},
					{
						title: "Shopping bag",
						text: "Review and check out",
						to: "/cart"
					},
					{
						title: "Help",
						text: "FAQ and contact",
						to: "/faq"
					}
				].map((c) => /* @__PURE__ */ jsxs(Link, {
					to: c.to,
					className: "border border-border p-6 transition-colors hover:bg-secondary",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "text-2xl",
						children: c.title
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: c.text
					})]
				}, c.title))
			})
		]
	});
}
//#endregion
export { Account as component };
