import { steps } from "@/content/steps";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/** Proceso en 5 pasos sobre card azul con grilla de plano. */
export function Process() {
  return (
    <section id="proceso" aria-labelledby="proceso-title" className="px-3 sm:px-4">
      <div className="mx-auto max-w-[1400px] rounded-[28px] bg-azul bg-plano px-5 py-20 sm:rounded-[36px] sm:px-8 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeading id="proceso-title" tone="dark" eyebrow="Cómo trabajamos" title="De tu mensaje a la obra terminada." lede="Un mismo equipo te acompaña de punta a punta." />
          <ol className="mt-14 grid gap-4 md:grid-cols-5">
            {steps.map((s, i) => (
              <li key={s.title}>
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
