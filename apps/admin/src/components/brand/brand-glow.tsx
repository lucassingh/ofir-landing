"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fondo animado del bloque de marca: manchas de azul profundo que derivan +
 * grano. Igual al CTA de la web. Se pausa cuando no está en pantalla; con
 * prefers-reduced-motion queda quieto (regla global de globals.css).
 */
export function BrandGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOn(entry.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} aria-hidden data-on={on} className="brand-glow pointer-events-none absolute inset-0 -z-20 overflow-hidden">
      <span className="brand-blob brand-blob-1" />
      <span className="brand-blob brand-blob-2" />
      <span className="brand-blob brand-blob-3" />
      <span className="brand-grain" />
    </div>
  );
}

/** Símbolo recortado (recurso del manual), decorativo. */
export function BrandSymbolCutout({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 100 100" className={className}>
      <path fill="currentColor" d="M0 0H74V22H30A8 8 0 0 0 22 30V74H0Z" />
      <path fill="currentColor" d="M100 26V100H26V78H70A8 8 0 0 0 78 70V26Z" />
      <path fill="currentColor" d="M78 0H100V22H78Z" />
      <path fill="currentColor" d="M0 78H22V100H0Z" />
    </svg>
  );
}
