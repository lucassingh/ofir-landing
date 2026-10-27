"use client";

import { createContext, useContext } from "react";
import BlurText from "@/components/reactbits/BlurText";
import dynamic from "next/dynamic";

const rotatingClass = "whitespace-nowrap rounded-xl bg-white/10 px-3 py-1 font-display font-bold text-white [font-stretch:112%]";

// El `loading` de next/dynamic no recibe props: el primer texto le llega por contexto.
const FirstText = createContext("");
function RotatingFallback() {
  return <span className={rotatingClass}>{useContext(FirstText)}</span>;
}

// RotatingText usa Math.random() al renderizar: se carga solo en el cliente (no rompe el prerender).
const RotatingText = dynamic(() => import("@/components/reactbits/RotatingText"), {
  ssr: false,
  loading: RotatingFallback,
});
import Magnet from "@/components/reactbits/Magnet";
import { motion, useReducedMotion } from "motion/react";

/** Islas cliente del hero: el resto del hero se renderiza en el servidor. */
export function HeroTitle({ text }: { text: string }) {
  return <BlurText text={text} animateBy="words" direction="bottom" delay={90} trigger="load" className="!inline-flex" />;
}

export function HeroRotating({ texts }: { texts: string[] }) {
  // Con un solo texto no hay nada que rotar.
  if (texts.length < 2) return <span className={rotatingClass}>{texts[0]}</span>;
  return (
    <FirstText value={texts[0]}>
      <RotatingText
        // si cambia la lista (vista previa del panel), arranca de nuevo desde el primero
        key={texts.join("|")}
        texts={texts}
        rotationInterval={2400}
        staggerDuration={0.02}
        staggerFrom="first"
        mainClassName={rotatingClass}
        splitLevelClassName="overflow-hidden"
      />
    </FirstText>
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
