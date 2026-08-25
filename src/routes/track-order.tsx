import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/track-order")({
  validateSearch: (search: Record<string, unknown>) => ({
    order: typeof search['order'] === "string" ? search['order'] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Track Your Order — NSJ Jewellery" },
      { name: "description", content: "Enter your order number and email to see live status from confirmed to delivered." },
      { property: "og:title", content: "Track Your Order — NSJ Jewellery" },
      { property: "og:description", content: "Live status for your Argent order." },
    ],
  }),
  component: TrackOrder,
});

const STAGES = ["Confirmed", "Processing", "Packed", "Shipped", "Out for Delivery", "Delivered"];

function TrackOrder() {
  const { order } = Route.useSearch();
  const [id, setId] = useState(order ?? "");
  const [contact, setContact] = useState("");
  const [result, setResult] = useState<{ id: string; stage: number } | null>(null);
  const [error, setError] = useState("");

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-8">
      <p className="eyebrow">Order tracking</p>
      <h1 className="mt-2 text-4xl md:text-5xl">Where's my order?</h1>

      <form
        className="mt-10 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!/^AG\d{6,10}$/i.test(id.trim())) {
            setResult(null);
            setError("Order numbers look like AG12345678");
            return;
          }
          if (!/^\S+@\S+\.\S+$/.test(contact.trim()) && !/^[6-9]\d{9}$/.test(contact.trim())) {
            setResult(null);
            setError("Enter the email or mobile used on the order");
            return;
          }
          setError("");
          setResult({ id: id.trim().toUpperCase(), stage: 2 });
        }}
      >
        <label className="block">
          <span className="eyebrow">Order number</span>
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            maxLength={20}
            className="mt-1 w-full border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground"
          />
        </label>
        <label className="block">
          <span className="eyebrow">Email or mobile</span>
          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            maxLength={255}
            className="mt-1 w-full border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground"
          />
        </label>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <button type="submit" className="bg-ink px-8 py-4 text-[11px] tracking-[0.2em] uppercase text-ink-foreground">
          Track order
        </button>
      </form>

      {result && (
        <section className="mt-12 border-t border-border pt-8">
          <p className="eyebrow">Order {result.id}</p>
          <ol className="mt-6 space-y-5">
            {STAGES.map((s, i) => (
              <li key={s} className="flex items-center gap-4">
                <span
                  className={
                    "grid size-6 place-items-center rounded-full border text-[10px] " +
                    (i <= result.stage ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground")
                  }
                >
                  {i + 1}
                </span>
                <span className={i <= result.stage ? "text-sm" : "text-sm text-muted-foreground"}>{s}</span>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-xs text-muted-foreground">
            Live carrier tracking connects once the shipping integration is configured.
          </p>
        </section>
      )}
    </div>
  );
}
