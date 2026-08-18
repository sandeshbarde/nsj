import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { CATEGORIES } from "@/data/products";

export function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setEmail("");
    toast.success("You're on the list");
  };

  return (
    <footer className="mt-24 bg-ink text-ink-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="font-display text-2xl uppercase tracking-[0.3em]">
              Argent
            </div>

            <p className="mt-4 max-w-xs text-sm text-ink-foreground/60">
              Hand-finished 925 sterling silver jewellery, designed in India
              for everyday wear.
            </p>

            {/* Newsletter */}
            <form
              className="mt-6 flex border-b border-ink-foreground/25"
              onSubmit={handleSubscribe}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                aria-label="Email address"
                maxLength={255}
                className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-ink-foreground/40"
              />

              <button
                type="submit"
                className="shrink-0 text-[11px] uppercase tracking-[0.2em] transition-opacity hover:opacity-60"
              >
                Join
              </button>
            </form>
          </div>

          {/* Shop */}
          <FooterCol title="Shop">
            {CATEGORIES.slice(0, 6).map((category) => (
              <Link
                key={category.slug}
                to="/shop"
                search={{
                  category: category.slug,
                }}
              >
                {category.label}
              </Link>
            ))}
          </FooterCol>

          {/* The House */}
          <FooterCol title="The House">
            <Link to="/about">About Us</Link>
            <Link to="/our-craft">Our Craft</Link>
            <Link to="/jewellery-care">Jewellery Care</Link>
            <Link to="/ring-size-guide">Ring Size Guide</Link>
            <Link to="/collections">Collections</Link>
          </FooterCol>

          {/* Help */}
          <FooterCol title="Help">
            <Link to="/contact">Contact</Link>
            <Link to="/faq">FAQ</Link>

            <Link
              to="/track-order"
              search={{
                order: undefined,
              }}
            >
              Track Order
            </Link>

            <Link to="/account">My Account</Link>
            <Link to="/policies">Policies</Link>
          </FooterCol>
        </div>

        {/* Bottom */}
        <div className="mt-14 flex flex-col gap-2 border-t border-ink-foreground/15 pt-6 text-[11px] uppercase tracking-[0.15em] text-ink-foreground/50 md:flex-row md:justify-between">
          <span>
            © {new Date().getFullYear()} Argent Silver
          </span>

          <span>
            925 Sterling Silver · Made in India
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h3 className="text-[11px] uppercase tracking-[0.25em] text-ink-foreground/50">
        {title}
      </h3>

      <div className="mt-4 flex flex-col gap-2 text-sm [&_a]:transition-opacity [&_a:hover]:opacity-60">
        {children}
      </div>
    </div>
  );
}