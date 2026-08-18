import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/product.$slug.tsx?tsr-split=notFoundComponent
var SplitNotFoundComponent = () => /* @__PURE__ */ jsxs("div", {
	className: "px-4 py-32 text-center",
	children: [/* @__PURE__ */ jsx("h1", {
		className: "text-3xl",
		children: "Piece not found"
	}), /* @__PURE__ */ jsx(Link, {
		to: "/shop",
		className: "mt-4 inline-block text-sm underline underline-offset-4",
		children: "Back to the collection"
	})]
});
//#endregion
export { SplitNotFoundComponent as notFoundComponent };
