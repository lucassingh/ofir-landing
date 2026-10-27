import Image from "next/image";
import type { SiteContent } from "@ofir/content";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SlideIn } from "@/components/ui/SlideIn";

/** El concepto de marca + la misión social. Dos cards: texto y foto del taller. */
export function Mission({ content }: { content: SiteContent }) {
  const { mission } = content;
  return (
    <section id="taller" data-cms-section="mission" aria-labelledby="mision-title" className="overflow-x-clip">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <SlideIn from="left" className="flex flex-col justify-between gap-10 rounded-[28px] bg-white p-8 shadow-card sm:p-12">
          <div className="grid gap-5">
            <Eyebrow>{mission.eyebrow}</Eyebrow>
            <h2 id="mision-title" className="font-display stretch-expanded text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.03] text-azul text-balance">
              {mission.title}
            </h2>
            <p className="max-w-lg text-lg leading-relaxed text-ink-soft">
              {mission.body}
            </p>
          </div>
          <div className="flex items-center gap-4 border-t border-line pt-6">
            <span aria-hidden className="size-3 bg-oro" />
            <span className="font-mono text-[13px] text-ink-soft">{mission.footnote}</span>
          </div>
        </SlideIn>
        <SlideIn from="right" delay={0.1} className="relative min-h-[380px] overflow-hidden rounded-[28px] shadow-card">
          <Image src={mission.photo} alt={mission.photoAlt} fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
        </SlideIn>
      </div>
      </div>
    </section>
  );
}
