"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { ProjectItem } from "@ofir/content";
import { cn } from "@/lib/cn";

type Item = ProjectItem & { key: string };

export function ProjectsGallery({ items, filters }: { items: Item[]; filters: { id: string; label: string }[] }) {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState("todas");
  const [open, setOpen] = useState<{ item: Item; index: number } | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const visible = useMemo(() => (filter === "todas" ? items : items.filter((p) => p.service === filter)), [filter, items]);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const step = useCallback(
    (dir: 1 | -1) =>
      setOpen((o) => (o ? { ...o, index: (o.index + dir + o.item.photos.length) % o.item.photos.length } : o)),
    [],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  return (
    <>
      <div role="tablist" aria-label="Filtrar obras" className="mt-10 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            role="tab"
            aria-selected={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "h-11 rounded-full px-5 text-[14px] font-medium transition-colors",
              filter === f.id ? "bg-azul text-white" : "bg-white text-grafito shadow-card hover:text-azul",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <motion.ul layout className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((p, i) => (
            <motion.li
              key={p.key}
              layout
              // misma entrada que el bento de servicios: sube, se agranda apenas y se enfoca; escalonada por columna
              initial={reduce ? false : { opacity: 0, y: 36, scale: 0.97, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.2 }}
              exit={{ opacity: 0, scale: 0.96, filter: "blur(6px)", transition: { duration: 0.25 } }}
              transition={{ duration: 0.9, delay: (i % 3) * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                onClick={() => setOpen({ item: p, index: 0 })}
                className="group relative block aspect-[4/5] w-full overflow-hidden rounded-[28px] bg-surface-2 text-left shadow-card"
                aria-label={`Ver obra: ${p.title} (${p.photos.length} fotos)`}
              >
                <Image src={p.photos[0]} alt="" fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                <span aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-azul/85 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 font-mono text-[11px] text-azul">
                  {p.photos.length} {p.photos.length === 1 ? "foto" : "fotos"}
                </span>
                <span className="absolute inset-x-0 bottom-0 grid gap-1 p-6">
                  <span className="font-display text-[1.35rem] font-bold leading-tight text-white [font-stretch:112%]">{p.title}</span>
                  <span className="text-[14px] leading-snug text-on-azul-soft">{p.summary}</span>
                </span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === dialogRef.current && setOpen(null)}
        aria-label={open?.item.title}
        className="m-auto w-[min(1000px,94vw)] rounded-[28px] bg-white p-0 backdrop:bg-azul-d/80 backdrop:backdrop-blur-sm"
      >
        {open && (
          <div className="grid gap-0 md:grid-cols-[1.4fr_1fr]">
            <div className="relative aspect-square bg-surface-2">
              <Image src={open.item.photos[open.index]} alt={`${open.item.title}, foto ${open.index + 1}`} fill sizes="(min-width:768px) 60vw, 94vw" className="object-cover" />
              {open.item.photos.length > 1 && (
                <>
                  <button onClick={() => step(-1)} aria-label="Foto anterior" className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-azul"><ChevronLeft className="size-5" /></button>
                  <button onClick={() => step(1)} aria-label="Foto siguiente" className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-azul"><ChevronRight className="size-5" /></button>
                </>
              )}
            </div>
            <div className="flex flex-col gap-4 p-7">
              <button onClick={() => setOpen(null)} aria-label="Cerrar" className="ml-auto grid size-10 place-items-center rounded-full bg-page text-azul"><X className="size-5" /></button>
              <h3 className="font-display text-2xl font-bold text-azul [font-stretch:112%]">{open.item.title}</h3>
              <p className="text-ink-soft">{open.item.summary}</p>
              <p className="font-mono text-[12px] text-ink-soft">Foto {open.index + 1} de {open.item.photos.length}</p>
              <div className="mt-auto flex flex-wrap gap-2">
                {open.item.photos.map((src, i) => (
                  <button key={src} onClick={() => setOpen({ ...open, index: i })} aria-label={`Ver foto ${i + 1}`} className={cn("relative size-14 overflow-hidden rounded-xl ring-2", i === open.index ? "ring-azul" : "ring-transparent")}>
                    <Image src={src} alt="" fill sizes="56px" className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
