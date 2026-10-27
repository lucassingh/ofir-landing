import { cn } from "@/lib/cn";
import { Eyebrow } from "./Eyebrow";

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  tone = "light",
  id,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  id?: string;
  className?: string;
}) {
  return (
    <div className={cn("grid max-w-2xl gap-4", align === "center" && "mx-auto justify-items-center text-center", className)}>
      <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      <h2
        id={id}
        className={cn(
          "font-display stretch-expanded text-[clamp(2rem,4.4vw,3.4rem)] font-extrabold leading-[1.02] tracking-[-0.012em] text-balance",
          tone === "dark" ? "text-white" : "text-azul",
        )}
      >
        {title}
      </h2>
      {lede && <p className={cn("max-w-xl text-lg leading-relaxed", tone === "dark" ? "text-on-azul-soft" : "text-ink-soft")}>{lede}</p>}
    </div>
  );
}
