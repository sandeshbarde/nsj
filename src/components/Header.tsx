import { Link, useNavigate } from "@tanstack/react-router";
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
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
] as const;

export function Header() {
  const { cartCount, wishlist } = useShop();

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const navigate = useNavigate();

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const searchValue = q.trim();

    setOpen(false);

    navigate({
      to: "/shop",
      search: {
        q: searchValue || undefined,
      },
    });
  };

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md">
      {/* =====================================================
          ANNOUNCEMENT BAR
          ===================================================== */}
      <div className="flex min-h-8 items-center justify-center bg-ink px-4 py-2 text-center text-[9px] uppercase tracking-[0.18em] text-ink-foreground sm:text-[10px] sm:tracking-[0.25em]">
        <span className="truncate">
          Complimentary shipping across India · 30-day returns
        </span>
      </div>

      {/* =====================================================
          MAIN HEADER
          ===================================================== */}
      <div className="mx-auto grid h-[68px] w-full max-w-7xl grid-cols-[44px_1fr_auto] items-center gap-2 px-4 sm:px-6 md:flex md:h-[76px] md:gap-6 md:px-8">
        {/* ===================================================
            MOBILE MENU BUTTON
            =================================================== */}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex size-10 items-center justify-center rounded-full transition-opacity hover:opacity-60 md:hidden"
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

        {/* ===================================================
            DESKTOP NAVIGATION
            =================================================== */}
        <nav className="hidden flex-1 items-center gap-6 lg:gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              {...("search" in item ? { search: item.search } : {})}
              className="whitespace-nowrap text-[10px] uppercase tracking-[0.18em] transition-opacity duration-200 hover:opacity-50 lg:text-[11px] lg:tracking-[0.2em]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* ===================================================
            LOGO
            =================================================== */}
        <Link
          to="/"
          onClick={closeMenu}
          aria-label="NSJ Jewellery home"
          className="justify-self-center whitespace-nowrap font-display text-[22px] uppercase tracking-[0.28em] sm:text-2xl md:justify-self-auto md:text-[26px]"
        >
          NSJ
        </Link>

        {/* ===================================================
            RIGHT ACTIONS
            =================================================== */}
        <div className="flex items-center justify-end gap-2 sm:gap-4 md:flex-1">
          {/* Desktop Search */}
          <form
            onSubmit={submit}
            className="hidden items-center gap-2 border-b border-border pb-1 lg:flex"
          >
            <Search
              className="size-4 shrink-0 text-muted-foreground"
              strokeWidth={1.25}
            />

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search"
              aria-label="Search jewellery"
              maxLength={100}
              className="w-24 bg-transparent text-xs outline-none placeholder:text-muted-foreground transition-all duration-200 focus:w-36"
            />
          </form>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="relative flex size-10 items-center justify-center rounded-full transition-opacity hover:opacity-60"
          >
            <Heart
              className="size-[19px] sm:size-5"
              strokeWidth={1.25}
            />

            {wishlist.length > 0 && (
              <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-ink text-[8px] text-ink-foreground">
                {wishlist.length > 9 ? "9+" : wishlist.length}
              </span>
            )}
          </Link>

          {/* Account */}
          <Link
            to="/account"
            aria-label="Account"
            className="hidden size-10 items-center justify-center rounded-full transition-opacity hover:opacity-60 sm:flex"
          >
            <User
              className="size-[19px]"
              strokeWidth={1.25}
            />
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            aria-label="Shopping cart"
            className="relative flex size-10 items-center justify-center rounded-full transition-opacity hover:opacity-60"
          >
            <ShoppingBag
              className="size-[19px] sm:size-5"
              strokeWidth={1.25}
            />

            {cartCount > 0 && (
              <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-ink text-[8px] text-ink-foreground">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* =====================================================
          MOBILE MENU
          ===================================================== */}
      <div
        className={`overflow-hidden border-t border-border bg-background transition-all duration-300 md:hidden ${
          open
            ? "max-h-[700px] opacity-100"
            : "max-h-0 border-t-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-7 pt-5 sm:px-6">
          {/* Mobile Search */}
          <form
            onSubmit={submit}
            className="mb-7 flex items-center gap-3 border-b border-border pb-3"
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
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />

            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                aria-label="Clear search"
                className="flex size-8 shrink-0 items-center justify-center"
              >
                <X
                  className="size-4"
                  strokeWidth={1.25}
                />
              </button>
            )}
          </form>

          {/* Mobile Main Navigation */}
          <nav className="mb-7 flex flex-col">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                {...("search" in item ? { search: item.search } : {})}
                onClick={closeMenu}
                className="border-b border-border py-4 text-[11px] uppercase tracking-[0.22em] transition-opacity hover:opacity-50"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Categories */}
          <div>
            <p className="mb-4 text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
              Shop by category
            </p>

            <div className="grid grid-cols-2 gap-x-4 gap-y-0">
              {CATEGORIES.map((category) => (
                <Link
                  key={category.slug}
                  to="/shop"
                  search={{
                    category: category.slug,
                  }}
                  onClick={closeMenu}
                  className="border-b border-border py-3 text-[10px] uppercase tracking-[0.16em] transition-opacity hover:opacity-50"
                >
                  {category.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Account */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Link
              to="/account"
              onClick={closeMenu}
              className="flex items-center justify-center gap-2 border border-border px-4 py-3 text-[10px] uppercase tracking-[0.18em] transition-colors hover:bg-secondary"
            >
              <User
                className="size-4"
                strokeWidth={1.25}
              />
              Account
            </Link>

            <Link
              to="/wishlist"
              onClick={closeMenu}
              className="flex items-center justify-center gap-2 border border-border px-4 py-3 text-[10px] uppercase tracking-[0.18em] transition-colors hover:bg-secondary"
            >
              <Heart
                className="size-4"
                strokeWidth={1.25}
              />
              Wishlist
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}