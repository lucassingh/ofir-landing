import { cacheLife, cacheTag } from "next/cache";
import { buildSiteContent, type SiteContent } from "@ofir/content";
import { readContentDocument } from "@ofir/content/store";

export const CONTENT_TAG = "site-content";

/**
 * Textos y fotos de la web, editables desde el panel (apps/admin).
 *
 * Queda cacheado (la página sigue siendo estática) hasta que el panel avisa un
 * cambio en POST /api/revalidate. Igual se refresca solo una vez por día, por si
 * algún aviso no llegó. Si el almacenamiento falla, la función tira error y
 * Next sigue sirviendo la última versión buena (no vuelve a los textos originales).
 */
export async function getSiteContent(): Promise<SiteContent> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("days");
  const doc = await readContentDocument();
  const saved = Object.fromEntries(Object.entries(doc.sections).map(([key, record]) => [key, record?.data]));
  return buildSiteContent(saved);
}

/** Año cacheado (Cache Components no permite `new Date()` suelto al prerenderizar). */
export async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}
