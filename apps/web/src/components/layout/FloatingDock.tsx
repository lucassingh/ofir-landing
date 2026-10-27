"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

/**
 * Elementos flotantes:
 *  - Hub de redes (Instagram + WhatsApp) pegado al lado izquierdo.
 *  - Botón "volver arriba" a la derecha, con anillo de progreso de lectura.
 * Aparecen al llegar a la sección de servicios ("Tres frentes, un mismo taller")
 * y se ocultan antes del footer. Un solo listener de scroll con requestAnimationFrame.
 */
export function FloatingDock({
  instagram,
  whatsapp,
}: {
  instagram: { url: string; handle: string };
  whatsapp: { href: string; display: string };
}) {
  const [show, setShow] = useState(false);
  const ring = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const start = document.getElementById("servicios");
    const footer = document.querySelector("footer");
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const started = start ? start.getBoundingClientRect().top < vh * 0.6 : window.scrollY > vh;
      const beforeFooter = footer ? footer.getBoundingClientRect().top > vh - 40 : true;
      setShow(started && beforeFooter);
      const max = document.documentElement.scrollHeight - vh;
      if (ring.current && max > 0) ring.current.style.strokeDashoffset = String(1 - window.scrollY / max);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  const social = [
    { href: instagram.url, label: "Instagram", hint: instagram.handle, Icon: InstagramIcon },
    { href: whatsapp.href, label: "WhatsApp", hint: whatsapp.display, Icon: WhatsAppIcon },
  ];

  return (
    <>
      {/* Hub de redes: vertical al costado en desktop, abajo a la izquierda en mobile */}
      <nav
        aria-label="Redes de OFIR"
        inert={!show}
        className={cn(
          "fixed bottom-4 left-4 z-40 flex gap-1.5 rounded-full bg-white/90 p-1.5 shadow-[0_16px_40px_-16px_rgba(22,50,79,0.45)] ring-1 ring-line backdrop-blur-md",
          "transition-[translate,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "lg:bottom-auto lg:left-5 lg:top-1/2 lg:-translate-y-1/2 lg:flex-col",
          show ? "translate-x-0 opacity-100" : "-translate-x-[calc(100%+24px)] opacity-0",
        )}
      >
        {social.map(({ href, label, hint, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${label}: ${hint}`}
            className="group relative grid size-11 place-items-center rounded-full text-azul transition-colors hover:bg-azul hover:text-white focus-visible:bg-azul focus-visible:text-white"
          >
            <Icon className="size-5" />
            {/* etiqueta al pasar el mouse (desktop) */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-full bg-azul px-3 py-1.5 font-mono text-[12px] text-white opacity-0 shadow-card transition-[opacity,translate] duration-300 -translate-x-1 group-hover:translate-x-0 group-hover:opacity-100 lg:block"
            >
              {hint}
            </span>
          </a>
        ))}
        <span aria-hidden className="mx-auto hidden h-px w-5 bg-line-2 lg:block" />
        <span aria-hidden className="mx-auto mb-1 hidden size-1.5 bg-oro lg:block" />
      </nav>

      {/* Volver arriba */}
      <button
        type="button"
        onClick={toTop}
        aria-label="Volver arriba"
        inert={!show}
        className={cn(
          "fixed bottom-4 right-4 z-40 grid size-14 place-items-center rounded-full bg-azul text-white shadow-[0_16px_32px_-12px_rgba(22,50,79,0.6)] lg:bottom-6 lg:right-6",
          "transition-[translate,opacity,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-azul-d",
          show ? "translate-y-0 opacity-100" : "translate-y-[calc(100%+32px)] opacity-0",
        )}
      >
        <svg aria-hidden viewBox="0 0 56 56" className="absolute inset-0 -rotate-90">
          <circle cx="28" cy="28" r="25" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
          <circle ref={ring} cx="28" cy="28" r="25" fill="none" stroke="#B8862B" strokeWidth="2" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset="1" />
        </svg>
        <ArrowUp className="relative size-5" />
      </button>
    </>
  );
}
