import { createFileRoute, Link } from "@tanstack/react-router";
import craft from "@/assets/craft.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About NSJ Jewellery — Sterling Silver, Made in India" },
      { name: "description", content: "Our story, mission and philosophy: hand-finished 925 sterling silver jewellery made in Jaipur." },
      { property: "og:title", content: "About NSJ Jewellery — Sterling Silver, Made in India" },
      { property: "og:description", content: "Our story, mission and jewellery philosophy." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 md:px-8 md:py-16">
      <p className="eyebrow">About us</p>
      <h1 className="mt-2 font-display text-[clamp(2.2rem,7vw,4rem)] leading-[1.04]">
        Jewellery made to be lived in.
      </h1>

      <div className="mt-10 overflow-hidden rounded-sm">
        <img
          src={craft}
          alt="Silversmith at work"
          loading="lazy"
          width={1400}
          height={900}
          className="aspect-video w-full object-cover"
        />
      </div>

      <div className="mt-12 space-y-10 text-base leading-relaxed text-muted-foreground">
        <p>
          NSJ Jewellery began with a single bench in Jaipur and one belief: silver deserves
          the same care as gold. We design in small batches, cast in 925 sterling silver,
          and finish every surface by hand.
        </p>

        <section>
          <h2 className="font-display text-2xl text-foreground md:text-3xl">Our mission</h2>
          <p className="mt-3">
            To make heirloom-quality silver accessible — pieces that hold their shine, their
            shape and their meaning far beyond a season.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground md:text-3xl">Our values</h2>
          <p className="mt-3">
            Honest materials, fair workshops, restrained design. No plated brass, no hidden
            alloys, no manufactured urgency.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground md:text-3xl">Our philosophy</h2>
          <p className="mt-3">
            Jewellery should feel personal, not performative. We design quiet pieces that
            layer, travel and age gracefully.
          </p>
        </section>
      </div>

      <div className="mt-12">
        <Link
          to="/our-craft"
          className="bg-ink px-8 py-4 text-[11px] tracking-[0.2em] uppercase text-ink-foreground transition-opacity hover:opacity-90"
        >
          See how it's made
        </Link>
      </div>
    </div>
  );
}
