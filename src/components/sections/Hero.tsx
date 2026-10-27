import { ArrowDown, ArrowUpRight } from "lucide-react";
import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ObraFrame } from "@/components/ui/ObraFrame";
import { WhatsAppIcon } from "@/components/ui/icons";
import { HeroTitle, HeroRotating, MagneticWhatsApp, HeroPhoto } from "./HeroClient";

const proof = ["Presupuesto sin cargo", "Garantía hasta 10 años", "Pago en cuotas · con factura"];

export function Hero() {
  return (
    // Margen parejo alrededor de la card: arriba = centro de la navbar (40px); a los lados y abajo, lo mismo desde md.
    <section aria-labelledby="hero-title" className="px-3 pt-10 sm:px-5 md:p-10 md:pt-10">
      <div className="relative isolate overflow-hidden rounded-[28px] bg-azul text-on-azul-soft sm:rounded-[36px] md:flex md:min-h-[calc(100svh-80px)] md:items-center md:rounded-br-none">
        {/* fondo: degradé sutil de azules del manual + grilla de plano encima */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(90%_75%_at_88%_8%,rgba(58,106,150,0.55)_0%,rgba(58,106,150,0)_60%),radial-gradient(70%_60%_at_0%_100%,rgba(15,36,64,0.9)_0%,rgba(15,36,64,0)_70%),linear-gradient(165deg,#1A3A5B_0%,#16324F_45%,#0F2440_100%)]" />
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 bg-plano" />
        {/* símbolo recortado (recurso del manual) */}
        <svg aria-hidden viewBox="0 0 100 100" className="pointer-events-none absolute -bottom-64 -right-64 -z-10 w-[760px] opacity-[0.06]">
          <path fill="#F5F3EF" d="M0 0H74V22H30A8 8 0 0 0 22 30V74H0Z" />
          <path fill="#F5F3EF" d="M100 26V100H26V78H70A8 8 0 0 0 78 70V26Z" />
          <path fill="#F5F3EF" d="M78 0H100V22H78Z" />
          <path fill="#F5F3EF" d="M0 78H22V100H0Z" />
        </svg>

        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 pb-16 pt-28 sm:px-10 md:pb-[clamp(84px,12svh,112px)] md:pt-[clamp(64px,10svh,96px)] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-7 [@media(max-height:820px)]:gap-5">
            <Eyebrow tone="dark">En {site.address.city}, {site.address.region}</Eyebrow>
            <h1 id="hero-title" className="font-display stretch-expanded text-[clamp(2.5rem,6vw,4.6rem)] [@media(min-width:768px)_and_(max-height:760px)]:text-[clamp(2.5rem,5vw,3.9rem)] font-extrabold leading-[0.98] tracking-[-0.015em] text-white">
              <HeroTitle text="Ingeniería y oficio, a tu medida." />
            </h1>
            <p className="flex flex-col items-start gap-x-3 gap-y-2 text-[clamp(1.15rem,2vw,1.45rem)] text-on-azul-soft sm:flex-row sm:flex-wrap sm:items-baseline">
              <span>Hacemos</span>
              <HeroRotating texts={["rejas y portones", "estructuras metálicas", "pisos epoxi", "techos impermeables", "muebles de hierro y madera"]} />
            </p>
            <p className="max-w-xl text-[17px] leading-relaxed">
              Herrería industrial y doméstica, pisos epoxi e impermeabilización con línea PROTEX. Medimos, te asesoramos y te pasamos el presupuesto sin cargo.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <MagneticWhatsApp>
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-14 items-center gap-3 rounded-full bg-white pl-5 pr-6 text-[16px] font-semibold text-azul shadow-[0_18px_40px_-18px_rgba(0,0,0,0.6)] transition-colors hover:bg-cal"
                >
                  <WhatsAppIcon className="size-5" />
                  Escribinos por WhatsApp
                </a>
              </MagneticWhatsApp>
              <a href="#contacto" className="inline-flex h-14 items-center gap-2 rounded-full px-6 text-[16px] font-medium text-white ring-1 ring-inset ring-white/25 transition-colors hover:bg-white/10">
                Pedir presupuesto <ArrowDown className="size-4" />
              </a>
            </div>
          </div>

          {/* pack de fotos: el tinglado manda (grande), la mesa acompaña */}
          <div className="relative hidden h-[clamp(440px,calc(100svh-300px),580px)] lg:block">
            <HeroPhoto delay={0.35} className="absolute right-0 top-0 h-[76%] aspect-[45/44] max-w-full">
              <ObraFrame tone="cal" priority src="/proyectos/cabreadas-galpon/01_cabreadas-y-galpon.jpg" alt="Cabreadas metálicas de un galpón hechas por OFIR" position="50% 70%" sizes="450px" className="h-full w-full" />
            </HeroPhoto>
            <HeroPhoto delay={0.6} className="absolute bottom-0 -left-6 aspect-square h-[38%]">
              <ObraFrame tone="cal" src="/proyectos/muebles-metal-y-madera/02_mesa-ratona.jpg" alt="Mesa ratona de madera maciza y hierro hecha por OFIR" sizes="220px" className="h-full w-full" />
            </HeroPhoto>
          </div>
        </div>

        {/* muesca inferior derecha con pruebas (patrón de la referencia).
            La card no tiene radio en esa esquina y las "orejas" (before/after) dibujan las curvas
            cóncavas con un radial-gradient: no queda ningún borde antialiaseado de la card a la vista. */}
        <div
          className={
            "absolute bottom-0 right-0 hidden rounded-tl-[32px] bg-page py-6 pl-9 pr-10 md:block " +
            "before:pointer-events-none before:absolute before:bottom-full before:right-0 before:size-8 before:bg-[radial-gradient(circle_at_0_0,transparent_31.5px,var(--page)_32px)] before:content-[''] " +
            "after:pointer-events-none after:absolute after:bottom-0 after:right-full after:size-8 after:bg-[radial-gradient(circle_at_0_0,transparent_31.5px,var(--page)_32px)] after:content-['']"
          }
        >
          <ul className="flex gap-8 text-[16px] font-medium text-azul">
            {proof.map((p) => (
              <li key={p} className="flex items-center gap-2.5"><ArrowUpRight className="size-[18px] text-oro" strokeWidth={2.4} />{p}</li>
            ))}
          </ul>
        </div>
      </div>

      <ul className="mt-4 grid gap-2.5 px-2 text-[15px] font-medium text-azul md:hidden">
        {proof.map((p) => (
          <li key={p} className="flex items-center gap-2"><ArrowUpRight className="size-[18px] text-oro" strokeWidth={2.4} />{p}</li>
        ))}
      </ul>
    </section>
  );
}
