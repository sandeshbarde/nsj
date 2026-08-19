import { useEffect, useMemo, useState, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { requireAdmin } from "@/lib/admin";
import {
  Archive,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Eye,
  Menu,
  Package,
  Search,
  ShoppingBag,
  Trash2,
  Truck,
  X,
} from "lucide-react";

type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

type PaymentStatus = "Paid" | "Pending" | "Failed" | "Refunded";

type Order = {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  date: string;
  shippingAddress: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
};

const STORAGE_KEY = "nsj_admin_orders";

const defaultOrders: Order[] = [
  {
    id: "NSJ-1008",
    customer: {
      name: "Priya Sharma",
      email: "priya@example.com",
      phone: "+91 98765 43210",
    },
    items: [
      {
        name: "Silver Rose Ring",
        quantity: 1,
        price: 1499,
      },
    ],
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
      pincode: "411001",
    },
  },
  {
    id: "NSJ-1007",
    customer: {
      name: "Aarav Mehta",
      email: "aarav@example.com",
      phone: "+91 98220 12345",
    },
    items: [
      {
        name: "Classic Silver Chain",
        quantity: 1,
        price: 2799,
      },
    ],
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
      pincode: "411045",
    },
  },
  {
    id: "NSJ-1006",
    customer: {
      name: "Ananya Patil",
      email: "ananya@example.com",
      phone: "+91 97654 32109",
    },
    items: [
      {
        name: "Pearl Drop Earrings",
        quantity: 1,
        price: 1899,
      },
    ],
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
      pincode: "411004",
    },
  },
  {
    id: "NSJ-1005",
    customer: {
      name: "Rahul Deshmukh",
      email: "rahul@example.com",
      phone: "+91 98989 11223",
    },
    items: [
      {
        name: "Elegant Silver Bracelet",
        quantity: 1,
        price: 2299,
      },
    ],
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
      pincode: "411057",
    },
  },
];

const statuses: Array<"All" | OrderStatus> = [
  "All",
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export const Route = createFileRoute("/admin/orders")({
  beforeLoad: requireAdmin,
  component: AdminOrders,
});

function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        setOrders(JSON.parse(saved));
      } catch {
        setOrders(defaultOrders);
      }
    } else {
      setOrders(defaultOrders);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultOrders));
    }
  }, []);

  const saveOrders = (updatedOrders: Order[]) => {
    setOrders(updatedOrders);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrders));
  };

  const filteredOrders = useMemo(() => {
    const query = search.toLowerCase().trim();

    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        order.id.toLowerCase().includes(query) ||
        order.customer.name.toLowerCase().includes(query) ||
        order.customer.email.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const updateStatus = (id: string, status: OrderStatus) => {
    const updated = orders.map((order) =>
      order.id === id
        ? {
            ...order,
            status,
          }
        : order,
    );

    saveOrders(updated);

    if (selectedOrder?.id === id) {
      setSelectedOrder({
        ...selectedOrder,
        status,
      });
    }
  };

  const deleteOrder = (id: string) => {
    const order = orders.find((item) => item.id === id);

    if (!order) return;

    const confirmed = window.confirm(
      `Delete order ${order.id}? This cannot be undone.`,
    );

    if (!confirmed) return;

    saveOrders(orders.filter((item) => item.id !== id));

    if (selectedOrder?.id === id) {
      setSelectedOrder(null);
    }
  };

  const totalRevenue = orders
    .filter((order) => order.paymentStatus === "Paid")
    .reduce((sum, order) => sum + order.total, 0);

  const pendingOrders = orders.filter(
    (order) =>
      order.status === "Pending" || order.status === "Confirmed",
  ).length;

  const processingOrders = orders.filter(
    (order) => order.status === "Processing",
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered",
  ).length;

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
            icon={<ClipboardList size={18} />}
            label="Dashboard"
          />

          <SidebarLink
            to="/admin/products"
            icon={<ShoppingBag size={18} />}
            label="Products"
          />

          <SidebarLink
            to="/admin/orders"
            icon={<ClipboardList size={18} />}
            label="Orders"
            active
          />

          <SidebarLink
            to="/admin/inventory"
            icon={<Package size={18} />}
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
                active
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
          {/* Header */}
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#b08a43]">
                Store Management
              </p>

              <h1 className="mt-1 font-serif text-3xl sm:text-4xl">
                Orders
              </h1>

              <p className="mt-2 text-sm text-black/45">
                Manage customer orders and fulfillment.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <OrderStat
              label="Paid Revenue"
              value={`₹${totalRevenue.toLocaleString("en-IN")}`}
              icon={<ShoppingBag size={19} />}
            />

            <OrderStat
              label="Pending"
              value={pendingOrders}
              icon={<ClipboardList size={19} />}
            />

            <OrderStat
              label="Processing"
              value={processingOrders}
              icon={<Package size={19} />}
            />

            <OrderStat
              label="Delivered"
              value={deliveredOrders}
              icon={<Truck size={19} />}
            />
          </div>

          {/* Filters */}
          <div className="mb-5 rounded-2xl border border-black/5 bg-white p-4">
            <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
                />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search order ID, customer or email..."
                  className="h-11 w-full rounded-xl border border-black/10 bg-[#fafafa] pl-11 pr-4 text-sm outline-none transition focus:border-[#b08a43]"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="h-11 rounded-xl border border-black/10 bg-[#fafafa] px-4 text-sm outline-none focus:border-[#b08a43]"
              >
                {statuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Orders */}
          <div className="overflow-hidden rounded-2xl border border-black/5 bg-white">
            <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
              <div>
                <h2 className="font-serif text-xl">
                  All Orders
                </h2>

                <p className="mt-1 text-xs text-black/40">
                  Showing {filteredOrders.length} of {orders.length} orders
                </p>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f7f1e4] text-[#a17b35]">
                  <ShoppingBag size={25} />
                </div>

                <h3 className="mt-4 font-serif text-xl">
                  No orders found
                </h3>

                <p className="mt-2 text-sm text-black/45">
                  Try changing your search or status filter.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px]">
                  <thead>
                    <tr className="border-b border-black/5 bg-[#faf9f6] text-left text-[10px] uppercase tracking-wider text-black/35">
                      <th className="px-5 py-4 font-medium">
                        Order
                      </th>

                      <th className="px-5 py-4 font-medium">
                        Customer
                      </th>

                      <th className="px-5 py-4 font-medium">
                        Items
                      </th>

                      <th className="px-5 py-4 font-medium">
                        Amount
                      </th>

                      <th className="px-5 py-4 font-medium">
                        Payment
                      </th>

                      <th className="px-5 py-4 font-medium">
                        Status
                      </th>

                      <th className="px-5 py-4 text-right font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-black/5 last:border-0"
                      >
                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold">
                            #{order.id}
                          </p>

                          <p className="mt-1 text-[11px] text-black/35">
                            {formatDate(order.date)}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm font-medium">
                            {order.customer.name}
                          </p>

                          <p className="mt-1 text-xs text-black/40">
                            {order.customer.email}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="max-w-[220px] truncate text-sm text-black/60">
                            {order.items
                              .map(
                                (item) =>
                                  `${item.name} × ${item.quantity}`,
                              )
                              .join(", ")}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm font-medium">
                          ₹{order.total.toLocaleString("en-IN")}
                        </td>

                        <td className="px-5 py-4">
                          <PaymentBadge
                            status={order.paymentStatus}
                          />
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge status={order.status} />
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(order)}
                              title="View order"
                              className="rounded-lg p-2 text-black/40 transition hover:bg-black/5 hover:text-black"
                            >
                              <Eye size={17} />
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteOrder(order.id)}
                              title="Delete order"
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

            <span>NSJ Jewellery Admin</span>

            <span className="inline-flex items-center gap-1">
              <ClipboardList size={14} />
              Order Management
            </span>
          </div>
        </div>
      </main>

      {/* Order Details */}
      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={(status) =>
            updateStatus(selectedOrder.id, status)
          }
        />
      )}
    </div>
  );
}

function OrderDetails({
  order,
  onClose,
  onStatusChange,
}: {
  order: Order;
  onClose: () => void;
  onStatusChange: (status: OrderStatus) => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-8">
      <div className="my-auto w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/5 px-5 py-5 sm:px-7">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#b08a43]">
              Order Details
            </p>

            <h2 className="mt-1 font-serif text-2xl">
              #{order.id}
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

        <div className="space-y-6 p-5 sm:p-7">
          {/* Customer */}
          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-black/40">
              Customer
            </h3>

            <div className="rounded-xl border border-black/5 bg-[#faf9f6] p-4">
              <p className="font-medium">
                {order.customer.name}
              </p>

              <p className="mt-1 text-sm text-black/50">
                {order.customer.email}
              </p>

              <p className="mt-1 text-sm text-black/50">
                {order.customer.phone}
              </p>
            </div>
          </section>

          {/* Status */}
          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-black/40">
              Order Status
            </h3>

            <select
              value={order.status}
              onChange={(event) =>
                onStatusChange(
                  event.target.value as OrderStatus,
                )
              }
              className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#b08a43]"
            >
              {statuses
                .filter((status) => status !== "All")
                .map((status) => (
                  <option key={status}>{status}</option>
                ))}
            </select>
          </section>

          {/* Items */}
          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-black/40">
              Products
            </h3>

            <div className="divide-y divide-black/5 rounded-xl border border-black/5">
              {order.items.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="flex items-center justify-between gap-4 p-4"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-black/40">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <p className="text-sm font-medium">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Address + Payment */}
          <div className="grid gap-5 sm:grid-cols-2">
            <section>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-black/40">
                Shipping Address
              </h3>

              <div className="rounded-xl border border-black/5 bg-[#faf9f6] p-4 text-sm leading-6 text-black/60">
                <p>{order.shippingAddress.line1}</p>
                <p>
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state}
                </p>
                <p>{order.shippingAddress.pincode}</p>
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-black/40">
                Payment
              </h3>

              <div className="rounded-xl border border-black/5 bg-[#faf9f6] p-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-black/45">
                    Method
                  </span>

                  <span>{order.paymentMethod}</span>
                </div>

                <div className="mt-3 flex justify-between gap-4">
                  <span className="text-black/45">
                    Status
                  </span>

                  <PaymentBadge status={order.paymentStatus} />
                </div>
              </div>
            </section>
          </div>

          {/* Summary */}
          <section className="rounded-xl bg-[#171513] p-5 text-white">
            <div className="flex justify-between text-sm text-white/50">
              <span>Subtotal</span>

              <span>
                ₹{order.subtotal.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="mt-2 flex justify-between text-sm text-white/50">
              <span>Shipping</span>

              <span>
                {order.shipping === 0
                  ? "Free"
                  : `₹${order.shipping.toLocaleString("en-IN")}`}
              </span>
            </div>

            <div className="mt-2 flex justify-between text-sm text-white/50">
              <span>Discount</span>

              <span>
                -₹{order.discount.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="mt-4 border-t border-white/10 pt-4">
              <div className="flex justify-between">
                <span className="font-medium">
                  Total
                </span>

                <span className="font-serif text-xl text-[#d8b875]">
                  ₹{order.total.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function OrderStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f7f1e4] text-[#a17b35]">
        {icon}
      </div>

      <p className="mt-4 text-xs text-black/40">
        {label}
      </p>

      <p className="mt-1 font-serif text-2xl">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: OrderStatus;
}) {
  const styles: Record<OrderStatus, string> = {
    Pending: "bg-amber-50 text-amber-700",
    Confirmed: "bg-blue-50 text-blue-700",
    Processing: "bg-violet-50 text-violet-700",
    Shipped: "bg-indigo-50 text-indigo-700",
    Delivered: "bg-emerald-50 text-emerald-700",
    Cancelled: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function PaymentBadge({
  status,
}: {
  status: PaymentStatus;
}) {
  const styles: Record<PaymentStatus, string> = {
    Paid: "bg-emerald-50 text-emerald-700",
    Pending: "bg-amber-50 text-amber-700",
    Failed: "bg-red-50 text-red-700",
    Refunded: "bg-violet-50 text-violet-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-medium ${styles[status]}`}
    >
      {status}
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

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}
