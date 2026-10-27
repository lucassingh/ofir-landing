"use client";

import AnimatedContent from "@/components/reactbits/AnimatedContent";

/** Aparición suave al scrollear (React Bits · AnimatedContent). Respeta prefers-reduced-motion. */
export function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <AnimatedContent distance={40} duration={0.8} ease="power3.out" initialOpacity={0} delay={delay} threshold={0.15} once className={className}>
      {children}
    </AnimatedContent>
  );
}
