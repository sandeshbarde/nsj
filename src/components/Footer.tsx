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
              NSJ
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

            {/* WhatsApp */}
            <a
              href="https://wa.me/917373262607?text=Hello%20NSJ%20Jewellery!%20%F0%9F%91%8B%20I%20would%20like%20to%20know%20more%20about%20your%20jewellery%20products."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#25D366]/80 hover:text-[#25D366]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                className="h-3.5 w-3.5 fill-current"
                aria-hidden="true"
              >
                <path d="M16.003 2C8.28 2 2 8.28 2 16.003c0 2.47.658 4.788 1.807 6.794L2 30l7.394-1.78A13.94 13.94 0 0 0 16.003 30C23.72 30 30 23.72 30 16.003 30 8.28 23.72 2 16.003 2zm7.226 19.47c-.304.853-1.783 1.63-2.438 1.73-.656.101-1.478.142-2.384-.15-.55-.18-1.258-.42-2.16-.822-3.801-1.641-6.285-5.497-6.478-5.75-.193-.254-1.574-2.094-1.574-3.994s.997-2.837 1.35-3.225c.354-.388.77-.485 1.026-.485.257 0 .514.002.738.014.237.013.554-.09.868.66.322.77 1.094 2.67 1.191 2.864.097.193.161.42.032.676-.128.257-.193.418-.386.645-.193.226-.405.504-.578.676-.193.193-.393.401-.169.787.225.387.997 1.643 2.14 2.66 1.47 1.307 2.71 1.713 3.1 1.906.387.194.612.162.837-.097.225-.257.965-1.126 1.222-1.513.257-.387.514-.322.87-.193.355.13 2.254 1.063 2.64 1.257.388.193.645.29.74.45.097.16.097.93-.207 1.783z" />
              </svg>
              WhatsApp Us
            </a>
          </FooterCol>
        </div>

        {/* Bottom */}
        <div className="mt-14 flex flex-col gap-2 border-t border-ink-foreground/15 pt-6 text-[11px] uppercase tracking-[0.15em] text-ink-foreground/50 md:flex-row md:justify-between">
          <span>© {new Date().getFullYear()} NSJ Jewellery</span>

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