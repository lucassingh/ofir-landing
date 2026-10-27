"use client";

import ScrollVelocity from "@/components/reactbits/ScrollVelocity";

/** Cinta de oficios que acelera con el scroll (React Bits · ScrollVelocity). */
export function Marquee({ lines }: { lines: [string, string] }) {
  const sep = <span aria-hidden className="mx-6 inline-block size-3 translate-y-[-0.35em] bg-oro" />;
  return (
    <section data-cms-section="marquee" aria-label="Lo que hacemos" className="overflow-hidden py-14">
      <ScrollVelocity
        texts={lines}
        velocity={40}
        separator={sep}
        className="font-display font-extrabold text-azul/90 [font-stretch:118%]"
        fontSize="clamp(2rem, 5vw, 4rem)"
        scrollerClassName="!drop-shadow-none py-2"
        fadeEdges
        outlineAlternate
      />
    </section>
  );
}
