/**
 * Vista previa en vivo: el panel muestra la landing real en un iframe
 * (`<web>/preview`) y le manda por postMessage el contenido que se está editando.
 *
 *   iframe → panel   { source: "ofir-preview", type: "ready" }   al montar
 *   panel → iframe   { source: "ofir-admin", type: "content", … } en cada cambio
 *
 * El iframe solo acepta mensajes del origen del panel (NEXT_PUBLIC_ADMIN_URL).
 */

export const PREVIEW_PATH = "/preview";

/**
 * Origen ("https://dominio.com") a partir de una URL cargada en una variable de
 * entorno. Tolera que falte https://, que sobre la barra final o que tenga
 * comillas. Si no sirve devuelve null: la app usa su valor por defecto en vez de
 * romperse al cargar.
 */
export function toOrigin(value: string | null | undefined): string | null {
  const raw = value?.trim().replace(/^["']+|["']+$/g, "").trim();
  if (!raw) return null;
  try {
    return new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`).origin;
  } catch {
    return null;
  }
}

export type PreviewReadyMessage = { source: "ofir-preview"; type: "ready" };

export type PreviewContentMessage = {
  source: "ofir-admin";
  type: "content";
  /** Contenido completo de la web (se normaliza del otro lado). */
  content: unknown;
  /** `data-cms-section` a mostrar. */
  focus: string | null;
  /** true = llevar la vista a esa sección (al abrir el editor), false = solo actualizar. */
  scroll: boolean;
};

export function isPreviewReadyMessage(data: unknown): data is PreviewReadyMessage {
  return typeof data === "object" && data !== null && (data as PreviewReadyMessage).source === "ofir-preview" && (data as PreviewReadyMessage).type === "ready";
}

export function isPreviewContentMessage(data: unknown): data is PreviewContentMessage {
  return typeof data === "object" && data !== null && (data as PreviewContentMessage).source === "ofir-admin" && (data as PreviewContentMessage).type === "content";
}
