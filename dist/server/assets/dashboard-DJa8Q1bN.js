import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Box, ChevronRight, CircleDollarSign, ClipboardList, ExternalLink, Gem, LayoutDashboard, LogOut, Menu, Package, ShoppingBag, TrendingUp, Users, X } from "lucide-react";
//#region src/routes/admin/dashboard.tsx?tsr-split=component
var stats = [
	{
		title: "Total Revenue",
		value: "₹2,48,500",
		change: "+12.5%",
		icon: CircleDollarSign
	},
	{
		title: "Total Orders",
		value: "42",
		change: "+8.2%",
		icon: ShoppingBag
	},
	{
		title: "Products",
		value: "128",
		change: "+4.6%",
		icon: Gem
	},
	{
		title: "Customers",
		value: "96",
		change: "+11.4%",
		icon: Users
	}
];
var recentOrders = [
	{
		id: "#NSJ-1008",
		customer: "Priya Sharma",
		product: "Silver Rose Ring",
		amount: "₹1,499",
		status: "Delivered"
	},
	{
		id: "#NSJ-1007",
		customer: "Aarav Mehta",
		product: "Classic Silver Chain",
		amount: "₹2,799",
		status: "Processing"
	},
	{
		id: "#NSJ-1006",
		customer: "Ananya Patil",
		product: "Pearl Drop Earrings",
		amount: "₹1,899",
		status: "Shipped"
	},
	{
		id: "#NSJ-1005",
		customer: "Rahul Deshmukh",
		product: "Elegant Silver Bracelet",
		amount: "₹2,299",
		status: "Pending"
	}
];
var lowStockProducts = [
	{
		name: "Pearl Drop Earrings",
		category: "Earrings",
		stock: 3
	},
	{
		name: "Classic Silver Chain",
		category: "Chains",
		stock: 5
	},
	{
		name: "Silver Lotus Pendant",
		category: "Pendants",
		stock: 7
	},
	{
		name: "Minimal Silver Bangle",
		category: "Bangles",
		stock: 8
	}
];
function AdminDashboard() {
	const navigate = useNavigate();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const handleLogout = () => {
		localStorage.removeItem("nsj_admin_authenticated");
		navigate({ to: "/admin/login" });
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#f7f4ef] text-[#171513]",
		children: [
			sidebarOpen && /* @__PURE__ */ jsx("button", {
				type: "button",
				"aria-label": "Close sidebar",
				onClick: () => setSidebarOpen(false),
				className: "fixed inset-0 z-40 bg-black/40 lg:hidden"
			}),
			/* @__PURE__ */ jsxs("aside", {
				className: `fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-[#171513] text-white transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`,
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex h-20 items-center justify-between border-b border-white/10 px-7",
						children: [/* @__PURE__ */ jsxs(Link, {
							to: "/admin/dashboard",
							className: "flex items-center gap-3",
							onClick: () => setSidebarOpen(false),
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex h-10 w-10 items-center justify-center rounded-full border border-[#c8a96b]/60",
								children: /* @__PURE__ */ jsx("span", {
									className: "font-serif text-sm text-[#d8b875]",
									children: "NSJ"
								})
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
								className: "font-serif text-lg tracking-[0.18em]",
								children: "NSJ"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-[8px] uppercase tracking-[0.32em] text-[#c8a96b]",
								children: "Jewellery"
							})] })]
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setSidebarOpen(false),
							"aria-label": "Close menu",
							className: "rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white lg:hidden",
							children: /* @__PURE__ */ jsx(X, { size: 20 })
						})]
					}),
					/* @__PURE__ */ jsxs("nav", {
						className: "flex-1 overflow-y-auto px-4 py-6",
						children: [/* @__PURE__ */ jsx("p", {
							className: "mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/30",
							children: "Management"
						}), /* @__PURE__ */ jsx("div", {
							className: "space-y-1",
							children: [
								{
									label: "Dashboard",
									href: "/admin/dashboard",
									icon: LayoutDashboard
								},
								{
									label: "Products",
									href: "/admin/products",
									icon: Gem
								},
								{
									label: "Orders",
									href: "/admin/orders",
									icon: ClipboardList
								},
								{
									label: "Inventory",
									href: "/admin/inventory",
									icon: Package
								}
							].map((item) => {
								const Icon = item.icon;
								return /* @__PURE__ */ jsxs(Link, {
									to: item.href,
									onClick: () => setSidebarOpen(false),
									className: "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 transition hover:bg-white/10 hover:text-white",
									activeProps: { className: "group flex items-center gap-3 rounded-xl bg-[#c8a96b]/15 px-4 py-3 text-sm text-[#e4c98d]" },
									children: [
										/* @__PURE__ */ jsx(Icon, {
											size: 18,
											strokeWidth: 1.7
										}),
										/* @__PURE__ */ jsx("span", { children: item.label }),
										/* @__PURE__ */ jsx(ChevronRight, {
											size: 15,
											className: "ml-auto opacity-0 transition group-hover:opacity-50"
										})
									]
								}, item.label);
							})
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "border-t border-white/10 p-4",
						children: [/* @__PURE__ */ jsxs(Link, {
							to: "/",
							className: "flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/50 transition hover:bg-white/10 hover:text-white",
							children: [/* @__PURE__ */ jsx(ExternalLink, { size: 17 }), "View Store"]
						}), /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: handleLogout,
							className: "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/50 transition hover:bg-red-500/10 hover:text-red-300",
							children: [/* @__PURE__ */ jsx(LogOut, { size: 17 }), "Logout"]
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "lg:pl-72",
				children: [/* @__PURE__ */ jsxs("header", {
					className: "sticky top-0 z-30 flex h-20 items-center justify-between border-b border-black/5 bg-[#f7f4ef]/95 px-5 backdrop-blur-md sm:px-8",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setSidebarOpen(true),
							"aria-label": "Open menu",
							className: "rounded-xl border border-black/10 bg-white p-2.5 lg:hidden",
							children: /* @__PURE__ */ jsx(Menu, { size: 20 })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
							className: "text-xs uppercase tracking-[0.25em] text-[#b08a43]",
							children: "Administration"
						}), /* @__PURE__ */ jsx("h1", {
							className: "font-serif text-2xl sm:text-3xl",
							children: "Dashboard"
						})] })]
					}), /* @__PURE__ */ jsxs("div", {
						className: "hidden items-center gap-3 sm:flex",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "text-right",
							children: [/* @__PURE__ */ jsx("p", {
								className: "text-sm font-medium",
								children: "NSJ Admin"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-black/40",
								children: "Store Manager"
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: "flex h-10 w-10 items-center justify-center rounded-full bg-[#171513] text-sm font-medium text-[#d8b875]",
							children: "A"
						})]
					})]
				}), /* @__PURE__ */ jsxs("main", {
					className: "p-5 sm:p-8",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "mb-8",
							children: [/* @__PURE__ */ jsx("p", {
								className: "text-sm text-black/45",
								children: "Welcome back, Admin."
							}), /* @__PURE__ */ jsx("h2", {
								className: "mt-1 font-serif text-3xl",
								children: "Here's what's happening today."
							})]
						}),
						/* @__PURE__ */ jsx("section", {
							className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
							children: stats.map((stat) => {
								const Icon = stat.icon;
								return /* @__PURE__ */ jsxs("div", {
									className: "rounded-2xl border border-black/5 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.03)]",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-start justify-between",
											children: [/* @__PURE__ */ jsx("div", {
												className: "flex h-11 w-11 items-center justify-center rounded-xl bg-[#f7f1e4] text-[#a17b35]",
												children: /* @__PURE__ */ jsx(Icon, {
													size: 21,
													strokeWidth: 1.7
												})
											}), /* @__PURE__ */ jsxs("span", {
												className: "flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700",
												children: [/* @__PURE__ */ jsx(TrendingUp, { size: 12 }), stat.change]
											})]
										}),
										/* @__PURE__ */ jsx("p", {
											className: "mt-5 text-sm text-black/45",
											children: stat.title
										}),
										/* @__PURE__ */ jsx("p", {
											className: "mt-1 font-serif text-2xl",
											children: stat.value
										})
									]
								}, stat.title);
							})
						}),
						/* @__PURE__ */ jsxs("section", {
							className: "mt-8",
							children: [/* @__PURE__ */ jsx("div", {
								className: "mb-4",
								children: /* @__PURE__ */ jsx("h3", {
									className: "font-serif text-2xl",
									children: "Quick Actions"
								})
							}), /* @__PURE__ */ jsxs("div", {
								className: "grid gap-3 sm:grid-cols-3",
								children: [
									/* @__PURE__ */ jsxs(Link, {
										to: "/admin/products",
										className: "group flex items-center justify-between rounded-2xl bg-[#171513] p-5 text-white transition hover:-translate-y-0.5",
										children: [/* @__PURE__ */ jsxs("div", { children: [
											/* @__PURE__ */ jsx(Gem, {
												className: "mb-3 text-[#d8b875]",
												size: 22
											}),
											/* @__PURE__ */ jsx("p", {
												className: "font-medium",
												children: "Manage Products"
											}),
											/* @__PURE__ */ jsx("p", {
												className: "mt-1 text-xs text-white/45",
												children: "Add, edit and manage jewellery"
											})
										] }), /* @__PURE__ */ jsx(ChevronRight, { className: "text-white/40 transition group-hover:translate-x-1" })]
									}),
									/* @__PURE__ */ jsxs(Link, {
										to: "/admin/orders",
										className: "group flex items-center justify-between rounded-2xl border border-black/5 bg-white p-5 transition hover:-translate-y-0.5",
										children: [/* @__PURE__ */ jsxs("div", { children: [
											/* @__PURE__ */ jsx(ShoppingBag, {
												className: "mb-3 text-[#a17b35]",
												size: 22
											}),
											/* @__PURE__ */ jsx("p", {
												className: "font-medium",
												children: "View Orders"
											}),
											/* @__PURE__ */ jsx("p", {
												className: "mt-1 text-xs text-black/40",
												children: "Check and update customer orders"
											})
										] }), /* @__PURE__ */ jsx(ChevronRight, { className: "text-black/25 transition group-hover:translate-x-1" })]
									}),
									/* @__PURE__ */ jsxs(Link, {
										to: "/admin/inventory",
										className: "group flex items-center justify-between rounded-2xl border border-black/5 bg-white p-5 transition hover:-translate-y-0.5",
										children: [/* @__PURE__ */ jsxs("div", { children: [
											/* @__PURE__ */ jsx(Box, {
												className: "mb-3 text-[#a17b35]",
												size: 22
											}),
											/* @__PURE__ */ jsx("p", {
												className: "font-medium",
												children: "Check Inventory"
											}),
											/* @__PURE__ */ jsx("p", {
												className: "mt-1 text-xs text-black/40",
												children: "Monitor jewellery stock levels"
											})
										] }), /* @__PURE__ */ jsx(ChevronRight, { className: "text-black/25 transition group-hover:translate-x-1" })]
									})
								]
							})]
						}),
						/* @__PURE__ */ jsxs("section", {
							className: "mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "overflow-hidden rounded-2xl border border-black/5 bg-white",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between border-b border-black/5 px-5 py-5",
									children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
										className: "font-serif text-xl",
										children: "Recent Orders"
									}), /* @__PURE__ */ jsx("p", {
										className: "mt-1 text-xs text-black/40",
										children: "Latest customer purchases"
									})] }), /* @__PURE__ */ jsx(Link, {
										to: "/admin/orders",
										className: "text-xs font-medium text-[#9b7430] hover:underline",
										children: "View all"
									})]
								}), /* @__PURE__ */ jsx("div", {
									className: "overflow-x-auto",
									children: /* @__PURE__ */ jsxs("table", {
										className: "w-full min-w-[650px]",
										children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
											className: "border-b border-black/5 text-left text-[10px] uppercase tracking-wider text-black/35",
											children: [
												/* @__PURE__ */ jsx("th", {
													className: "px-5 py-3 font-medium",
													children: "Order"
												}),
												/* @__PURE__ */ jsx("th", {
													className: "px-5 py-3 font-medium",
													children: "Customer"
												}),
												/* @__PURE__ */ jsx("th", {
													className: "px-5 py-3 font-medium",
													children: "Product"
												}),
												/* @__PURE__ */ jsx("th", {
													className: "px-5 py-3 font-medium",
													children: "Amount"
												}),
												/* @__PURE__ */ jsx("th", {
													className: "px-5 py-3 font-medium",
													children: "Status"
												})
											]
										}) }), /* @__PURE__ */ jsx("tbody", { children: recentOrders.map((order) => /* @__PURE__ */ jsxs("tr", {
											className: "border-b border-black/5 last:border-0",
											children: [
												/* @__PURE__ */ jsx("td", {
													className: "px-5 py-4 text-sm font-medium",
													children: order.id
												}),
												/* @__PURE__ */ jsx("td", {
													className: "px-5 py-4 text-sm text-black/60",
													children: order.customer
												}),
												/* @__PURE__ */ jsx("td", {
													className: "px-5 py-4 text-sm text-black/60",
													children: order.product
												}),
												/* @__PURE__ */ jsx("td", {
													className: "px-5 py-4 text-sm font-medium",
													children: order.amount
												}),
												/* @__PURE__ */ jsx("td", {
													className: "px-5 py-4",
													children: /* @__PURE__ */ jsx(StatusBadge, { status: order.status })
												})
											]
										}, order.id)) })]
									})
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "rounded-2xl border border-black/5 bg-white",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between border-b border-black/5 px-5 py-5",
									children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
										className: "font-serif text-xl",
										children: "Low Stock"
									}), /* @__PURE__ */ jsx("p", {
										className: "mt-1 text-xs text-black/40",
										children: "Products that need attention"
									})] }), /* @__PURE__ */ jsx(Link, {
										to: "/admin/inventory",
										className: "text-xs font-medium text-[#9b7430] hover:underline",
										children: "Inventory"
									})]
								}), /* @__PURE__ */ jsx("div", {
									className: "divide-y divide-black/5",
									children: lowStockProducts.map((product) => /* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between px-5 py-4",
										children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
											className: "text-sm font-medium",
											children: product.name
										}), /* @__PURE__ */ jsx("p", {
											className: "mt-1 text-xs text-black/40",
											children: product.category
										})] }), /* @__PURE__ */ jsxs("span", {
											className: `rounded-full px-3 py-1 text-xs font-medium ${product.stock <= 3 ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`,
											children: [product.stock, " left"]
										})]
									}, product.name))
								})]
							})]
						}),
						/* @__PURE__ */ jsx("section", {
							className: "mt-8 rounded-2xl border border-black/5 bg-[#171513] p-6 text-white sm:p-7",
							children: /* @__PURE__ */ jsxs("div", {
								className: "flex flex-col justify-between gap-5 sm:flex-row sm:items-center",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-start gap-4",
									children: [/* @__PURE__ */ jsx("div", {
										className: "mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/10",
										children: /* @__PURE__ */ jsx("span", { className: "h-2.5 w-2.5 rounded-full bg-emerald-400" })
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
										className: "font-medium",
										children: "Store is live"
									}), /* @__PURE__ */ jsx("p", {
										className: "mt-1 text-sm text-white/45",
										children: "Your NSJ jewellery storefront is currently online."
									})] })]
								}), /* @__PURE__ */ jsxs(Link, {
									to: "/",
									className: "inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm transition hover:bg-white/10",
									children: ["Open Store", /* @__PURE__ */ jsx(ExternalLink, { size: 15 })]
								})]
							})
						})
					]
				})]
			})
		]
	});
}
function StatusBadge({ status }) {
	return /* @__PURE__ */ jsx("span", {
		className: `inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${{
			Delivered: "bg-emerald-50 text-emerald-700",
			Processing: "bg-blue-50 text-blue-700",
			Shipped: "bg-violet-50 text-violet-700",
			Pending: "bg-amber-50 text-amber-700"
		}[status] ?? "bg-gray-100 text-gray-600"}`,
		children: status
	});
}
//#endregion
export { AdminDashboard as component };
