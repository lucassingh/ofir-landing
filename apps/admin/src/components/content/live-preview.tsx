"use client";

import { Crosshair, Maximize2, Minimize2, Monitor, RotateCw, Smartphone } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { isPreviewReadyMessage, PREVIEW_PATH, type PreviewContentMessage } from "@ofir/content/preview";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { IconAction } from "./field-shell";

const DEVICES = {
  desktop: { label: "Computadora", icon: Monitor, width: 1280 },
  mobile: { label: "Celular", icon: Smartphone, width: 390 },
} as const;
type Device = keyof typeof DEVICES;

// siteUrl ya es un origen válido (ver config/site.ts)
const SITE_ORIGIN = siteConfig.siteUrl;
const PREVIEW_SRC = `${siteConfig.siteUrl}${PREVIEW_PATH}`;
const READY_TIMEOUT_MS = 15_000;

/**
 * La web real dentro de un iframe, alimentada con lo que se está escribiendo.
 * El iframe nunca se desmonta (cambiar de tamaño o agrandar solo cambia estilos),
 * así no se recarga la página.
 */
export function LivePreview({ content, target }: { content: unknown; target: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [device, setDevice] = useState<Device>("desktop");
  const [expanded, setExpanded] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  // El primer envío después de "ready" (o al pedir "volver a la sección") lleva la vista a la sección.
  const [scrollPending, setScrollPending] = useState(true);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== SITE_ORIGIN || event.source !== frame.current?.contentWindow) return;
      if (!isPreviewReadyMessage(event.data)) return;
      setReady(true);
      setFailed(false);
      setScrollPending(true);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    if (ready) return;
    const timer = setTimeout(() => setFailed(true), READY_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [ready, reloadKey]);

  // Manda el contenido (con una pausa corta mientras se escribe).
  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(
      () => {
        const message: PreviewContentMessage = { source: "ofir-admin", type: "content", content, focus: target, scroll: scrollPending };
        frame.current?.contentWindow?.postMessage(message, SITE_ORIGIN);
        if (scrollPending) setScrollPending(false);
      },
      scrollPending ? 0 : 150,
    );
    return () => clearTimeout(timer);
  }, [content, ready, target, scrollPending]);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setExpanded(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  const changeDevice = (next: Device) => {
    setDevice(next);
    setScrollPending(true);
  };
  const reload = useCallback(() => {
    setReady(false);
    setFailed(false);
    setReloadKey((k) => k + 1);
  }, []);

  const { width: deviceWidth } = DEVICES[device];
  const phone = device === "mobile";
  const inset = phone ? 16 : 0;
  const scale = size.width > 0 ? Math.min(1, (size.width - inset * 2) / deviceWidth) : 0;
  const frameBox = {
    width: deviceWidth * scale,
    height: Math.max(0, size.height - inset * 2),
    left: Math.max(0, (size.width - deviceWidth * scale) / 2),
    top: inset,
  };

  return (
    <>
      {expanded && <div aria-hidden className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px] animate-fade-in" onClick={() => setExpanded(false)} />}
      <section
        aria-label="Vista previa en vivo"
        className={cn(
          "flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-card",
          expanded && "fixed inset-3 z-50 shadow-popover sm:inset-6",
        )}
      >
        <header className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2">
          <p className="flex items-center gap-2 text-[13px] font-medium">
            <span aria-hidden className="relative flex size-2">
              {ready && <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />}
              <span className={cn("relative inline-flex size-2 rounded-full", ready ? "bg-success" : "bg-border-strong")} />
            </span>
            Vista previa en vivo
          </p>

          <div className="ml-auto flex items-center gap-1">
            <div role="group" aria-label="Tamaño de pantalla" className="flex rounded-lg bg-muted p-0.5">
              {(Object.keys(DEVICES) as Device[]).map((key) => {
                const { label, icon: Icon } = DEVICES[key];
                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={device === key}
                    onClick={() => changeDevice(key)}
                    className={cn(
                      "flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-[background-color,color,box-shadow] duration-150",
                      device === key ? "bg-surface text-foreground shadow-card" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon aria-hidden className="size-3.5" />
                    <span className="hidden sm:inline">{label}</span>
                    <span className="sr-only sm:hidden">{label}</span>
                  </button>
                );
              })}
            </div>
            <IconAction label="Volver a la sección que estás editando" onClick={() => setScrollPending(true)} disabled={!ready}>
              <Crosshair />
            </IconAction>
            <IconAction label={expanded ? "Achicar la vista previa" : "Ver la vista previa en grande"} onClick={() => setExpanded((v) => !v)}>
              {expanded ? <Minimize2 /> : <Maximize2 />}
            </IconAction>
          </div>
        </header>

        <div ref={box} className={cn("relative overflow-hidden bg-canvas", expanded ? "flex-1" : "h-[min(72dvh,780px)]")}>
          {scale > 0 && (
            <div
              className={cn(
                "absolute overflow-hidden bg-surface transition-[left,width,border-radius] duration-300 ease-snappy",
                phone && "shadow-popover ring-8 ring-foreground/90",
              )}
              style={{ ...frameBox, borderRadius: phone ? 28 : 0 }}
            >
              <iframe
                key={reloadKey}
                ref={frame}
                src={PREVIEW_SRC}
                title="Vista previa de la web con los cambios sin guardar"
                className="block origin-top-left border-0"
                style={{ width: deviceWidth, height: frameBox.height / scale, transform: `scale(${scale})` }}
              />
            </div>
          )}

          {!ready && (
            <div className="absolute inset-0 grid place-items-center bg-canvas/90">
              {failed ? (
                <div role="alert" className="max-w-xs space-y-3 px-6 text-center">
                  <p className="text-sm font-medium">No se pudo cargar la vista previa</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Revisá que la web esté funcionando en {siteConfig.siteUrl}. Podés seguir editando y guardar igual.
                  </p>
                  <Button type="button" variant="outline" size="sm" onClick={reload}>
                    <RotateCw aria-hidden />
                    Reintentar
                  </Button>
                </div>
              ) : (
                <div role="status" className="w-3/4 max-w-sm space-y-3">
                  <span className="sr-only">Cargando la vista previa…</span>
                  <Skeleton className="h-10 w-full rounded-full" />
                  <Skeleton className="h-40 w-full rounded-2xl" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              )}
            </div>
          )}
        </div>

        <p className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
          Así queda con lo que escribiste, antes de guardar. El formulario de contacto no envía nada desde acá.
        </p>
      </section>
    </>
  );
}
