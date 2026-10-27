import { buildSectionSchema, type SectionSchema } from "./schema";
import { SECTIONS, SECTION_ORDER, type SiteContent } from "./sections";
import type { Field, LeafField, SectionDefinition, SectionKey } from "./types";

export * from "./types";
export * from "./sections";
export { buildSectionSchema } from "./schema";

const schemaCache = new Map<SectionKey, SectionSchema>();

export function getSectionSchema(key: SectionKey): SectionSchema {
  let schema = schemaCache.get(key);
  if (!schema) {
    schema = buildSectionSchema(SECTIONS[key].groups);
    schemaCache.set(key, schema);
  }
  return schema;
}

export function isSectionKey(value: string): value is SectionKey {
  return (SECTION_ORDER as string[]).includes(value);
}

export function getSectionDefinition(key: SectionKey): SectionDefinition<SiteContent[SectionKey]> {
  return SECTIONS[key] as SectionDefinition<SiteContent[SectionKey]>;
}

export function sectionFields(key: SectionKey): Field[] {
  return SECTIONS[key].groups.flatMap((g) => g.fields);
}

// ─────────────────────────────────────────────────────────────────────────────
// Normalización: lleva cualquier JSON a la forma de la sección (sin validar límites)
// ─────────────────────────────────────────────────────────────────────────────

type Values = Record<string, unknown>;

const isObject = (v: unknown): v is Values => typeof v === "object" && v !== null && !Array.isArray(v);

function emptyLeaf(field: LeafField): unknown {
  switch (field.kind) {
    case "number":
      return field.min;
    case "boolean":
      return true;
    case "gallery":
    case "stringList":
      return [];
    case "select":
      return field.options[0]?.value ?? "";
    default:
      return "";
  }
}

/** Ítem vacío de una lista (lo que agrega el botón "Agregar" del panel). */
export function emptyListItem(fields: LeafField[]): Values {
  return Object.fromEntries(fields.map((f) => [f.key, emptyLeaf(f)]));
}

function normalizeLeaf(field: LeafField, raw: unknown, fallback: unknown): unknown {
  switch (field.kind) {
    case "number": {
      const n = typeof raw === "string" && raw.trim() !== "" ? Number(raw) : raw;
      return typeof n === "number" && Number.isFinite(n) ? n : fallback;
    }
    case "boolean":
      return typeof raw === "boolean" ? raw : fallback;
    case "gallery":
    case "stringList":
      return Array.isArray(raw) ? raw.filter((x): x is string => typeof x === "string") : fallback;
    default:
      return typeof raw === "string" ? raw : fallback;
  }
}

function normalizeFields(fields: Field[], raw: unknown, defaults: Values): Values {
  const source = isObject(raw) ? raw : {};
  const out: Values = {};
  for (const field of fields) {
    const fallback = defaults[field.key];
    if (field.kind === "list") {
      const items = source[field.key];
      const fallbackItems = Array.isArray(fallback) ? (fallback as Values[]) : [];
      // En listas de largo fijo cada posición es siempre "la misma" tarjeta: si a un ítem
      // le falta un campo (ej. se agregó al schema después), toma el original de esa posición.
      // En listas variables las posiciones cambian al ordenar o borrar: se completa con vacío.
      const fixed = field.min === field.max;
      out[field.key] = Array.isArray(items)
        ? items.map((item, i) =>
            normalizeFields(field.fields, item, (fixed ? fallbackItems[i] : undefined) ?? emptyListItem(field.fields)),
          )
        : fallbackItems;
    } else {
      out[field.key] = field.key in source ? normalizeLeaf(field, source[field.key], fallback) : fallback;
    }
  }
  return out;
}

/**
 * Lleva el JSON guardado a la forma de la sección, completando con los
 * defaults lo que falte. No valida límites: lo usa la vista previa, que tiene
 * que reflejar lo que la persona está escribiendo aunque todavía no sea válido.
 */
export function normalizeSection<K extends SectionKey>(key: K, raw: unknown): SiteContent[K] {
  return normalizeFields(sectionFields(key), raw, SECTIONS[key].defaults as unknown as Values) as unknown as SiteContent[K];
}

/**
 * Contenido que se publica: lo guardado + defaults, validado con el schema.
 * Si algo no valida (ej. cambió un límite después de guardar), la sección vuelve
 * a sus textos originales: la web nunca se rompe por contenido.
 */
export function mergeSectionContent<K extends SectionKey>(key: K, raw: unknown): SiteContent[K] {
  if (raw === undefined) return SECTIONS[key].defaults;
  const parsed = getSectionSchema(key).safeParse(normalizeSection(key, raw));
  return parsed.success ? (parsed.data as unknown as SiteContent[K]) : SECTIONS[key].defaults;
}

/** Contenido completo de la web a partir de los datos guardados por sección. */
export function buildSiteContent(saved: Partial<Record<SectionKey, unknown>>): SiteContent {
  const content = {} as Record<SectionKey, unknown>;
  for (const key of SECTION_ORDER) content[key] = mergeSectionContent(key, saved[key]);
  return content as SiteContent;
}

/** Igual que `buildSiteContent` pero sin validar (para la vista previa en vivo). */
export function buildPreviewContent(raw: unknown): SiteContent {
  const source = isObject(raw) ? raw : {};
  const content = {} as Record<SectionKey, unknown>;
  for (const key of SECTION_ORDER) content[key] = normalizeSection(key, source[key]);
  return content as SiteContent;
}

export const DEFAULT_SITE_CONTENT: SiteContent = buildSiteContent({});

/** Link a WhatsApp con mensaje precargado (wa.me funciona en desktop y mobile). */
export function whatsappUrl(number: string, message: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
