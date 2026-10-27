import "server-only";

import { buildSiteContent, type SectionKey, type SiteContent } from "@ofir/content";
import { EMPTY_DOCUMENT, isStoreConfigured, readContentDocument, type ContentDocument } from "@ofir/content/store";
import { siteConfig } from "@/config/site";

export type StoreStatus =
  /** Blob conectado y leído bien. */
  | "ready"
  /** Falta BLOB_READ_WRITE_TOKEN: se ve lo original y no se puede guardar. */
  | "missing"
  /** Blob conectado pero la lectura falló: no se guarda para no pisar lo publicado. */
  | "error";

export type LoadedContent = { doc: ContentDocument; status: StoreStatus };

/** Lo publicado, siempre fresco (el panel nunca usa caché). */
export async function loadContent(): Promise<LoadedContent> {
  if (!isStoreConfigured()) return { doc: EMPTY_DOCUMENT, status: "missing" };
  try {
    return { doc: await readContentDocument(), status: "ready" };
  } catch (error) {
    console.error("[cms] no se pudo leer el contenido", error);
    return { doc: EMPTY_DOCUMENT, status: "error" };
  }
}

export function siteContentOf(doc: ContentDocument): SiteContent {
  const saved: Partial<Record<SectionKey, unknown>> = {};
  for (const [key, record] of Object.entries(doc.sections)) saved[key as SectionKey] = record?.data;
  return buildSiteContent(saved);
}

/**
 * Avisa a la web que hubo cambios (POST /api/revalidate). Con REVALIDATE_URLS se
 * puede avisar a más de una (ej. la web local y la de producción, que comparten
 * el mismo almacenamiento). Devuelve true solo si todas confirmaron.
 */
export async function notifySite(): Promise<boolean> {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) return false;
  const urls = (process.env.REVALIDATE_URLS || siteConfig.siteUrl)
    .split(",")
    .map((url) => url.trim().replace(/\/$/, ""))
    .filter(Boolean);

  const results = await Promise.allSettled(
    urls.map((url) =>
      fetch(`${url}/api/revalidate`, {
        method: "POST",
        headers: { authorization: `Bearer ${secret}` },
        signal: AbortSignal.timeout(8000),
      }).then((res) => res.ok),
    ),
  );
  const ok = results.every((r) => r.status === "fulfilled" && r.value);
  if (!ok) console.warn("[cms] la web no confirmó la actualización", urls, results);
  return ok;
}
