import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AlertTriangle, Archive, CheckCircle2, ChevronLeft, Gem, Menu, Package, Plus, Search, X, XCircle } from "lucide-react";
//#region src/routes/admin/inventory.tsx?tsr-split=component
var PRODUCT_STORAGE_KEY = "nsj_admin_products";
var defaultProducts = [
	{
		id: "NSJ-001",
		name: "Silver Rose Ring",
		slug: "silver-rose-ring",
		category: "Rings",
		price: 1499,
		mrp: 1999,
		stock: 25,
		image: "",
		description: "Elegant 925 sterling silver rose-inspired ring.",
		purity: "925 Silver",
		weightGrams: 4.2,
		featured: true,
		published: true
	},
	{
		id: "NSJ-002",
		name: "Classic Silver Chain",
		slug: "classic-silver-chain",
		category: "Chains",
		price: 2799,
		mrp: 3499,
		stock: 5,
		image: "",
		description: "Classic silver chain designed for everyday elegance.",
		purity: "925 Silver",
		weightGrams: 8.5,
		featured: false,
		published: true
	},
	{
		id: "NSJ-003",
		name: "Pearl Drop Earrings",
		slug: "pearl-drop-earrings",
		category: "Earrings",
		price: 1899,
		mrp: 2499,
		stock: 3,
		image: "",
		description: "Elegant pearl drop earrings with a refined silver finish.",
		purity: "925 Silver",
		weightGrams: 3.8,
		featured: true,
		published: true
	},
	{
		id: "NSJ-004",
		name: "Elegant Silver Bracelet",
		slug: "elegant-silver-bracelet",
		category: "Bracelets",
		price: 2299,
		mrp: 2999,
		stock: 14,
		image: "",
		description: "Minimal silver bracelet with a premium polished finish.",
		purity: "925 Silver",
		weightGrams: 6.2,
		featured: false,
		published: true
	}
];
var categories = [
	"All",
	"Rings",
	"Earrings",
	"Necklaces",
	"Bracelets",
	"Bangles",
	"Chains",
	"Pendants",
	"Anklets"
];
function AdminInventory() {
	const [products, setProducts] = useState([]);
	const [search, setSearch] = useState("");
	const [category, setCategory] = useState("All");
	const [stockFilter, setStockFilter] = useState("All");
	const [mobileMenu, setMobileMenu] = useState(false);
	const [editingProduct, setEditingProduct] = useState(null);
	useEffect(() => {
		loadProducts();
	}, []);
	const loadProducts = () => {
		const saved = localStorage.getItem(PRODUCT_STORAGE_KEY);
		if (saved) try {
			const parsed = JSON.parse(saved);
			if (Array.isArray(parsed)) {
				setProducts(parsed);
				return;
			}
		} catch {}
		setProducts(defaultProducts);
		localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(defaultProducts));
	};
	const saveProducts = (updatedProducts) => {
		setProducts(updatedProducts);
		localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(updatedProducts));
	};
	const filteredProducts = useMemo(() => {
		const query = search.trim().toLowerCase();
		return products.filter((product) => {
			const matchesSearch = !query || product.name.toLowerCase().includes(query) || product.category.toLowerCase().includes(query) || product.id.toLowerCase().includes(query);
			const matchesCategory = category === "All" || product.category === category;
			const matchesStock = stockFilter === "All" || stockFilter === "In Stock" && product.stock > 5 || stockFilter === "Low Stock" && product.stock > 0 && product.stock <= 5 || stockFilter === "Out of Stock" && product.stock === 0;
			return matchesSearch && matchesCategory && matchesStock;
		});
	}, [
		products,
		search,
		category,
		stockFilter
	]);
	const totalProducts = products.length;
	const totalUnits = products.reduce((total, product) => total + product.stock, 0);
	const inStock = products.filter((product) => product.stock > 5).length;
	const lowStock = products.filter((product) => product.stock > 0 && product.stock <= 5).length;
	const outOfStock = products.filter((product) => product.stock === 0).length;
	const updateStock = (id, newStock) => {
		const stock = Math.max(0, Math.floor(newStock));
		const updatedProducts = products.map((product) => product.id === id ? {
			...product,
			stock
		} : product);
		saveProducts(updatedProducts);
		setEditingProduct(null);
	};
	const increaseStock = (product, amount = 1) => {
		updateStock(product.id, product.stock + amount);
	};
	const decreaseStock = (product, amount = 1) => {
		updateStock(product.id, product.stock - amount);
	};
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
								icon: /* @__PURE__ */ jsx(Gem, { size: 18 }),
								label: "Dashboard"
							}),
							/* @__PURE__ */ jsx(SidebarLink, {
								to: "/admin/products",
								icon: /* @__PURE__ */ jsx(Gem, { size: 18 }),
								label: "Products"
							}),
							/* @__PURE__ */ jsx(SidebarLink, {
								to: "/admin/orders",
								icon: /* @__PURE__ */ jsx(Archive, { size: 18 }),
								label: "Orders"
							}),
							/* @__PURE__ */ jsx(SidebarLink, {
								to: "/admin/inventory",
								icon: /* @__PURE__ */ jsx(Package, { size: 18 }),
								label: "Inventory",
								active: true
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
							onClick: () => setMobileMenu(false)
						}),
						/* @__PURE__ */ jsx(MobileLink, {
							to: "/admin/inventory",
							label: "Inventory",
							active: true,
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
						/* @__PURE__ */ jsxs("div", {
							className: "mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("p", {
									className: "text-xs uppercase tracking-[0.25em] text-[#b08a43]",
									children: "Store Management"
								}),
								/* @__PURE__ */ jsx("h1", {
									className: "mt-1 font-serif text-3xl sm:text-4xl",
									children: "Inventory"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-2 text-sm text-black/45",
									children: "Monitor and update your jewellery stock."
								})
							] }), /* @__PURE__ */ jsxs(Link, {
								to: "/admin/products",
								className: "inline-flex items-center justify-center gap-2 rounded-xl bg-[#171513] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#2a2724]",
								children: [/* @__PURE__ */ jsx(Plus, { size: 18 }), "Manage Products"]
							})]
						}),
						/* @__PURE__ */ jsxs("section", {
							className: "mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
							children: [
								/* @__PURE__ */ jsx(InventoryStat, {
									title: "Total Products",
									value: totalProducts,
									icon: /* @__PURE__ */ jsx(Gem, { size: 20 }),
									description: "Products in catalogue"
								}),
								/* @__PURE__ */ jsx(InventoryStat, {
									title: "Total Units",
									value: totalUnits,
									icon: /* @__PURE__ */ jsx(Package, { size: 20 }),
									description: "Available stock units"
								}),
								/* @__PURE__ */ jsx(InventoryStat, {
									title: "Low Stock",
									value: lowStock,
									icon: /* @__PURE__ */ jsx(AlertTriangle, { size: 20 }),
									description: "5 or fewer units",
									warning: true
								}),
								/* @__PURE__ */ jsx(InventoryStat, {
									title: "Out of Stock",
									value: outOfStock,
									icon: /* @__PURE__ */ jsx(XCircle, { size: 20 }),
									description: "Needs restocking",
									danger: true
								})
							]
						}),
						/* @__PURE__ */ jsx("section", {
							className: "mb-7 rounded-2xl border border-black/5 bg-white p-5 sm:p-6",
							children: /* @__PURE__ */ jsxs("div", {
								className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
									className: "font-serif text-xl",
									children: "Inventory Health"
								}), /* @__PURE__ */ jsxs("p", {
									className: "mt-1 text-xs text-black/40",
									children: [inStock, " products have healthy stock levels."]
								})] }), /* @__PURE__ */ jsx(StockHealth, {
									total: totalProducts,
									healthy: inStock
								})]
							})
						}),
						/* @__PURE__ */ jsx("section", {
							className: "mb-5 rounded-2xl border border-black/5 bg-white p-4",
							children: /* @__PURE__ */ jsxs("div", {
								className: "grid gap-3 lg:grid-cols-[1fr_auto_auto]",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "relative",
										children: [/* @__PURE__ */ jsx(Search, {
											size: 18,
											className: "absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
										}), /* @__PURE__ */ jsx("input", {
											value: search,
											onChange: (event) => setSearch(event.target.value),
											placeholder: "Search product, category or ID...",
											className: "h-11 w-full rounded-xl border border-black/10 bg-[#fafafa] pl-11 pr-4 text-sm outline-none transition focus:border-[#b08a43]"
										})]
									}),
									/* @__PURE__ */ jsx("select", {
										value: category,
										onChange: (event) => setCategory(event.target.value),
										className: "h-11 rounded-xl border border-black/10 bg-[#fafafa] px-4 text-sm outline-none focus:border-[#b08a43]",
										children: categories.map((item) => /* @__PURE__ */ jsx("option", { children: item }, item))
									}),
									/* @__PURE__ */ jsxs("select", {
										value: stockFilter,
										onChange: (event) => setStockFilter(event.target.value),
										className: "h-11 rounded-xl border border-black/10 bg-[#fafafa] px-4 text-sm outline-none focus:border-[#b08a43]",
										children: [
											/* @__PURE__ */ jsx("option", { children: "All" }),
											/* @__PURE__ */ jsx("option", { children: "In Stock" }),
											/* @__PURE__ */ jsx("option", { children: "Low Stock" }),
											/* @__PURE__ */ jsx("option", { children: "Out of Stock" })
										]
									})
								]
							})
						}),
						/* @__PURE__ */ jsxs("section", {
							className: "overflow-hidden rounded-2xl border border-black/5 bg-white",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex items-center justify-between border-b border-black/5 px-5 py-4",
								children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
									className: "font-serif text-xl",
									children: "Stock Management"
								}), /* @__PURE__ */ jsxs("p", {
									className: "mt-1 text-xs text-black/40",
									children: [
										"Showing ",
										filteredProducts.length,
										" of ",
										products.length,
										" ",
										"products"
									]
								})] })
							}), filteredProducts.length === 0 ? /* @__PURE__ */ jsxs("div", {
								className: "flex min-h-72 flex-col items-center justify-center px-6 text-center",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "flex h-14 w-14 items-center justify-center rounded-full bg-[#f7f1e4] text-[#a17b35]",
										children: /* @__PURE__ */ jsx(Package, { size: 25 })
									}),
									/* @__PURE__ */ jsx("h3", {
										className: "mt-4 font-serif text-xl",
										children: "No products found"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-2 text-sm text-black/45",
										children: "Try changing your search or stock filter."
									})
								]
							}) : /* @__PURE__ */ jsx("div", {
								className: "overflow-x-auto",
								children: /* @__PURE__ */ jsxs("table", {
									className: "w-full min-w-[950px]",
									children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
										className: "border-b border-black/5 bg-[#faf9f6] text-left text-[10px] uppercase tracking-wider text-black/35",
										children: [
											/* @__PURE__ */ jsx("th", {
												className: "px-5 py-4 font-medium",
												children: "Product"
											}),
											/* @__PURE__ */ jsx("th", {
												className: "px-5 py-4 font-medium",
												children: "Category"
											}),
											/* @__PURE__ */ jsx("th", {
												className: "px-5 py-4 font-medium",
												children: "Current Stock"
											}),
											/* @__PURE__ */ jsx("th", {
												className: "px-5 py-4 font-medium",
												children: "Stock Status"
											}),
											/* @__PURE__ */ jsx("th", {
												className: "px-5 py-4 font-medium",
												children: "Quick Update"
											}),
											/* @__PURE__ */ jsx("th", {
												className: "px-5 py-4 text-right font-medium",
												children: "Action"
											})
										]
									}) }), /* @__PURE__ */ jsx("tbody", { children: filteredProducts.map((product) => /* @__PURE__ */ jsxs("tr", {
										className: "border-b border-black/5 last:border-0",
										children: [
											/* @__PURE__ */ jsx("td", {
												className: "px-5 py-4",
												children: /* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-3",
													children: [/* @__PURE__ */ jsx("div", {
														className: "flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f3eee5]",
														children: product.image ? /* @__PURE__ */ jsx("img", {
															src: product.image,
															alt: product.name,
															className: "h-full w-full object-cover"
														}) : /* @__PURE__ */ jsx(Gem, {
															size: 19,
															className: "text-[#b08a43]"
														})
													}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
														className: "text-sm font-medium",
														children: product.name
													}), /* @__PURE__ */ jsx("p", {
														className: "mt-1 text-[11px] text-black/35",
														children: product.id
													})] })]
												})
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-5 py-4 text-sm text-black/55",
												children: product.category
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-5 py-4",
												children: /* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ jsx("span", {
														className: "font-serif text-xl",
														children: product.stock
													}), /* @__PURE__ */ jsx("span", {
														className: "text-xs text-black/35",
														children: "units"
													})]
												})
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-5 py-4",
												children: /* @__PURE__ */ jsx(StockStatus, { stock: product.stock })
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-5 py-4",
												children: /* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-2",
													children: [
														/* @__PURE__ */ jsx("button", {
															type: "button",
															onClick: () => decreaseStock(product, 1),
															disabled: product.stock === 0,
															className: "flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 text-sm transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-30",
															children: "−"
														}),
														/* @__PURE__ */ jsx("button", {
															type: "button",
															onClick: () => increaseStock(product, 1),
															className: "flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 text-sm transition hover:bg-black/5",
															children: "+"
														}),
														/* @__PURE__ */ jsx("button", {
															type: "button",
															onClick: () => increaseStock(product, 5),
															className: "rounded-lg border border-black/10 px-2.5 py-1.5 text-[11px] transition hover:bg-black/5",
															children: "+5"
														})
													]
												})
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-5 py-4 text-right",
												children: /* @__PURE__ */ jsx("button", {
													type: "button",
													onClick: () => setEditingProduct(product),
													className: "rounded-lg bg-[#171513] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#2a2724]",
													children: "Update Stock"
												})
											})
										]
									}, product.id)) })]
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
									children: [/* @__PURE__ */ jsx(Archive, { size: 14 }), "Inventory Management"]
								})
							]
						})
					]
				})
			}),
			editingProduct && /* @__PURE__ */ jsx(StockModal, {
				product: editingProduct,
				onClose: () => setEditingProduct(null),
				onSave: (stock) => updateStock(editingProduct.id, stock)
			})
		]
	});
}
function StockModal({ product, onClose, onSave }) {
	const [stock, setStock] = useState(String(product.stock));
	const submit = (event) => {
		event.preventDefault();
		const value = Number(stock);
		if (!Number.isFinite(value) || value < 0) {
			alert("Please enter a valid stock quantity.");
			return;
		}
		onSave(Math.floor(value));
	};
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between border-b border-black/5 px-5 py-5",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
					className: "text-[10px] uppercase tracking-[0.25em] text-[#b08a43]",
					children: "Inventory"
				}), /* @__PURE__ */ jsx("h2", {
					className: "mt-1 font-serif text-2xl",
					children: "Update Stock"
				})] }), /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: onClose,
					className: "rounded-xl p-2 text-black/40 hover:bg-black/5",
					children: /* @__PURE__ */ jsx(X, { size: 20 })
				})]
			}), /* @__PURE__ */ jsxs("form", {
				onSubmit: submit,
				className: "p-5",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "rounded-xl bg-[#faf9f6] p-4",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex h-12 w-12 items-center justify-center rounded-xl bg-[#f3eee5]",
								children: product.image ? /* @__PURE__ */ jsx("img", {
									src: product.image,
									alt: product.name,
									className: "h-full w-full rounded-xl object-cover"
								}) : /* @__PURE__ */ jsx(Gem, {
									size: 19,
									className: "text-[#b08a43]"
								})
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
								className: "text-sm font-medium",
								children: product.name
							}), /* @__PURE__ */ jsxs("p", {
								className: "mt-1 text-xs text-black/40",
								children: [
									product.category,
									" · ",
									product.id
								]
							})] })]
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-5",
						children: [/* @__PURE__ */ jsx("label", {
							htmlFor: "stock",
							className: "mb-2 block text-xs font-medium uppercase tracking-wider text-black/50",
							children: "Stock Quantity"
						}), /* @__PURE__ */ jsx("input", {
							id: "stock",
							type: "number",
							min: "0",
							value: stock,
							onChange: (event) => setStock(event.target.value),
							autoFocus: true,
							className: "h-13 w-full rounded-xl border border-black/10 bg-white px-4 text-lg outline-none focus:border-[#b08a43] focus:ring-2 focus:ring-[#b08a43]/10"
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-4",
						children: /* @__PURE__ */ jsx(StockStatus, { stock: Number(stock) || 0 })
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end",
						children: [/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: onClose,
							className: "rounded-xl border border-black/10 px-5 py-3 text-sm font-medium transition hover:bg-black/5",
							children: "Cancel"
						}), /* @__PURE__ */ jsx("button", {
							type: "submit",
							className: "rounded-xl bg-[#171513] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#2a2724]",
							children: "Save Stock"
						})]
					})
				]
			})]
		})
	});
}
function InventoryStat({ title, value, icon, description, warning = false, danger = false }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-2xl border border-black/5 bg-white p-5",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: `flex h-11 w-11 items-center justify-center rounded-xl ${danger ? "bg-red-50 text-red-600" : warning ? "bg-amber-50 text-amber-600" : "bg-[#f7f1e4] text-[#a17b35]"}`,
				children: icon
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-5 text-xs text-black/40",
				children: title
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-1 font-serif text-2xl",
				children: value
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-1 text-[11px] text-black/30",
				children: description
			})
		]
	});
}
function StockHealth({ total, healthy }) {
	const percentage = total === 0 ? 0 : Math.round(healthy / total * 100);
	return /* @__PURE__ */ jsxs("div", {
		className: "w-full sm:w-72",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-2 flex justify-between text-xs",
			children: [/* @__PURE__ */ jsx("span", {
				className: "text-black/40",
				children: "Healthy stock"
			}), /* @__PURE__ */ jsxs("span", {
				className: "font-medium",
				children: [percentage, "%"]
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "h-2 overflow-hidden rounded-full bg-black/5",
			children: /* @__PURE__ */ jsx("div", {
				className: "h-full rounded-full bg-[#a17b35] transition-all",
				style: { width: `${percentage}%` }
			})
		})]
	});
}
function StockStatus({ stock }) {
	if (stock === 0) return /* @__PURE__ */ jsxs("span", {
		className: "inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-[11px] font-medium text-red-700",
		children: [/* @__PURE__ */ jsx(XCircle, { size: 13 }), "Out of Stock"]
	});
	if (stock <= 5) return /* @__PURE__ */ jsxs("span", {
		className: "inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-[11px] font-medium text-amber-700",
		children: [/* @__PURE__ */ jsx(AlertTriangle, { size: 13 }), "Low Stock"]
	});
	return /* @__PURE__ */ jsxs("span", {
		className: "inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-medium text-emerald-700",
		children: [/* @__PURE__ */ jsx(CheckCircle2, { size: 13 }), "In Stock"]
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
//#endregion
export { AdminInventory as component };
