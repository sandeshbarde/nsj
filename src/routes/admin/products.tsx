import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import {
  Archive,
  ChevronLeft,
  Edit3,
  Eye,
  Gem,
  ImagePlus,
  Video,

  Menu,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";

type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  mrp: number;
  stock: number;
  image: string;
  gallery: string[];
  video: string;
  description: string;
  purity: string;
  weightGrams: number;
  featured: boolean;
  published: boolean;
};

const STORAGE_KEY = "nsj_admin_products";
const STORAGE_BUCKET = "product-media";
const MAX_GALLERY_IMAGES = 20;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 25 * 1024 * 1024;

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number | null;
  mrp: number | null;
  stock: number | null;
  image: string | null;
  gallery: string[] | null;
  video: string | null;
  description: string | null;
  purity: string | null;
  weight_grams: number | null;
  featured: boolean | null;
  published: boolean | null;
};

const rowToProduct = (row: ProductRow): Product => {
  const gallery = Array.isArray(row.gallery)
    ? row.gallery.filter((value): value is string => typeof value === "string" && value.length > 0)
    : row.image
      ? [row.image]
      : [];

  return {
    id: row.id,
    name: row.name ?? "",
    slug: row.slug ?? "",
    category: row.category ?? "Rings",
    price: Number(row.price ?? 0),
    mrp: Number(row.mrp ?? 0),
    stock: Number(row.stock ?? 0),
    image: row.image ?? gallery[0] ?? "",
    gallery,
    video: row.video ?? "",
    description: row.description ?? "",
    purity: row.purity ?? "925 Silver",
    weightGrams: Number(row.weight_grams ?? 0),
    featured: Boolean(row.featured),
    published: row.published !== false,
  };
};

const productToRow = (product: Product) => ({
  id: product.id,
  name: product.name.trim(),
  slug: product.slug.trim(),
  category: product.category,
  price: product.price,
  mrp: product.mrp,
  stock: product.stock,
  image: product.image || product.gallery[0] || null,
  gallery: product.gallery ?? [],
  video: product.video || null,
  description: product.description || null,
  purity: product.purity || null,
  weight_grams: product.weightGrams,
  featured: product.featured,
  published: product.published,
});

function readLegacyProducts(): Product[] {
  if (typeof window === "undefined") return [];

  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];

  try {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    return parsed.map((item): Product => {
      const gallery = Array.isArray(item.gallery)
        ? item.gallery.filter((value: unknown): value is string => typeof value === "string")
        : item.image
          ? [String(item.image)]
          : [];

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
        published: item.published !== false,
      };
    });
  } catch {
    return [];
  }
}

const defaultProducts: Product[] = [
  {
    id: "NSJ-001",
    name: "Silver Rose Ring",
    slug: "silver-rose-ring",
    category: "Rings",
    price: 1499,
    mrp: 1999,
    stock: 25,
    image: "",
    gallery: [],
    video: "",
    description: "Elegant 925 sterling silver rose-inspired ring.",
    purity: "925 Silver",
    weightGrams: 4.2,
    featured: true,
    published: true,
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
    gallery: [],
    video: "",
    description: "Classic silver chain designed for everyday elegance.",
    purity: "925 Silver",
    weightGrams: 8.5,
    featured: false,
    published: true,
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
    gallery: [],
    video: "",
    description: "Elegant pearl drop earrings with a refined silver finish.",
    purity: "925 Silver",
    weightGrams: 3.8,
    featured: true,
    published: true,
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
    gallery: [],
    video: "",
    description: "Minimal silver bracelet with a premium polished finish.",
    purity: "925 Silver",
    weightGrams: 6.2,
    featured: false,
    published: true,
  },
];

const categories = [
  "All",
  "Rings",
  "Earrings",
  "Necklaces",
  "Bracelets",
  "Bangles",
  "Chains",
  "Pendants",
  "Anklets",
];

const emptyProduct: Product = {
  id: "",
  name: "",
  slug: "",
  category: "Rings",
  price: 0,
  mrp: 0,
  stock: 0,
  image: "",
  gallery: [],
  video: "",
  description: "",
  purity: "925 Silver",
  weightGrams: 0,
  featured: false,
  published: true,
};

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadProducts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Load products error:", error);
      alert(`Could not load products from Supabase.\n\n${error.message}`);
      setProducts([]);
      setLoading(false);
      return;
    }

    let dbProducts = ((data ?? []) as ProductRow[]).map(rowToProduct);

    // One-time migration from the old localStorage product list.
    if (dbProducts.length === 0) {
      const legacyProducts = readLegacyProducts();

      if (legacyProducts.length > 0) {
        const { data: migrated, error: migrationError } = await supabase
          .from("products")
          .upsert(legacyProducts.map(productToRow), { onConflict: "id" })
          .select("*");

        if (!migrationError && migrated) {
          dbProducts = (migrated as ProductRow[]).map(rowToProduct);
          localStorage.removeItem(STORAGE_KEY);
        } else if (migrationError) {
          console.error("Product migration error:", migrationError);
        }
      }
    }

    setProducts(dbProducts);
    setLoading(false);
  };

  useEffect(() => {
    void loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    const product = products.find((item) => item.id === id);
    if (!product) return;

    const confirmed = window.confirm(
      `Delete "${product.name}"? This action cannot be undone.`,
    );
    if (!confirmed) return;

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

  const togglePublished = async (id: string) => {
    const product = products.find((item) => item.id === id);
    if (!product) return;

    const published = !product.published;
    setProducts((current) =>
      current.map((item) => (item.id === id ? { ...item, published } : item)),
    );

    const { error } = await supabase
      .from("products")
      .update({ published })
      .eq("id", id);

    if (error) {
      console.error("Publish update error:", error);
      setProducts((current) =>
        current.map((item) =>
          item.id === id ? { ...item, published: product.published } : item,
        ),
      );
      alert(`Could not update product status.\n\n${error.message}`);
    }
  };

  const toggleFeatured = async (id: string) => {
    const product = products.find((item) => item.id === id);
    if (!product) return;

    const featured = !product.featured;
    setProducts((current) =>
      current.map((item) => (item.id === id ? { ...item, featured } : item)),
    );

    const { error } = await supabase
      .from("products")
      .update({ featured })
      .eq("id", id);

    if (error) {
      console.error("Featured update error:", error);
      setProducts((current) =>
        current.map((item) =>
          item.id === id ? { ...item, featured: product.featured } : item,
        ),
      );
      alert(`Could not update featured status.\n\n${error.message}`);
    }
  };

  const createSlug = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.id.toLowerCase().includes(query);

      const matchesCategory =
        category === "All" || product.category === category;

      const matchesStock =
        stockFilter === "All" ||
        (stockFilter === "In Stock" && product.stock > 5) ||
        (stockFilter === "Low Stock" &&
          product.stock > 0 &&
          product.stock <= 5) ||
        (stockFilter === "Out of Stock" && product.stock === 0);

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, search, category, stockFilter]);

  const openAddForm = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleSaveProduct = async (product: Product): Promise<boolean> => {
    setSaving(true);

    const { data, error } = await supabase
      .from("products")
      .upsert(productToRow(product), { onConflict: "id" })
      .select("*")
      .single();

    setSaving(false);

    if (error) {
      console.error("Save product error:", error);
      alert(
        `Could not save product.\n\n${error.message}\n\nCheck your Supabase table, RLS policies and environment variables.`,
      );
      return false;
    }

    const savedProduct = rowToProduct(data as ProductRow);

    setProducts((current) => {
      const exists = current.some((item) => item.id === savedProduct.id);
      return exists
        ? current.map((item) =>
            item.id === savedProduct.id ? savedProduct : item,
          )
        : [savedProduct, ...current];
    });

    setShowForm(false);
    setEditingProduct(null);
    return true;
  };

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-[#171513]">
      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-black/5 bg-[#f7f4ef]/95 px-5 backdrop-blur-md lg:hidden">
        <button
          type="button"
          onClick={() => setMobileMenu(true)}
          className="rounded-xl border border-black/10 bg-white p-2.5"
        >
          <Menu size={20} />
        </button>

        <p className="font-serif text-xl tracking-[0.15em]">NSJ</p>

        <Link to="/admin/dashboard" className="text-sm">
          Dashboard
        </Link>
      </header>

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-72 flex-col bg-[#171513] text-white lg:flex">
        <div className="flex h-20 items-center border-b border-white/10 px-7">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c8a96b]/60">
              <span className="font-serif text-sm text-[#d8b875]">NSJ</span>
            </div>

            <div>
              <p className="font-serif text-lg tracking-[0.18em]">NSJ</p>
              <p className="text-[8px] uppercase tracking-[0.32em] text-[#c8a96b]">
                Admin
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6">
          <SidebarLink
            to="/admin/dashboard"
            icon={<Gem size={18} />}
            label="Dashboard"
          />

          <SidebarLink
            to="/admin/products"
            icon={<Gem size={18} />}
            label="Products"
            active
          />

          <SidebarLink
            to="/admin/orders"
            icon={<Archive size={18} />}
            label="Orders"
          />

          <SidebarLink
            to="/admin/inventory"
            icon={<Archive size={18} />}
            label="Inventory"
          />
        </nav>

        <div className="border-t border-white/10 p-5">
          <Link
            to="/"
            className="text-sm text-white/50 transition hover:text-white"
          >
            ← View Store
          </Link>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenu && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileMenu(false)}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          />

          <aside className="fixed left-0 top-0 z-50 h-screen w-72 bg-[#171513] p-5 text-white lg:hidden">
            <div className="mb-8 flex items-center justify-between">
              <p className="font-serif text-2xl tracking-[0.15em]">NSJ</p>

              <button
                type="button"
                onClick={() => setMobileMenu(false)}
                className="rounded-lg p-2 hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="space-y-1">
              <MobileLink
                to="/admin/dashboard"
                label="Dashboard"
                onClick={() => setMobileMenu(false)}
              />

              <MobileLink
                to="/admin/products"
                label="Products"
                onClick={() => setMobileMenu(false)}
                active
              />

              <MobileLink
                to="/admin/orders"
                label="Orders"
                onClick={() => setMobileMenu(false)}
              />

              <MobileLink
                to="/admin/inventory"
                label="Inventory"
                onClick={() => setMobileMenu(false)}
              />
            </nav>
          </aside>
        </>
      )}

      {/* Main */}
      <main className="lg:pl-72">
        <div className="p-5 sm:p-8">
          {/* Page Header */}
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#b08a43]">
                Store Management
              </p>

              <h1 className="mt-1 font-serif text-3xl sm:text-4xl">
                Products
              </h1>

              <p className="mt-2 text-sm text-black/45">
                Manage your NSJ jewellery collection.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddForm}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#171513] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#2a2724] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={18} />
              Add Product
            </button>
          </div>

          {/* Stats */}
          <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MiniStat label="Total Products" value={products.length} />

            <MiniStat
              label="Published"
              value={products.filter((p) => p.published).length}
            />

            <MiniStat
              label="Low Stock"
              value={
                products.filter((p) => p.stock > 0 && p.stock <= 5).length
              }
            />

            <MiniStat
              label="Out of Stock"
              value={products.filter((p) => p.stock === 0).length}
            />
          </div>

          {/* Filters */}
          <div className="mb-5 rounded-2xl border border-black/5 bg-white p-4">
            <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
              {/* Search */}
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
                />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search products..."
                  className="h-11 w-full rounded-xl border border-black/10 bg-[#fafafa] pl-11 pr-4 text-sm outline-none transition focus:border-[#b08a43]"
                />
              </div>

              {/* Category */}
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="h-11 rounded-xl border border-black/10 bg-[#fafafa] px-4 text-sm outline-none focus:border-[#b08a43]"
              >
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              {/* Stock */}
              <select
                value={stockFilter}
                onChange={(event) => setStockFilter(event.target.value)}
                className="h-11 rounded-xl border border-black/10 bg-[#fafafa] px-4 text-sm outline-none focus:border-[#b08a43]"
              >
                <option>All</option>
                <option>In Stock</option>
                <option>Low Stock</option>
                <option>Out of Stock</option>
              </select>
            </div>
          </div>

          {/* Products Table */}
          <div className="overflow-hidden rounded-2xl border border-black/5 bg-white">
            <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
              <div>
                <h2 className="font-serif text-xl">All Products</h2>

                <p className="mt-1 text-xs text-black/40">
                  Showing {filteredProducts.length} of {products.length}{" "}
                  products
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex min-h-80 items-center justify-center px-6 text-center">
                <div>
                  <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#c8a96b]/30 border-t-[#a17b35]" />
                  <p className="mt-4 text-sm text-black/45">Loading products from Supabase...</p>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f7f1e4] text-[#a17b35]">
                  <Gem size={25} />
                </div>

                <h3 className="mt-4 font-serif text-xl">
                  No products found
                </h3>

                <p className="mt-2 max-w-sm text-sm text-black/45">
                  Try changing your search or filters, or add a new product.
                </p>

                <button
                  type="button"
                  onClick={openAddForm}
                  className="mt-5 rounded-xl bg-[#171513] px-5 py-3 text-sm text-white"
                >
                  Add Product
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead>
                    <tr className="border-b border-black/5 bg-[#faf9f6] text-left text-[10px] uppercase tracking-wider text-black/35">
                      <th className="px-5 py-4 font-medium">Product</th>
                      <th className="px-5 py-4 font-medium">Category</th>
                      <th className="px-5 py-4 font-medium">Price</th>
                      <th className="px-5 py-4 font-medium">Stock</th>
                      <th className="px-5 py-4 font-medium">Status</th>
                      <th className="px-5 py-4 font-medium">Featured</th>
                      <th className="px-5 py-4 text-right font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-black/5 last:border-0"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f3eee5]">
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Gem
                                  size={19}
                                  className="text-[#b08a43]"
                                />
                              )}
                            </div>

                            <div>
                              <p className="text-sm font-medium">
                                {product.name}
                              </p>

                              <p className="mt-1 text-[11px] text-black/35">
                                {product.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-black/55">
                          {product.category}
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm font-medium">
                            ₹{product.price.toLocaleString("en-IN")}
                          </p>

                          {product.mrp > product.price && (
                            <p className="text-xs text-black/30 line-through">
                              ₹{product.mrp.toLocaleString("en-IN")}
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <StockBadge stock={product.stock} />
                        </td>

                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() => void togglePublished(product.id)}
                            className={`rounded-full px-3 py-1 text-[11px] font-medium ${
                              product.published
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {product.published ? "Published" : "Draft"}
                          </button>
                        </td>

                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() => void toggleFeatured(product.id)}
                            aria-label={
                              product.featured
                                ? "Remove featured"
                                : "Make featured"
                            }
                            className={`rounded-lg p-2 transition ${
                              product.featured
                                ? "bg-[#f7f1e4] text-[#a17b35]"
                                : "text-black/25 hover:bg-black/5"
                            }`}
                          >
                            <Star
                              size={17}
                              fill={
                                product.featured ? "currentColor" : "none"
                              }
                            />
                          </button>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => openEditForm(product)}
                              title="Edit product"
                              className="rounded-lg p-2 text-black/40 transition hover:bg-black/5 hover:text-black"
                            >
                              <Edit3 size={17} />
                            </button>

                            <button
                              type="button"
                              onClick={() => void handleDelete(product.id)}
                              disabled={saving}
                              title="Delete product"
                              className="rounded-lg p-2 text-black/40 transition hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Bottom */}
          <div className="mt-5 flex items-center justify-between text-xs text-black/35">
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-1 transition hover:text-black"
            >
              <ChevronLeft size={14} />
              Dashboard
            </Link>

            <span>
              NSJ Jewellery Admin
            </span>

            <span className="inline-flex items-center gap-1">
              <Eye size={14} />
              Local Management
            </span>
          </div>
        </div>
      </main>

      {/* Product Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
}


function createSafeFileName(fileName: string) {
  const base = fileName
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return base || "media";
}

async function resizeImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      const maxSide = 1800;
      const scale = Math.min(1, maxSide / Math.max(image.width, image.height));

      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));

      const context = canvas.getContext("2d");
      if (!context) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Unable to process image."));
        return;
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(objectUrl);
          if (!blob) {
            reject(new Error("Unable to create image file."));
            return;
          }
          resolve(blob);
        },
        "image/jpeg",
        0.84,
      );
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Unable to process image."));
    };

    image.src = objectUrl;
  });
}

async function uploadMedia(
  file: File,
  productId: string,
  kind: "image" | "video",
): Promise<string> {
  const isImage = kind === "image";
  const body = isImage ? await resizeImage(file) : file;
  const extension = isImage ? "jpg" : (file.name.split(".").pop() || "mp4").toLowerCase();
  const unique =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  const path = `products/${productId}/${Date.now()}-${unique}-${createSafeFileName(file.name)}.${extension}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, body, {
      cacheControl: "3600",
      contentType: isImage ? "image/jpeg" : file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(path);

  if (!data.publicUrl) {
    throw new Error("Could not create a public URL for the uploaded file.");
  }

  return data.publicUrl;
}

function ProductForm({
  product,
  onClose,
  onSave,
}: {
  product: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
}) {
  const [form, setForm] = useState<Product>(
    product ?? {
      ...emptyProduct,
      id: `NSJ-${Date.now().toString().slice(-6)}`,
    },
  );

  const update = <K extends keyof Product>(
    key: K,
    value: Product[K],
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const createSlug = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const [savingForm, setSavingForm] = useState(false);

  const addImages = async (files: FileList | null) => {
    if (!files?.length) return;

    const currentCount = form.gallery?.length ?? 0;
    const remaining = MAX_GALLERY_IMAGES - currentCount;

    if (remaining <= 0) {
      alert(`You can upload up to ${MAX_GALLERY_IMAGES} photos per product.`);
      return;
    }

    try {
      const selectedFiles = Array.from(files).slice(0, remaining);
      const nextImages: string[] = [];

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

      if (nextImages.length > 0) {
        setForm((current) => {
          const gallery = [...(current.gallery ?? []), ...nextImages].slice(
            0,
            MAX_GALLERY_IMAGES,
          );

          return {
            ...current,
            gallery,
            image: gallery[0] ?? current.image,
          };
        });
      }
    } catch (error) {
      console.error("Image upload error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Could not upload image.",
      );
    }
  };

  const removeImage = (index: number) => {
    setForm((current) => {
      const gallery = (current.gallery ?? []).filter((_, i) => i !== index);

      return {
        ...current,
        gallery,
        image: gallery[0] ?? "",
      };
    });
  };

  const handleVideoFile = async (file: File | undefined) => {
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
        video: videoUrl,
      }));
    } catch (error) {
      console.error("Video upload error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Could not upload video.",
      );
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
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
    const finalProduct: Product = {
      ...form,
      name: form.name.trim(),
      slug: form.slug || createSlug(form.name),
      image: form.image || gallery[0] || "",
      gallery,
    };

    setSavingForm(true);
    try {
      await onSave(finalProduct);
    } finally {
      setSavingForm(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-8">
      <div className="my-auto w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-black/5 px-5 py-5 sm:px-7">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#b08a43]">
              Product Management
            </p>

            <div className="mb-3 rounded-lg bg-[#fbf7ed] px-3 py-2 text-[11px] leading-5 text-[#7b602d]">
              Photos are uploaded to Supabase Storage and their URLs are saved in your products database.
            </div>

            <h2 className="mt-1 font-serif text-2xl">
              {product ? "Edit Product" : "Add Product"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-black/40 hover:bg-black/5 hover:text-black"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-6 p-5 sm:p-7">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Product Name">
              <input
                value={form.name}
                onChange={(event) => {
                  const name = event.target.value;

                  setForm((current) => ({
                    ...current,
                    name,
                    slug: current.slug || createSlug(name),
                  }));
                }}
                placeholder="Silver Rose Ring"
                required
                className="admin-input"
              />
            </Field>

            <Field label="Category">
              <select
                value={form.category}
                onChange={(event) =>
                  update("category", event.target.value)
                }
                className="admin-input"
              >
                {categories
                  .filter((item) => item !== "All")
                  .map((item) => (
                    <option key={item}>{item}</option>
                  ))}
              </select>
            </Field>

            <Field label="Price">
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(event) =>
                  update("price", Number(event.target.value))
                }
                className="admin-input"
              />
            </Field>

            <Field label="MRP">
              <input
                type="number"
                min="0"
                value={form.mrp}
                onChange={(event) =>
                  update("mrp", Number(event.target.value))
                }
                className="admin-input"
              />
            </Field>

            <Field label="Stock">
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(event) =>
                  update("stock", Number(event.target.value))
                }
                className="admin-input"
              />
            </Field>

            <Field label="Weight (grams)">
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.weightGrams}
                onChange={(event) =>
                  update("weightGrams", Number(event.target.value))
                }
                className="admin-input"
              />
            </Field>

            <Field label="Purity">
              <input
                value={form.purity}
                onChange={(event) =>
                  update("purity", event.target.value)
                }
                placeholder="925 Silver"
                className="admin-input"
              />
            </Field>

            <Field label="Image URL">
              <input
                value={form.image}
                onChange={(event) =>
                  update("image", event.target.value)
                }
                placeholder="/images/product.jpg"
                className="admin-input"
              />
            </Field>
          </div>


          {/* Product Media */}
          <div className="space-y-4 rounded-2xl border border-black/5 bg-[#fbfaf7] p-4 sm:p-5">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold">
                <ImagePlus size={17} className="text-[#a17b35]" />
                Product Photos
              </p>
              <p className="mt-1 text-xs text-black/40">
                Upload up to 20 photos. The first photo becomes the main product image.
              </p>
            </div>

            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#c8a96b]/60 bg-white px-4 py-5 text-sm transition hover:bg-[#fbf7ed]">
              <ImagePlus size={18} className="text-[#a17b35]" />
              Choose photos
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(event) => {
                  void addImages(event.target.files);
                  event.currentTarget.value = "";
                }}
              />
            </label>

            {(form.gallery ?? []).length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {(form.gallery ?? []).map((image, index) => (
                  <div
                    key={`${image.slice(0, 20)}-${index}`}
                    className="group relative overflow-hidden rounded-xl border border-black/10 bg-white"
                  >
                    <img
                      src={image}
                      alt={`${form.name || "Product"} photo ${index + 1}`}
                      className="aspect-square w-full object-cover"
                    />

                    {index === 0 && (
                      <span className="absolute left-2 top-2 rounded-full bg-[#171513]/85 px-2 py-1 text-[9px] uppercase tracking-wider text-white">
                        Main
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute right-2 top-2 rounded-lg bg-white/90 p-2 text-red-600 shadow-sm transition hover:bg-white"
                      aria-label={`Remove photo ${index + 1}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <Field label="Main Image URL (optional)">
              <input
                value={form.image}
                onChange={(event) => update("image", event.target.value)}
                placeholder="https://... or /images/product.jpg"
                className="admin-input"
              />
            </Field>
          </div>

          {/* Product Video */}
          <div className="space-y-4 rounded-2xl border border-black/5 bg-[#fbfaf7] p-4 sm:p-5">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Video size={17} className="text-[#a17b35]" />
                Product Video
              </p>
              <p className="mt-1 text-xs text-black/40">
                Add a video URL, or upload a small video for local testing.
              </p>
            </div>

            <Field label="Video URL">
              <input
                value={form.video.startsWith("data:") ? "" : form.video}
                onChange={(event) => update("video", event.target.value)}
                placeholder="https://cdn.example.com/product-video.mp4"
                className="admin-input"
              />
            </Field>

            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#c8a96b]/60 bg-white px-4 py-5 text-sm transition hover:bg-[#fbf7ed]">
              <Video size={18} className="text-[#a17b35]" />
              Upload small video
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(event) => {
                  void handleVideoFile(event.target.files?.[0]);
                  event.currentTarget.value = "";
                }}
              />
            </label>

            {form.video && (
              <div className="overflow-hidden rounded-xl border border-black/10 bg-black">
                <video
                  src={form.video}
                  controls
                  className="max-h-72 w-full"
                />
              </div>
            )}
          </div>

          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(event) =>
                update("description", event.target.value)
              }
              placeholder="Describe the jewellery product..."
              rows={4}
              className="admin-input resize-none py-3"
            />
          </Field>

          <Field label="Slug">
            <input
              value={form.slug}
              onChange={(event) =>
                update("slug", createSlug(event.target.value))
              }
              placeholder="silver-rose-ring"
              className="admin-input"
            />
          </Field>

          {/* Options */}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-black/10 p-4">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(event) =>
                  update("published", event.target.checked)
                }
                className="h-4 w-4 accent-[#a17b35]"
              />

              <div>
                <p className="text-sm font-medium">Published</p>
                <p className="text-xs text-black/40">
                  Show this product in the store.
                </p>
              </div>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-black/10 p-4">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) =>
                  update("featured", event.target.checked)
                }
                className="h-4 w-4 accent-[#a17b35]"
              />

              <div>
                <p className="text-sm font-medium">Featured Product</p>
                <p className="text-xs text-black/40">
                  Highlight this product on the store.
                </p>
              </div>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse gap-3 border-t border-black/5 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-black/10 px-5 py-3 text-sm font-medium transition hover:bg-black/5"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={savingForm}
              className="rounded-xl bg-[#171513] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#2a2724] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {savingForm
                ? "Saving..."
                : product
                  ? "Save Changes"
                  : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-black/50">
        {label}
      </span>
      {children}
    </label>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-4">
      <p className="text-xs text-black/40">{label}</p>
      <p className="mt-1 font-serif text-2xl">{value}</p>
    </div>
  );
}

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-medium text-red-700">
        Out of stock
      </span>
    );
  }

  if (stock <= 5) {
    return (
      <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-700">
        {stock} left
      </span>
    );
  }

  return (
    <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
      {stock} in stock
    </span>
  );
}

function SidebarLink({
  to,
  icon,
  label,
  active = false,
}: {
  to: string;
  icon: ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`mb-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
        active
          ? "bg-[#c8a96b]/15 text-[#e4c98d]"
          : "text-white/55 hover:bg-white/10 hover:text-white"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

function MobileLink({
  to,
  label,
  active = false,
  onClick,
}: {
  to: string;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`block rounded-xl px-4 py-3 text-sm ${
        active
          ? "bg-[#c8a96b]/15 text-[#e4c98d]"
          : "text-white/55 hover:bg-white/10 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
}