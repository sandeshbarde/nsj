import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

export const Route = createFileRoute("/order-success")({
  validateSearch: (search: Record<string, unknown>) => ({
    order: typeof search['order'] === "string" ? search['order'] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Order Confirmed — Argent Silver" },
      { name: "description", content: "Your sterling silver order has been placed successfully." },
      { property: "og:title", content: "Order Confirmed — Argent Silver" },
      { property: "og:description", content: "Thank you for your order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderSuccess,
});

function OrderSuccess() {
  const { order } = Route.useSearch();

  return (
    <div className="mx-auto max-w-xl px-4 py-28 text-center">
      <div className="mx-auto grid size-14 place-items-center rounded-full border border-foreground">
        <Check className="size-6" strokeWidth={1} />
      </div>
      <h1 className="mt-8 text-4xl">Thank you</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Your order has been placed. A confirmation will be sent to your email shortly.
      </p>
      {order && (
        <p className="mt-6 border-y border-border py-4 text-sm">
          Order number <span className="tracking-[0.2em]">{order}</span>
        </p>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/track-order"
          search={{ order }}
          className="bg-ink px-8 py-4 text-[11px] tracking-[0.2em] uppercase text-ink-foreground"
        >
          Track order
        </Link>
        <Link to="/shop" className="border border-foreground px-8 py-4 text-[11px] tracking-[0.2em] uppercase">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
