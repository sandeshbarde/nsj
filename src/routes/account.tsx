import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account — Argent Silver" },
      { name: "description", content: "Sign in to view your Argent orders, addresses, wishlist and profile." },
      { property: "og:title", content: "My Account — Argent Silver" },
      { property: "og:description", content: "Orders, addresses and wishlist in one place." },
    ],
  }),
  component: Account,
});

function Account() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 md:px-8">
      <p className="eyebrow">Account</p>
      <h1 className="mt-2 text-4xl md:text-5xl">Your Argent account</h1>
      <p className="mt-4 max-w-xl text-sm text-muted-foreground">
        Accounts, saved orders and addresses need a secure backend. Once Lovable Cloud is switched on for this
        project, sign-in, registration, password reset, order history and the admin dashboard all connect here —
        no placeholder logins in the meantime.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {[
          { title: "Wishlist", text: "Saved pieces, available now", to: "/wishlist" as const },
          { title: "Track an order", text: "Status by order number", to: "/track-order" as const },
          { title: "Shopping bag", text: "Review and check out", to: "/cart" as const },
          { title: "Help", text: "FAQ and contact", to: "/faq" as const },
        ].map((c) => (
          <Link key={c.title} to={c.to} className="border border-border p-6 transition-colors hover:bg-secondary">
            <h2 className="text-2xl">{c.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{c.text}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
