import { a as formatINR, i as discountPct, n as CATEGORY_IMAGE, o as getProduct, r as PRODUCTS, t as CATEGORIES } from "./products-DCeX7mS0.js";
import { r as useShop, t as ShopProvider } from "./store-DCX_9F1S.js";
import { useEffect, useState } from "react";
import { HeadContent, Link, Outlet, Scripts, createFileRoute, createRootRouteWithContext, createRouter, lazyRouteComponent, notFound, redirect, useNavigate, useRouter } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster, toast } from "sonner";
import { Gem, Heart, Menu, RotateCcw, Search, ShoppingBag, Sparkles, Star, Truck, User, X } from "lucide-react";
import { motion } from "motion/react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region src/styles.css?url
var styles_default = "/assets/styles-BPCPEWlQ.css";
//#endregion
//#region src/lib/lovable-error-reporting.ts
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
//#endregion
//#region src/components/Header.tsx
var NAV = [
	{
		to: "/shop",
		label: "New In",
		search: { sort: "newest" }
	},
	{
		to: "/shop",
		label: "Jewellery"
	},
	{
		to: "/collections",
		label: "Collections"
	},
	{
		to: "/about",
		label: "About"
	}
];
function Header() {
	const { cartCount, wishlist } = useShop();
	const [open, setOpen] = useState(false);
	const [q, setQ] = useState("");
	const navigate = useNavigate();
	const submit = (e) => {
		e.preventDefault();
		setOpen(false);
		navigate({
			to: "/shop",
			search: { q: q.trim() || void 0 }
		});
	};
	const closeMenu = () => {
		setOpen(false);
	};
	return /* @__PURE__ */ jsxs("header", {
		className: "sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "bg-ink py-2 text-center text-[10px] uppercase tracking-[0.25em] text-ink-foreground",
				children: "Complimentary shipping across India · 30-day returns"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 md:px-8",
				children: [
					/* @__PURE__ */ jsx("button", {
						type: "button",
						className: "md:hidden",
						"aria-label": open ? "Close menu" : "Open menu",
						"aria-expanded": open,
						onClick: () => setOpen((value) => !value),
						children: open ? /* @__PURE__ */ jsx(X, {
							className: "size-5",
							strokeWidth: 1.25
						}) : /* @__PURE__ */ jsx(Menu, {
							className: "size-5",
							strokeWidth: 1.25
						})
					}),
					/* @__PURE__ */ jsx("nav", {
						className: "hidden flex-1 items-center gap-7 text-[11px] uppercase tracking-[0.2em] md:flex",
						children: NAV.map((item) => /* @__PURE__ */ jsx(Link, {
							to: item.to,
							...item.search ? { search: item.search } : {},
							className: "transition-opacity hover:opacity-60",
							children: item.label
						}, item.label))
					}),
					/* @__PURE__ */ jsx(Link, {
						to: "/",
						className: "flex-1 text-center font-display text-2xl uppercase tracking-[0.3em] md:flex-none",
						onClick: closeMenu,
						children: "NSJ"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-1 items-center justify-end gap-4",
						children: [
							/* @__PURE__ */ jsxs("form", {
								onSubmit: submit,
								className: "hidden items-center gap-2 border-b border-border pb-1 lg:flex",
								children: [/* @__PURE__ */ jsx(Search, {
									className: "size-4 text-muted-foreground",
									strokeWidth: 1.25
								}), /* @__PURE__ */ jsx("input", {
									value: q,
									onChange: (e) => setQ(e.target.value),
									placeholder: "Search",
									"aria-label": "Search jewellery",
									maxLength: 100,
									className: "w-28 bg-transparent text-xs outline-none placeholder:text-muted-foreground focus:w-40"
								})]
							}),
							/* @__PURE__ */ jsxs(Link, {
								to: "/wishlist",
								"aria-label": "Wishlist",
								className: "relative",
								children: [/* @__PURE__ */ jsx(Heart, {
									className: "size-5",
									strokeWidth: 1.25
								}), wishlist.length > 0 && /* @__PURE__ */ jsx("span", {
									className: "absolute -right-2 -top-2 grid size-4 place-items-center rounded-full bg-ink text-[9px] text-ink-foreground",
									children: wishlist.length
								})]
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/account",
								"aria-label": "Account",
								className: "hidden sm:block",
								children: /* @__PURE__ */ jsx(User, {
									className: "size-5",
									strokeWidth: 1.25
								})
							}),
							/* @__PURE__ */ jsxs(Link, {
								to: "/cart",
								"aria-label": "Shopping cart",
								className: "relative",
								children: [/* @__PURE__ */ jsx(ShoppingBag, {
									className: "size-5",
									strokeWidth: 1.25
								}), cartCount > 0 && /* @__PURE__ */ jsx("span", {
									className: "absolute -right-2 -top-2 grid size-4 place-items-center rounded-full bg-ink text-[9px] text-ink-foreground",
									children: cartCount
								})]
							})
						]
					})
				]
			}),
			open && /* @__PURE__ */ jsxs("div", {
				className: "border-t border-border bg-background px-4 pb-6 pt-4 md:hidden",
				children: [/* @__PURE__ */ jsxs("form", {
					onSubmit: submit,
					className: "mb-5 flex items-center gap-2 border-b border-border pb-2",
					children: [
						/* @__PURE__ */ jsx(Search, {
							className: "size-4 shrink-0 text-muted-foreground",
							strokeWidth: 1.25
						}),
						/* @__PURE__ */ jsx("input", {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Search jewellery",
							"aria-label": "Search jewellery",
							maxLength: 100,
							className: "w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: closeMenu,
							"aria-label": "Close menu",
							className: "shrink-0",
							children: /* @__PURE__ */ jsx(X, {
								className: "size-4",
								strokeWidth: 1.25
							})
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-2 gap-x-4 gap-y-4 text-[11px] uppercase tracking-[0.2em]",
					children: [
						CATEGORIES.map((category) => /* @__PURE__ */ jsx(Link, {
							to: "/shop",
							search: { category: category.slug },
							onClick: closeMenu,
							className: "transition-opacity hover:opacity-60",
							children: category.label
						}, category.slug)),
						/* @__PURE__ */ jsx(Link, {
							to: "/collections",
							onClick: closeMenu,
							className: "transition-opacity hover:opacity-60",
							children: "Collections"
						}),
						/* @__PURE__ */ jsx(Link, {
							to: "/about",
							onClick: closeMenu,
							className: "transition-opacity hover:opacity-60",
							children: "About"
						}),
						/* @__PURE__ */ jsx(Link, {
							to: "/account",
							onClick: closeMenu,
							className: "transition-opacity hover:opacity-60",
							children: "Account"
						})
					]
				})]
			})
		]
	});
}
//#endregion
//#region src/components/Footer.tsx
function Footer() {
	const [email, setEmail] = useState("");
	const handleSubscribe = (e) => {
		e.preventDefault();
		if (!/^\S+@\S+\.\S+$/.test(email)) {
			toast.error("Please enter a valid email address");
			return;
		}
		setEmail("");
		toast.success("You're on the list");
	};
	return /* @__PURE__ */ jsx("footer", {
		className: "mt-24 bg-ink text-ink-foreground",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-7xl px-4 py-16 md:px-8",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "grid gap-12 md:grid-cols-4",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("div", {
							className: "font-display text-2xl uppercase tracking-[0.3em]",
							children: "Argent"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-4 max-w-xs text-sm text-ink-foreground/60",
							children: "Hand-finished 925 sterling silver jewellery, designed in India for everyday wear."
						}),
						/* @__PURE__ */ jsxs("form", {
							className: "mt-6 flex border-b border-ink-foreground/25",
							onSubmit: handleSubscribe,
							children: [/* @__PURE__ */ jsx("input", {
								type: "email",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								placeholder: "Email address",
								"aria-label": "Email address",
								maxLength: 255,
								className: "w-full bg-transparent py-2 text-sm outline-none placeholder:text-ink-foreground/40"
							}), /* @__PURE__ */ jsx("button", {
								type: "submit",
								className: "shrink-0 text-[11px] uppercase tracking-[0.2em] transition-opacity hover:opacity-60",
								children: "Join"
							})]
						})
					] }),
					/* @__PURE__ */ jsx(FooterCol, {
						title: "Shop",
						children: CATEGORIES.slice(0, 6).map((category) => /* @__PURE__ */ jsx(Link, {
							to: "/shop",
							search: { category: category.slug },
							children: category.label
						}, category.slug))
					}),
					/* @__PURE__ */ jsxs(FooterCol, {
						title: "The House",
						children: [
							/* @__PURE__ */ jsx(Link, {
								to: "/about",
								children: "About Us"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/our-craft",
								children: "Our Craft"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/jewellery-care",
								children: "Jewellery Care"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/ring-size-guide",
								children: "Ring Size Guide"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/collections",
								children: "Collections"
							})
						]
					}),
					/* @__PURE__ */ jsxs(FooterCol, {
						title: "Help",
						children: [
							/* @__PURE__ */ jsx(Link, {
								to: "/contact",
								children: "Contact"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/faq",
								children: "FAQ"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/track-order",
								search: { order: void 0 },
								children: "Track Order"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/account",
								children: "My Account"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/policies",
								children: "Policies"
							})
						]
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "mt-14 flex flex-col gap-2 border-t border-ink-foreground/15 pt-6 text-[11px] uppercase tracking-[0.15em] text-ink-foreground/50 md:flex-row md:justify-between",
				children: [/* @__PURE__ */ jsxs("span", { children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" Argent Silver"
				] }), /* @__PURE__ */ jsx("span", { children: "925 Sterling Silver · Made in India" })]
			})]
		})
	});
}
function FooterCol({ title, children }) {
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
		className: "text-[11px] uppercase tracking-[0.25em] text-ink-foreground/50",
		children: title
	}), /* @__PURE__ */ jsx("div", {
		className: "mt-4 flex flex-col gap-2 text-sm [&_a]:transition-opacity [&_a:hover]:opacity-60",
		children
	})] });
}
//#endregion
//#region src/routes/__root.tsx
function NotFoundComponent() {
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-[60vh] items-center justify-center px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "font-display text-6xl",
					children: "404"
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "mt-4 text-xl",
					children: "Page not found"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ jsx(Link, {
					to: "/",
					className: "mt-6 inline-block bg-ink px-8 py-4 text-[11px] tracking-[0.2em] uppercase text-ink-foreground",
					children: "Go home"
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	useEffect(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-[60vh] items-center justify-center px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-2xl",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try again or head back home."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex flex-wrap justify-center gap-3",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "bg-ink px-6 py-3 text-[11px] tracking-[0.2em] uppercase text-ink-foreground",
						children: "Try again"
					}), /* @__PURE__ */ jsx("a", {
						href: "/",
						className: "border border-foreground px-6 py-3 text-[11px] tracking-[0.2em] uppercase",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$23 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Argent — 925 Sterling Silver Jewellery" },
			{
				name: "description",
				content: "Hand-finished 925 sterling silver jewellery, designed in India for everyday wear."
			},
			{
				property: "og:title",
				content: "Argent — 925 Sterling Silver Jewellery"
			},
			{
				property: "og:description",
				content: "Hand-finished sterling silver jewellery, made in India."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Jost:wght@300;400;500&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		children: [/* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }), /* @__PURE__ */ jsxs("body", { children: [children, /* @__PURE__ */ jsx(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$23.useRouteContext();
	return /* @__PURE__ */ jsx(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ jsxs(ShopProvider, { children: [
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsx("main", {
				className: "min-h-[50vh]",
				children: /* @__PURE__ */ jsx(Outlet, {})
			}),
			/* @__PURE__ */ jsx(Footer, {}),
			/* @__PURE__ */ jsx(Toaster, { position: "bottom-right" })
		] })
	});
}
//#endregion
//#region src/lib/utils.ts
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
//#region src/components/ProductCard.tsx
function ProductCard({ product, index = 0 }) {
	const { addToCart, toggleWishlist, inWishlist } = useShop();
	const wished = inWishlist(product.id);
	const oos = product.stock === 0;
	return /* @__PURE__ */ jsxs(motion.article, {
		initial: {
			opacity: 0,
			y: 16
		},
		whileInView: {
			opacity: 1,
			y: 0
		},
		viewport: {
			once: true,
			margin: "-60px"
		},
		transition: {
			duration: .5,
			delay: Math.min(index, 6) * .05
		},
		className: "group",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "relative overflow-hidden bg-secondary",
			children: [
				/* @__PURE__ */ jsx(Link, {
					to: "/product/$slug",
					params: { slug: product.slug },
					"aria-label": product.name,
					children: /* @__PURE__ */ jsx("img", {
						src: product.image,
						alt: product.name,
						loading: "lazy",
						width: 800,
						height: 1e3,
						className: "aspect-4/5 w-full object-cover transition-transform duration-700 group-hover:scale-105"
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "absolute left-3 top-3 flex flex-col gap-1",
					children: [product.tags.includes("new") && /* @__PURE__ */ jsx("span", {
						className: "bg-background/90 px-2 py-1 text-[10px] tracking-[0.2em] uppercase",
						children: "New"
					}), oos && /* @__PURE__ */ jsx("span", {
						className: "bg-ink px-2 py-1 text-[10px] tracking-[0.2em] uppercase text-ink-foreground",
						children: "Sold out"
					})]
				}),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => {
						toggleWishlist(product.id);
						toast(wished ? "Removed from wishlist" : "Added to wishlist");
					},
					"aria-label": wished ? "Remove from wishlist" : "Add to wishlist",
					className: "absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-background/85 backdrop-blur transition-colors hover:bg-background",
					children: /* @__PURE__ */ jsx(Heart, {
						className: cn("size-4", wished && "fill-foreground"),
						strokeWidth: 1.25
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "pointer-events-none absolute inset-x-0 bottom-0 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0 group-focus-within:translate-y-0",
					children: /* @__PURE__ */ jsxs("button", {
						type: "button",
						disabled: oos,
						onClick: () => {
							addToCart(product.id, product.sizes[0] ?? "Free Size");
							toast.success("Added to bag", { description: product.name });
						},
						className: "pointer-events-auto flex w-full items-center justify-center gap-2 bg-ink px-4 py-3 text-[11px] tracking-[0.2em] uppercase text-ink-foreground transition-opacity hover:opacity-90 disabled:opacity-40",
						children: [/* @__PURE__ */ jsx(ShoppingBag, {
							className: "size-3.5",
							strokeWidth: 1.5
						}), oos ? "Sold out" : "Add to bag"]
					})
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "pt-4",
			children: [
				/* @__PURE__ */ jsx(Link, {
					to: "/product/$slug",
					params: { slug: product.slug },
					className: "font-display text-lg leading-snug hover:opacity-70",
					children: product.name
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-1 flex items-center gap-1 text-xs text-muted-foreground",
					children: [
						/* @__PURE__ */ jsx(Star, {
							className: "size-3 fill-foreground text-foreground",
							strokeWidth: 0
						}),
						product.rating.toFixed(1),
						" ",
						/* @__PURE__ */ jsxs("span", {
							className: "opacity-60",
							children: [
								"(",
								product.reviews,
								")"
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-2 flex items-baseline gap-2 text-sm",
					children: [
						/* @__PURE__ */ jsx("span", { children: formatINR(product.price) }),
						/* @__PURE__ */ jsx("span", {
							className: "text-muted-foreground line-through",
							children: formatINR(product.mrp)
						}),
						/* @__PURE__ */ jsxs("span", {
							className: "text-xs text-muted-foreground",
							children: [discountPct(product), "% off"]
						})
					]
				})
			]
		})]
	});
}
//#endregion
//#region src/assets/hero.jpg
var hero_default = "/assets/hero-DqJyAG0f.jpg";
//#endregion
//#region src/assets/craft.jpg
var craft_default = "/assets/craft-CNWmnH-L.jpg";
//#endregion
//#region src/routes/index.tsx
var Route$22 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Argent — The Art of Silver | 925 Sterling Silver Jewellery" },
		{
			name: "description",
			content: "Timeless 925 sterling silver jewellery, thoughtfully designed and hand-finished in India. Rings, earrings, necklaces, chains and more."
		},
		{
			property: "og:title",
			content: "Argent — The Art of Silver"
		},
		{
			property: "og:description",
			content: "Timeless jewellery, thoughtfully designed."
		}
	] }),
	component: Home
});
var newArrivals = PRODUCTS.filter((p) => p.tags.includes("new")).slice(0, 4);
var bestSellers = PRODUCTS.filter((p) => p.tags.includes("bestseller")).slice(0, 4);
var signature = PRODUCTS.filter((p) => p.tags.includes("signature")).slice(0, 4);
var REVIEWS = [
	{
		name: "Ananya R.",
		city: "Bengaluru",
		text: "The finish is far better than I expected. It genuinely looks like a luxury piece."
	},
	{
		name: "Rhea M.",
		city: "Mumbai",
		text: "Wore the layered necklace daily for months — still no tarnish. Beautifully made."
	},
	{
		name: "Karan S.",
		city: "Delhi",
		text: "Bought the rope chain as a gift. Packaging alone made the moment special."
	}
];
function Home() {
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsxs("section", {
			className: "relative",
			children: [/* @__PURE__ */ jsx("img", {
				src: hero_default,
				alt: "Model wearing 925 sterling silver necklace and rings",
				width: 1600,
				height: 1200,
				className: "h-[70vh] min-h-[460px] w-full object-cover md:h-[82vh]"
			}), /* @__PURE__ */ jsx("div", {
				className: "absolute inset-0 flex items-center",
				children: /* @__PURE__ */ jsxs(motion.div, {
					initial: {
						opacity: 0,
						y: 24
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { duration: .8 },
					className: "mx-auto w-full max-w-7xl px-6 md:px-8",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "eyebrow",
							children: "Argent · Est. 2016"
						}),
						/* @__PURE__ */ jsx("h1", {
							className: "mt-4 max-w-xl text-5xl leading-[1.05] md:text-7xl",
							children: "THE ART OF SILVER"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-5 max-w-sm text-sm text-muted-foreground md:text-base",
							children: "Timeless jewellery, thoughtfully designed."
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-8 flex flex-wrap gap-3",
							children: [/* @__PURE__ */ jsx(Link, {
								to: "/shop",
								className: "bg-ink px-8 py-4 text-[11px] tracking-[0.2em] uppercase text-ink-foreground transition-opacity hover:opacity-90",
								children: "Shop now"
							}), /* @__PURE__ */ jsx(Link, {
								to: "/collections",
								className: "border border-foreground px-8 py-4 text-[11px] tracking-[0.2em] uppercase transition-colors hover:bg-foreground hover:text-background",
								children: "Explore collection"
							})]
						})
					]
				})
			})]
		}),
		/* @__PURE__ */ jsxs("section", {
			className: "mx-auto max-w-7xl px-4 py-20 md:px-8",
			children: [/* @__PURE__ */ jsx(Heading, {
				eyebrow: "Shop by category",
				title: "Find your piece"
			}), /* @__PURE__ */ jsx("div", {
				className: "mt-10 grid grid-cols-2 gap-4 md:grid-cols-4",
				children: CATEGORIES.slice(0, 8).map((c, i) => /* @__PURE__ */ jsx(motion.div, {
					initial: {
						opacity: 0,
						y: 16
					},
					whileInView: {
						opacity: 1,
						y: 0
					},
					viewport: { once: true },
					transition: {
						duration: .5,
						delay: i * .04
					},
					children: /* @__PURE__ */ jsxs(Link, {
						to: "/shop",
						search: { category: c.slug },
						className: "group block",
						children: [/* @__PURE__ */ jsx("div", {
							className: "overflow-hidden bg-secondary",
							children: /* @__PURE__ */ jsx("img", {
								src: CATEGORY_IMAGE[c.slug],
								alt: c.label,
								loading: "lazy",
								width: 800,
								height: 1e3,
								className: "aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
							})
						}), /* @__PURE__ */ jsx("p", {
							className: "mt-3 text-center text-[11px] tracking-[0.2em] uppercase",
							children: c.label
						})]
					})
				}, c.slug))
			})]
		}),
		/* @__PURE__ */ jsx(ProductRow, {
			eyebrow: "Just landed",
			title: "New Arrivals",
			products: newArrivals,
			to: { sort: "newest" }
		}),
		/* @__PURE__ */ jsx(ProductRow, {
			eyebrow: "Loved most",
			title: "Best Sellers",
			products: bestSellers,
			to: { tag: "bestseller" }
		}),
		/* @__PURE__ */ jsx("section", {
			className: "bg-ink text-ink-foreground",
			children: /* @__PURE__ */ jsxs("div", {
				className: "mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 md:grid-cols-2 md:px-8",
				children: [/* @__PURE__ */ jsx("img", {
					src: craft_default,
					alt: "Silversmith hand-finishing a piece",
					loading: "lazy",
					width: 1400,
					height: 900,
					className: "w-full object-cover"
				}), /* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("p", {
						className: "eyebrow text-ink-foreground/60",
						children: "Our story"
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "mt-3 text-4xl md:text-5xl",
						children: "Silver, shaped slowly."
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-5 max-w-md text-sm leading-relaxed text-ink-foreground/70",
						children: "Every Argent piece begins at a workbench in Jaipur, where our silversmiths cast, file and polish by hand. We work only in 925 sterling silver — never plated brass — so each design keeps its lustre for years, not seasons."
					}),
					/* @__PURE__ */ jsx(Link, {
						to: "/our-craft",
						className: "mt-8 inline-block border border-ink-foreground/40 px-8 py-4 text-[11px] tracking-[0.2em] uppercase",
						children: "Discover our craft"
					})
				] })]
			})
		}),
		/* @__PURE__ */ jsx(ProductRow, {
			eyebrow: "The signature edit",
			title: "Signature Collection",
			products: signature,
			to: { tag: "signature" }
		}),
		/* @__PURE__ */ jsx("section", {
			className: "mx-auto max-w-7xl px-4 py-16 md:px-8",
			children: /* @__PURE__ */ jsxs("div", {
				className: "grid gap-8 border-y border-border py-12 md:grid-cols-4",
				children: [
					/* @__PURE__ */ jsx(Why, {
						icon: /* @__PURE__ */ jsx(Gem, {
							className: "size-5",
							strokeWidth: 1
						}),
						title: "925 Sterling Silver",
						text: "Hallmarked purity on every piece."
					}),
					/* @__PURE__ */ jsx(Why, {
						icon: /* @__PURE__ */ jsx(Sparkles, {
							className: "size-5",
							strokeWidth: 1
						}),
						title: "Anti-tarnish finish",
						text: "Rhodium polished for lasting shine."
					}),
					/* @__PURE__ */ jsx(Why, {
						icon: /* @__PURE__ */ jsx(Truck, {
							className: "size-5",
							strokeWidth: 1
						}),
						title: "Free shipping",
						text: "Across India, insured and tracked."
					}),
					/* @__PURE__ */ jsx(Why, {
						icon: /* @__PURE__ */ jsx(RotateCcw, {
							className: "size-5",
							strokeWidth: 1
						}),
						title: "30-day returns",
						text: "No-questions-asked pickup."
					})
				]
			})
		}),
		/* @__PURE__ */ jsxs("section", {
			className: "mx-auto max-w-7xl px-4 pb-20 md:px-8",
			children: [/* @__PURE__ */ jsx(Heading, {
				eyebrow: "Kind words",
				title: "Customer Reviews"
			}), /* @__PURE__ */ jsx("div", {
				className: "mt-10 grid gap-6 md:grid-cols-3",
				children: REVIEWS.map((r) => /* @__PURE__ */ jsxs("figure", {
					className: "bg-secondary p-8",
					children: [/* @__PURE__ */ jsxs("blockquote", {
						className: "font-display text-xl leading-relaxed",
						children: [
							"“",
							r.text,
							"”"
						]
					}), /* @__PURE__ */ jsxs("figcaption", {
						className: "eyebrow mt-6",
						children: [
							r.name,
							" · ",
							r.city
						]
					})]
				}, r.name))
			})]
		}),
		/* @__PURE__ */ jsxs("section", {
			className: "mx-auto max-w-7xl px-4 pb-24 md:px-8",
			children: [/* @__PURE__ */ jsx(Heading, {
				eyebrow: "@argentsilver",
				title: "From the community"
			}), /* @__PURE__ */ jsx("div", {
				className: "mt-10 grid grid-cols-2 gap-3 md:grid-cols-4",
				children: PRODUCTS.slice(0, 4).map((p) => /* @__PURE__ */ jsx(Link, {
					to: "/product/$slug",
					params: { slug: p.slug },
					className: "overflow-hidden bg-secondary",
					children: /* @__PURE__ */ jsx("img", {
						src: p.image,
						alt: p.name,
						loading: "lazy",
						width: 800,
						height: 1e3,
						className: "aspect-square w-full object-cover transition-transform duration-700 hover:scale-105"
					})
				}, p.id))
			})]
		})
	] });
}
function Heading({ eyebrow, title }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "text-center",
		children: [/* @__PURE__ */ jsx("p", {
			className: "eyebrow",
			children: eyebrow
		}), /* @__PURE__ */ jsx("h2", {
			className: "mt-3 text-4xl md:text-5xl",
			children: title
		})]
	});
}
function ProductRow({ eyebrow, title, products, to }) {
	return /* @__PURE__ */ jsxs("section", {
		className: "mx-auto max-w-7xl px-4 py-16 md:px-8",
		children: [
			/* @__PURE__ */ jsx(Heading, {
				eyebrow,
				title
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4",
				children: products.map((p, i) => /* @__PURE__ */ jsx(ProductCard, {
					product: p,
					index: i
				}, p.id))
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-10 text-center",
				children: /* @__PURE__ */ jsx(Link, {
					to: "/shop",
					search: to,
					className: "text-[11px] tracking-[0.2em] uppercase underline underline-offset-8",
					children: "View all"
				})
			})
		]
	});
}
function Why({ icon, title, text }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "text-center",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "flex justify-center",
				children: icon
			}),
			/* @__PURE__ */ jsx("h3", {
				className: "mt-4 text-lg",
				children: title
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: text
			})
		]
	});
}
//#endregion
//#region src/routes/about.tsx
var $$splitComponentImporter$21 = () => import("./about-n8wnqWsY.js");
var Route$21 = createFileRoute("/about")({
	head: () => ({ meta: [
		{ title: "About Argent — Sterling Silver, Made in India" },
		{
			name: "description",
			content: "Our story, mission and philosophy: hand-finished 925 sterling silver jewellery made in Jaipur."
		},
		{
			property: "og:title",
			content: "About Argent — Sterling Silver, Made in India"
		},
		{
			property: "og:description",
			content: "Our story, mission and jewellery philosophy."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
//#endregion
//#region src/routes/account.tsx
var $$splitComponentImporter$20 = () => import("./account-DKbQLO3E.js");
var Route$20 = createFileRoute("/account")({
	head: () => ({ meta: [
		{ title: "My Account — Argent Silver" },
		{
			name: "description",
			content: "Sign in to view your Argent orders, addresses, wishlist and profile."
		},
		{
			property: "og:title",
			content: "My Account — Argent Silver"
		},
		{
			property: "og:description",
			content: "Orders, addresses and wishlist in one place."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
//#endregion
//#region src/routes/cart.tsx
var $$splitComponentImporter$19 = () => import("./cart-DBx6UQ1k.js");
var Route$19 = createFileRoute("/cart")({
	head: () => ({ meta: [
		{ title: "Your Bag — Argent Silver" },
		{
			name: "description",
			content: "Review the sterling silver pieces in your shopping bag before checkout."
		},
		{
			property: "og:title",
			content: "Your Bag — Argent Silver"
		},
		{
			property: "og:description",
			content: "Review your sterling silver selection."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
//#endregion
//#region src/routes/checkout.tsx
var $$splitComponentImporter$18 = () => import("./checkout-cR69KCsB.js");
var Route$18 = createFileRoute("/checkout")({
	head: () => ({ meta: [
		{ title: "Secure Checkout — Argent Silver" },
		{
			name: "description",
			content: "Complete your sterling silver order with secure checkout and free shipping."
		},
		{
			property: "og:title",
			content: "Secure Checkout — Argent Silver"
		},
		{
			property: "og:description",
			content: "Complete your order securely."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
//#endregion
//#region src/routes/collections.tsx
var $$splitComponentImporter$17 = () => import("./collections-Estl8kro.js");
var Route$17 = createFileRoute("/collections")({
	head: () => ({ meta: [
		{ title: "Collections — Argent Sterling Silver" },
		{
			name: "description",
			content: "Explore Argent's silver jewellery collections by category, occasion and edit."
		},
		{
			property: "og:title",
			content: "Collections — Argent Sterling Silver"
		},
		{
			property: "og:description",
			content: "Explore our silver jewellery collections."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
//#endregion
//#region src/routes/contact.tsx
var $$splitComponentImporter$16 = () => import("./contact-sMFMJIhg.js");
var Route$16 = createFileRoute("/contact")({
	head: () => ({ meta: [
		{ title: "Contact Argent — Silver Jewellery Support" },
		{
			name: "description",
			content: "Reach the Argent team by form, WhatsApp, phone or email, or visit our Jaipur studio."
		},
		{
			property: "og:title",
			content: "Contact Argent"
		},
		{
			property: "og:description",
			content: "We reply within one business day."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
//#endregion
//#region src/routes/faq.tsx
var $$splitComponentImporter$15 = () => import("./faq-DH7pfhvo.js");
var Route$15 = createFileRoute("/faq")({
	head: () => ({ meta: [
		{ title: "FAQ — Silver, Shipping & Returns | Argent" },
		{
			name: "description",
			content: "Answers on 925 silver, shipping, returns, exchanges, payments, ring sizing and jewellery care."
		},
		{
			property: "og:title",
			content: "FAQ — Silver, Shipping & Returns"
		},
		{
			property: "og:description",
			content: "Common questions, answered."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
//#endregion
//#region src/routes/jewellery-care.tsx
var $$splitComponentImporter$14 = () => import("./jewellery-care-MACYjTQ_.js");
var Route$14 = createFileRoute("/jewellery-care")({
	head: () => ({ meta: [
		{ title: "Jewellery Care — Keep Silver Bright | Argent" },
		{
			name: "description",
			content: "How to clean, store and maintain 925 sterling silver jewellery so it stays bright for years."
		},
		{
			property: "og:title",
			content: "Jewellery Care — Keep Silver Bright"
		},
		{
			property: "og:description",
			content: "Cleaning, storage and maintenance for sterling silver."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
//#endregion
//#region src/routes/order-success.tsx
var $$splitComponentImporter$13 = () => import("./order-success-CRcwT9Hb.js");
var Route$13 = createFileRoute("/order-success")({
	validateSearch: (search) => ({ order: typeof search["order"] === "string" ? search["order"] : void 0 }),
	head: () => ({ meta: [
		{ title: "Order Confirmed — Argent Silver" },
		{
			name: "description",
			content: "Your sterling silver order has been placed successfully."
		},
		{
			property: "og:title",
			content: "Order Confirmed — Argent Silver"
		},
		{
			property: "og:description",
			content: "Thank you for your order."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
//#endregion
//#region src/routes/our-craft.tsx
var $$splitComponentImporter$12 = () => import("./our-craft-DTHfHdD2.js");
var Route$12 = createFileRoute("/our-craft")({
	head: () => ({ meta: [
		{ title: "Our Craft — 925 Silver Craftsmanship | Argent" },
		{
			name: "description",
			content: "How Argent silver jewellery is made: casting, filing, stone setting, polishing and quality checks."
		},
		{
			property: "og:title",
			content: "Our Craft — 925 Silver Craftsmanship"
		},
		{
			property: "og:description",
			content: "Inside the making of Argent sterling silver jewellery."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
//#endregion
//#region src/routes/policies.tsx
var $$splitComponentImporter$11 = () => import("./policies-D9pYM4Tc.js");
var Route$11 = createFileRoute("/policies")({
	head: () => ({ meta: [
		{ title: "Shipping, Returns & Privacy Policies — Argent Silver" },
		{
			name: "description",
			content: "Argent's shipping, return, refund, cancellation and privacy policies, plus terms of use."
		},
		{
			property: "og:title",
			content: "Policies — Argent Silver"
		},
		{
			property: "og:description",
			content: "Shipping, returns, refunds, privacy and terms."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
//#endregion
//#region src/routes/ring-size-guide.tsx
var $$splitComponentImporter$10 = () => import("./ring-size-guide-BwcJbwmG.js");
var Route$10 = createFileRoute("/ring-size-guide")({
	head: () => ({ meta: [
		{ title: "Ring Size Guide (India) — Argent Silver" },
		{
			name: "description",
			content: "Indian ring size chart with diameter and circumference, plus how to measure your ring size at home."
		},
		{
			property: "og:title",
			content: "Ring Size Guide (India) — Argent"
		},
		{
			property: "og:description",
			content: "Find your Indian ring size in two minutes."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
//#endregion
//#region src/routes/shop.tsx
var $$splitComponentImporter$9 = () => import("./shop-ClzAUtgT.js");
var Route$9 = createFileRoute("/shop")({
	validateSearch: (search) => ({
		q: typeof search["q"] === "string" && search["q"] ? search["q"] : void 0,
		category: CATEGORIES.some((c) => c.slug === search["category"]) ? search["category"] : void 0,
		gender: [
			"women",
			"men",
			"unisex"
		].includes(String(search["gender"])) ? search["gender"] : void 0,
		sort: [
			"newest",
			"price-asc",
			"price-desc",
			"popular"
		].includes(String(search["sort"])) ? search["sort"] : void 0,
		maxPrice: Number(search["maxPrice"]) > 0 ? Number(search["maxPrice"]) : void 0,
		inStock: search["inStock"] === true || search["inStock"] === "true" ? true : void 0,
		minRating: Number(search["minRating"]) > 0 ? Number(search["minRating"]) : void 0,
		tag: [
			"new",
			"bestseller",
			"signature",
			"gift"
		].includes(String(search["tag"])) ? search["tag"] : void 0
	}),
	head: () => ({ meta: [
		{ title: "Shop 925 Sterling Silver Jewellery — Argent" },
		{
			name: "description",
			content: "Browse hand-finished 925 sterling silver rings, earrings, necklaces, chains and bracelets. Filter by category, price and purity."
		},
		{
			property: "og:title",
			content: "Shop 925 Sterling Silver Jewellery — Argent"
		},
		{
			property: "og:description",
			content: "Hand-finished sterling silver jewellery for everyday wear."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
//#endregion
//#region src/routes/track-order.tsx
var $$splitComponentImporter$8 = () => import("./track-order-WTagsqV2.js");
var Route$8 = createFileRoute("/track-order")({
	validateSearch: (search) => ({ order: typeof search["order"] === "string" ? search["order"] : void 0 }),
	head: () => ({ meta: [
		{ title: "Track Your Order — Argent Silver" },
		{
			name: "description",
			content: "Enter your order number and email to see live status from confirmed to delivered."
		},
		{
			property: "og:title",
			content: "Track Your Order — Argent Silver"
		},
		{
			property: "og:description",
			content: "Live status for your Argent order."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
//#endregion
//#region src/routes/wishlist.tsx
var $$splitComponentImporter$7 = () => import("./wishlist-CoBWfKKS.js");
var Route$7 = createFileRoute("/wishlist")({
	head: () => ({ meta: [
		{ title: "Wishlist — Argent Silver" },
		{
			name: "description",
			content: "Your saved sterling silver jewellery pieces, ready when you are."
		},
		{
			property: "og:title",
			content: "Wishlist — Argent Silver"
		},
		{
			property: "og:description",
			content: "Your saved sterling silver pieces."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
//#endregion
//#region src/routes/admin/index.tsx
var $$splitComponentImporter$6 = () => import("./admin-DyhP5j4X.js");
var Route$6 = createFileRoute("/admin/")({
	beforeLoad: () => {
		if (typeof window !== "undefined") {
			if (localStorage.getItem("nsj_admin_authenticated") !== "true") throw redirect({ to: "/admin/login" });
		}
	},
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
//#endregion
//#region src/routes/admin/dashboard.tsx
var $$splitComponentImporter$5 = () => import("./dashboard-DJa8Q1bN.js");
var Route$5 = createFileRoute("/admin/dashboard")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
//#endregion
//#region src/routes/admin/inventory.tsx
var $$splitComponentImporter$4 = () => import("./inventory-CupeSMMb.js");
var Route$4 = createFileRoute("/admin/inventory")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
//#endregion
//#region src/routes/admin/login.tsx
var $$splitComponentImporter$3 = () => import("./login-Dik0qszV.js");
var Route$3 = createFileRoute("/admin/login")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
//#endregion
//#region src/routes/admin/orders.tsx
var $$splitComponentImporter$2 = () => import("./orders-DKXqy-HH.js");
var Route$2 = createFileRoute("/admin/orders")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
//#endregion
//#region src/routes/admin/products.tsx
var $$splitComponentImporter$1 = () => import("./products-CNwchTzG.js");
var Route$1 = createFileRoute("/admin/products")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
//#endregion
//#region src/routes/product.$slug.tsx
var $$splitComponentImporter = () => import("./product._slug-CUsecLpj.js");
var $$splitErrorComponentImporter = () => import("./product._slug-uz4MWqtI.js");
var $$splitNotFoundComponentImporter = () => import("./product._slug-CqIGCBhb.js");
var Route = createFileRoute("/product/$slug")({
	loader: ({ params }) => {
		const product = getProduct(params.slug);
		if (!product) throw notFound();
		return { product };
	},
	head: ({ loaderData }) => {
		if (!loaderData) return { meta: [{ title: "Product unavailable — Argent" }, {
			name: "robots",
			content: "noindex"
		}] };
		const p = loaderData.product;
		return { meta: [
			{ title: `${p.name} — 925 Sterling Silver | Argent` },
			{
				name: "description",
				content: p.description.slice(0, 155)
			},
			{
				property: "og:title",
				content: `${p.name} — Argent`
			},
			{
				property: "og:description",
				content: p.description.slice(0, 155)
			},
			{
				property: "og:type",
				content: "product"
			}
		] };
	},
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
//#region src/routeTree.gen.ts
var IndexRoute = Route$22.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$23
});
var AboutRoute = Route$21.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$23
});
var AccountRoute = Route$20.update({
	id: "/account",
	path: "/account",
	getParentRoute: () => Route$23
});
var CartRoute = Route$19.update({
	id: "/cart",
	path: "/cart",
	getParentRoute: () => Route$23
});
var CheckoutRoute = Route$18.update({
	id: "/checkout",
	path: "/checkout",
	getParentRoute: () => Route$23
});
var CollectionsRoute = Route$17.update({
	id: "/collections",
	path: "/collections",
	getParentRoute: () => Route$23
});
var ContactRoute = Route$16.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$23
});
var FaqRoute = Route$15.update({
	id: "/faq",
	path: "/faq",
	getParentRoute: () => Route$23
});
var JewelleryCareRoute = Route$14.update({
	id: "/jewellery-care",
	path: "/jewellery-care",
	getParentRoute: () => Route$23
});
var OrderSuccessRoute = Route$13.update({
	id: "/order-success",
	path: "/order-success",
	getParentRoute: () => Route$23
});
var OurCraftRoute = Route$12.update({
	id: "/our-craft",
	path: "/our-craft",
	getParentRoute: () => Route$23
});
var PoliciesRoute = Route$11.update({
	id: "/policies",
	path: "/policies",
	getParentRoute: () => Route$23
});
var RingSizeGuideRoute = Route$10.update({
	id: "/ring-size-guide",
	path: "/ring-size-guide",
	getParentRoute: () => Route$23
});
var ShopRoute = Route$9.update({
	id: "/shop",
	path: "/shop",
	getParentRoute: () => Route$23
});
var TrackOrderRoute = Route$8.update({
	id: "/track-order",
	path: "/track-order",
	getParentRoute: () => Route$23
});
var WishlistRoute = Route$7.update({
	id: "/wishlist",
	path: "/wishlist",
	getParentRoute: () => Route$23
});
var AdminIndexRoute = Route$6.update({
	id: "/admin/",
	path: "/admin/",
	getParentRoute: () => Route$23
});
var rootRouteChildren = {
	IndexRoute,
	AboutRoute,
	AccountRoute,
	CartRoute,
	CheckoutRoute,
	CollectionsRoute,
	ContactRoute,
	FaqRoute,
	JewelleryCareRoute,
	OrderSuccessRoute,
	OurCraftRoute,
	PoliciesRoute,
	RingSizeGuideRoute,
	ShopRoute,
	TrackOrderRoute,
	WishlistRoute,
	AdminDashboardRoute: Route$5.update({
		id: "/admin/dashboard",
		path: "/admin/dashboard",
		getParentRoute: () => Route$23
	}),
	AdminInventoryRoute: Route$4.update({
		id: "/admin/inventory",
		path: "/admin/inventory",
		getParentRoute: () => Route$23
	}),
	AdminLoginRoute: Route$3.update({
		id: "/admin/login",
		path: "/admin/login",
		getParentRoute: () => Route$23
	}),
	AdminOrdersRoute: Route$2.update({
		id: "/admin/orders",
		path: "/admin/orders",
		getParentRoute: () => Route$23
	}),
	AdminProductsRoute: Route$1.update({
		id: "/admin/products",
		path: "/admin/products",
		getParentRoute: () => Route$23
	}),
	ProductSlugRoute: Route.update({
		id: "/product/$slug",
		path: "/product/$slug",
		getParentRoute: () => Route$23
	}),
	AdminIndexRoute
};
var routeTree = Route$23._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { Route$13 as a, cn as c, getRouter, Route$9 as i, Route as n, craft_default as o, Route$8 as r, ProductCard as s, router_exports as t };
