import { createFileRoute, Link } from "@tanstack/react-router";
import { CATEGORIES, CATEGORY_IMAGE } from "@/data/products";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title: "Collections — Argent Sterling Silver" },
      { name: "description", content: "Explore Argent's silver jewellery collections by category, occasion and edit." },
      { property: "og:title", content: "Collections — Argent Sterling Silver" },
      { property: "og:description", content: "Explore our silver jewellery collections." },
    ],
  }),
  component: Collections,
});

const EDITS = [
  { tag: "new" as const, title: "New Arrivals", text: "The latest pieces from the workbench." },
  { tag: "bestseller" as const, title: "Best Sellers", text: "Most loved by our community." },
  { tag: "signature" as const, title: "Signature Collection", text: "Our defining silhouettes." },
  { tag: "gift" as const, title: "Gifts", text: "Considered pieces, beautifully boxed." },
];

function Collections() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <p className="eyebrow">Collections</p>
      <h1 className="mt-2 text-4xl md:text-5xl">Edits & Categories</h1>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {EDITS.map((e) => (
          <Link key={e.tag} to="/shop" search={{ tag: e.tag }} className="group block bg-secondary p-8">
            <h2 className="text-3xl">{e.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{e.text}</p>
            <span className="mt-6 inline-block text-[11px] tracking-[0.2em] uppercase underline underline-offset-8">
              Shop the edit
            </span>
          </Link>
        ))}
      </div>

      <h2 className="mt-20 text-3xl">By category</h2>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {CATEGORIES.map((c) => (
          <Link key={c.slug} to="/shop" search={{ category: c.slug }} className="group block">
            <div className="overflow-hidden bg-secondary">
              <img
                src={CATEGORY_IMAGE[c.slug]}
                alt={c.label}
                loading="lazy"
                width={800}
                height={1000}
                className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <p className="mt-3 text-center text-[11px] tracking-[0.2em] uppercase">{c.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
