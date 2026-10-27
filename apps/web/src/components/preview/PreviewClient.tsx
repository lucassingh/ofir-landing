"use client";

import { useEffect, useState } from "react";
import { buildPreviewContent, type SiteContent } from "@ofir/content";
import { isPreviewContentMessage, toOrigin, type PreviewReadyMessage } from "@ofir/content/preview";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { LandingSections } from "@/components/sections/LandingSections";
import { PreviewModeContext } from "./PreviewMode";

/**
 * Orígenes que pueden mandar contenido: el panel en producción y, en desarrollo,
 * el panel local. toOrigin tolera la variable sin https:// o con barra final.
 */
const ALLOWED_ORIGINS = [
  toOrigin(process.env.NEXT_PUBLIC_ADMIN_URL),
  process.env.NODE_ENV === "development" ? "http://localhost:3001" : null,
].filter((origin): origin is string => origin !== null);

/** Altura de la navbar fija + aire: la sección enfocada queda justo debajo. */
const NAV_OFFSET = 84;

/**
 * La landing real, alimentada por el panel. Arranca con lo publicado y se
 * redibuja con cada mensaje del editor (ver packages/content/src/preview.ts).
 */
export function PreviewClient({ initial, year }: { initial: SiteContent; year: number }) {
  const [content, setContent] = useState(initial);
  const [focus, setFocus] = useState<{ target: string; nonce: number } | null>(null);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (!ALLOWED_ORIGINS.includes(event.origin) || !isPreviewContentMessage(event.data)) return;
      setContent(buildPreviewContent(event.data.content));
      const target = event.data.focus;
      if (event.data.scroll && target) setFocus({ target, nonce: Date.now() });
    };
    window.addEventListener("message", onMessage);
    // avisa al panel que ya puede mandar el contenido
    const ready: PreviewReadyMessage = { source: "ofir-preview", type: "ready" };
    window.parent?.postMessage(ready, "*");
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Lleva la vista a la sección que se edita (después de pintar el contenido nuevo).
  useEffect(() => {
    if (!focus) return;
    const el = document.querySelector<HTMLElement>(`[data-cms-section="${focus.target}"]`);
    if (!el) return;
    const top = focus.target === "hero" ? 0 : el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top, behavior: "instant" });
  }, [focus]);

  return (
    <PreviewModeContext value={true}>
      <SiteChrome content={content} year={year}>
        <LandingSections content={content} />
      </SiteChrome>
    </PreviewModeContext>
  );
}
