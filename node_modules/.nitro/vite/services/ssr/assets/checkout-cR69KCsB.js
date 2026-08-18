import { a as formatINR } from "./products-DCeX7mS0.js";
import { n as applyCoupon, r as useShop } from "./store-DCX_9F1S.js";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { z } from "zod";
//#region src/routes/checkout.tsx?tsr-split=component
var detailsSchema = z.object({
	name: z.string().trim().min(2, "Enter your full name").max(80),
	email: z.string().trim().email("Enter a valid email").max(255),
	phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")
});
var addressSchema = z.object({
	line1: z.string().trim().min(4, "Enter your address").max(160),
	city: z.string().trim().min(2, "Enter your city").max(60),
	state: z.string().trim().min(2, "Enter your state").max(60),
	pincode: z.string().trim().regex(/^\d{6}$/, "Enter a valid 6-digit PIN code")
});
function CheckoutPage() {
	const { lines, subtotal, clearCart } = useShop();
	const navigate = useNavigate();
	const [step, setStep] = useState(0);
	const [errors, setErrors] = useState({});
	const [details, setDetails] = useState({
		name: "",
		email: "",
		phone: ""
	});
	const [address, setAddress] = useState({
		line1: "",
		city: "",
		state: "",
		pincode: ""
	});
	const [shippingMethod, setShippingMethod] = useState("standard");
	const [payment, setPayment] = useState("prepaid");
	const [code, setCode] = useState("");
	const [discount, setDiscount] = useState(0);
	const [placing, setPlacing] = useState(false);
	const shippingCost = shippingMethod === "express" ? 199 : subtotal >= 1500 ? 0 : 99;
	const total = Math.max(0, subtotal - discount) + shippingCost;
	if (lines.length === 0) return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-2xl px-4 py-32 text-center",
		children: [/* @__PURE__ */ jsx("h1", {
			className: "text-4xl",
			children: "Nothing to check out"
		}), /* @__PURE__ */ jsx(Link, {
			to: "/shop",
			className: "mt-6 inline-block bg-ink px-8 py-4 text-[11px] tracking-[0.2em] uppercase text-ink-foreground",
			children: "Shop the collection"
		})]
	});
	const validate = () => {
		const schema = step === 0 ? detailsSchema : addressSchema;
		const data = step === 0 ? details : address;
		const res = schema.safeParse(data);
		if (res.success) {
			setErrors({});
			return true;
		}
		const next = {};
		for (const issue of res.error.issues) next[String(issue.path[0])] = issue.message;
		setErrors(next);
		return false;
	};
	const placeOrder = async () => {
		setPlacing(true);
		await new Promise((r) => setTimeout(r, 700));
		const orderId = "AG" + Date.now().toString().slice(-8);
		try {
			window.localStorage.setItem("ag_last_order", JSON.stringify({
				orderId,
				total,
				email: details.email,
				name: details.name,
				method: payment
			}));
		} catch {}
		clearCart();
		setPlacing(false);
		navigate({
			to: "/order-success",
			search: { order: orderId }
		});
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-6xl px-4 py-12 md:px-8",
		children: [
			/* @__PURE__ */ jsx("h1", {
				className: "text-4xl",
				children: "Checkout"
			}),
			/* @__PURE__ */ jsx("ol", {
				className: "mt-6 flex flex-wrap gap-6 text-[11px] tracking-[0.2em] uppercase",
				children: [
					"Details",
					"Address",
					"Shipping",
					"Payment"
				].map((s, i) => /* @__PURE__ */ jsxs("li", {
					className: i === step ? "underline underline-offset-8" : "text-muted-foreground",
					children: [
						i + 1,
						". ",
						s
					]
				}, s))
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-10 grid gap-12 lg:grid-cols-[1fr_360px]",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "space-y-6",
					children: [
						step === 0 && /* @__PURE__ */ jsxs(Fieldset, {
							title: "Customer information",
							children: [
								/* @__PURE__ */ jsx(Field, {
									label: "Full name",
									value: details.name,
									error: errors["name"],
									onChange: (v) => setDetails({
										...details,
										name: v
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Email",
									type: "email",
									value: details.email,
									error: errors["email"],
									onChange: (v) => setDetails({
										...details,
										email: v
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Mobile number",
									value: details.phone,
									error: errors["phone"],
									onChange: (v) => setDetails({
										...details,
										phone: v
									})
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "text-xs text-muted-foreground",
									children: [
										"Checking out as a guest. ",
										/* @__PURE__ */ jsx(Link, {
											to: "/account",
											className: "underline underline-offset-4",
											children: "Sign in"
										}),
										" to save your details."
									]
								})
							]
						}),
						step === 1 && /* @__PURE__ */ jsxs(Fieldset, {
							title: "Shipping address",
							children: [
								/* @__PURE__ */ jsx(Field, {
									label: "Address",
									value: address.line1,
									error: errors["line1"],
									onChange: (v) => setAddress({
										...address,
										line1: v
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "City",
									value: address.city,
									error: errors["city"],
									onChange: (v) => setAddress({
										...address,
										city: v
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "State",
									value: address.state,
									error: errors["state"],
									onChange: (v) => setAddress({
										...address,
										state: v
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "PIN code",
									value: address.pincode,
									error: errors["pincode"],
									onChange: (v) => setAddress({
										...address,
										pincode: v
									})
								})
							]
						}),
						step === 2 && /* @__PURE__ */ jsxs(Fieldset, {
							title: "Shipping method",
							children: [/* @__PURE__ */ jsx(Choice, {
								checked: shippingMethod === "standard",
								onChange: () => setShippingMethod("standard"),
								title: "Standard · 4–6 days",
								note: subtotal >= 1500 ? "Free" : formatINR(99)
							}), /* @__PURE__ */ jsx(Choice, {
								checked: shippingMethod === "express",
								onChange: () => setShippingMethod("express"),
								title: "Express · 1–2 days",
								note: formatINR(199)
							})]
						}),
						step === 3 && /* @__PURE__ */ jsxs(Fieldset, {
							title: "Payment",
							children: [
								/* @__PURE__ */ jsx(Choice, {
									checked: payment === "prepaid",
									onChange: () => setPayment("prepaid"),
									title: "Pay online (UPI / Card / Netbanking)",
									note: "Secure"
								}),
								/* @__PURE__ */ jsx(Choice, {
									checked: payment === "cod",
									onChange: () => setPayment("cod"),
									title: "Cash on delivery",
									note: "+ ₹0"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-muted-foreground",
									children: "Online payments will be processed by Razorpay once the gateway keys are configured. Orders are marked paid only after payment verification."
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex gap-3",
							children: [step > 0 && /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setStep((s) => s - 1),
								className: "border border-foreground px-6 py-4 text-[11px] tracking-[0.2em] uppercase",
								children: "Back"
							}), step < 3 ? /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => {
									if (step > 1 || validate()) setStep((s) => s + 1);
								},
								className: "bg-ink px-8 py-4 text-[11px] tracking-[0.2em] uppercase text-ink-foreground",
								children: "Continue"
							}) : /* @__PURE__ */ jsx("button", {
								type: "button",
								disabled: placing,
								onClick: placeOrder,
								className: "bg-ink px-8 py-4 text-[11px] tracking-[0.2em] uppercase text-ink-foreground disabled:opacity-50",
								children: placing ? "Placing order…" : `Place order · ${formatINR(total)}`
							})]
						})
					]
				}), /* @__PURE__ */ jsxs("aside", {
					className: "h-fit bg-secondary p-6",
					children: [
						/* @__PURE__ */ jsx("h2", {
							className: "eyebrow",
							children: "Order summary"
						}),
						/* @__PURE__ */ jsx("ul", {
							className: "mt-5 space-y-4",
							children: lines.map((l) => /* @__PURE__ */ jsxs("li", {
								className: "flex gap-3 text-sm",
								children: [
									/* @__PURE__ */ jsx("img", {
										src: l.product.image,
										alt: "",
										loading: "lazy",
										width: 800,
										height: 1e3,
										className: "h-20 w-16 object-cover"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex-1",
										children: [/* @__PURE__ */ jsx("p", {
											className: "font-display text-base",
											children: l.product.name
										}), /* @__PURE__ */ jsxs("p", {
											className: "text-xs text-muted-foreground",
											children: [
												l.size,
												" · Qty ",
												l.qty
											]
										})]
									}),
									/* @__PURE__ */ jsx("span", { children: formatINR(l.product.price * l.qty) })
								]
							}, l.productId + l.size))
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-6 flex gap-2",
							children: [/* @__PURE__ */ jsx("input", {
								value: code,
								onChange: (e) => setCode(e.target.value),
								maxLength: 20,
								placeholder: "Coupon code",
								"aria-label": "Coupon code",
								className: "w-full border border-border bg-background px-3 py-2 text-sm outline-none"
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => {
									const res = applyCoupon(code, subtotal);
									setDiscount(res.discount);
									res.ok ? toast.success(res.message) : toast.error(res.message);
								},
								className: "border border-foreground px-4 text-[11px] tracking-[0.2em] uppercase",
								children: "Apply"
							})]
						}),
						/* @__PURE__ */ jsxs("dl", {
							className: "mt-6 space-y-2 border-t border-border pt-4 text-sm",
							children: [
								/* @__PURE__ */ jsx(Row, {
									label: "Subtotal",
									value: formatINR(subtotal)
								}),
								discount > 0 && /* @__PURE__ */ jsx(Row, {
									label: "Discount",
									value: `− ${formatINR(discount)}`
								}),
								/* @__PURE__ */ jsx(Row, {
									label: "Shipping",
									value: shippingCost === 0 ? "Free" : formatINR(shippingCost)
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between border-t border-border pt-3 text-base",
									children: [/* @__PURE__ */ jsx("dt", { children: "Total" }), /* @__PURE__ */ jsx("dd", { children: formatINR(total) })]
								})
							]
						})
					]
				})]
			})
		]
	});
}
function Fieldset({ title, children }) {
	return /* @__PURE__ */ jsxs("section", {
		className: "border border-border p-6",
		children: [/* @__PURE__ */ jsx("h2", {
			className: "eyebrow",
			children: title
		}), /* @__PURE__ */ jsx("div", {
			className: "mt-5 space-y-4",
			children
		})]
	});
}
function Field({ label, value, onChange, error, type = "text" }) {
	return /* @__PURE__ */ jsxs("label", {
		className: "block",
		children: [
			/* @__PURE__ */ jsx("span", {
				className: "eyebrow",
				children: label
			}),
			/* @__PURE__ */ jsx("input", {
				type,
				value,
				onChange: (e) => onChange(e.target.value),
				maxLength: 255,
				className: "mt-1 w-full border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground"
			}),
			error && /* @__PURE__ */ jsx("span", {
				className: "mt-1 block text-xs text-destructive",
				children: error
			})
		]
	});
}
function Choice({ checked, onChange, title, note }) {
	return /* @__PURE__ */ jsxs("label", {
		className: "flex cursor-pointer items-center justify-between border border-border p-4 text-sm",
		children: [/* @__PURE__ */ jsxs("span", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ jsx("input", {
				type: "radio",
				checked,
				onChange,
				className: "accent-foreground"
			}), title]
		}), /* @__PURE__ */ jsx("span", {
			className: "text-muted-foreground",
			children: note
		})]
	});
}
function Row({ label, value }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex justify-between",
		children: [/* @__PURE__ */ jsx("dt", {
			className: "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ jsx("dd", { children: value })]
	});
}
//#endregion
export { CheckoutPage as component };
