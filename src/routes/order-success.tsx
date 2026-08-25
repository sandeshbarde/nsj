import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

export const Route = createFileRoute("/order-success")({
  validateSearch: (search: Record<string, unknown>) => ({
    order: typeof search['order'] === "string" ? search['order'] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Order Confirmed — NSJ Jewellery" },
      { name: "description", content: "Your sterling silver order has been placed successfully." },
      { property: "og:title", content: "Order Confirmed — NSJ Jewellery" },
      { property: "og:description", content: "Thank you for your order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderSuccess,
});

function OrderSuccess() {
  const { order } = Route.useSearch();

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center md:px-8 md:py-28">
      <div className="mx-auto grid size-16 place-items-center rounded-full border border-foreground">
        <Check className="size-7" strokeWidth={1} />
      </div>
      <h1 className="mt-8 font-display text-3xl md:text-4xl">Thank you!</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Your order has been placed. A confirmation will be sent to your email shortly.
      </p>
      {order && (
        <p className="mt-6 border-y border-border py-4 text-sm text-muted-foreground">
          Order no. <span className="font-mono tracking-[0.18em] text-foreground">{order}</span>
        </p>
      )}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          to="/track-order"
          search={{ order }}
          className="bg-ink px-8 py-4 text-[11px] tracking-[0.2em] uppercase text-ink-foreground transition-opacity hover:opacity-90"
        >
          Track order
        </Link>
        <Link to="/shop" className="border border-foreground px-8 py-4 text-[11px] tracking-[0.2em] uppercase transition-colors hover:bg-foreground hover:text-background">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
