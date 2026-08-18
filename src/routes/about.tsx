import { createFileRoute, Link } from "@tanstack/react-router";
import craft from "@/assets/craft.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Argent — Sterling Silver, Made in India" },
      { name: "description", content: "Our story, mission and philosophy: hand-finished 925 sterling silver jewellery made in Jaipur." },
      { property: "og:title", content: "About Argent — Sterling Silver, Made in India" },
      { property: "og:description", content: "Our story, mission and jewellery philosophy." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-8">
      <p className="eyebrow">About us</p>
      <h1 className="mt-2 text-4xl md:text-5xl">Jewellery made to be lived in.</h1>
      <img src={craft} alt="Silversmith at work" loading="lazy" width={1400} height={900} className="mt-10 w-full object-cover" />

      <div className="mt-12 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <p>
          Argent began in 2016 with a single bench in Jaipur and one belief: silver deserves the same care as
          gold. We design in small batches, cast in 925 sterling silver, and finish every surface by hand.
        </p>
        <section>
          <h2 className="text-2xl text-foreground">Our mission</h2>
          <p className="mt-2">
            To make heirloom-quality silver accessible — pieces that hold their shine, their shape and their
            meaning far beyond a season.
          </p>
        </section>
        <section>
          <h2 className="text-2xl text-foreground">Our values</h2>
          <p className="mt-2">
            Honest materials, fair workshops, restrained design. No plated brass, no hidden alloys, no
            manufactured urgency.
          </p>
        </section>
        <section>
          <h2 className="text-2xl text-foreground">Our philosophy</h2>
          <p className="mt-2">
            Jewellery should feel personal, not performative. We design quiet pieces that layer, travel and age
            gracefully.
          </p>
        </section>
      </div>

      <Link to="/our-craft" className="mt-12 inline-block bg-ink px-8 py-4 text-[11px] tracking-[0.2em] uppercase text-ink-foreground">
        See how it's made
      </Link>
    </div>
  );
}
