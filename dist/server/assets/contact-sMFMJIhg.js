import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { z } from "zod";
//#region src/routes/contact.tsx?tsr-split=component
var schema = z.object({
	name: z.string().trim().min(2, "Enter your name").max(80),
	email: z.string().trim().email("Enter a valid email").max(255),
	phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
	message: z.string().trim().min(10, "Tell us a little more").max(1e3)
});
function Contact() {
	const [form, setForm] = useState({
		name: "",
		email: "",
		phone: "",
		message: ""
	});
	const [errors, setErrors] = useState({});
	const [sent, setSent] = useState(false);
	const submit = (e) => {
		e.preventDefault();
		const res = schema.safeParse(form);
		if (!res.success) {
			const next = {};
			for (const i of res.error.issues) next[String(i.path[0])] = i.message;
			setErrors(next);
			toast.error("Please fix the highlighted fields");
			return;
		}
		setErrors({});
		setSent(true);
		setForm({
			name: "",
			email: "",
			phone: "",
			message: ""
		});
		toast.success("Message sent — we'll reply within one business day");
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-5xl px-4 py-16 md:px-8",
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "eyebrow",
				children: "Contact"
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "mt-2 text-4xl md:text-5xl",
				children: "We're here to help"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-12 grid gap-12 md:grid-cols-2",
				children: [/* @__PURE__ */ jsxs("form", {
					onSubmit: submit,
					className: "space-y-5",
					noValidate: true,
					children: [
						[
							["name", "Full name"],
							["email", "Email"],
							["phone", "Mobile number"]
						].map(([key, label]) => /* @__PURE__ */ jsxs("label", {
							className: "block",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "eyebrow",
									children: label
								}),
								/* @__PURE__ */ jsx("input", {
									value: form[key],
									onChange: (e) => setForm({
										...form,
										[key]: e.target.value
									}),
									maxLength: 255,
									className: "mt-1 w-full border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground"
								}),
								errors[key] && /* @__PURE__ */ jsx("span", {
									className: "mt-1 block text-xs text-destructive",
									children: errors[key]
								})
							]
						}, key)),
						/* @__PURE__ */ jsxs("label", {
							className: "block",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "eyebrow",
									children: "Message"
								}),
								/* @__PURE__ */ jsx("textarea", {
									value: form.message,
									onChange: (e) => setForm({
										...form,
										message: e.target.value
									}),
									rows: 4,
									maxLength: 1e3,
									className: "mt-1 w-full border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground"
								}),
								errors["message"] && /* @__PURE__ */ jsx("span", {
									className: "mt-1 block text-xs text-destructive",
									children: errors["message"]
								})
							]
						}),
						/* @__PURE__ */ jsx("button", {
							type: "submit",
							className: "bg-ink px-8 py-4 text-[11px] tracking-[0.2em] uppercase text-ink-foreground",
							children: "Send message"
						}),
						sent && /* @__PURE__ */ jsx("p", {
							className: "text-sm text-muted-foreground",
							children: "Thank you — your message is with our team."
						})
					]
				}), /* @__PURE__ */ jsxs("aside", {
					className: "space-y-6 text-sm",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
							className: "eyebrow",
							children: "Studio"
						}), /* @__PURE__ */ jsxs("p", {
							className: "mt-2 text-muted-foreground",
							children: [
								"14 Amrapali Marg, C-Scheme",
								/* @__PURE__ */ jsx("br", {}),
								"Jaipur, Rajasthan 302001"
							]
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("h2", {
								className: "eyebrow",
								children: "Reach us"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-2 space-x-2 text-muted-foreground",
								children: /* @__PURE__ */ jsx("a", {
									className: "underline underline-offset-4",
									href: "tel:+919000000000",
									children: "+91 90000 00000"
								})
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-muted-foreground",
								children: /* @__PURE__ */ jsx("a", {
									className: "underline underline-offset-4",
									href: "mailto:care@argentsilver.in",
									children: "care@argentsilver.in"
								})
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-muted-foreground",
								children: /* @__PURE__ */ jsx("a", {
									className: "underline underline-offset-4",
									href: "https://wa.me/919000000000",
									target: "_blank",
									rel: "noopener noreferrer",
									children: "WhatsApp us"
								})
							})
						] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
							className: "eyebrow",
							children: "Hours"
						}), /* @__PURE__ */ jsx("p", {
							className: "mt-2 text-muted-foreground",
							children: "Mon–Sat, 10am – 7pm IST"
						})] }),
						/* @__PURE__ */ jsx("iframe", {
							title: "Argent studio location",
							src: "https://www.google.com/maps?q=C-Scheme,Jaipur&output=embed",
							className: "h-64 w-full border border-border",
							loading: "lazy"
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { Contact as component };
