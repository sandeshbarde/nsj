import { createFileRoute } from "@tanstack/react-router";
import craft from "@/assets/craft.jpg";

export const Route = createFileRoute("/our-craft")({
  head: () => ({
    meta: [
      { title: "Our Craft — 925 Silver Craftsmanship | Argent" },
      { name: "description", content: "How Argent silver jewellery is made: casting, filing, stone setting, polishing and quality checks." },
      { property: "og:title", content: "Our Craft — 925 Silver Craftsmanship" },
      { property: "og:description", content: "Inside the making of Argent sterling silver jewellery." },
    ],
  }),
  component: Craft,
});

const STEPS = [
  { n: "01", t: "Design", d: "Sketched in studio, prototyped in wax, refined until the proportions feel right." },
  { n: "02", t: "Casting", d: "Poured in 925 sterling silver — 92.5% pure silver with copper for strength." },
  { n: "03", t: "Filing & shaping", d: "Each casting is hand-filed to remove seams and true the form." },
  { n: "04", t: "Stone setting", d: "Stones are set by hand under magnification, prong by prong." },
  { n: "05", t: "Polishing", d: "Multi-stage buffing and rhodium finish for an anti-tarnish lustre." },
  { n: "06", t: "Quality check", d: "Weighed, hallmarked and inspected before it's boxed." },
];

function Craft() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-8">
      <p className="eyebrow">Our craft</p>
      <h1 className="mt-2 text-4xl md:text-5xl">Six hands, one piece.</h1>
      <img src={craft} alt="Hand-finishing silver jewellery" loading="lazy" width={1400} height={900} className="mt-10 w-full object-cover" />

      <div className="mt-14 grid gap-10 md:grid-cols-2">
        {STEPS.map((s) => (
          <div key={s.n} className="border-t border-border pt-5">
            <span className="eyebrow">{s.n}</span>
            <h2 className="mt-2 text-2xl">{s.t}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
          </div>
        ))}
      </div>

      <section className="mt-16 bg-secondary p-10">
        <h2 className="text-3xl">What 925 means</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Sterling silver is 92.5% pure silver alloyed with 7.5% copper. Pure silver alone is too soft to hold a
          setting; the alloy gives strength while keeping the bright white tone. Every Argent piece is stamped
          925 and independently hallmarked.
        </p>
      </section>
    </div>
  );
}
