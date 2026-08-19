import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import {
  BarChart3,
  Box,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  ExternalLink,
  Gem,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { requireAdmin } from "@/lib/admin";
import { supabase } from "@/lib/supabase";
import { AdminGate } from "@/components/AdminGate";

export const Route = createFileRoute("/admin/dashboard")({
  beforeLoad: requireAdmin,
  component: () => <AdminGate><AdminDashboard /></AdminGate>,
});

const stats = [
  {
    title: "Total Revenue",
    value: "₹2,48,500",
    change: "+12.5%",
    icon: CircleDollarSign,
  },
  {
    title: "Total Orders",
    value: "42",
    change: "+8.2%",
    icon: ShoppingBag,
  },
  {
    title: "Products",
    value: "128",
    change: "+4.6%",
    icon: Gem,
  },
  {
    title: "Customers",
    value: "96",
    change: "+11.4%",
    icon: Users,
  },
];

const recentOrders = [
  {
    id: "#NSJ-1008",
    customer: "Priya Sharma",
    product: "Silver Rose Ring",
    amount: "₹1,499",
    status: "Delivered",
  },
  {
    id: "#NSJ-1007",
    customer: "Aarav Mehta",
    product: "Classic Silver Chain",
    amount: "₹2,799",
    status: "Processing",
  },
  {
    id: "#NSJ-1006",
    customer: "Ananya Patil",
    product: "Pearl Drop Earrings",
    amount: "₹1,899",
    status: "Shipped",
  },
  {
    id: "#NSJ-1005",
    customer: "Rahul Deshmukh",
    product: "Elegant Silver Bracelet",
    amount: "₹2,299",
    status: "Pending",
  },
];

const lowStockProducts = [
  {
    name: "Pearl Drop Earrings",
    category: "Earrings",
    stock: 3,
  },
  {
    name: "Classic Silver Chain",
    category: "Chains",
    stock: 5,
  },
  {
    name: "Silver Lotus Pendant",
    category: "Pendants",
    stock: 7,
  },
  {
    name: "Minimal Silver Bangle",
    category: "Bangles",
    stock: 8,
  },
];

function AdminDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    await navigate({
      to: "/admin/login",
    });
  };

  const navigation = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Products",
      href: "/admin/products",
      icon: Gem,
    },
    {
      label: "Orders",
      href: "/admin/orders",
      icon: ClipboardList,
    },
    {
      label: "Inventory",
      href: "/admin/inventory",
      icon: Package,
    },
  ] as const;

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-[#171513]">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-[#171513] text-white transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-7">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3"
            onClick={() => setSidebarOpen(false)}
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
                Jewellery
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
            className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/30">
            Management
          </p>

          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
                  activeProps={{
                    className:
                      "group flex items-center gap-3 rounded-xl bg-[#c8a96b]/15 px-4 py-3 text-sm text-[#e4c98d]",
                  }}
                >
                  <Icon
                    size={18}
                    strokeWidth={1.7}
                  />

                  <span>{item.label}</span>

                  <ChevronRight
                    size={15}
                    className="ml-auto opacity-0 transition group-hover:opacity-50"
                  />
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Store / Logout */}
        <div className="border-t border-white/10 p-4">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/50 transition hover:bg-white/10 hover:text-white"
          >
            <ExternalLink size={17} />
            View Store
          </Link>

          <button
            type="button"
            onClick={() => void handleLogout()}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/50 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-72">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-black/5 bg-[#f7f4ef]/95 px-5 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              className="rounded-xl border border-black/10 bg-white p-2.5 lg:hidden"
            >
              <Menu size={20} />
            </button>

            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#b08a43]">
                Administration
              </p>

              <h1 className="font-serif text-2xl sm:text-3xl">
                Dashboard
              </h1>
            </div>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <div className="text-right">
              <p className="text-sm font-medium">
                NSJ Admin
              </p>

              <p className="text-xs text-black/40">
                Store Manager
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#171513] text-sm font-medium text-[#d8b875]">
              A
            </div>
          </div>
        </header>

        <main className="p-5 sm:p-8">
          {/* Welcome */}
          <div className="mb-8">
            <p className="text-sm text-black/45">
              Welcome back, Admin.
            </p>

            <h2 className="mt-1 font-serif text-3xl">
              Here's what's happening today.
            </h2>
          </div>

          {/* Stats */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="rounded-2xl border border-black/5 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.03)]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f7f1e4] text-[#a17b35]">
                      <Icon
                        size={21}
                        strokeWidth={1.7}
                      />
                    </div>

                    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                      <TrendingUp size={12} />
                      {stat.change}
                    </span>
                  </div>

                  <p className="mt-5 text-sm text-black/45">
                    {stat.title}
                  </p>

                  <p className="mt-1 font-serif text-2xl">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </section>

          {/* Quick Actions */}
          <section className="mt-8">
            <div className="mb-4">
              <h3 className="font-serif text-2xl">
                Quick Actions
              </h3>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Link
                to="/admin/products"
                className="group flex items-center justify-between rounded-2xl bg-[#171513] p-5 text-white transition hover:-translate-y-0.5"
              >
                <div>
                  <Gem
                    className="mb-3 text-[#d8b875]"
                    size={22}
                  />

                  <p className="font-medium">
                    Manage Products
                  </p>

                  <p className="mt-1 text-xs text-white/45">
                    Add, edit and manage jewellery
                  </p>
                </div>

                <ChevronRight className="text-white/40 transition group-hover:translate-x-1" />
              </Link>

              <Link
                to="/admin/orders"
                className="group flex items-center justify-between rounded-2xl border border-black/5 bg-white p-5 transition hover:-translate-y-0.5"
              >
                <div>
                  <ShoppingBag
                    className="mb-3 text-[#a17b35]"
                    size={22}
                  />

                  <p className="font-medium">
                    View Orders
                  </p>

                  <p className="mt-1 text-xs text-black/40">
                    Check and update customer orders
                  </p>
                </div>

                <ChevronRight className="text-black/25 transition group-hover:translate-x-1" />
              </Link>

              <Link
                to="/admin/inventory"
                className="group flex items-center justify-between rounded-2xl border border-black/5 bg-white p-5 transition hover:-translate-y-0.5"
              >
                <div>
                  <Box
                    className="mb-3 text-[#a17b35]"
                    size={22}
                  />

                  <p className="font-medium">
                    Check Inventory
                  </p>

                  <p className="mt-1 text-xs text-black/40">
                    Monitor jewellery stock levels
                  </p>
                </div>

                <ChevronRight className="text-black/25 transition group-hover:translate-x-1" />
              </Link>

              <Link
                to="/admin/media"
                className="group flex items-center justify-between rounded-2xl border border-black/5 bg-white p-5 transition hover:-translate-y-0.5"
              >
                <div>
                  <Settings className="mb-3 text-[#a17b35]" size={22} />
                  <p className="font-medium">Photos &amp; Media</p>
                  <p className="mt-1 text-xs text-black/40">Update storefront images</p>
                </div>
                <ChevronRight className="text-black/25 transition group-hover:translate-x-1" />
              </Link>
            </div>
          </section>

          {/* Orders + Low Stock */}
          <section className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            {/* Recent Orders */}
            <div className="overflow-hidden rounded-2xl border border-black/5 bg-white">
              <div className="flex items-center justify-between border-b border-black/5 px-5 py-5">
                <div>
                  <h3 className="font-serif text-xl">
                    Recent Orders
                  </h3>

                  <p className="mt-1 text-xs text-black/40">
                    Latest customer purchases
                  </p>
                </div>

                <Link
                  to="/admin/orders"
                  className="text-xs font-medium text-[#9b7430] hover:underline"
                >
                  View all
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px]">
                  <thead>
                    <tr className="border-b border-black/5 text-left text-[10px] uppercase tracking-wider text-black/35">
                      <th className="px-5 py-3 font-medium">
                        Order
                      </th>

                      <th className="px-5 py-3 font-medium">
                        Customer
                      </th>

                      <th className="px-5 py-3 font-medium">
                        Product
                      </th>

                      <th className="px-5 py-3 font-medium">
                        Amount
                      </th>

                      <th className="px-5 py-3 font-medium">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-black/5 last:border-0"
                      >
                        <td className="px-5 py-4 text-sm font-medium">
                          {order.id}
                        </td>

                        <td className="px-5 py-4 text-sm text-black/60">
                          {order.customer}
                        </td>

                        <td className="px-5 py-4 text-sm text-black/60">
                          {order.product}
                        </td>

                        <td className="px-5 py-4 text-sm font-medium">
                          {order.amount}
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge
                            status={order.status}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Low Stock */}
            <div className="rounded-2xl border border-black/5 bg-white">
              <div className="flex items-center justify-between border-b border-black/5 px-5 py-5">
                <div>
                  <h3 className="font-serif text-xl">
                    Low Stock
                  </h3>

                  <p className="mt-1 text-xs text-black/40">
                    Products that need attention
                  </p>
                </div>

                <Link
                  to="/admin/inventory"
                  className="text-xs font-medium text-[#9b7430] hover:underline"
                >
                  Inventory
                </Link>
              </div>

              <div className="divide-y divide-black/5">
                {lowStockProducts.map((product) => (
                  <div
                    key={product.name}
                    className="flex items-center justify-between px-5 py-4"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {product.name}
                      </p>

                      <p className="mt-1 text-xs text-black/40">
                        {product.category}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        product.stock <= 3
                          ? "bg-red-50 text-red-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {product.stock} left
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Store Status */}
          <section className="mt-8 rounded-2xl border border-black/5 bg-[#171513] p-6 text-white sm:p-7">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/10">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>

                <div>
                  <p className="font-medium">
                    Store is live
                  </p>

                  <p className="mt-1 text-sm text-white/45">
                    Your NSJ jewellery storefront is currently
                    online.
                  </p>
                </div>
              </div>

              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm transition hover:bg-white/10"
              >
                Open Store
                <ExternalLink size={15} />
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Delivered: "bg-emerald-50 text-emerald-700",
    Processing: "bg-blue-50 text-blue-700",
    Shipped: "bg-violet-50 text-violet-700",
    Pending: "bg-amber-50 text-amber-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
        styles[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}
