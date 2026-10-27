"use client";

import { Globe } from "lucide-react";
import Image from "next/image";
import type { SeoContent } from "@ofir/content";
import { siteConfig } from "@/config/site";

const host = siteConfig.siteUrl.replace(/^https?:\/\//, "");

/** Cómo se ve en Google y al compartir el link: esta sección no aparece en la página. */
export function SeoPreview({ values }: { values: Partial<SeoContent> }) {
  const title = values.title?.trim() || "Sin título";
  const description = values.description?.trim() || "Sin descripción";
  const shareTitle = values.shareTitle?.trim() || title;

  return (
    <section aria-label="Vista previa en Google y al compartir" className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
        <p className="border-b border-border px-4 py-2 text-[13px] font-medium">En Google</p>
        {/* Colores de Google a propósito: la idea es reconocer el resultado tal como se ve. */}
        <div className="bg-white px-5 py-5 text-[#202124]">
          <div className="flex items-center gap-3">
            <span className="grid size-7 place-items-center rounded-full bg-[#f1f3f4]">
              <Image src="/brand/ofir_simbolo_color.svg" alt="" width={18} height={18} unoptimized />
            </span>
            <span className="leading-tight">
              <span className="block text-sm">OFIR</span>
              <span className="block text-xs text-[#4d5156]">https://{host}</span>
            </span>
          </div>
          <p className="mt-2 line-clamp-1 text-xl leading-snug text-[#1a0dab]">{title}</p>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-[#4d5156]">{description}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
        <p className="border-b border-border px-4 py-2 text-[13px] font-medium">Al compartir el link (WhatsApp, Facebook)</p>
        <div className="p-4">
          <div className="max-w-md overflow-hidden rounded-lg border border-border bg-canvas">
            <div className="relative aspect-[1200/630] bg-muted">
              <Image src={`${siteConfig.siteUrl}/opengraph-image.jpg`} alt="" fill unoptimized sizes="448px" className="object-cover" />
            </div>
            <div className="space-y-1 px-3.5 py-3">
              <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
                <Globe aria-hidden className="size-3" />
                {host}
              </p>
              <p className="line-clamp-2 text-sm font-semibold leading-snug">{shareTitle}</p>
              <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{description}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">La imagen es fija (la del diseño de la web).</p>
        </div>
      </div>
    </section>
  );
}
