import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { CATEGORIES } from "@/data/products";
import { useShop } from "@/lib/store";

const NAV = [
  {
    to: "/shop",
    label: "New In",
    search: { sort: "newest" as const },
  },
  {
    to: "/shop",
    label: "Jewellery",
  },
  {
    to: "/collections",
    label: "Collections",
  },
  {
    to: "/about",
    label: "About",
  },
];

export function Header() {
  const { cartCount, wishlist } = useShop();

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const navigate = useNavigate();

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setOpen(false);

    navigate({
      to: "/shop",
      search: {
        q: q.trim() || undefined,
      },
    });
  };

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      {/* Announcement Bar */}
      <div className="bg-ink py-2 text-center text-[10px] uppercase tracking-[0.25em] text-ink-foreground">
        Complimentary shipping across India · 30-day returns
      </div>

      {/* Main Navigation */}
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 md:px-8">
        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? (
            <X
              className="size-5"
              strokeWidth={1.25}
            />
          ) : (
            <Menu
              className="size-5"
              strokeWidth={1.25}
            />
          )}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden flex-1 items-center gap-7 text-[11px] uppercase tracking-[0.2em] md:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              {...(item.search ? { search: item.search } : {})}
              className="transition-opacity hover:opacity-60"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logo */}
        <Link
          to="/"
          className="flex-1 text-center font-display text-2xl uppercase tracking-[0.3em] md:flex-none"
          onClick={closeMenu}
        >
          NSJ
        </Link>

        {/* Right Actions */}
        <div className="flex flex-1 items-center justify-end gap-4">
          {/* Desktop Search */}
          <form
            onSubmit={submit}
            className="hidden items-center gap-2 border-b border-border pb-1 lg:flex"
          >
            <Search
              className="size-4 text-muted-foreground"
              strokeWidth={1.25}
            />

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search"
              aria-label="Search jewellery"
              maxLength={100}
              className="w-28 bg-transparent text-xs outline-none placeholder:text-muted-foreground focus:w-40"
            />
          </form>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="relative"
          >
            <Heart
              className="size-5"
              strokeWidth={1.25}
            />

            {wishlist.length > 0 && (
              <span className="absolute -right-2 -top-2 grid size-4 place-items-center rounded-full bg-ink text-[9px] text-ink-foreground">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Account */}
          <Link
            to="/account"
            aria-label="Account"
            className="hidden sm:block"
          >
            <User
              className="size-5"
              strokeWidth={1.25}
            />
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            aria-label="Shopping cart"
            className="relative"
          >
            <ShoppingBag
              className="size-5"
              strokeWidth={1.25}
            />

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 grid size-4 place-items-center rounded-full bg-ink text-[9px] text-ink-foreground">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-border bg-background px-4 pb-6 pt-4 md:hidden">
          {/* Mobile Search */}
          <form
            onSubmit={submit}
            className="mb-5 flex items-center gap-2 border-b border-border pb-2"
          >
            <Search
              className="size-4 shrink-0 text-muted-foreground"
              strokeWidth={1.25}
            />

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search jewellery"
              aria-label="Search jewellery"
              maxLength={100}
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />

            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close menu"
              className="shrink-0"
            >
              <X
                className="size-4"
                strokeWidth={1.25}
              />
            </button>
          </form>

          {/* Mobile Navigation */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-[11px] uppercase tracking-[0.2em]">
            {CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                to="/shop"
                search={{
                  category: category.slug,
                }}
                onClick={closeMenu}
                className="transition-opacity hover:opacity-60"
              >
                {category.label}
              </Link>
            ))}

            <Link
              to="/collections"
              onClick={closeMenu}
              className="transition-opacity hover:opacity-60"
            >
              Collections
            </Link>

            <Link
              to="/about"
              onClick={closeMenu}
              className="transition-opacity hover:opacity-60"
            >
              About
            </Link>

            <Link
              to="/account"
              onClick={closeMenu}
              className="transition-opacity hover:opacity-60"
            >
              Account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}