import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Archive,
  CheckCircle2,
  ChevronLeft,
  Gem,
  Menu,
  Package,
  Plus,
  Search,
  X,
  XCircle,
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
  description: string;
  purity: string;
  weightGrams: number;
  featured: boolean;
  published: boolean;
};

const PRODUCT_STORAGE_KEY = "nsj_admin_products";

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

type StockFilter = "All" | "In Stock" | "Low Stock" | "Out of Stock";

export const Route = createFileRoute("/admin/inventory")({
  component: AdminInventory,
});

function AdminInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [stockFilter, setStockFilter] = useState<StockFilter>("All");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    const saved = localStorage.getItem(PRODUCT_STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setProducts(parsed);
          return;
        }
      } catch {
        // Use defaults below.
      }
    }

    setProducts(defaultProducts);
    localStorage.setItem(
      PRODUCT_STORAGE_KEY,
      JSON.stringify(defaultProducts),
    );
  };

  const saveProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);

    localStorage.setItem(
      PRODUCT_STORAGE_KEY,
      JSON.stringify(updatedProducts),
    );
  };

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

  const totalProducts = products.length;

  const totalUnits = products.reduce(
    (total, product) => total + product.stock,
    0,
  );

  const inStock = products.filter((product) => product.stock > 5).length;

  const lowStock = products.filter(
    (product) => product.stock > 0 && product.stock <= 5,
  ).length;

  const outOfStock = products.filter(
    (product) => product.stock === 0,
  ).length;

  const updateStock = (id: string, newStock: number) => {
    const stock = Math.max(0, Math.floor(newStock));

    const updatedProducts = products.map((product) =>
      product.id === id
        ? {
            ...product,
            stock,
          }
        : product,
    );

    saveProducts(updatedProducts);

    setEditingProduct(null);
  };

  const increaseStock = (product: Product, amount = 1) => {
    updateStock(product.id, product.stock + amount);
  };

  const decreaseStock = (product: Product, amount = 1) => {
    updateStock(product.id, product.stock - amount);
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

        <Link
          to="/admin/dashboard"
          className="text-sm"
        >
          Dashboard
        </Link>
      </header>

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-72 flex-col bg-[#171513] text-white lg:flex">
        <div className="flex h-20 items-center border-b border-white/10 px-7">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c8a96b]/60">
              <span className="font-serif text-sm text-[#d8b875]">
                NSJ
              </span>
            </div>

            <div>
              <p className="font-serif text-lg tracking-[0.18em]">
                NSJ
              </p>

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
          />

          <SidebarLink
            to="/admin/orders"
            icon={<Archive size={18} />}
            label="Orders"
          />

          <SidebarLink
            to="/admin/inventory"
            icon={<Package size={18} />}
            label="Inventory"
            active
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
              <p className="font-serif text-2xl tracking-[0.15em]">
                NSJ
              </p>

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
              />

              <MobileLink
                to="/admin/orders"
                label="Orders"
                onClick={() => setMobileMenu(false)}
              />

              <MobileLink
                to="/admin/inventory"
                label="Inventory"
                active
                onClick={() => setMobileMenu(false)}
              />

            </nav>
          </aside>
        </>
      )}

      {/* Main */}
      <main className="lg:pl-72">
        <div className="p-5 sm:p-8">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#b08a43]">
                Store Management
              </p>

              <h1 className="mt-1 font-serif text-3xl sm:text-4xl">
                Inventory
              </h1>

              <p className="mt-2 text-sm text-black/45">
                Monitor and update your jewellery stock.
              </p>
            </div>

            <Link
              to="/admin/products"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#171513] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#2a2724]"
            >
              <Plus size={18} />
              Manage Products
            </Link>
          </div>

          {/* Inventory Stats */}
          <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <InventoryStat
              title="Total Products"
              value={totalProducts}
              icon={<Gem size={20} />}
              description="Products in catalogue"
            />

            <InventoryStat
              title="Total Units"
              value={totalUnits}
              icon={<Package size={20} />}
              description="Available stock units"
            />

            <InventoryStat
              title="Low Stock"
              value={lowStock}
              icon={<AlertTriangle size={20} />}
              description="5 or fewer units"
              warning
            />

            <InventoryStat
              title="Out of Stock"
              value={outOfStock}
              icon={<XCircle size={20} />}
              description="Needs restocking"
              danger
            />
          </section>

          {/* Stock Health */}
          <section className="mb-7 rounded-2xl border border-black/5 bg-white p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-serif text-xl">
                  Inventory Health
                </h2>

                <p className="mt-1 text-xs text-black/40">
                  {inStock} products have healthy stock levels.
                </p>
              </div>

              <StockHealth
                total={totalProducts}
                healthy={inStock}
              />
            </div>
          </section>

          {/* Filters */}
          <section className="mb-5 rounded-2xl border border-black/5 bg-white p-4">
            <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
                />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search product, category or ID..."
                  className="h-11 w-full rounded-xl border border-black/10 bg-[#fafafa] pl-11 pr-4 text-sm outline-none transition focus:border-[#b08a43]"
                />
              </div>

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="h-11 rounded-xl border border-black/10 bg-[#fafafa] px-4 text-sm outline-none focus:border-[#b08a43]"
              >
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              <select
                value={stockFilter}
                onChange={(event) =>
                  setStockFilter(
                    event.target.value as StockFilter,
                  )
                }
                className="h-11 rounded-xl border border-black/10 bg-[#fafafa] px-4 text-sm outline-none focus:border-[#b08a43]"
              >
                <option>All</option>
                <option>In Stock</option>
                <option>Low Stock</option>
                <option>Out of Stock</option>
              </select>
            </div>
          </section>

          {/* Inventory Table */}
          <section className="overflow-hidden rounded-2xl border border-black/5 bg-white">
            <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
              <div>
                <h2 className="font-serif text-xl">
                  Stock Management
                </h2>

                <p className="mt-1 text-xs text-black/40">
                  Showing {filteredProducts.length} of {products.length}{" "}
                  products
                </p>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f7f1e4] text-[#a17b35]">
                  <Package size={25} />
                </div>

                <h3 className="mt-4 font-serif text-xl">
                  No products found
                </h3>

                <p className="mt-2 text-sm text-black/45">
                  Try changing your search or stock filter.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[950px]">
                  <thead>
                    <tr className="border-b border-black/5 bg-[#faf9f6] text-left text-[10px] uppercase tracking-wider text-black/35">
                      <th className="px-5 py-4 font-medium">
                        Product
                      </th>

                      <th className="px-5 py-4 font-medium">
                        Category
                      </th>

                      <th className="px-5 py-4 font-medium">
                        Current Stock
                      </th>

                      <th className="px-5 py-4 font-medium">
                        Stock Status
                      </th>

                      <th className="px-5 py-4 font-medium">
                        Quick Update
                      </th>

                      <th className="px-5 py-4 text-right font-medium">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-black/5 last:border-0"
                      >
                        {/* Product */}
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

                        {/* Category */}
                        <td className="px-5 py-4 text-sm text-black/55">
                          {product.category}
                        </td>

                        {/* Stock */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-serif text-xl">
                              {product.stock}
                            </span>

                            <span className="text-xs text-black/35">
                              units
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <StockStatus stock={product.stock} />
                        </td>

                        {/* Quick Update */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                decreaseStock(product, 1)
                              }
                              disabled={product.stock === 0}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 text-sm transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              −
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                increaseStock(product, 1)
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 text-sm transition hover:bg-black/5"
                            >
                              +
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                increaseStock(product, 5)
                              }
                              className="rounded-lg border border-black/10 px-2.5 py-1.5 text-[11px] transition hover:bg-black/5"
                            >
                              +5
                            </button>
                          </div>
                        </td>

                        {/* Action */}
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              setEditingProduct(product)
                            }
                            className="rounded-lg bg-[#171513] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#2a2724]"
                          >
                            Update Stock
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Bottom */}
          <div className="mt-5 flex items-center justify-between text-xs text-black/35">
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-1 transition hover:text-black"
            >
              <ChevronLeft size={14} />
              Dashboard
            </Link>

            <span>NSJ Jewellery Admin</span>

            <span className="inline-flex items-center gap-1">
              <Archive size={14} />
              Inventory Management
            </span>
          </div>
        </div>
      </main>

      {/* Update Stock Modal */}
      {editingProduct && (
        <StockModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={(stock) =>
            updateStock(editingProduct.id, stock)
          }
        />
      )}
    </div>
  );
}

function StockModal({
  product,
  onClose,
  onSave,
}: {
  product: Product;
  onClose: () => void;
  onSave: (stock: number) => void;
}) {
  const [stock, setStock] = useState(String(product.stock));

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const value = Number(stock);

    if (!Number.isFinite(value) || value < 0) {
      alert("Please enter a valid stock quantity.");
      return;
    }

    onSave(Math.floor(value));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/5 px-5 py-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#b08a43]">
              Inventory
            </p>

            <h2 className="mt-1 font-serif text-2xl">
              Update Stock
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-black/40 hover:bg-black/5"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={submit} className="p-5">
          {/* Product */}
          <div className="rounded-xl bg-[#faf9f6] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f3eee5]">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full rounded-xl object-cover"
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

                <p className="mt-1 text-xs text-black/40">
                  {product.category} · {product.id}
                </p>
              </div>
            </div>
          </div>

          {/* Stock Input */}
          <div className="mt-5">
            <label
              htmlFor="stock"
              className="mb-2 block text-xs font-medium uppercase tracking-wider text-black/50"
            >
              Stock Quantity
            </label>

            <input
              id="stock"
              type="number"
              min="0"
              value={stock}
              onChange={(event) => setStock(event.target.value)}
              autoFocus
              className="h-13 w-full rounded-xl border border-black/10 bg-white px-4 text-lg outline-none focus:border-[#b08a43] focus:ring-2 focus:ring-[#b08a43]/10"
            />
          </div>

          {/* Current Status */}
          <div className="mt-4">
            <StockStatus stock={Number(stock) || 0} />
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-black/10 px-5 py-3 text-sm font-medium transition hover:bg-black/5"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-[#171513] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#2a2724]"
            >
              Save Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InventoryStat({
  title,
  value,
  icon,
  description,
  warning = false,
  danger = false,
}: {
  title: string;
  value: number;
  icon: ReactNode;
  description: string;
  warning?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
          danger
            ? "bg-red-50 text-red-600"
            : warning
              ? "bg-amber-50 text-amber-600"
              : "bg-[#f7f1e4] text-[#a17b35]"
        }`}
      >
        {icon}
      </div>

      <p className="mt-5 text-xs text-black/40">
        {title}
      </p>

      <p className="mt-1 font-serif text-2xl">
        {value}
      </p>

      <p className="mt-1 text-[11px] text-black/30">
        {description}
      </p>
    </div>
  );
}

function StockHealth({
  total,
  healthy,
}: {
  total: number;
  healthy: number;
}) {
  const percentage =
    total === 0 ? 0 : Math.round((healthy / total) * 100);

  return (
    <div className="w-full sm:w-72">
      <div className="mb-2 flex justify-between text-xs">
        <span className="text-black/40">
          Healthy stock
        </span>

        <span className="font-medium">
          {percentage}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-black/5">
        <div
          className="h-full rounded-full bg-[#a17b35] transition-all"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

function StockStatus({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-[11px] font-medium text-red-700">
        <XCircle size={13} />
        Out of Stock
      </span>
    );
  }

  if (stock <= 5) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-[11px] font-medium text-amber-700">
        <AlertTriangle size={13} />
        Low Stock
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-medium text-emerald-700">
      <CheckCircle2 size={13} />
      In Stock
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