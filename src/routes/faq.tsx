import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Silver, Shipping & Returns | Argent" },
      { name: "description", content: "Answers on 925 silver, shipping, returns, exchanges, payments, ring sizing and jewellery care." },
      { property: "og:title", content: "FAQ — Silver, Shipping & Returns" },
      { property: "og:description", content: "Common questions, answered." },
    ],
  }),
  component: Faq,
});

const FAQS = [
  { q: "Is your jewellery real 925 sterling silver?", a: "Yes. Every piece is 92.5% pure silver, stamped 925 and hallmarked." },
  { q: "Will it tarnish?", a: "All silver oxidises over time. Our rhodium finish slows it considerably, and the polishing cloth in your box restores shine." },
  { q: "How long does shipping take?", a: "Orders dispatch within 24–48 hours. Standard delivery is 4–6 days, express 1–2 days." },
  { q: "What is your return policy?", a: "30 days from delivery, unworn and in original packaging. We arrange a free pickup." },
  { q: "Can I exchange for a different size?", a: "Yes, one free size exchange per order within 30 days." },
  { q: "What payment methods do you accept?", a: "UPI, credit and debit cards, netbanking and cash on delivery across India." },
  { q: "How do I find my ring size?", a: "Use our ring size guide — measure the circumference of your finger and match it to the chart." },
  { q: "How should I care for my jewellery?", a: "Wipe after wear, keep away from perfume and water, and store in the pouch provided." },
];

function Faq() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<number | null>(0);
  const list = FAQS.filter((f) => (f.q + f.a).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-8">
      <p className="eyebrow">Help centre</p>
      <h1 className="mt-2 text-4xl md:text-5xl">Frequently asked</h1>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search questions"
        aria-label="Search questions"
        className="mt-8 w-full border-b border-border bg-transparent py-3 text-sm outline-none focus:border-foreground"
      />

      <div className="mt-8 border-t border-border">
        {list.map((f, i) => (
          <div key={f.q} className="border-b border-border">
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
              aria-expanded={open === i}
            >
              <span className="font-display text-xl">{f.q}</span>
              <span className="text-muted-foreground">{open === i ? "−" : "+"}</span>
            </button>
            {open === i && <p className="pb-5 text-sm text-muted-foreground">{f.a}</p>}
          </div>
        ))}
        {list.length === 0 && <p className="py-8 text-sm text-muted-foreground">No matching questions.</p>}
      </div>
    </div>
  );
}
