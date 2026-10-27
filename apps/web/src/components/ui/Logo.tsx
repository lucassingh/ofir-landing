import Image from "next/image";
import { cn } from "@/lib/cn";

type Variant = "horizontal" | "horizontal-slogan" | "simbolo";
const RATIO: Record<Variant, number> = { horizontal: 446.78 / 108, "horizontal-slogan": 446.78 / 112.68, simbolo: 1 };

/** Logo desde public/brand (copiado de branding/logo/svg). Nunca redibujar el logo. */
export function Logo({
  variant = "horizontal",
  tone = "color",
  height = 32,
  className,
  priority,
}: {
  variant?: Variant;
  tone?: "color" | "negativo";
  height?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={`/brand/ofir_${variant}_${tone}.svg`}
      alt="OFIR"
      width={Math.round(height * RATIO[variant])}
      height={height}
      priority={priority}
      className={cn("h-auto select-none", className)}
      style={{ height, width: "auto" }}
      unoptimized
    />
  );
}
