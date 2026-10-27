"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { nav } from "@/content/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { Logo } from "@/components/ui/Logo";
import { WhatsAppIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

/**
 * Navbar flotante tipo "píldora" (referencia: biz-ideas). Blanca, centrada, con sombra suave
 * al scrollear. En mobile abre un panel con los anchors.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const [active, setActive] = useState<string | null>(null);

  // Navegación a anclas: primero se cierra el menú (libera el scroll del body) y recién después se desplaza.
  const goTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const el = document.getElementById(href.slice(1));
    if (!el) return;
    e.preventDefault();
    setOpen(false);
    // doble frame: espera a que el efecto libere el overflow del body antes de desplazar
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
        history.replaceState(null, "", href);
      }),
    );
  };

  useEffect(() => {
    // scroll-spy: la sección activa es la última cuyo borde superior pasó el 35 % de la pantalla
    const ids = nav.map((n) => n.href.slice(1));
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > 24);
      const line = window.innerHeight * 0.35;
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      // al llegar al final de la página, se marca la última (contacto)
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = ids[ids.length - 1];
      setActive(current);
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

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    // top 12px + alto 56px → centro a 40px = borde superior de la card del hero
    <header className="fixed inset-x-0 top-3 z-50 px-5 md:px-16">
      <nav
        aria-label="Principal"
        className={cn(
          "mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 rounded-full bg-white/90 pl-5 pr-1.5 backdrop-blur-md transition-shadow duration-300",
          scrolled ? "shadow-[0_12px_40px_-16px_rgba(22,50,79,0.35)]" : "shadow-[0_1px_0_rgba(22,50,79,0.06)]",
        )}
      >
        <Link href="/" aria-label="OFIR, inicio" className="shrink-0">
          <Logo height={26} priority />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={(e) => goTo(e, item.href)}
                aria-current={active === item.href.slice(1) ? "location" : undefined}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors duration-300",
                  active === item.href.slice(1) ? "bg-azul/[0.07] text-azul" : "text-grafito/80 hover:bg-page hover:text-azul",
                )}
              >
                {item.label}
                <span
                  aria-hidden
                  className={cn(
                    "absolute bottom-0.5 left-1/2 size-1 -translate-x-1/2 bg-oro transition-opacity duration-300",
                    active === item.href.slice(1) ? "opacity-100" : "opacity-0",
                  )}
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5">
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-azul px-5 text-[14px] font-medium text-white transition-colors hover:bg-azul-d"
          >
            <WhatsAppIcon className="size-4" />
            <span className="hidden sm:inline">Escribinos</span>
            <span className="sm:hidden">WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            className="grid size-11 place-items-center rounded-full text-azul hover:bg-page lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <div
        id="menu-mobile"
        hidden={!open}
        className="mx-auto mt-2 max-w-5xl rounded-[28px] bg-white p-3 shadow-card lg:hidden"
      >
        <ul className="grid">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={(e) => goTo(e, item.href)}
                aria-current={active === item.href.slice(1) ? "location" : undefined}
                className={cn(
                  "flex h-14 items-center gap-3 rounded-2xl px-4 font-display text-lg font-bold text-azul [font-stretch:112%] hover:bg-page",
                  active === item.href.slice(1) && "bg-page",
                )}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
