import { jsx } from "react/jsx-runtime";
//#region src/routes/product.$slug.tsx?tsr-split=errorComponent
var SplitErrorComponent = ({ error }) => /* @__PURE__ */ jsx("div", {
	role: "alert",
	className: "px-4 py-32 text-center text-sm",
	children: error.message
});
//#endregion
export { SplitErrorComponent as errorComponent };
