"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fondo animado del CTA: manchas de azul oscuro que derivan + grano.
 * Performance: solo se anima transform (lo resuelve la GPU, sin repintar), sin filter: blur,
 * y la animación se pausa cuando la card no está en pantalla.
 */
export function CtaGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} aria-hidden data-on={on} className="cta-glow pointer-events-none absolute inset-0 -z-20 overflow-hidden">
      <span className="cta-blob cta-blob-1" />
      <span className="cta-blob cta-blob-2" />
      <span className="cta-blob cta-blob-3" />
      <span className="cta-grain" />
    </div>
  );
}
