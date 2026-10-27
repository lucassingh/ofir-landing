import { cn } from "@/lib/cn";

/** Etiqueta de sección: punto de oro (la "junta") + texto espaciado. */
export function Eyebrow({ children, tone = "light", className }: { children: React.ReactNode; tone?: "light" | "dark"; className?: string }) {
  return (
    <p
      className={cn(
        "flex items-center gap-2.5 font-display text-[12px] font-semibold uppercase tracking-[0.2em] [font-stretch:112%]",
        tone === "dark" ? "text-on-azul-soft" : "text-azul-2",
        className,
      )}
    >
      <span aria-hidden className="size-2 shrink-0 bg-oro" />
      {children}
    </p>
  );
}
