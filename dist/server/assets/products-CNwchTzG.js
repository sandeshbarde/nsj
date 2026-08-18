import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Archive, ChevronLeft, Edit3, Eye, Gem, ImagePlus, Menu, Plus, Search, Star, Trash2, Video, X } from "lucide-react";
import "@supabase/supabase-js";
throw new Error("Missing Supabase environment variables.");
function readLegacyProducts() {
	if (typeof window === "undefined") return [];
	const saved = localStorage.getItem(STORAGE_KEY);
	if (!saved) return [];
	try {
		const parsed = JSON.parse(saved);
		if (!Array.isArray(parsed)) return [];
		return parsed.map((item) => {
			const gallery = Array.isArray(item.gallery) ? item.gallery.filter((value) => typeof value === "string") : item.image ? [String(item.image)] : [];
			return {
				id: String(item.id ?? `NSJ-${Date.now()}`),
				name: String(item.name ?? ""),
				slug: String(item.slug ?? ""),
				category: String(item.category ?? "Rings"),
				price: Number(item.price ?? 0),
				mrp: Number(item.mrp ?? 0),
				stock: Number(item.stock ?? 0),
				image: String(item.image ?? gallery[0] ?? ""),
				gallery,
				video: typeof item.video === "string" ? item.video : "",
				description: String(item.description ?? ""),
				purity: String(item.purity ?? "925 Silver"),
				weightGrams: Number(item.weightGrams ?? 0),
				featured: Boolean(item.featured),
				published: item.published !== false
			};
		});
	} catch {
		return [];
	}
}
function AdminProducts() {
	const [products, setProducts] = useState([]);
	const [search, setSearch] = useState("");
	const [category, setCategory] = useState("All");
	const [stockFilter, setStockFilter] = useState("All");
	const [showForm, setShowForm] = useState(false);
	const [editingProduct, setEditingProduct] = useState(null);
	const [mobileMenu, setMobileMenu] = useState(false);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const loadProducts = async () => {
		setLoading(true);
		const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
		if (error) {
			console.error("Load products error:", error);
			alert(`Could not load products from Supabase.\n\n${error.message}`);
			setProducts([]);
			setLoading(false);
			return;
		}
		let dbProducts = (data ?? []).map(rowToProduct);
		if (dbProducts.length === 0) {
			const legacyProducts = readLegacyProducts();
			if (legacyProducts.length > 0) {
				const { data: migrated, error: migrationError } = await supabase.from("products").upsert(legacyProducts.map(productToRow), { onConflict: "id" }).select("*");
				if (!migrationError && migrated) {
					dbProducts = migrated.map(rowToProduct);
					localStorage.removeItem(STORAGE_KEY);
				} else if (migrationError) console.error("Product migration error:", migrationError);
			}
		}
		setProducts(dbProducts);
		setLoading(false);
	};
	useEffect(() => {
		loadProducts();
	}, []);
	const handleDelete = async (id) => {
		const product = products.find((item) => item.id === id);
		if (!product) return;
		if (!window.confirm(`Delete "${product.name}"? This action cannot be undone.`)) return;
		setSaving(true);
		const { error } = await supabase.from("products").delete().eq("id", id);
		setSaving(false);
		if (error) {
			console.error("Delete product error:", error);
			alert(`Could not delete product.\n\n${error.message}`);
			return;
		}
		setProducts((current) => current.filter((item) => item.id !== id));
	};
	const togglePublished = async (id) => {
		const product = products.find((item) => item.id === id);
		if (!product) return;
		const published = !product.published;
		setProducts((current) => current.map((item) => item.id === id ? {
			...item,
			published
		} : item));
		const { error } = await supabase.from("products").update({ published }).eq("id", id);
		if (error) {
			console.error("Publish update error:", error);
			setProducts((current) => current.map((item) => item.id === id ? {
				...item,
				published: product.published
			} : item));
			alert(`Could not update product status.\n\n${error.message}`);
		}
	};
	const toggleFeatured = async (id) => {
		const product = products.find((item) => item.id === id);
		if (!product) return;
		const featured = !product.featured;
		setProducts((current) => current.map((item) => item.id === id ? {
			...item,
			featured
		} : item));
		const { error } = await supabase.from("products").update({ featured }).eq("id", id);
		if (error) {
			console.error("Featured update error:", error);
			setProducts((current) => current.map((item) => item.id === id ? {
				...item,
				featured: product.featured
			} : item));
			alert(`Could not update featured status.\n\n${error.message}`);
		}
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
	const openAddForm = () => {
		setEditingProduct(null);
		setShowForm(true);
	};
	const openEditForm = (product) => {
		setEditingProduct(product);
		setShowForm(true);
	};
	const handleSaveProduct = async (product) => {
		setSaving(true);
		const { data, error } = await supabase.from("products").upsert(productToRow(product), { onConflict: "id" }).select("*").single();
		setSaving(false);
		if (error) {
			console.error("Save product error:", error);
			alert(`Could not save product.\n\n${error.message}\n\nCheck your Supabase table, RLS policies and environment variables.`);
			return false;
		}
		const savedProduct = rowToProduct(data);
		setProducts((current) => {
			return current.some((item) => item.id === savedProduct.id) ? current.map((item) => item.id === savedProduct.id ? savedProduct : item) : [savedProduct, ...current];
		});
		setShowForm(false);
		setEditingProduct(null);
		return true;
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
								label: "Products",
								active: true
							}),
							/* @__PURE__ */ jsx(SidebarLink, {
								to: "/admin/orders",
								icon: /* @__PURE__ */ jsx(Archive, { size: 18 }),
								label: "Orders"
							}),
							/* @__PURE__ */ jsx(SidebarLink, {
								to: "/admin/inventory",
								icon: /* @__PURE__ */ jsx(Archive, { size: 18 }),
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
							onClick: () => setMobileMenu(false),
							active: true
						}),
						/* @__PURE__ */ jsx(MobileLink, {
							to: "/admin/orders",
							label: "Orders",
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
						/* @__PURE__ */ jsxs("div", {
							className: "mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("p", {
									className: "text-xs uppercase tracking-[0.25em] text-[#b08a43]",
									children: "Store Management"
								}),
								/* @__PURE__ */ jsx("h1", {
									className: "mt-1 font-serif text-3xl sm:text-4xl",
									children: "Products"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-2 text-sm text-black/45",
									children: "Manage your NSJ jewellery collection."
								})
							] }), /* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: openAddForm,
								disabled: saving,
								className: "inline-flex items-center justify-center gap-2 rounded-xl bg-[#171513] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#2a2724] disabled:cursor-not-allowed disabled:opacity-50",
								children: [/* @__PURE__ */ jsx(Plus, { size: 18 }), "Add Product"]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
							children: [
								/* @__PURE__ */ jsx(MiniStat, {
									label: "Total Products",
									value: products.length
								}),
								/* @__PURE__ */ jsx(MiniStat, {
									label: "Published",
									value: products.filter((p) => p.published).length
								}),
								/* @__PURE__ */ jsx(MiniStat, {
									label: "Low Stock",
									value: products.filter((p) => p.stock > 0 && p.stock <= 5).length
								}),
								/* @__PURE__ */ jsx(MiniStat, {
									label: "Out of Stock",
									value: products.filter((p) => p.stock === 0).length
								})
							]
						}),
						/* @__PURE__ */ jsx("div", {
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
											placeholder: "Search products...",
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
						/* @__PURE__ */ jsxs("div", {
							className: "overflow-hidden rounded-2xl border border-black/5 bg-white",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex items-center justify-between border-b border-black/5 px-5 py-4",
								children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
									className: "font-serif text-xl",
									children: "All Products"
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
							}), loading ? /* @__PURE__ */ jsx("div", {
								className: "flex min-h-80 items-center justify-center px-6 text-center",
								children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", { className: "mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#c8a96b]/30 border-t-[#a17b35]" }), /* @__PURE__ */ jsx("p", {
									className: "mt-4 text-sm text-black/45",
									children: "Loading products from Supabase..."
								})] })
							}) : filteredProducts.length === 0 ? /* @__PURE__ */ jsxs("div", {
								className: "flex min-h-80 flex-col items-center justify-center px-6 text-center",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "flex h-14 w-14 items-center justify-center rounded-full bg-[#f7f1e4] text-[#a17b35]",
										children: /* @__PURE__ */ jsx(Gem, { size: 25 })
									}),
									/* @__PURE__ */ jsx("h3", {
										className: "mt-4 font-serif text-xl",
										children: "No products found"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-2 max-w-sm text-sm text-black/45",
										children: "Try changing your search or filters, or add a new product."
									}),
									/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: openAddForm,
										className: "mt-5 rounded-xl bg-[#171513] px-5 py-3 text-sm text-white",
										children: "Add Product"
									})
								]
							}) : /* @__PURE__ */ jsx("div", {
								className: "overflow-x-auto",
								children: /* @__PURE__ */ jsxs("table", {
									className: "w-full min-w-[1000px]",
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
												children: "Price"
											}),
											/* @__PURE__ */ jsx("th", {
												className: "px-5 py-4 font-medium",
												children: "Stock"
											}),
											/* @__PURE__ */ jsx("th", {
												className: "px-5 py-4 font-medium",
												children: "Status"
											}),
											/* @__PURE__ */ jsx("th", {
												className: "px-5 py-4 font-medium",
												children: "Featured"
											}),
											/* @__PURE__ */ jsx("th", {
												className: "px-5 py-4 text-right font-medium",
												children: "Actions"
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
											/* @__PURE__ */ jsxs("td", {
												className: "px-5 py-4",
												children: [/* @__PURE__ */ jsxs("p", {
													className: "text-sm font-medium",
													children: ["₹", product.price.toLocaleString("en-IN")]
												}), product.mrp > product.price && /* @__PURE__ */ jsxs("p", {
													className: "text-xs text-black/30 line-through",
													children: ["₹", product.mrp.toLocaleString("en-IN")]
												})]
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-5 py-4",
												children: /* @__PURE__ */ jsx(StockBadge, { stock: product.stock })
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-5 py-4",
												children: /* @__PURE__ */ jsx("button", {
													type: "button",
													onClick: () => void togglePublished(product.id),
													className: `rounded-full px-3 py-1 text-[11px] font-medium ${product.published ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`,
													children: product.published ? "Published" : "Draft"
												})
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-5 py-4",
												children: /* @__PURE__ */ jsx("button", {
													type: "button",
													onClick: () => void toggleFeatured(product.id),
													"aria-label": product.featured ? "Remove featured" : "Make featured",
													className: `rounded-lg p-2 transition ${product.featured ? "bg-[#f7f1e4] text-[#a17b35]" : "text-black/25 hover:bg-black/5"}`,
													children: /* @__PURE__ */ jsx(Star, {
														size: 17,
														fill: product.featured ? "currentColor" : "none"
													})
												})
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-5 py-4",
												children: /* @__PURE__ */ jsxs("div", {
													className: "flex justify-end gap-1",
													children: [/* @__PURE__ */ jsx("button", {
														type: "button",
														onClick: () => openEditForm(product),
														title: "Edit product",
														className: "rounded-lg p-2 text-black/40 transition hover:bg-black/5 hover:text-black",
														children: /* @__PURE__ */ jsx(Edit3, { size: 17 })
													}), /* @__PURE__ */ jsx("button", {
														type: "button",
														onClick: () => void handleDelete(product.id),
														disabled: saving,
														title: "Delete product",
														className: "rounded-lg p-2 text-black/40 transition hover:bg-red-50 hover:text-red-600",
														children: /* @__PURE__ */ jsx(Trash2, { size: 17 })
													})]
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
									children: [/* @__PURE__ */ jsx(Eye, { size: 14 }), "Local Management"]
								})
							]
						})
					]
				})
			}),
			showForm && /* @__PURE__ */ jsx(ProductForm, {
				product: editingProduct,
				onClose: () => {
					setShowForm(false);
					setEditingProduct(null);
				},
				onSave: handleSaveProduct
			})
		]
	});
}
function createSafeFileName(fileName) {
	return fileName.replace(/\.[^/.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "media";
}
async function resizeImage(file) {
	return new Promise((resolve, reject) => {
		const objectUrl = URL.createObjectURL(file);
		const image = new Image();
		image.onload = () => {
			const scale = Math.min(1, 1800 / Math.max(image.width, image.height));
			const canvas = document.createElement("canvas");
			canvas.width = Math.max(1, Math.round(image.width * scale));
			canvas.height = Math.max(1, Math.round(image.height * scale));
			const context = canvas.getContext("2d");
			if (!context) {
				URL.revokeObjectURL(objectUrl);
				reject(/* @__PURE__ */ new Error("Unable to process image."));
				return;
			}
			context.drawImage(image, 0, 0, canvas.width, canvas.height);
			canvas.toBlob((blob) => {
				URL.revokeObjectURL(objectUrl);
				if (!blob) {
					reject(/* @__PURE__ */ new Error("Unable to create image file."));
					return;
				}
				resolve(blob);
			}, "image/jpeg", .84);
		};
		image.onerror = () => {
			URL.revokeObjectURL(objectUrl);
			reject(/* @__PURE__ */ new Error("Unable to process image."));
		};
		image.src = objectUrl;
	});
}
async function uploadMedia(file, productId, kind) {
	const isImage = kind === "image";
	const body = isImage ? await resizeImage(file) : file;
	const extension = isImage ? "jpg" : (file.name.split(".").pop() || "mp4").toLowerCase();
	const unique = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2);
	const path = `products/${productId}/${Date.now()}-${unique}-${createSafeFileName(file.name)}.${extension}`;
	const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, body, {
		cacheControl: "3600",
		contentType: isImage ? "image/jpeg" : file.type,
		upsert: false
	});
	if (error) throw new Error(`Storage upload failed: ${error.message}`);
	const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
	if (!data.publicUrl) throw new Error("Could not create a public URL for the uploaded file.");
	return data.publicUrl;
}
function ProductForm({ product, onClose, onSave }) {
	const [form, setForm] = useState(product ?? {
		...emptyProduct,
		id: `NSJ-${Date.now().toString().slice(-6)}`
	});
	const update = (key, value) => {
		setForm((current) => ({
			...current,
			[key]: value
		}));
	};
	const createSlug = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
	const [savingForm, setSavingForm] = useState(false);
	const addImages = async (files) => {
		if (!files?.length) return;
		const remaining = MAX_GALLERY_IMAGES - (form.gallery?.length ?? 0);
		if (remaining <= 0) {
			alert(`You can upload up to ${MAX_GALLERY_IMAGES} photos per product.`);
			return;
		}
		try {
			const selectedFiles = Array.from(files).slice(0, remaining);
			const nextImages = [];
			for (const file of selectedFiles) {
				if (!file.type.startsWith("image/")) {
					alert(`${file.name} is not an image.`);
					continue;
				}
				if (file.size > MAX_IMAGE_BYTES) {
					alert(`${file.name} is larger than 5 MB. Please choose a smaller image.`);
					continue;
				}
				const imageUrl = await uploadMedia(file, form.id, "image");
				nextImages.push(imageUrl);
			}
			if (nextImages.length > 0) setForm((current) => {
				const gallery = [...current.gallery ?? [], ...nextImages].slice(0, MAX_GALLERY_IMAGES);
				return {
					...current,
					gallery,
					image: gallery[0] ?? current.image
				};
			});
		} catch (error) {
			console.error("Image upload error:", error);
			alert(error instanceof Error ? error.message : "Could not upload image.");
		}
	};
	const removeImage = (index) => {
		setForm((current) => {
			const gallery = (current.gallery ?? []).filter((_, i) => i !== index);
			return {
				...current,
				gallery,
				image: gallery[0] ?? ""
			};
		});
	};
	const handleVideoFile = async (file) => {
		if (!file) return;
		if (!file.type.startsWith("video/")) {
			alert("Please choose a video file.");
			return;
		}
		if (file.size > MAX_VIDEO_BYTES) {
			alert("Video is larger than 25 MB. Please choose a smaller video.");
			return;
		}
		try {
			const videoUrl = await uploadMedia(file, form.id, "video");
			setForm((current) => ({
				...current,
				video: videoUrl
			}));
		} catch (error) {
			console.error("Video upload error:", error);
			alert(error instanceof Error ? error.message : "Could not upload video.");
		}
	};
	const submit = async (event) => {
		event.preventDefault();
		if (!form.name.trim()) {
			alert("Please enter a product name.");
			return;
		}
		if (form.price <= 0) {
			alert("Please enter a valid price.");
			return;
		}
		const gallery = form.gallery?.filter(Boolean) ?? [];
		const finalProduct = {
			...form,
			name: form.name.trim(),
			slug: form.slug || createSlug(form.name),
			image: form.image || gallery[0] || "",
			gallery
		};
		setSavingForm(true);
		try {
			await onSave(finalProduct);
		} finally {
			setSavingForm(false);
		}
	};
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-8",
		children: /* @__PURE__ */ jsxs("div", {
			className: "my-auto w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between border-b border-black/5 px-5 py-5 sm:px-7",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("p", {
						className: "text-[10px] uppercase tracking-[0.25em] text-[#b08a43]",
						children: "Product Management"
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mb-3 rounded-lg bg-[#fbf7ed] px-3 py-2 text-[11px] leading-5 text-[#7b602d]",
						children: "Photos are uploaded to Supabase Storage and their URLs are saved in your products database."
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "mt-1 font-serif text-2xl",
						children: product ? "Edit Product" : "Add Product"
					})
				] }), /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: onClose,
					className: "rounded-xl p-2 text-black/40 hover:bg-black/5 hover:text-black",
					children: /* @__PURE__ */ jsx(X, { size: 20 })
				})]
			}), /* @__PURE__ */ jsxs("form", {
				onSubmit: submit,
				className: "space-y-6 p-5 sm:p-7",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-5 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ jsx(Field, {
								label: "Product Name",
								children: /* @__PURE__ */ jsx("input", {
									value: form.name,
									onChange: (event) => {
										const name = event.target.value;
										setForm((current) => ({
											...current,
											name,
											slug: current.slug || createSlug(name)
										}));
									},
									placeholder: "Silver Rose Ring",
									required: true,
									className: "admin-input"
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Category",
								children: /* @__PURE__ */ jsx("select", {
									value: form.category,
									onChange: (event) => update("category", event.target.value),
									className: "admin-input",
									children: categories.filter((item) => item !== "All").map((item) => /* @__PURE__ */ jsx("option", { children: item }, item))
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Price",
								children: /* @__PURE__ */ jsx("input", {
									type: "number",
									min: "0",
									value: form.price,
									onChange: (event) => update("price", Number(event.target.value)),
									className: "admin-input"
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "MRP",
								children: /* @__PURE__ */ jsx("input", {
									type: "number",
									min: "0",
									value: form.mrp,
									onChange: (event) => update("mrp", Number(event.target.value)),
									className: "admin-input"
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Stock",
								children: /* @__PURE__ */ jsx("input", {
									type: "number",
									min: "0",
									value: form.stock,
									onChange: (event) => update("stock", Number(event.target.value)),
									className: "admin-input"
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Weight (grams)",
								children: /* @__PURE__ */ jsx("input", {
									type: "number",
									min: "0",
									step: "0.01",
									value: form.weightGrams,
									onChange: (event) => update("weightGrams", Number(event.target.value)),
									className: "admin-input"
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Purity",
								children: /* @__PURE__ */ jsx("input", {
									value: form.purity,
									onChange: (event) => update("purity", event.target.value),
									placeholder: "925 Silver",
									className: "admin-input"
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Image URL",
								children: /* @__PURE__ */ jsx("input", {
									value: form.image,
									onChange: (event) => update("image", event.target.value),
									placeholder: "/images/product.jpg",
									className: "admin-input"
								})
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "space-y-4 rounded-2xl border border-black/5 bg-[#fbfaf7] p-4 sm:p-5",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("p", {
								className: "flex items-center gap-2 text-sm font-semibold",
								children: [/* @__PURE__ */ jsx(ImagePlus, {
									size: 17,
									className: "text-[#a17b35]"
								}), "Product Photos"]
							}), /* @__PURE__ */ jsx("p", {
								className: "mt-1 text-xs text-black/40",
								children: "Upload up to 20 photos. The first photo becomes the main product image."
							})] }),
							/* @__PURE__ */ jsxs("label", {
								className: "flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#c8a96b]/60 bg-white px-4 py-5 text-sm transition hover:bg-[#fbf7ed]",
								children: [
									/* @__PURE__ */ jsx(ImagePlus, {
										size: 18,
										className: "text-[#a17b35]"
									}),
									"Choose photos",
									/* @__PURE__ */ jsx("input", {
										type: "file",
										accept: "image/*",
										multiple: true,
										className: "hidden",
										onChange: (event) => {
											addImages(event.target.files);
											event.currentTarget.value = "";
										}
									})
								]
							}),
							(form.gallery ?? []).length > 0 && /* @__PURE__ */ jsx("div", {
								className: "grid grid-cols-2 gap-3 sm:grid-cols-3",
								children: (form.gallery ?? []).map((image, index) => /* @__PURE__ */ jsxs("div", {
									className: "group relative overflow-hidden rounded-xl border border-black/10 bg-white",
									children: [
										/* @__PURE__ */ jsx("img", {
											src: image,
											alt: `${form.name || "Product"} photo ${index + 1}`,
											className: "aspect-square w-full object-cover"
										}),
										index === 0 && /* @__PURE__ */ jsx("span", {
											className: "absolute left-2 top-2 rounded-full bg-[#171513]/85 px-2 py-1 text-[9px] uppercase tracking-wider text-white",
											children: "Main"
										}),
										/* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => removeImage(index),
											className: "absolute right-2 top-2 rounded-lg bg-white/90 p-2 text-red-600 shadow-sm transition hover:bg-white",
											"aria-label": `Remove photo ${index + 1}`,
											children: /* @__PURE__ */ jsx(Trash2, { size: 14 })
										})
									]
								}, `${image.slice(0, 20)}-${index}`))
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Main Image URL (optional)",
								children: /* @__PURE__ */ jsx("input", {
									value: form.image,
									onChange: (event) => update("image", event.target.value),
									placeholder: "https://... or /images/product.jpg",
									className: "admin-input"
								})
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "space-y-4 rounded-2xl border border-black/5 bg-[#fbfaf7] p-4 sm:p-5",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("p", {
								className: "flex items-center gap-2 text-sm font-semibold",
								children: [/* @__PURE__ */ jsx(Video, {
									size: 17,
									className: "text-[#a17b35]"
								}), "Product Video"]
							}), /* @__PURE__ */ jsx("p", {
								className: "mt-1 text-xs text-black/40",
								children: "Add a video URL, or upload a small video for local testing."
							})] }),
							/* @__PURE__ */ jsx(Field, {
								label: "Video URL",
								children: /* @__PURE__ */ jsx("input", {
									value: form.video.startsWith("data:") ? "" : form.video,
									onChange: (event) => update("video", event.target.value),
									placeholder: "https://cdn.example.com/product-video.mp4",
									className: "admin-input"
								})
							}),
							/* @__PURE__ */ jsxs("label", {
								className: "flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#c8a96b]/60 bg-white px-4 py-5 text-sm transition hover:bg-[#fbf7ed]",
								children: [
									/* @__PURE__ */ jsx(Video, {
										size: 18,
										className: "text-[#a17b35]"
									}),
									"Upload small video",
									/* @__PURE__ */ jsx("input", {
										type: "file",
										accept: "video/*",
										className: "hidden",
										onChange: (event) => {
											handleVideoFile(event.target.files?.[0]);
											event.currentTarget.value = "";
										}
									})
								]
							}),
							form.video && /* @__PURE__ */ jsx("div", {
								className: "overflow-hidden rounded-xl border border-black/10 bg-black",
								children: /* @__PURE__ */ jsx("video", {
									src: form.video,
									controls: true,
									className: "max-h-72 w-full"
								})
							})
						]
					}),
					/* @__PURE__ */ jsx(Field, {
						label: "Description",
						children: /* @__PURE__ */ jsx("textarea", {
							value: form.description,
							onChange: (event) => update("description", event.target.value),
							placeholder: "Describe the jewellery product...",
							rows: 4,
							className: "admin-input resize-none py-3"
						})
					}),
					/* @__PURE__ */ jsx(Field, {
						label: "Slug",
						children: /* @__PURE__ */ jsx("input", {
							value: form.slug,
							onChange: (event) => update("slug", createSlug(event.target.value)),
							placeholder: "silver-rose-ring",
							className: "admin-input"
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ jsxs("label", {
							className: "flex cursor-pointer items-center gap-3 rounded-xl border border-black/10 p-4",
							children: [/* @__PURE__ */ jsx("input", {
								type: "checkbox",
								checked: form.published,
								onChange: (event) => update("published", event.target.checked),
								className: "h-4 w-4 accent-[#a17b35]"
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
								className: "text-sm font-medium",
								children: "Published"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-black/40",
								children: "Show this product in the store."
							})] })]
						}), /* @__PURE__ */ jsxs("label", {
							className: "flex cursor-pointer items-center gap-3 rounded-xl border border-black/10 p-4",
							children: [/* @__PURE__ */ jsx("input", {
								type: "checkbox",
								checked: form.featured,
								onChange: (event) => update("featured", event.target.checked),
								className: "h-4 w-4 accent-[#a17b35]"
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
								className: "text-sm font-medium",
								children: "Featured Product"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-black/40",
								children: "Highlight this product on the store."
							})] })]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col-reverse gap-3 border-t border-black/5 pt-5 sm:flex-row sm:justify-end",
						children: [/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: onClose,
							className: "rounded-xl border border-black/10 px-5 py-3 text-sm font-medium transition hover:bg-black/5",
							children: "Cancel"
						}), /* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: savingForm,
							className: "rounded-xl bg-[#171513] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#2a2724] disabled:cursor-not-allowed disabled:opacity-50",
							children: savingForm ? "Saving..." : product ? "Save Changes" : "Create Product"
						})]
					})
				]
			})]
		})
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ jsxs("label", {
		className: "block",
		children: [/* @__PURE__ */ jsx("span", {
			className: "mb-2 block text-xs font-medium uppercase tracking-wider text-black/50",
			children: label
		}), children]
	});
}
function MiniStat({ label, value }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-2xl border border-black/5 bg-white p-4",
		children: [/* @__PURE__ */ jsx("p", {
			className: "text-xs text-black/40",
			children: label
		}), /* @__PURE__ */ jsx("p", {
			className: "mt-1 font-serif text-2xl",
			children: value
		})]
	});
}
function StockBadge({ stock }) {
	if (stock === 0) return /* @__PURE__ */ jsx("span", {
		className: "rounded-full bg-red-50 px-3 py-1 text-[11px] font-medium text-red-700",
		children: "Out of stock"
	});
	if (stock <= 5) return /* @__PURE__ */ jsxs("span", {
		className: "rounded-full bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-700",
		children: [stock, " left"]
	});
	return /* @__PURE__ */ jsxs("span", {
		className: "rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700",
		children: [stock, " in stock"]
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
export { AdminProducts as component };
var supabase, STORAGE_KEY, STORAGE_BUCKET, MAX_GALLERY_IMAGES, MAX_IMAGE_BYTES, MAX_VIDEO_BYTES, rowToProduct, productToRow, categories, emptyProduct;
