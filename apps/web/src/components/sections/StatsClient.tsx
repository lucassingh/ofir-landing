"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { motion, motionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import CountUp from "@/components/reactbits/CountUp";

export function StatNumber({ to, prefix, suffix }: { to: number; prefix?: string; suffix?: string }) {
  if (to === 0) return <span>{prefix}0{suffix}</span>;
  return <CountUp to={to} duration={1.6} prefix={prefix} suffix={suffix} trigger="view" />;
}

/**
 * Animación ligada al scroll, solo de entrada:
 * los cubos llegan abiertos desde los costados y se juntan en el centro cuando la sección
 * llega a la pantalla. Una vez armados quedan fijos (no se desarman al salir ni al volver).
 * En mobile (una columna) solo suben y se asientan. Respeta prefers-reduced-motion.
 */
// valor estático para cuando no hay animación (los hooks se llaman siempre en el mismo orden)
const progressZero = motionValue(0.5);

const Ctx = createContext<{ progress: MotionValue<number> | null; wide: boolean; total: number }>({ progress: null, wide: false, total: 4 });

export function StatsDeck({ children, className, total }: { children: React.ReactNode; className?: string; total: number }) {
  const ref = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();
  const [wide, setWide] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const [done, setDone] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!done && v >= 0.4) setDone(true);
  });

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  return (
    <Ctx.Provider value={{ progress: reduce || done ? null : scrollYProgress, wide, total }}>
      <ul ref={ref} className={className}>{children}</ul>
    </Ctx.Provider>
  );
}

export function StatCard({ index, className, children }: { index: number; className?: string; children: React.ReactNode }) {
  const { progress, wide, total } = useContext(Ctx);
  const p = progress ?? progressZero;
  // posición relativa al centro: -1.5, -0.5, 0.5, 1.5
  const dir = index - (total - 1) / 2;
  const stops = [0.05, 0.4];
  const x = useTransform(p, stops, wide ? [dir * 160, 0] : [0, 0]);
  const y = useTransform(p, stops, wide ? [Math.abs(dir) * 40, 0] : [50, 0]);
  const rotate = useTransform(p, stops, wide ? [dir * 5, 0] : [0, 0]);
  const opacity = useTransform(p, stops, [0.15, 1]);
  const scale = useTransform(p, stops, [0.92, 1]);

  if (!progress) return <li className={className}>{children}</li>;
  return (
    <motion.li className={className} style={{ x, y, rotate, opacity, scale }}>
      {children}
    </motion.li>
  );
}
