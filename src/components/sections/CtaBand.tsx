import { ArrowDown } from "lucide-react";
import { whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/icons";
import { CtaGlow } from "./CtaGlow";

/** Banda de cierre antes del contacto: el último empujón a WhatsApp. */
export function CtaBand() {
  return (
    <section aria-labelledby="cta-title" className="px-3 sm:px-4">
      <div className="relative isolate mx-auto max-w-[1400px] overflow-hidden rounded-[28px] bg-azul-2 px-6 py-20 text-center sm:rounded-[36px] lg:py-28">
        {/* degradé animado + grano (ver CtaGlow: pausado fuera de pantalla) */}
        <CtaGlow />
        <svg aria-hidden viewBox="0 0 100 100" className="pointer-events-none absolute -left-32 -top-32 -z-10 w-[520px] opacity-[0.1]">
          <path fill="#fff" d="M0 0H74V22H30A8 8 0 0 0 22 30V74H0Z" /><path fill="#fff" d="M100 26V100H26V78H70A8 8 0 0 0 78 70V26Z" /><path fill="#fff" d="M78 0H100V22H78Z" /><path fill="#fff" d="M0 78H22V100H0Z" />
        </svg>
        <h2 id="cta-title" className="mx-auto max-w-3xl font-display stretch-expanded text-[clamp(2.2rem,5vw,4rem)] font-extrabold leading-[1] text-white text-balance">
          ¿Tenés un trabajo en mente?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/85">Contanos qué necesitás. Medimos, te asesoramos y te pasamos el número sin cargo.</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="inline-flex h-14 items-center gap-3 rounded-full bg-white px-6 font-semibold text-azul hover:bg-cal">
            <WhatsAppIcon /> Escribinos por WhatsApp
          </a>
          <a href="#contacto" className="inline-flex h-14 items-center gap-2 rounded-full px-6 font-medium text-white ring-1 ring-inset ring-white/35 hover:bg-white/10">
            Completar el formulario <ArrowDown className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
