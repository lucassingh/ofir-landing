import Image from "next/image";
import { ArrowUpRight, Check } from "lucide-react";
import { services } from "@/content/services";
import { whatsappUrl } from "@/lib/whatsapp";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Spotlight, BentoIn } from "./ServicesClient";
import { cn } from "@/lib/cn";

/**
 * Bento de servicios (cards blancas grandes, estilo Apple). Industria ocupa la card ancha
 * con foto; el resto alterna. Cada card tiene su CTA a WhatsApp con mensaje precargado.
 */
export function Services() {
  const layout = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"];
  return (
    <section id="servicios" aria-labelledby="servicios-title" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
      <SectionHeading
        id="servicios-title"
        eyebrow="Qué hacemos"
        title={<>Tres frentes,<br />un mismo taller.</>}
        lede="De una estructura para tu planta a la mesa de tu local. Todo se diseña, se fabrica y se termina en nuestro taller."
      />

      <div className="mt-14 grid gap-4 lg:grid-cols-12">
        {services.map((s, i) => (
          <BentoIn key={s.id} index={i} className={cn(layout[i])}>
            <Spotlight className="flex h-full flex-col !rounded-[28px] !p-0">
              <div className={cn("relative overflow-hidden", i % 3 === 0 ? "aspect-[16/9]" : "aspect-[16/10]")}>
                <Image src={s.photo} alt={s.photoAlt} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover transition-transform duration-700 hover:scale-[1.03]" />
                <span className="absolute left-5 top-5 rounded-full bg-white/92 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-azul backdrop-blur">
                  {s.kicker}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-4 p-7 sm:p-8">
                <h3 className="font-display text-[1.6rem] font-bold leading-tight text-azul [font-stretch:112%]">{s.title}</h3>
                <p className="text-[16px] leading-relaxed text-ink-soft">{s.summary}</p>
                <ul className="grid gap-2 text-[15px] text-grafito sm:grid-cols-2">
                  {s.items.map((it) => (
                    <li key={it} className="flex gap-2.5"><Check className="mt-0.5 size-4 shrink-0 text-azul-2" />{it}</li>
                  ))}
                </ul>
                <a
                  href={whatsappUrl(s.waMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-1.5 pt-3 font-mono text-[12px] font-medium uppercase tracking-[0.12em] text-azul hover:text-azul-2"
                >
                  Consultar por WhatsApp <ArrowUpRight className="size-4" />
                </a>
              </div>
            </Spotlight>
          </BentoIn>
        ))}
      </div>
    </section>
  );
}
