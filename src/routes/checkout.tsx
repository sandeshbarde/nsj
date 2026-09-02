import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useId, type ReactNode } from "react";
import { toast } from "sonner";
import { z } from "zod";
import {
  Building2,
  Check,
  Copy,
  CreditCard,
  ExternalLink,
  QrCode,
  ShieldCheck,
  Smartphone,
  Truck,
} from "lucide-react";
import { formatINR } from "@/data/products";
import { applyCoupon, useShop } from "@/lib/store";
import { PAYMENT_CONFIG, getUpiQrCodeUrl, getUpiUri } from "@/lib/paymentConfig";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Secure Checkout — NSJ Jewellery" },
      {
        name: "description",
        content:
          "Complete your sterling silver order with secure UPI, QR, Bank Transfer, or COD payment.",
      },
      { property: "og:title", content: "Secure Checkout — NSJ Jewellery" },
      { property: "og:description", content: "Complete your order securely." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

const detailsSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
});

const addressSchema = z.object({
  line1: z.string().trim().min(4, "Enter your address").max(160),
  city: z.string().trim().min(2, "Enter your city").max(60),
  state: z.string().trim().min(2, "Enter your state").max(60),
  pincode: z.string().trim().regex(/^\d{6}$/, "Enter a valid 6-digit PIN code"),
});

type Errors = Record<string, string>;
type PaymentType = "upi" | "bank" | "cod";

function CheckoutPage() {
  const { lines, subtotal, clearCart } = useShop();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [details, setDetails] = useState({ name: "", email: "", phone: "" });
  const [address, setAddress] = useState({
    line1: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">(
    "standard"
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentType>("upi");
  const [transactionRef, setTransactionRef] = useState("");
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [orderId] = useState(() => "NSJ-" + Date.now().toString().slice(-6));

  const shippingCost =
    shippingMethod === "express" ? 199 : subtotal >= 1500 ? 0 : 99;
  const total = Math.max(0, subtotal - discount) + shippingCost;

  const copyToClipboard = (text: string, key: string, label: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-32 text-center">
        <h1 className="text-4xl">Nothing to check out</h1>
        <Link
          to="/shop"
          className="mt-6 inline-block bg-ink px-8 py-4 text-[11px] tracking-[0.2em] uppercase text-ink-foreground"
        >
          Shop the collection
        </Link>
      </div>
    );
  }

  const validate = (): boolean => {
    const schema = step === 0 ? detailsSchema : addressSchema;
    const data = step === 0 ? details : address;
    const res = schema.safeParse(data);
    if (res.success) {
      setErrors({});
      return true;
    }
    const next: Errors = {};
    for (const issue of res.error.issues)
      next[String(issue.path[0])] = issue.message;
    setErrors(next);
    return false;
  };

  const placeOrder = async () => {
    setPlacing(true);

    const orderData = {
      id: orderId,
      customer: {
        name: details.name.trim(),
        email: details.email.trim(),
        phone: details.phone.trim(),
      },
      items: lines.map((l) => ({
        name: `${l.product.name} (${l.size})`,
        quantity: l.qty,
        price: l.product.price,
      })),
      subtotal,
      shipping: shippingCost,
      discount,
      total,
      paymentMethod:
        paymentMethod === "upi"
          ? "UPI / QR Transfer"
          : paymentMethod === "bank"
          ? "Bank Account Transfer"
          : "Cash on Delivery (COD)",
      paymentStatus: (paymentMethod === "cod" ? "Pending" : "Paid") as
        | "Paid"
        | "Pending",
      transactionRef: transactionRef.trim() || undefined,
      status: "Confirmed" as const,
      date: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
      shippingAddress: {
        line1: address.line1.trim(),
        city: address.city.trim(),
        state: address.state.trim(),
        pincode: address.pincode.trim(),
      },
    };

    // 1. Save to local storage for instant access in client & admin views
    try {
      window.localStorage.setItem("ag_last_order", JSON.stringify(orderData));

      const existingRaw = window.localStorage.getItem("nsj_admin_orders");
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      window.localStorage.setItem(
        "nsj_admin_orders",
        JSON.stringify([orderData, ...existing])
      );
    } catch (e) {
      console.error("Local storage save error:", e);
    }

    // 2. Save to Supabase orders table if configured
    try {
      await supabase.from("orders").insert({
        id: orderData.id,
        customer_name: orderData.customer.name,
        customer_email: orderData.customer.email,
        customer_phone: orderData.customer.phone,
        items: orderData.items,
        subtotal: orderData.subtotal,
        shipping: orderData.shipping,
        discount: orderData.discount,
        total: orderData.total,
        payment_method: orderData.paymentMethod,
        payment_status: orderData.paymentStatus,
        transaction_ref: orderData.transactionRef,
        status: orderData.status,
        shipping_address: orderData.shippingAddress,
      });
    } catch (e) {
      console.warn("Supabase order insert notice:", e);
    }

    clearCart();
    setPlacing(false);
    navigate({ to: "/order-success", search: { order: orderId } });
  };

  const steps = ["Details", "Address", "Shipping", "Payment"];
  const upiUri = getUpiUri(total, orderId);
  const upiQrUrl = getUpiQrCodeUrl(total, orderId);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 md:px-8">
      <h1 className="font-display text-3xl md:text-4xl">Checkout</h1>

      {/* Step indicator */}
      <ol className="mt-6 flex gap-0">
        {steps.map((s, i) => (
          <li key={s} className="flex flex-1 items-center">
            <span
              className={`flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase ${
                i === step ? "font-medium" : "text-muted-foreground"
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] ${
                  i === step
                    ? "bg-foreground text-background"
                    : i < step
                    ? "bg-secondary text-foreground"
                    : "border border-border"
                }`}
              >
                {i + 1}
              </span>
              <span className="hidden sm:inline">{s}</span>
            </span>
            {i < steps.length - 1 && (
              <span className="mx-2 flex-1 border-t border-border" />
            )}
          </li>
        ))}
      </ol>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {/* STEP 0: Customer Information */}
          {step === 0 && (
            <Fieldset title="Customer information">
              <Field
                label="Full name"
                value={details.name}
                error={errors["name"]}
                placeholder="e.g. Rahul Sharma"
                onChange={(v) => setDetails({ ...details, name: v })}
              />
              <Field
                label="Email address"
                type="email"
                value={details.email}
                error={errors["email"]}
                placeholder="you@email.com"
                onChange={(v) => setDetails({ ...details, email: v })}
              />
              <Field
                label="Mobile number (WhatsApp preferred)"
                type="tel"
                value={details.phone}
                error={errors["phone"]}
                placeholder="10-digit mobile number"
                onChange={(v) => setDetails({ ...details, phone: v })}
              />
              <p className="text-xs text-muted-foreground">
                Checking out as a guest.{" "}
                <Link to="/account" className="underline underline-offset-4">
                  Sign in
                </Link>{" "}
                to save your details.
              </p>
            </Fieldset>
          )}

          {/* STEP 1: Shipping Address */}
          {step === 1 && (
            <Fieldset title="Shipping address">
              <Field
                label="Flat / House No. / Street Address"
                value={address.line1}
                error={errors["line1"]}
                placeholder="e.g. Flat 402, Royal Residency, MG Road"
                onChange={(v) => setAddress({ ...address, line1: v })}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="City"
                  value={address.city}
                  error={errors["city"]}
                  placeholder="e.g. Pune"
                  onChange={(v) => setAddress({ ...address, city: v })}
                />
                <Field
                  label="State"
                  value={address.state}
                  error={errors["state"]}
                  placeholder="e.g. Maharashtra"
                  onChange={(v) => setAddress({ ...address, state: v })}
                />
              </div>
              <Field
                label="PIN code"
                value={address.pincode}
                error={errors["pincode"]}
                placeholder="6-digit PIN code"
                onChange={(v) => setAddress({ ...address, pincode: v })}
              />
            </Fieldset>
          )}

          {/* STEP 2: Shipping Method */}
          {step === 2 && (
            <Fieldset title="Shipping method">
              <Choice
                checked={shippingMethod === "standard"}
                onChange={() => setShippingMethod("standard")}
                title="Standard Insured Delivery · 3–5 Business Days"
                note={subtotal >= 1500 ? "Free" : formatINR(99)}
              />
              <Choice
                checked={shippingMethod === "express"}
                onChange={() => setShippingMethod("express")}
                title="Express Air Priority · 1–2 Business Days"
                note={formatINR(199)}
              />
              <div className="rounded border border-border bg-secondary/50 p-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <ShieldCheck size={16} /> 100% Insured & Tracked Packaging
                </div>
                <p className="mt-1">
                  All NSJ jewellery parcels are tamper-proof sealed and insured
                  doorstep-to-doorstep.
                </p>
              </div>
            </Fieldset>
          )}

          {/* STEP 3: Payment */}
          {step === 3 && (
            <Fieldset title="Choose Payment Method">
              {/* Payment selector tabs */}
              <div className="grid gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("upi")}
                  className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-all ${
                    paymentMethod === "upi"
                      ? "border-foreground bg-foreground text-background shadow-sm"
                      : "border-border bg-card hover:border-foreground/40"
                  }`}
                >
                  <QrCode size={24} />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider">
                      UPI / QR Code
                    </p>
                    <p
                      className={`text-[10px] ${
                        paymentMethod === "upi"
                          ? "text-background/80"
                          : "text-muted-foreground"
                      }`}
                    >
                      GPay, PhonePe, Paytm
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("bank")}
                  className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-all ${
                    paymentMethod === "bank"
                      ? "border-foreground bg-foreground text-background shadow-sm"
                      : "border-border bg-card hover:border-foreground/40"
                  }`}
                >
                  <Building2 size={24} />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider">
                      Bank Transfer
                    </p>
                    <p
                      className={`text-[10px] ${
                        paymentMethod === "bank"
                          ? "text-background/80"
                          : "text-muted-foreground"
                      }`}
                    >
                      NEFT / IMPS / RTGS
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-all ${
                    paymentMethod === "cod"
                      ? "border-foreground bg-foreground text-background shadow-sm"
                      : "border-border bg-card hover:border-foreground/40"
                  }`}
                >
                  <Truck size={24} />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider">
                      Cash on Delivery
                    </p>
                    <p
                      className={`text-[10px] ${
                        paymentMethod === "cod"
                          ? "text-background/80"
                          : "text-muted-foreground"
                      }`}
                    >
                      Pay at doorstep
                    </p>
                  </div>
                </button>
              </div>

              {/* UPI & QR PAYMENT VIEW */}
              {paymentMethod === "upi" && (
                <div className="space-y-6 rounded-xl border border-border bg-secondary/30 p-6">
                  <div className="text-center">
                    <p className="eyebrow text-foreground/70">
                      Scan QR Code to Pay
                    </p>
                    <p className="mt-1 font-display text-2xl">
                      {formatINR(total)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Scan using Google Pay, PhonePe, Paytm, or any UPI app
                    </p>
                  </div>

                  {/* QR Code Container */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="rounded-2xl border-2 border-foreground/10 bg-white p-4 shadow-md">
                      <img
                        src={upiQrUrl}
                        alt="NSJ UPI QR Code"
                        width={220}
                        height={220}
                        className="h-52 w-52 rounded-lg object-contain"
                      />
                    </div>
                    <p className="mt-2 text-[11px] text-muted-foreground">
                      Order ID:{" "}
                      <span className="font-mono font-medium text-foreground">
                        {orderId}
                      </span>
                    </p>
                  </div>

                  {/* Direct Pay Link for Mobile */}
                  <div className="sm:hidden">
                    <a
                      href={upiUri}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] py-3.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition hover:opacity-95"
                    >
                      <Smartphone size={16} /> Pay Directly via UPI App
                    </a>
                  </div>

                  {/* Copy UPI ID Box */}
                  <div className="rounded-lg border border-border bg-background p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          UPI ID / VPA
                        </span>
                        <p className="font-mono text-sm font-medium">
                          {PAYMENT_CONFIG.upiId}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            PAYMENT_CONFIG.upiId,
                            "upi",
                            "UPI ID"
                          )
                        }
                        className="flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-xs transition hover:bg-secondary"
                      >
                        {copiedKey === "upi" ? (
                          <>
                            <Check size={14} className="text-green-600" />{" "}
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy size={14} /> Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Reference input */}
                  <div>
                    <label className="block">
                      <span className="eyebrow">
                        UPI Transaction / UTR / Reference ID (Optional)
                      </span>
                      <input
                        type="text"
                        value={transactionRef}
                        onChange={(e) => setTransactionRef(e.target.value)}
                        placeholder="e.g. 12-digit UTR from GPay / PhonePe"
                        maxLength={40}
                        className="mt-1 w-full rounded border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground"
                      />
                    </label>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Enter the 12-digit UTR number shown in your payment app for
                      faster verification.
                    </p>
                  </div>
                </div>
              )}

              {/* BANK ACCOUNT TRANSFER VIEW */}
              {paymentMethod === "bank" && (
                <div className="space-y-6 rounded-xl border border-border bg-secondary/30 p-6">
                  <div>
                    <p className="eyebrow">Direct Bank Transfer Details</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Transfer <strong className="text-foreground">{formatINR(total)}</strong> to the account below via IMPS / NEFT / RTGS.
                    </p>
                  </div>

                  <div className="divide-y divide-border rounded-lg border border-border bg-background">
                    <div className="flex items-center justify-between p-3.5 text-sm">
                      <span className="text-xs text-muted-foreground">Bank Name</span>
                      <span className="font-medium">{PAYMENT_CONFIG.bankName}</span>
                    </div>
                    <div className="flex items-center justify-between p-3.5 text-sm">
                      <span className="text-xs text-muted-foreground">Account Holder</span>
                      <span className="font-medium">{PAYMENT_CONFIG.accountHolder}</span>
                    </div>
                    <div className="flex items-center justify-between p-3.5 text-sm">
                      <span className="text-xs text-muted-foreground">Account Number</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium">{PAYMENT_CONFIG.accountNumber}</span>
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(
                              PAYMENT_CONFIG.accountNumber,
                              "acc",
                              "Account Number"
                            )
                          }
                          className="rounded border border-border p-1 hover:bg-secondary"
                          aria-label="Copy Account Number"
                        >
                          {copiedKey === "acc" ? (
                            <Check size={14} className="text-green-600" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3.5 text-sm">
                      <span className="text-xs text-muted-foreground">IFSC Code</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium">{PAYMENT_CONFIG.ifscCode}</span>
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(
                              PAYMENT_CONFIG.ifscCode,
                              "ifsc",
                              "IFSC Code"
                            )
                          }
                          className="rounded border border-border p-1 hover:bg-secondary"
                          aria-label="Copy IFSC Code"
                        >
                          {copiedKey === "ifsc" ? (
                            <Check size={14} className="text-green-600" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3.5 text-sm">
                      <span className="text-xs text-muted-foreground">Branch & Type</span>
                      <span className="text-xs">{PAYMENT_CONFIG.branch} · {PAYMENT_CONFIG.accountType}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block">
                      <span className="eyebrow">
                        Bank Transfer Reference / UTR Number
                      </span>
                      <input
                        type="text"
                        value={transactionRef}
                        onChange={(e) => setTransactionRef(e.target.value)}
                        placeholder="e.g. IMPS/NEFT Ref Number"
                        maxLength={40}
                        className="mt-1 w-full rounded border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* CASH ON DELIVERY VIEW */}
              {paymentMethod === "cod" && (
                <div className="rounded-xl border border-border bg-secondary/30 p-6">
                  <div className="flex items-start gap-3">
                    <Truck className="size-5 shrink-0 text-foreground" />
                    <div>
                      <h3 className="font-display text-lg">Cash / UPI on Delivery</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        You can pay <strong>{formatINR(total)}</strong> in cash or via UPI QR code directly to the courier executive when your order arrives.
                      </p>
                      <p className="mt-3 text-xs text-muted-foreground">
                        ✓ No advance payment required.<br />
                        ✓ Our team will call or WhatsApp you to confirm your shipping address before dispatch.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Fieldset>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-2">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="border border-foreground px-6 py-4 text-[11px] tracking-[0.2em] uppercase transition hover:bg-foreground hover:text-background"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 2 || validate()) setStep((s) => s + 1);
                }}
                className="bg-ink px-8 py-4 text-[11px] tracking-[0.2em] uppercase text-ink-foreground transition hover:opacity-90"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                disabled={placing}
                onClick={placeOrder}
                className="flex-1 bg-ink px-8 py-4 text-[11px] tracking-[0.2em] uppercase text-ink-foreground shadow-md transition hover:opacity-90 disabled:opacity-50"
              >
                {placing
                  ? "Confirming Order…"
                  : `Confirm & Place Order · ${formatINR(total)}`}
              </button>
            )}
          </div>
        </div>

        {/* ORDER SUMMARY SIDEBAR */}
        <aside className="h-fit rounded-xl border border-border bg-secondary/40 p-6 shadow-sm">
          <h2 className="eyebrow">Order summary</h2>
          <ul className="mt-5 space-y-4">
            {lines.map((l) => (
              <li key={l.productId + l.size} className="flex gap-3 text-sm">
                <img
                  src={l.product.image}
                  alt={l.product.name}
                  loading="lazy"
                  width={800}
                  height={1000}
                  className="h-20 w-16 rounded object-cover"
                />
                <div className="flex-1">
                  <p className="font-display text-base leading-snug">
                    {l.product.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {l.size} · Qty {l.qty}
                  </p>
                </div>
                <span className="font-medium">
                  {formatINR(l.product.price * l.qty)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={20}
              placeholder="Coupon code"
              aria-label="Coupon code"
              className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
            />
            <button
              type="button"
              onClick={() => {
                const res = applyCoupon(code, subtotal);
                setDiscount(res.discount);
                res.ok ? toast.success(res.message) : toast.error(res.message);
              }}
              className="rounded border border-foreground px-4 text-[11px] tracking-[0.2em] uppercase transition hover:bg-foreground hover:text-background"
            >
              Apply
            </button>
          </div>

          <dl className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
            <Row label="Subtotal" value={formatINR(subtotal)} />
            {discount > 0 && (
              <Row label="Discount" value={`− ${formatINR(discount)}`} />
            )}
            <Row
              label="Shipping"
              value={shippingCost === 0 ? "Free" : formatINR(shippingCost)}
            />
            <div className="flex justify-between border-t border-border pt-3 text-base font-medium">
              <dt>Total</dt>
              <dd>{formatINR(total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}

function Fieldset({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="eyebrow">{title}</h2>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string | undefined;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={255}
        className="mt-1 w-full rounded border border-border bg-transparent px-3 py-2.5 text-sm outline-none transition focus:border-foreground"
      />
      {error && (
        <span className="mt-1 block text-xs text-destructive">{error}</span>
      )}
    </label>
  );
}

function Choice({
  checked,
  onChange,
  title,
  note,
}: {
  checked: boolean;
  onChange: () => void;
  title: string;
  note: string;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 text-sm transition ${
        checked
          ? "border-foreground bg-secondary/50 font-medium"
          : "border-border hover:border-foreground/30"
      }`}
    >
      <span className="flex items-center gap-3">
        <input
          type="radio"
          checked={checked}
          onChange={onChange}
          className="accent-foreground"
        />
        {title}
      </span>
      <span className="text-xs text-muted-foreground">{note}</span>
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
