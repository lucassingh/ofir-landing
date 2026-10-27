"use client";

import BlurText from "@/components/reactbits/BlurText";
import dynamic from "next/dynamic";

// RotatingText usa Math.random() al renderizar: se carga solo en el cliente (no rompe el prerender).
const RotatingText = dynamic(() => import("@/components/reactbits/RotatingText"), {
  ssr: false,
  loading: () => <span className="whitespace-nowrap rounded-xl bg-white/10 px-3 py-1 font-display font-bold text-white [font-stretch:112%]">rejas y portones</span>,
});
import Magnet from "@/components/reactbits/Magnet";
import { motion, useReducedMotion } from "motion/react";

/** Islas cliente del hero: el resto del hero se renderiza en el servidor. */
export function HeroTitle({ text }: { text: string }) {
  return <BlurText text={text} animateBy="words" direction="bottom" delay={90} trigger="load" className="!inline-flex" />;
}

export function HeroRotating({ texts }: { texts: string[] }) {
  return (
    <RotatingText
      texts={texts}
      rotationInterval={2400}
      staggerDuration={0.02}
      staggerFrom="first"
      mainClassName="whitespace-nowrap rounded-xl bg-white/10 px-3 py-1 font-display font-bold text-white [font-stretch:112%]"
      splitLevelClassName="overflow-hidden"
    />
  );
}

export function MagneticWhatsApp({ children }: { children: React.ReactNode }) {
  return (
    <Magnet padding={60} magnetStrength={4}>
      {children}
    </Magnet>
  );
}

/**
 * Entrada de las fotos del hero con el mismo lenguaje que el título (BlurText):
 * desenfoque → nítido, subiendo, escalonado. Respeta prefers-reduced-motion.
 */
export function HeroPhoto({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, filter: "blur(14px)", y: 48, scale: 0.97 }}
      animate={{ opacity: 1, filter: "blur(0px)", y: 0, scale: 1 }}
      transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
