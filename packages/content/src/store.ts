import { BlobPreconditionFailedError, del, get, list, put } from "@vercel/blob";
import type { SectionKey } from "./types";

/**
 * Almacenamiento del contenido: un solo JSON en Vercel Blob (sin base de datos).
 *
 *   cms/content.json     lo publicado. Solo están las secciones que se editaron;
 *                        el resto usa los defaults del código.
 *   cms/history/*.json   copia de cada guardado (quedan las últimas 30), por si
 *                        hay que recuperar algo a mano.
 *   cms/images/*         fotos subidas desde el panel (las sube el navegador).
 *
 * Se lee con `useCache: false` (directo del origen, nunca una copia vieja del CDN)
 * y se escribe con `ifMatch`: si otra persona guardó en el medio, se vuelve a
 * leer y se aplica el cambio sobre su versión.
 */

export interface SectionRecord {
  data: unknown;
  updatedAt: string;
  /** Nombre (no email) de quien guardó: el JSON es público. */
  updatedBy: string;
}

export interface ContentDocument {
  version: 1;
  savedAt: string | null;
  sections: Partial<Record<SectionKey, SectionRecord>>;
}

const CONTENT_PATH = "cms/content.json";
const HISTORY_PREFIX = "cms/history/";
const KEEP_HISTORY = 30;
const MAX_ATTEMPTS = 3;

export const EMPTY_DOCUMENT: ContentDocument = { version: 1, savedAt: null, sections: {} };

export class StoreNotConfiguredError extends Error {
  constructor() {
    super("Falta BLOB_READ_WRITE_TOKEN: conectá el almacenamiento Blob al proyecto en Vercel.");
    this.name = "StoreNotConfiguredError";
  }
}

export function isStoreConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function parseDocument(raw: unknown): ContentDocument {
  if (!raw || typeof raw !== "object") return EMPTY_DOCUMENT;
  const { savedAt, sections } = raw as Partial<ContentDocument>;
  return {
    version: 1,
    savedAt: typeof savedAt === "string" ? savedAt : null,
    sections: sections && typeof sections === "object" && !Array.isArray(sections) ? sections : {},
  };
}

async function readWithEtag(): Promise<{ doc: ContentDocument; etag: string | null }> {
  const result = await get(CONTENT_PATH, { access: "public", useCache: false });
  if (!result || result.statusCode !== 200) return { doc: EMPTY_DOCUMENT, etag: null };
  return { doc: parseDocument(await new Response(result.stream).json()), etag: result.blob.etag };
}

/**
 * Lo publicado. Sin token (desarrollo sin Blob) devuelve el documento vacío,
 * o sea, la web con sus textos originales. Los errores de red se propagan: en
 * la landing eso mantiene la última versión buena en vez de volver a los originales.
 */
export async function readContentDocument(): Promise<ContentDocument> {
  if (!isStoreConfigured()) return EMPTY_DOCUMENT;
  return (await readWithEtag()).doc;
}

async function backup(doc: ContentDocument) {
  await put(`${HISTORY_PREFIX}${doc.savedAt?.replace(/[:.]/g, "-")}.json`, JSON.stringify(doc), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: true,
  });
  const { blobs } = await list({ prefix: HISTORY_PREFIX });
  const old = blobs.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()).slice(KEEP_HISTORY);
  if (old.length > 0) await del(old.map((b) => b.url));
}

async function update(change: (doc: ContentDocument, now: string) => ContentDocument): Promise<ContentDocument> {
  if (!isStoreConfigured()) throw new StoreNotConfiguredError();

  for (let attempt = 1; ; attempt++) {
    const { doc, etag } = await readWithEtag();
    const now = new Date().toISOString();
    const next = { ...change(doc, now), savedAt: now };
    try {
      await put(CONTENT_PATH, JSON.stringify(next), {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: false,
        cacheControlMaxAge: 60,
        ...(etag ? { ifMatch: etag } : { allowOverwrite: true }),
      });
    } catch (error) {
      if (error instanceof BlobPreconditionFailedError && attempt < MAX_ATTEMPTS) continue;
      throw error;
    }
    // La copia no bloquea el guardado: si falla, lo publicado ya está bien.
    await backup(next).catch((error) => console.warn("[cms] no se pudo guardar la copia de seguridad", error));
    return next;
  }
}

export function saveSection(key: SectionKey, data: unknown, updatedBy: string) {
  return update((doc, now) => ({ ...doc, sections: { ...doc.sections, [key]: { data, updatedAt: now, updatedBy } } }));
}

/** Vuelve la sección a sus textos y fotos originales. */
export function resetSection(key: SectionKey) {
  return update((doc) => {
    const sections = { ...doc.sections };
    delete sections[key];
    return { ...doc, sections };
  });
}
