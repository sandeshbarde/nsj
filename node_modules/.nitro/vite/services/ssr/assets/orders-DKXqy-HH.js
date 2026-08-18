import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ChevronLeft, ClipboardList, Eye, Menu, Package, Search, ShoppingBag, Trash2, Truck, X } from "lucide-react";
//#region src/routes/admin/orders.tsx?tsr-split=component
var STORAGE_KEY = "nsj_admin_orders";
var defaultOrders = [
	{
		id: "NSJ-1008",
		customer: {
			name: "Priya Sharma",
			email: "priya@example.com",
			phone: "+91 98765 43210"
		},
		items: [{
			name: "Silver Rose Ring",
			quantity: 1,
			price: 1499
		}],
		subtotal: 1499,
		shipping: 0,
		discount: 0,
		total: 1499,
		paymentMethod: "UPI",
		paymentStatus: "Paid",
		status: "Delivered",
		date: "2026-08-12",
		shippingAddress: {
			line1: "12 MG Road",
			city: "Pune",
			state: "Maharashtra",
			pincode: "411001"
		}
	},
	{
		id: "NSJ-1007",
		customer: {
			name: "Aarav Mehta",
			email: "aarav@example.com",
			phone: "+91 98220 12345"
		},
		items: [{
			name: "Classic Silver Chain",
			quantity: 1,
			price: 2799
		}],
		subtotal: 2799,
		shipping: 0,
		discount: 0,
		total: 2799,
		paymentMethod: "Card",
		paymentStatus: "Paid",
		status: "Processing",
		date: "2026-08-11",
		shippingAddress: {
			line1: "45 Baner Road",
			city: "Pune",
			state: "Maharashtra",
			pincode: "411045"
		}
	},
	{
		id: "NSJ-1006",
		customer: {
			name: "Ananya Patil",
			email: "ananya@example.com",
			phone: "+91 97654 32109"
		},
		items: [{
			name: "Pearl Drop Earrings",
			quantity: 1,
			price: 1899
		}],
		subtotal: 1899,
		shipping: 0,
		discount: 0,
		total: 1899,
		paymentMethod: "UPI",
		paymentStatus: "Paid",
		status: "Shipped",
		date: "2026-08-10",
		shippingAddress: {
			line1: "8 FC Road",
			city: "Pune",
			state: "Maharashtra",
			pincode: "411004"
		}
	},
	{
		id: "NSJ-1005",
		customer: {
			name: "Rahul Deshmukh",
			email: "rahul@example.com",
			phone: "+91 98989 11223"
		},
		items: [{
			name: "Elegant Silver Bracelet",
			quantity: 1,
			price: 2299
		}],
		subtotal: 2299,
		shipping: 0,
		discount: 0,
		total: 2299,
		paymentMethod: "Cash on Delivery",
		paymentStatus: "Pending",
		status: "Pending",
		date: "2026-08-09",
		shippingAddress: {
			line1: "22 Wakad Main Road",
			city: "Pune",
			state: "Maharashtra",
			pincode: "411057"
		}
	}
];
var statuses = [
	"All",
	"Pending",
	"Confirmed",
	"Processing",
	"Shipped",
	"Delivered",
	"Cancelled"
];
function AdminOrders() {
	const [orders, setOrders] = useState([]);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("All");
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [mobileMenu, setMobileMenu] = useState(false);
	useEffect(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) try {
			setOrders(JSON.parse(saved));
		} catch {
			setOrders(defaultOrders);
		}
		else {
			setOrders(defaultOrders);
			localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultOrders));
		}
	}, []);
	const saveOrders = (updatedOrders) => {
		setOrders(updatedOrders);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrders));
	};
	const filteredOrders = useMemo(() => {
		const query = search.toLowerCase().trim();
		return orders.filter((order) => {
			const matchesSearch = !query || order.id.toLowerCase().includes(query) || order.customer.name.toLowerCase().includes(query) || order.customer.email.toLowerCase().includes(query);
			const matchesStatus = statusFilter === "All" || order.status === statusFilter;
			return matchesSearch && matchesStatus;
		});
	}, [
		orders,
		search,
		statusFilter
	]);
	const updateStatus = (id, status) => {
		const updated = orders.map((order) => order.id === id ? {
			...order,
			status
		} : order);
		saveOrders(updated);
		if (selectedOrder?.id === id) setSelectedOrder({
			...selectedOrder,
			status
		});
	};
	const deleteOrder = (id) => {
		const order = orders.find((item) => item.id === id);
		if (!order) return;
		if (!window.confirm(`Delete order ${order.id}? This cannot be undone.`)) return;
		saveOrders(orders.filter((item) => item.id !== id));
		if (selectedOrder?.id === id) setSelectedOrder(null);
	};
	const totalRevenue = orders.filter((order) => order.paymentStatus === "Paid").reduce((sum, order) => sum + order.total, 0);
	const pendingOrders = orders.filter((order) => order.status === "Pending" || order.status === "Confirmed").length;
	const processingOrders = orders.filter((order) => order.status === "Processing").length;
	const deliveredOrders = orders.filter((order) => order.status === "Delivered").length;
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#f7f4ef] text-[#171513]",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "sticky top-0 z-30 flex h-18 items-center justify-between border-b border-black/5 bg-[#f7f4ef]/95 px-5 backdrop-blur-md lg:hidden",
				children: [
					/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setMobileMenu(true),
						className: "rounded-xl border border-black/10 bg-white p-2.5",
						children: /* @__PURE__ */ jsx(Menu, { size: 20 })
					}),
					/* @__PURE__ */ jsx("p", {
						className: "font-serif text-xl tracking-[0.15em]",
						children: "NSJ"
					}),
					/* @__PURE__ */ jsx(Link, {
						to: "/admin/dashboard",
						className: "text-sm",
						children: "Dashboard"
					})
				]
			}),
			/* @__PURE__ */ jsxs("aside", {
				className: "fixed left-0 top-0 hidden h-screen w-72 flex-col bg-[#171513] text-white lg:flex",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "flex h-20 items-center border-b border-white/10 px-7",
						children: /* @__PURE__ */ jsxs(Link, {
							to: "/admin/dashboard",
							className: "flex items-center gap-3",
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
								children: "Admin"
							})] })]
						})
					}),
					/* @__PURE__ */ jsxs("nav", {
						className: "flex-1 px-4 py-6",
						children: [
							/* @__PURE__ */ jsx(SidebarLink, {
								to: "/admin/dashboard",
								icon: /* @__PURE__ */ jsx(ClipboardList, { size: 18 }),
								label: "Dashboard"
							}),
							/* @__PURE__ */ jsx(SidebarLink, {
								to: "/admin/products",
								icon: /* @__PURE__ */ jsx(ShoppingBag, { size: 18 }),
								label: "Products"
							}),
							/* @__PURE__ */ jsx(SidebarLink, {
								to: "/admin/orders",
								icon: /* @__PURE__ */ jsx(ClipboardList, { size: 18 }),
								label: "Orders",
								active: true
							}),
							/* @__PURE__ */ jsx(SidebarLink, {
								to: "/admin/inventory",
								icon: /* @__PURE__ */ jsx(Package, { size: 18 }),
								label: "Inventory"
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "border-t border-white/10 p-5",
						children: /* @__PURE__ */ jsx(Link, {
							to: "/",
							className: "text-sm text-white/50 transition hover:text-white",
							children: "← View Store"
						})
					})
				]
			}),
			mobileMenu && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("button", {
				type: "button",
				"aria-label": "Close menu",
				onClick: () => setMobileMenu(false),
				className: "fixed inset-0 z-40 bg-black/40 lg:hidden"
			}), /* @__PURE__ */ jsxs("aside", {
				className: "fixed left-0 top-0 z-50 h-screen w-72 bg-[#171513] p-5 text-white lg:hidden",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "mb-8 flex items-center justify-between",
					children: [/* @__PURE__ */ jsx("p", {
						className: "font-serif text-2xl tracking-[0.15em]",
						children: "NSJ"
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setMobileMenu(false),
						className: "rounded-lg p-2 hover:bg-white/10",
						children: /* @__PURE__ */ jsx(X, { size: 20 })
					})]
				}), /* @__PURE__ */ jsxs("nav", {
					className: "space-y-1",
					children: [
						/* @__PURE__ */ jsx(MobileLink, {
							to: "/admin/dashboard",
							label: "Dashboard",
							onClick: () => setMobileMenu(false)
						}),
						/* @__PURE__ */ jsx(MobileLink, {
							to: "/admin/products",
							label: "Products",
							onClick: () => setMobileMenu(false)
						}),
						/* @__PURE__ */ jsx(MobileLink, {
							to: "/admin/orders",
							label: "Orders",
							active: true,
							onClick: () => setMobileMenu(false)
						}),
						/* @__PURE__ */ jsx(MobileLink, {
							to: "/admin/inventory",
							label: "Inventory",
							onClick: () => setMobileMenu(false)
						})
					]
				})]
			})] }),
			/* @__PURE__ */ jsx("main", {
				className: "lg:pl-72",
				children: /* @__PURE__ */ jsxs("div", {
					className: "p-5 sm:p-8",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
							children: /* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("p", {
									className: "text-xs uppercase tracking-[0.25em] text-[#b08a43]",
									children: "Store Management"
								}),
								/* @__PURE__ */ jsx("h1", {
									className: "mt-1 font-serif text-3xl sm:text-4xl",
									children: "Orders"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-2 text-sm text-black/45",
									children: "Manage customer orders and fulfillment."
								})
							] })
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
							children: [
								/* @__PURE__ */ jsx(OrderStat, {
									label: "Paid Revenue",
									value: `₹${totalRevenue.toLocaleString("en-IN")}`,
									icon: /* @__PURE__ */ jsx(ShoppingBag, { size: 19 })
								}),
								/* @__PURE__ */ jsx(OrderStat, {
									label: "Pending",
									value: pendingOrders,
									icon: /* @__PURE__ */ jsx(ClipboardList, { size: 19 })
								}),
								/* @__PURE__ */ jsx(OrderStat, {
									label: "Processing",
									value: processingOrders,
									icon: /* @__PURE__ */ jsx(Package, { size: 19 })
								}),
								/* @__PURE__ */ jsx(OrderStat, {
									label: "Delivered",
									value: deliveredOrders,
									icon: /* @__PURE__ */ jsx(Truck, { size: 19 })
								})
							]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mb-5 rounded-2xl border border-black/5 bg-white p-4",
							children: /* @__PURE__ */ jsxs("div", {
								className: "grid gap-3 lg:grid-cols-[1fr_auto]",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "relative",
									children: [/* @__PURE__ */ jsx(Search, {
										size: 18,
										className: "absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
									}), /* @__PURE__ */ jsx("input", {
										value: search,
										onChange: (event) => setSearch(event.target.value),
										placeholder: "Search order ID, customer or email...",
										className: "h-11 w-full rounded-xl border border-black/10 bg-[#fafafa] pl-11 pr-4 text-sm outline-none transition focus:border-[#b08a43]"
									})]
								}), /* @__PURE__ */ jsx("select", {
									value: statusFilter,
									onChange: (event) => setStatusFilter(event.target.value),
									className: "h-11 rounded-xl border border-black/10 bg-[#fafafa] px-4 text-sm outline-none focus:border-[#b08a43]",
									children: statuses.map((status) => /* @__PURE__ */ jsx("option", { children: status }, status))
								})]
							})
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "overflow-hidden rounded-2xl border border-black/5 bg-white",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex items-center justify-between border-b border-black/5 px-5 py-4",
								children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
									className: "font-serif text-xl",
									children: "All Orders"
								}), /* @__PURE__ */ jsxs("p", {
									className: "mt-1 text-xs text-black/40",
									children: [
										"Showing ",
										filteredOrders.length,
										" of ",
										orders.length,
										" orders"
									]
								})] })
							}), filteredOrders.length === 0 ? /* @__PURE__ */ jsxs("div", {
								className: "flex min-h-72 flex-col items-center justify-center px-6 text-center",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "flex h-14 w-14 items-center justify-center rounded-full bg-[#f7f1e4] text-[#a17b35]",
										children: /* @__PURE__ */ jsx(ShoppingBag, { size: 25 })
									}),
									/* @__PURE__ */ jsx("h3", {
										className: "mt-4 font-serif text-xl",
										children: "No orders found"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-2 text-sm text-black/45",
										children: "Try changing your search or status filter."
									})
								]
							}) : /* @__PURE__ */ jsx("div", {
								className: "overflow-x-auto",
								children: /* @__PURE__ */ jsxs("table", {
									className: "w-full min-w-[1050px]",
									children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
										className: "border-b border-black/5 bg-[#faf9f6] text-left text-[10px] uppercase tracking-wider text-black/35",
										children: [
											/* @__PURE__ */ jsx("th", {
												className: "px-5 py-4 font-medium",
												children: "Order"
											}),
											/* @__PURE__ */ jsx("th", {
												className: "px-5 py-4 font-medium",
												children: "Customer"
											}),
											/* @__PURE__ */ jsx("th", {
												className: "px-5 py-4 font-medium",
												children: "Items"
											}),
											/* @__PURE__ */ jsx("th", {
												className: "px-5 py-4 font-medium",
												children: "Amount"
											}),
											/* @__PURE__ */ jsx("th", {
												className: "px-5 py-4 font-medium",
												children: "Payment"
											}),
											/* @__PURE__ */ jsx("th", {
												className: "px-5 py-4 font-medium",
												children: "Status"
											}),
											/* @__PURE__ */ jsx("th", {
												className: "px-5 py-4 text-right font-medium",
												children: "Actions"
											})
										]
									}) }), /* @__PURE__ */ jsx("tbody", { children: filteredOrders.map((order) => /* @__PURE__ */ jsxs("tr", {
										className: "border-b border-black/5 last:border-0",
										children: [
											/* @__PURE__ */ jsxs("td", {
												className: "px-5 py-4",
												children: [/* @__PURE__ */ jsxs("p", {
													className: "text-sm font-semibold",
													children: ["#", order.id]
												}), /* @__PURE__ */ jsx("p", {
													className: "mt-1 text-[11px] text-black/35",
													children: formatDate(order.date)
												})]
											}),
											/* @__PURE__ */ jsxs("td", {
												className: "px-5 py-4",
												children: [/* @__PURE__ */ jsx("p", {
													className: "text-sm font-medium",
													children: order.customer.name
												}), /* @__PURE__ */ jsx("p", {
													className: "mt-1 text-xs text-black/40",
													children: order.customer.email
												})]
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-5 py-4",
												children: /* @__PURE__ */ jsx("p", {
													className: "max-w-[220px] truncate text-sm text-black/60",
													children: order.items.map((item) => `${item.name} × ${item.quantity}`).join(", ")
												})
											}),
											/* @__PURE__ */ jsxs("td", {
												className: "px-5 py-4 text-sm font-medium",
												children: ["₹", order.total.toLocaleString("en-IN")]
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-5 py-4",
												children: /* @__PURE__ */ jsx(PaymentBadge, { status: order.paymentStatus })
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-5 py-4",
												children: /* @__PURE__ */ jsx(StatusBadge, { status: order.status })
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-5 py-4",
												children: /* @__PURE__ */ jsxs("div", {
													className: "flex justify-end gap-1",
													children: [/* @__PURE__ */ jsx("button", {
														type: "button",
														onClick: () => setSelectedOrder(order),
														title: "View order",
														className: "rounded-lg p-2 text-black/40 transition hover:bg-black/5 hover:text-black",
														children: /* @__PURE__ */ jsx(Eye, { size: 17 })
													}), /* @__PURE__ */ jsx("button", {
														type: "button",
														onClick: () => deleteOrder(order.id),
														title: "Delete order",
														className: "rounded-lg p-2 text-black/40 transition hover:bg-red-50 hover:text-red-600",
														children: /* @__PURE__ */ jsx(Trash2, { size: 17 })
													})]
												})
											})
										]
									}, order.id)) })]
								})
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-5 flex items-center justify-between text-xs text-black/35",
							children: [
								/* @__PURE__ */ jsxs(Link, {
									to: "/admin/dashboard",
									className: "inline-flex items-center gap-1 transition hover:text-black",
									children: [/* @__PURE__ */ jsx(ChevronLeft, { size: 14 }), "Dashboard"]
								}),
								/* @__PURE__ */ jsx("span", { children: "NSJ Jewellery Admin" }),
								/* @__PURE__ */ jsxs("span", {
									className: "inline-flex items-center gap-1",
									children: [/* @__PURE__ */ jsx(ClipboardList, { size: 14 }), "Order Management"]
								})
							]
						})
					]
				})
			}),
			selectedOrder && /* @__PURE__ */ jsx(OrderDetails, {
				order: selectedOrder,
				onClose: () => setSelectedOrder(null),
				onStatusChange: (status) => updateStatus(selectedOrder.id, status)
			})
		]
	});
}
function OrderDetails({ order, onClose, onStatusChange }) {
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-8",
		children: /* @__PURE__ */ jsxs("div", {
			className: "my-auto w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between border-b border-black/5 px-5 py-5 sm:px-7",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
					className: "text-[10px] uppercase tracking-[0.25em] text-[#b08a43]",
					children: "Order Details"
				}), /* @__PURE__ */ jsxs("h2", {
					className: "mt-1 font-serif text-2xl",
					children: ["#", order.id]
				})] }), /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: onClose,
					className: "rounded-xl p-2 text-black/40 hover:bg-black/5 hover:text-black",
					children: /* @__PURE__ */ jsx(X, { size: 20 })
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "space-y-6 p-5 sm:p-7",
				children: [
					/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h3", {
						className: "mb-3 text-xs font-semibold uppercase tracking-wider text-black/40",
						children: "Customer"
					}), /* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-black/5 bg-[#faf9f6] p-4",
						children: [
							/* @__PURE__ */ jsx("p", {
								className: "font-medium",
								children: order.customer.name
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-1 text-sm text-black/50",
								children: order.customer.email
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-1 text-sm text-black/50",
								children: order.customer.phone
							})
						]
					})] }),
					/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h3", {
						className: "mb-3 text-xs font-semibold uppercase tracking-wider text-black/40",
						children: "Order Status"
					}), /* @__PURE__ */ jsx("select", {
						value: order.status,
						onChange: (event) => onStatusChange(event.target.value),
						className: "h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#b08a43]",
						children: statuses.filter((status) => status !== "All").map((status) => /* @__PURE__ */ jsx("option", { children: status }, status))
					})] }),
					/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h3", {
						className: "mb-3 text-xs font-semibold uppercase tracking-wider text-black/40",
						children: "Products"
					}), /* @__PURE__ */ jsx("div", {
						className: "divide-y divide-black/5 rounded-xl border border-black/5",
						children: order.items.map((item, index) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between gap-4 p-4",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
								className: "text-sm font-medium",
								children: item.name
							}), /* @__PURE__ */ jsxs("p", {
								className: "mt-1 text-xs text-black/40",
								children: ["Quantity: ", item.quantity]
							})] }), /* @__PURE__ */ jsxs("p", {
								className: "text-sm font-medium",
								children: ["₹", (item.price * item.quantity).toLocaleString("en-IN")]
							})]
						}, `${item.name}-${index}`))
					})] }),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-5 sm:grid-cols-2",
						children: [/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h3", {
							className: "mb-3 text-xs font-semibold uppercase tracking-wider text-black/40",
							children: "Shipping Address"
						}), /* @__PURE__ */ jsxs("div", {
							className: "rounded-xl border border-black/5 bg-[#faf9f6] p-4 text-sm leading-6 text-black/60",
							children: [
								/* @__PURE__ */ jsx("p", { children: order.shippingAddress.line1 }),
								/* @__PURE__ */ jsxs("p", { children: [
									order.shippingAddress.city,
									",",
									" ",
									order.shippingAddress.state
								] }),
								/* @__PURE__ */ jsx("p", { children: order.shippingAddress.pincode })
							]
						})] }), /* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h3", {
							className: "mb-3 text-xs font-semibold uppercase tracking-wider text-black/40",
							children: "Payment"
						}), /* @__PURE__ */ jsxs("div", {
							className: "rounded-xl border border-black/5 bg-[#faf9f6] p-4 text-sm",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between gap-4",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-black/45",
									children: "Method"
								}), /* @__PURE__ */ jsx("span", { children: order.paymentMethod })]
							}), /* @__PURE__ */ jsxs("div", {
								className: "mt-3 flex justify-between gap-4",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-black/45",
									children: "Status"
								}), /* @__PURE__ */ jsx(PaymentBadge, { status: order.paymentStatus })]
							})]
						})] })]
					}),
					/* @__PURE__ */ jsxs("section", {
						className: "rounded-xl bg-[#171513] p-5 text-white",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between text-sm text-white/50",
								children: [/* @__PURE__ */ jsx("span", { children: "Subtotal" }), /* @__PURE__ */ jsxs("span", { children: ["₹", order.subtotal.toLocaleString("en-IN")] })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-2 flex justify-between text-sm text-white/50",
								children: [/* @__PURE__ */ jsx("span", { children: "Shipping" }), /* @__PURE__ */ jsx("span", { children: order.shipping === 0 ? "Free" : `₹${order.shipping.toLocaleString("en-IN")}` })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-2 flex justify-between text-sm text-white/50",
								children: [/* @__PURE__ */ jsx("span", { children: "Discount" }), /* @__PURE__ */ jsxs("span", { children: ["-₹", order.discount.toLocaleString("en-IN")] })]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-4 border-t border-white/10 pt-4",
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ jsx("span", {
										className: "font-medium",
										children: "Total"
									}), /* @__PURE__ */ jsxs("span", {
										className: "font-serif text-xl text-[#d8b875]",
										children: ["₹", order.total.toLocaleString("en-IN")]
									})]
								})
							})
						]
					})
				]
			})]
		})
	});
}
function OrderStat({ label, value, icon }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-2xl border border-black/5 bg-white p-5",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "flex h-10 w-10 items-center justify-center rounded-xl bg-[#f7f1e4] text-[#a17b35]",
				children: icon
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-4 text-xs text-black/40",
				children: label
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-1 font-serif text-2xl",
				children: value
			})
		]
	});
}
function StatusBadge({ status }) {
	return /* @__PURE__ */ jsx("span", {
		className: `inline-flex rounded-full px-3 py-1 text-[11px] font-medium ${{
			Pending: "bg-amber-50 text-amber-700",
			Confirmed: "bg-blue-50 text-blue-700",
			Processing: "bg-violet-50 text-violet-700",
			Shipped: "bg-indigo-50 text-indigo-700",
			Delivered: "bg-emerald-50 text-emerald-700",
			Cancelled: "bg-red-50 text-red-700"
		}[status]}`,
		children: status
	});
}
function PaymentBadge({ status }) {
	return /* @__PURE__ */ jsx("span", {
		className: `inline-flex rounded-full px-3 py-1 text-[11px] font-medium ${{
			Paid: "bg-emerald-50 text-emerald-700",
			Pending: "bg-amber-50 text-amber-700",
			Failed: "bg-red-50 text-red-700",
			Refunded: "bg-violet-50 text-violet-700"
		}[status]}`,
		children: status
	});
}
function SidebarLink({ to, icon, label, active = false }) {
	return /* @__PURE__ */ jsxs(Link, {
		to,
		className: `mb-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${active ? "bg-[#c8a96b]/15 text-[#e4c98d]" : "text-white/55 hover:bg-white/10 hover:text-white"}`,
		children: [icon, label]
	});
}
function MobileLink({ to, label, active = false, onClick }) {
	return /* @__PURE__ */ jsx(Link, {
		to,
		onClick,
		className: `block rounded-xl px-4 py-3 text-sm ${active ? "bg-[#c8a96b]/15 text-[#e4c98d]" : "text-white/55 hover:bg-white/10 hover:text-white"}`,
		children: label
	});
}
function formatDate(date) {
	return new Intl.DateTimeFormat("en-IN", {
		day: "2-digit",
		month: "short",
		year: "numeric"
	}).format(new Date(date));
}
//#endregion
export { AdminOrders as component };
