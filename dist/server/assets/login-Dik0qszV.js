import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
//#region src/routes/admin/login.tsx?tsr-split=component
function AdminLogin() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const handleSubmit = async (event) => {
		event.preventDefault();
		setError("");
		const cleanEmail = email.trim().toLowerCase();
		if (!cleanEmail || !password.trim()) {
			setError("Please enter your email and password.");
			return;
		}
		setLoading(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 700));
			if (cleanEmail === "admin@nsj.com" && password === "NSJ@12345") {
				localStorage.setItem("nsj_admin_authenticated", "true");
				await navigate({ to: "/admin/dashboard" });
				return;
			}
			setError("Invalid admin email or password.");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ jsx("main", {
		className: "min-h-screen bg-[#f7f4ef] text-[#171513]",
		children: /* @__PURE__ */ jsxs("div", {
			className: "grid min-h-screen lg:grid-cols-2",
			children: [/* @__PURE__ */ jsxs("section", {
				className: "relative hidden overflow-hidden bg-[#171513] lg:flex",
				children: [/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(210,170,90,0.25),transparent_40%)]" }), /* @__PURE__ */ jsxs("div", {
					className: "relative z-10 flex w-full flex-col justify-between p-12 xl:p-20",
					children: [
						/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(Link, {
							to: "/",
							className: "inline-flex items-center gap-3 text-white",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex h-11 w-11 items-center justify-center rounded-full border border-[#c8a96b]/60",
								children: /* @__PURE__ */ jsx("span", {
									className: "font-serif text-lg text-[#d8b875]",
									children: "NSJ"
								})
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
								className: "font-serif text-xl tracking-[0.18em]",
								children: "NSJ"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-[9px] uppercase tracking-[0.35em] text-[#c8a96b]",
								children: "Jewellery"
							})] })]
						}) }),
						/* @__PURE__ */ jsxs("div", {
							className: "max-w-xl",
							children: [
								/* @__PURE__ */ jsx("p", {
									className: "mb-5 text-xs uppercase tracking-[0.35em] text-[#c8a96b]",
									children: "Administration"
								}),
								/* @__PURE__ */ jsxs("h1", {
									className: "font-serif text-5xl leading-tight text-white xl:text-6xl",
									children: ["Manage your", /* @__PURE__ */ jsx("span", {
										className: "block text-[#d8b875]",
										children: "jewellery store."
									})]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-7 max-w-lg text-base leading-7 text-white/60",
									children: "Manage products, inventory, orders and your NSJ jewellery collection from one elegant dashboard."
								})
							]
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "text-xs text-white/30",
							children: [
								"© ",
								(/* @__PURE__ */ new Date()).getFullYear(),
								" NSJ Jewellery. Admin Portal."
							]
						})
					]
				})]
			}), /* @__PURE__ */ jsx("section", {
				className: "flex min-h-screen items-center justify-center px-6 py-12 sm:px-10",
				children: /* @__PURE__ */ jsxs("div", {
					className: "w-full max-w-md",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "mb-10 text-center lg:hidden",
							children: /* @__PURE__ */ jsxs(Link, {
								to: "/",
								className: "inline-flex flex-col items-center",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-serif text-3xl tracking-[0.2em]",
									children: "NSJ"
								}), /* @__PURE__ */ jsx("span", {
									className: "mt-1 text-[9px] uppercase tracking-[0.35em] text-[#b08a43]",
									children: "Jewellery"
								})]
							})
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mb-8",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#171513] text-[#d8b875]",
									children: /* @__PURE__ */ jsx(ShieldCheck, {
										size: 22,
										strokeWidth: 1.7
									})
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mb-2 text-xs font-medium uppercase tracking-[0.3em] text-[#b08a43]",
									children: "Secure Access"
								}),
								/* @__PURE__ */ jsx("h2", {
									className: "font-serif text-4xl text-[#171513]",
									children: "Admin Login"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-3 text-sm leading-6 text-black/50",
									children: "Sign in to manage your NSJ jewellery store."
								})
							]
						}),
						error && /* @__PURE__ */ jsx("div", {
							role: "alert",
							className: "mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700",
							children: error
						}),
						/* @__PURE__ */ jsxs("form", {
							onSubmit: handleSubmit,
							className: "space-y-5",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									htmlFor: "admin-email",
									className: "mb-2 block text-sm font-medium",
									children: "Admin Email"
								}), /* @__PURE__ */ jsxs("div", {
									className: "relative",
									children: [/* @__PURE__ */ jsx(Mail, {
										size: 18,
										className: "absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
									}), /* @__PURE__ */ jsx("input", {
										id: "admin-email",
										type: "email",
										value: email,
										onChange: (event) => setEmail(event.target.value),
										placeholder: "admin@nsj.com",
										autoComplete: "username",
										maxLength: 255,
										required: true,
										className: "h-13 w-full rounded-xl border border-black/10 bg-white pl-12 pr-4 text-sm outline-none transition focus:border-[#b08a43] focus:ring-2 focus:ring-[#b08a43]/10"
									})]
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									htmlFor: "admin-password",
									className: "mb-2 block text-sm font-medium",
									children: "Password"
								}), /* @__PURE__ */ jsxs("div", {
									className: "relative",
									children: [
										/* @__PURE__ */ jsx(LockKeyhole, {
											size: 18,
											className: "absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
										}),
										/* @__PURE__ */ jsx("input", {
											id: "admin-password",
											type: showPassword ? "text" : "password",
											value: password,
											onChange: (event) => setPassword(event.target.value),
											placeholder: "Enter your password",
											autoComplete: "current-password",
											maxLength: 128,
											required: true,
											className: "h-13 w-full rounded-xl border border-black/10 bg-white pl-12 pr-12 text-sm outline-none transition focus:border-[#b08a43] focus:ring-2 focus:ring-[#b08a43]/10"
										}),
										/* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => setShowPassword((value) => !value),
											"aria-label": showPassword ? "Hide password" : "Show password",
											className: "absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-black/40 transition hover:bg-black/5 hover:text-black",
											children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { size: 18 }) : /* @__PURE__ */ jsx(Eye, { size: 18 })
										})
									]
								})] }),
								/* @__PURE__ */ jsx("button", {
									type: "submit",
									disabled: loading,
									className: "flex h-13 w-full items-center justify-center rounded-xl bg-[#171513] px-5 text-sm font-medium tracking-wide text-white transition hover:bg-[#292623] disabled:cursor-not-allowed disabled:opacity-60",
									children: loading ? "Signing in..." : "Sign in to Admin"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-6 rounded-xl border border-[#d8c7a5] bg-[#fbf7ed] p-4",
							children: [/* @__PURE__ */ jsx("p", {
								className: "text-xs font-semibold uppercase tracking-wider text-[#8b6b32]",
								children: "Local Development Login"
							}), /* @__PURE__ */ jsxs("div", {
								className: "mt-3 space-y-1 text-xs text-black/60",
								children: [/* @__PURE__ */ jsxs("p", { children: [
									/* @__PURE__ */ jsx("strong", { children: "Email:" }),
									" ",
									"admin@nsj.com"
								] }), /* @__PURE__ */ jsxs("p", { children: [
									/* @__PURE__ */ jsx("strong", { children: "Password:" }),
									" ",
									"NSJ@12345"
								] })]
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-8 text-center",
							children: /* @__PURE__ */ jsx(Link, {
								to: "/",
								className: "text-sm text-black/45 transition hover:text-[#8b6b32]",
								children: "← Back to NSJ Jewellery"
							})
						})
					]
				})
			})]
		})
	});
}
//#endregion
export { AdminLogin as component };
