import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { formatINR } from "@/data/products";
import { applyCoupon, useShop } from "@/lib/store";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Secure Checkout — NSJ Jewellery" },
      { name: "description", content: "Complete your sterling silver order with secure checkout and free shipping." },
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
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
});

const addressSchema = z.object({
  line1: z.string().trim().min(4, "Enter your address").max(160),
  city: z.string().trim().min(2, "Enter your city").max(60),
  state: z.string().trim().min(2, "Enter your state").max(60),
  pincode: z.string().trim().regex(/^\d{6}$/, "Enter a valid 6-digit PIN code"),
});

type Errors = Record<string, string>;

function CheckoutPage() {
  const { lines, subtotal, clearCart } = useShop();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [details, setDetails] = useState({ name: "", email: "", phone: "" });
  const [address, setAddress] = useState({ line1: "", city: "", state: "", pincode: "" });
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const [payment, setPayment] = useState<"prepaid" | "cod">("prepaid");
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [placing, setPlacing] = useState(false);

  const shippingCost = shippingMethod === "express" ? 199 : subtotal >= 1500 ? 0 : 99;
  const total = Math.max(0, subtotal - discount) + shippingCost;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-32 text-center">
        <h1 className="text-4xl">Nothing to check out</h1>
        <Link to="/shop" className="mt-6 inline-block bg-ink px-8 py-4 text-[11px] tracking-[0.2em] uppercase text-ink-foreground">
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
    for (const issue of res.error.issues) next[String(issue.path[0])] = issue.message;
    setErrors(next);
    return false;
  };

  const placeOrder = async () => {
    setPlacing(true);
    // Payment gateway (Razorpay) is not configured yet. The order is only
    // confirmed after this step succeeds — no order is marked paid here.
    await new Promise((r) => setTimeout(r, 700));
    const orderId = "AG" + Date.now().toString().slice(-8);
    try {
      window.localStorage.setItem(
        "ag_last_order",
        JSON.stringify({ orderId, total, email: details.email, name: details.name, method: payment }),
      );
    } catch {
      /* storage unavailable */
    }
    clearCart();
    setPlacing(false);
    navigate({ to: "/order-success", search: { order: orderId } });
  };

  const steps = ["Details", "Address", "Shipping", "Payment"];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 md:px-8">
      <h1 className="font-display text-3xl md:text-4xl">Checkout</h1>

      {/* Step indicator */}
      <ol className="mt-6 flex gap-0">
        {steps.map((s, i) => (
          <li key={s} className="flex flex-1 items-center">
            <span className={`flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase ${i === step ? "font-medium" : "text-muted-foreground"}`}>
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] ${i === step ? "bg-foreground text-background" : i < step ? "bg-secondary text-foreground" : "border border-border"}`}>
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

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {step === 0 && (
            <Fieldset title="Customer information">
              <Field label="Full name" value={details.name} error={errors['name']} onChange={(v) => setDetails({ ...details, name: v })} />
              <Field label="Email" type="email" value={details.email} error={errors['email']} onChange={(v) => setDetails({ ...details, email: v })} />
              <Field label="Mobile number" value={details.phone} error={errors['phone']} onChange={(v) => setDetails({ ...details, phone: v })} />
              <p className="text-xs text-muted-foreground">
                Checking out as a guest. <Link to="/account" className="underline underline-offset-4">Sign in</Link> to save your details.
              </p>
            </Fieldset>
          )}

          {step === 1 && (
            <Fieldset title="Shipping address">
              <Field label="Address" value={address.line1} error={errors['line1']} onChange={(v) => setAddress({ ...address, line1: v })} />
              <Field label="City" value={address.city} error={errors['city']} onChange={(v) => setAddress({ ...address, city: v })} />
              <Field label="State" value={address.state} error={errors['state']} onChange={(v) => setAddress({ ...address, state: v })} />
              <Field label="PIN code" value={address.pincode} error={errors['pincode']} onChange={(v) => setAddress({ ...address, pincode: v })} />
            </Fieldset>
          )}

          {step === 2 && (
            <Fieldset title="Shipping method">
              <Choice
                checked={shippingMethod === "standard"}
                onChange={() => setShippingMethod("standard")}
                title="Standard · 4–6 days"
                note={subtotal >= 1500 ? "Free" : formatINR(99)}
              />
              <Choice
                checked={shippingMethod === "express"}
                onChange={() => setShippingMethod("express")}
                title="Express · 1–2 days"
                note={formatINR(199)}
              />
            </Fieldset>
          )}

          {step === 3 && (
            <Fieldset title="Payment">
              <Choice checked={payment === "prepaid"} onChange={() => setPayment("prepaid")} title="Pay online (UPI / Card / Netbanking)" note="Secure" />
              <Choice checked={payment === "cod"} onChange={() => setPayment("cod")} title="Cash on delivery" note="+ ₹0" />
              <p className="text-xs text-muted-foreground">
                Online payments will be processed by Razorpay once the gateway keys are configured. Orders are
                marked paid only after payment verification.
              </p>
            </Fieldset>
          )}

          <div className="flex gap-3">
            {step > 0 && (
              <button type="button" onClick={() => setStep((s) => s - 1)} className="border border-foreground px-6 py-4 text-[11px] tracking-[0.2em] uppercase">
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={() => {
                  if (step > 1 || validate()) setStep((s) => s + 1);
                }}
                className="bg-ink px-8 py-4 text-[11px] tracking-[0.2em] uppercase text-ink-foreground"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                disabled={placing}
                onClick={placeOrder}
                className="bg-ink px-8 py-4 text-[11px] tracking-[0.2em] uppercase text-ink-foreground disabled:opacity-50"
              >
                {placing ? "Placing order…" : `Place order · ${formatINR(total)}`}
              </button>
            )}
          </div>
        </div>

        <aside className="h-fit bg-secondary p-6">
          <h2 className="eyebrow">Order summary</h2>
          <ul className="mt-5 space-y-4">
            {lines.map((l) => (
              <li key={l.productId + l.size} className="flex gap-3 text-sm">
                <img src={l.product.image} alt="" loading="lazy" width={800} height={1000} className="h-20 w-16 object-cover" />
                <div className="flex-1">
                  <p className="font-display text-base">{l.product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {l.size} · Qty {l.qty}
                  </p>
                </div>
                <span>{formatINR(l.product.price * l.qty)}</span>
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
              className="w-full border border-border bg-background px-3 py-2 text-sm outline-none"
            />
            <button
              type="button"
              onClick={() => {
                const res = applyCoupon(code, subtotal);
                setDiscount(res.discount);
                res.ok ? toast.success(res.message) : toast.error(res.message);
              }}
              className="border border-foreground px-4 text-[11px] tracking-[0.2em] uppercase"
            >
              Apply
            </button>
          </div>

          <dl className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
            <Row label="Subtotal" value={formatINR(subtotal)} />
            {discount > 0 && <Row label="Discount" value={`− ${formatINR(discount)}`} />}
            <Row label="Shipping" value={shippingCost === 0 ? "Free" : formatINR(shippingCost)} />
            <div className="flex justify-between border-t border-border pt-3 text-base">
              <dt>Total</dt>
              <dd>{formatINR(total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}

function Fieldset({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border border-border p-6">
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
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string | undefined;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={255}
        className="mt-1 w-full border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground"
      />
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
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
    <label className="flex cursor-pointer items-center justify-between border border-border p-4 text-sm">
      <span className="flex items-center gap-3">
        <input type="radio" checked={checked} onChange={onChange} className="accent-foreground" />
        {title}
      </span>
      <span className="text-muted-foreground">{note}</span>
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
