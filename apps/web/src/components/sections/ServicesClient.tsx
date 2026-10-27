"use client";

import SpotlightCard from "@/components/reactbits/SpotlightCard";
import { motion, useReducedMotion } from "motion/react";

/** Card blanca con luz que sigue el cursor (React Bits · SpotlightCard), en Azul Plano. */
export function Spotlight({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <SpotlightCard theme="light" spotlightColor="#3A6A96" intensity={0.35} spotlightSize={320} className={className}>
      {children}
    </SpotlightCard>
  );
}

/**
 * Entrada sutil de las cards del bento: suben un poco, se aclaran y se enfocan,
 * escalonadas por fila (izquierda primero). Una sola vez. Respeta prefers-reduced-motion.
 */
export function BentoIn({ children, className, index }: { children: React.ReactNode; className?: string; index: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 36, scale: 0.97, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay: (index % 2) * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
