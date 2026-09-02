import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, MessageCircle, Truck, ShoppingBag, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { formatINR } from "@/data/products";
import { PAYMENT_CONFIG } from "@/lib/paymentConfig";

interface LastOrder {
  id: string;
  customer?: {
    name: string;
    email: string;
    phone: string;
  };
  items?: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total?: number;
  paymentMethod?: string;
  transactionRef?: string;
  shippingAddress?: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export const Route = createFileRoute("/order-success")({
  validateSearch: (search: Record<string, unknown>) => ({
    order: typeof search["order"] === "string" ? search["order"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Order Confirmed — NSJ Jewellery" },
      {
        name: "description",
        content: "Your sterling silver order has been placed successfully.",
      },
      { property: "og:title", content: "Order Confirmed — NSJ Jewellery" },
      { property: "og:description", content: "Thank you for your order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderSuccess,
});

function OrderSuccess() {
  const { order: searchOrder } = Route.useSearch();
  const [orderData, setOrderData] = useState<LastOrder | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("ag_last_order");
      if (raw) {
        const parsed = JSON.parse(raw) as LastOrder;
        setOrderData(parsed);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const orderId = searchOrder || orderData?.id || "NSJ-" + Date.now().toString().slice(-6);
  const total = orderData?.total ?? 0;
  const customerName = orderData?.customer?.name || "Valued Customer";
  const customerPhone = orderData?.customer?.phone || "";
  const paymentMethod = orderData?.paymentMethod || "UPI / Online";
  const transactionRef = orderData?.transactionRef;

  // WhatsApp message generation for payment screenshot and order confirmation
  const generateWhatsAppUrl = () => {
    const lines = [
      `💎 *NSJ JEWELLERY — ORDER CONFIRMATION*`,
      `*Order ID:* ${orderId}`,
      `*Name:* ${customerName}`,
      customerPhone ? `*Phone:* ${customerPhone}` : "",
      `*Total Amount:* ₹${total.toLocaleString("en-IN")}`,
      `*Payment Method:* ${paymentMethod}`,
      transactionRef ? `*Transaction/UTR Ref:* ${transactionRef}` : "",
      orderData?.shippingAddress
        ? `*Address:* ${orderData.shippingAddress.line1}, ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} - ${orderData.shippingAddress.pincode}`
        : "",
      ``,
      `_I have placed my order on mynsj.in. Please find my payment screenshot attached._`,
    ]
      .filter(Boolean)
      .join("\n");

    return `https://wa.me/${PAYMENT_CONFIG.whatsappNumber}?text=${encodeURIComponent(lines)}`;
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center md:px-8 md:py-24">
      {/* Success Badge */}
      <div className="mx-auto grid size-20 place-items-center rounded-full border-2 border-foreground bg-secondary">
        <Check className="size-9 text-foreground" strokeWidth={1.5} />
      </div>

      <p className="eyebrow mt-6 text-foreground/70">Order Confirmed</p>
      <h1 className="mt-2 font-display text-4xl md:text-5xl">Thank You!</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Your order has been successfully placed. We are preparing your hand-finished 925 sterling silver jewellery for dispatch.
      </p>

      {/* Order Details Card */}
      <div className="mt-8 rounded-xl border border-border bg-card p-6 text-left shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Order Reference
            </span>
            <p className="font-mono text-lg font-semibold tracking-wide text-foreground">
              {orderId}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Total Paid / Due
            </span>
            <p className="font-display text-xl font-medium">
              {total > 0 ? formatINR(total) : "Confirmed"}
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 text-xs sm:grid-cols-2">
          <div>
            <span className="text-muted-foreground">Payment Method:</span>
            <p className="font-medium text-foreground">{paymentMethod}</p>
          </div>
          {transactionRef && (
            <div>
              <span className="text-muted-foreground">Transaction UTR / Ref:</span>
              <p className="font-mono font-medium text-foreground">{transactionRef}</p>
            </div>
          )}
          {orderData?.shippingAddress && (
            <div className="sm:col-span-2">
              <span className="text-muted-foreground">Shipping To:</span>
              <p className="text-foreground">
                {orderData.shippingAddress.line1}, {orderData.shippingAddress.city},{" "}
                {orderData.shippingAddress.state} - {orderData.shippingAddress.pincode}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* WhatsApp Confirmation Banner */}
      <div className="mt-6 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 p-5 text-left">
        <div className="flex items-start gap-3.5">
          <div className="rounded-full bg-[#25D366] p-2 text-white">
            <MessageCircle size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground">
              Share Screenshot & Confirm on WhatsApp
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              If you paid via UPI QR or Bank Transfer, send your payment screenshot to our official WhatsApp support for instant priority dispatch.
            </p>
            <a
              href={generateWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition hover:opacity-95"
            >
              <MessageCircle size={15} /> Send on WhatsApp (+91 73732 62607)
            </a>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          to="/track-order"
          search={{ order: orderId }}
          className="flex items-center justify-center gap-2 bg-ink px-8 py-4 text-[11px] tracking-[0.2em] uppercase text-ink-foreground transition hover:opacity-90"
        >
          <Truck size={15} /> Track Order
        </Link>
        <Link
          to="/shop"
          className="flex items-center justify-center gap-2 border border-foreground px-8 py-4 text-[11px] tracking-[0.2em] uppercase transition hover:bg-foreground hover:text-background"
        >
          <ShoppingBag size={15} /> Continue Shopping
        </Link>
      </div>
    </div>
  );
}
