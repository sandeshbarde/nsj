import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/jewellery-care")({
  head: () => ({
    meta: [
      { title: "Jewellery Care — Keep Silver Bright | Argent" },
      { name: "description", content: "How to clean, store and maintain 925 sterling silver jewellery so it stays bright for years." },
      { property: "og:title", content: "Jewellery Care — Keep Silver Bright" },
      { property: "og:description", content: "Cleaning, storage and maintenance for sterling silver." },
    ],
  }),
  component: Care,
});

const BLOCKS = [
  { t: "Cleaning", items: ["Buff gently with the polishing cloth in your box", "For heavier tarnish, use warm water with a drop of mild soap and a soft brush", "Dry completely before storing"] },
  { t: "Storage", items: ["Keep pieces in the pouch provided, one per pouch", "Store away from humidity and direct sunlight", "Add a silica sachet to your jewellery box"] },
  { t: "What to avoid", items: ["Perfume, hairspray and lotions on the metal", "Swimming pools, sea water and hot springs", "Sleeping or working out in delicate chains"] },
  { t: "Maintenance", items: ["Wipe after each wear", "Free replating within 6 months of purchase", "Have prongs checked yearly on stone-set pieces"] },
];

function Care() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-8">
      <p className="eyebrow">Jewellery care</p>
      <h1 className="mt-2 text-4xl md:text-5xl">Caring for your silver</h1>
      <div className="mt-12 grid gap-10 md:grid-cols-2">
        {BLOCKS.map((b) => (
          <section key={b.t} className="border-t border-border pt-5">
            <h2 className="text-2xl">{b.t}</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {b.items.map((i) => (
                <li key={i}>— {i}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
