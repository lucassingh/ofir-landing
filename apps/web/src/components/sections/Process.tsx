import type { SiteContent } from "@ofir/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/** Proceso en 5 pasos sobre card azul con grilla de plano. */
export function Process({ content }: { content: SiteContent }) {
  const { process } = content;
  return (
    <section id="proceso" data-cms-section="process" aria-labelledby="proceso-title" className="px-3 sm:px-4">
      <div className="mx-auto max-w-[1400px] rounded-[28px] bg-azul bg-plano px-5 py-20 sm:rounded-[36px] sm:px-8 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeading id="proceso-title" tone="dark" eyebrow={process.eyebrow} title={process.title} lede={process.lede} />
          <ol className="mt-14 grid gap-4 md:grid-cols-5">
            {process.steps.map((s, i) => (
              <li key={i}>
                <Reveal delay={i * 0.08} className="relative flex h-full flex-col gap-4 rounded-[24px] bg-white/[0.05] p-6 ring-1 ring-inset ring-white/10">
                  <span className="relative grid size-12 place-items-center rounded-xl font-mono text-lg font-medium text-white ring-2 ring-inset ring-cal">
                    {i + 1}
                    {i === 0 && <span aria-hidden className="absolute left-full top-1/2 size-2.5 -translate-y-1/2 bg-oro" />}
                  </span>
                  <h3 className="font-display text-[1.15rem] font-bold leading-tight text-white [font-stretch:112%]">{s.title}</h3>
                  <p className="text-[15px] leading-relaxed text-on-azul-soft">{s.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
