"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Entrada lateral sutil: la card llega desde un costado hacia el centro, se aclara y se enfoca.
 * Una sola vez al entrar en pantalla. Respeta prefers-reduced-motion.
 * El contenedor padre debería tener overflow-x-clip para no generar scroll horizontal.
 */
export function SlideIn({
  children,
  className,
  from = "left",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  from?: "left" | "right";
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, x: from === "left" ? -90 : 90, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
