import { del, list, put } from "@vercel/blob";
import type { SectionKey } from "./types";

/**
 * Almacenamiento del contenido: archivos JSON en Vercel Blob (sin base de datos).
 *
 *   cms/content/<fecha>-<azar>.json   una versión por guardado. La más nueva es la
 *                                     publicada; quedan las últimas 30 como historial.
 *   cms/images/*                      fotos subidas desde el panel (las sube el navegador).
 *
 * Cada versión es un archivo nuevo con URL única y nunca se sobrescribe: el CDN
 * del store público no puede devolver una copia vieja. Cuál es la última se
 * pregunta con list(), que va a la API de Blob y no al CDN. (Un archivo fijo
 * sobrescrito puede tardar hasta 60 s en verse en un store público:
 * `useCache: false` solo saltea el CDN en stores privados.)
 *
 * En cada versión solo están las secciones que se editaron; el resto usa los
 * defaults del código.
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

type Version = { url: string; pathname: string; uploadedAt: Date };

const VERSIONS_PREFIX = "cms/content/";
const KEEP_VERSIONS = 30;
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

/** Versiones de la más nueva a la más vieja (el nombre empieza con la fecha en ms). */
async function listVersions(): Promise<Version[]> {
  const { blobs } = await list({ prefix: VERSIONS_PREFIX, limit: 1000 });
  return blobs.sort((a, b) => b.pathname.localeCompare(a.pathname) || b.uploadedAt.getTime() - a.uploadedAt.getTime());
}

async function fetchVersion(version: Version | undefined): Promise<ContentDocument> {
  if (!version) return EMPTY_DOCUMENT;
  const res = await fetch(version.url);
  if (!res.ok) throw new Error(`No se pudo leer el contenido (${res.status})`);
  return parseDocument(await res.json());
}

/**
 * Lo publicado. Sin token (desarrollo sin Blob) devuelve el documento vacío,
 * o sea, la web con sus textos originales. Los errores de red se propagan: en
 * la landing eso mantiene la última versión buena en vez de volver a los originales.
 */
export async function readContentDocument(): Promise<ContentDocument> {
  if (!isStoreConfigured()) return EMPTY_DOCUMENT;
  return fetchVersion((await listVersions())[0]);
}

// Nombres siempre crecientes aunque se guarde dos veces en el mismo milisegundo.
let lastStamp = 0;
function nextStamp() {
  lastStamp = Math.max(Date.now(), lastStamp + 1);
  return String(lastStamp).padStart(15, "0");
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Espera a que list() ya muestre la versión nueva: recién ahí se avisa a la web. */
async function listIncluding(url: string): Promise<Version[]> {
  let versions = await listVersions();
  for (let i = 0; i < 5 && !versions.some((v) => v.url === url); i++) {
    await sleep(400);
    versions = await listVersions();
  }
  return versions;
}

/**
 * Aplica un cambio sobre la última versión y guarda una nueva. Si otra persona
 * guardó en el medio, vuelve a aplicar el cambio sobre la versión de ella, así
 * la última incluye los dos cambios.
 */
async function update(change: (doc: ContentDocument, now: string) => ContentDocument): Promise<ContentDocument> {
  if (!isStoreConfigured()) throw new StoreNotConfiguredError();

  const ours = new Set<string>(); // versiones de intentos anteriores de este mismo guardado
  for (let attempt = 1; ; attempt++) {
    const base = (await listVersions()).find((v) => !ours.has(v.url));
    const now = new Date().toISOString();
    const next = { ...change(await fetchVersion(base), now), savedAt: now };

    const created = await put(`${VERSIONS_PREFIX}${nextStamp()}.json`, JSON.stringify(next), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: true,
      // nunca cambia: puede quedar en el CDN para siempre
      cacheControlMaxAge: 60 * 60 * 24 * 365,
    });
    ours.add(created.url);

    const versions = await listIncluding(created.url);
    const concurrent = versions.some((v) => !ours.has(v.url) && (!base || v.pathname > base.pathname));
    if (concurrent && attempt < MAX_ATTEMPTS) continue;

    // Historial: quedan las últimas 30. Si falla, lo publicado ya está bien.
    const old = versions.slice(KEEP_VERSIONS);
    if (old.length > 0) await del(old.map((v) => v.url)).catch((error) => console.warn("[cms] no se pudo podar el historial", error));
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
