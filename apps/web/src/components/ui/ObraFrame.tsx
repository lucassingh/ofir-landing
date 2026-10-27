import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Marco de obra (recurso del manual): esquinas en L + punto de oro.
 * Envuelve fotos reales de trabajos.
 */
export function ObraFrame({
  src,
  alt,
  className,
  tone = "azul",
  sizes = "(min-width: 1024px) 40vw, 90vw",
  priority,
  position = "50% 50%",
}: {
  src: string;
  alt: string;
  className?: string;
  tone?: "azul" | "cal";
  sizes?: string;
  priority?: boolean;
  position?: string;
}) {
  const c = tone === "azul" ? "border-azul" : "border-cal";
  return (
    <figure className={cn("relative p-2.5", className)}>
      <span aria-hidden className={cn("absolute left-0 top-0 z-10 size-14 border-l-[6px] border-t-[6px]", c)} />
      <span aria-hidden className={cn("absolute bottom-0 right-0 z-10 size-14 border-b-[6px] border-r-[6px]", c)} />
      <span aria-hidden className="absolute right-0 top-0 z-10 size-[6px] bg-oro" />
      <div className="relative h-full w-full overflow-hidden rounded-[18px] bg-surface-2">
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" style={{ objectPosition: position }} />
      </div>
    </figure>
  );
}
