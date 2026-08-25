import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/ring-size-guide")({
  head: () => ({
    meta: [
      { title: "Ring Size Guide (India) — NSJ Jewellery" },
      { name: "description", content: "Indian ring size chart with diameter and circumference, plus how to measure your ring size at home." },
      { property: "og:title", content: "Ring Size Guide (India) — Argent" },
      { property: "og:description", content: "Find your Indian ring size in two minutes." },
    ],
  }),
  component: SizeGuide,
});

const SIZES = [
  { in: "10", dia: "15.3", circ: "48.0" },
  { in: "12", dia: "16.1", circ: "50.6" },
  { in: "14", dia: "16.9", circ: "53.1" },
  { in: "16", dia: "17.8", circ: "55.7" },
  { in: "18", dia: "18.6", circ: "58.3" },
  { in: "20", dia: "19.4", circ: "60.8" },
  { in: "22", dia: "20.2", circ: "63.4" },
];

function SizeGuide() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-8">
      <p className="eyebrow">Ring size guide</p>
      <h1 className="mt-2 text-4xl md:text-5xl">Find your size</h1>

      <section className="mt-10 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-2xl text-foreground">How to measure</h2>
        <ol className="mt-3 space-y-2">
          <li>1. Wrap a thin strip of paper snugly around the base of your finger.</li>
          <li>2. Mark where the paper overlaps and measure the length in millimetres.</li>
          <li>3. Match that circumference to the chart below.</li>
          <li>4. Measure at the end of the day, when fingers are largest.</li>
        </ol>
      </section>

      <table className="mt-10 w-full border-t border-border text-sm">
        <thead>
          <tr className="eyebrow">
            <th className="py-3 text-left">Indian size</th>
            <th className="py-3 text-left">Diameter (mm)</th>
            <th className="py-3 text-left">Circumference (mm)</th>
          </tr>
        </thead>
        <tbody>
          {SIZES.map((s) => (
            <tr key={s.in} className="border-t border-border">
              <td className="py-3">{s.in}</td>
              <td className="py-3">{s.dia}</td>
              <td className="py-3">{s.circ}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-8 text-xs text-muted-foreground">
        Between two sizes? Choose the larger one — especially for wide bands.
      </p>
    </div>
  );
}
