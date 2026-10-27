"use server";

import { getSectionSchema, isSectionKey, SECTIONS } from "@ofir/content";
import { resetSection, saveSection, StoreNotConfiguredError } from "@ofir/content/store";
import { getCurrentUser, SESSION_EXPIRED_MESSAGE } from "@/lib/auth";
import { notifySite } from "@/lib/cms";

export type SectionMeta = { updatedAt: string | null; updatedBy: string | null };

export type SaveResult =
  | {
      ok: true;
      values: Record<string, unknown>;
      meta: SectionMeta;
      /** false = se guardó pero la web no confirmó que se actualizó. */
      published: boolean;
    }
  | { ok: false; error: string };

function storeError(error: unknown): string {
  console.error("[cms] no se pudo guardar", error);
  if (error instanceof StoreNotConfiguredError) return "El almacenamiento no está conectado (falta BLOB_READ_WRITE_TOKEN).";
  return "No se pudo conectar con el almacenamiento. Probá de nuevo en un momento: lo que escribiste sigue acá.";
}

/** Guarda una sección completa, validada con el mismo schema que usa el formulario. */
export async function saveSectionAction(key: string, values: unknown): Promise<SaveResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: SESSION_EXPIRED_MESSAGE };
  if (!isSectionKey(key)) return { ok: false, error: "Esa sección no existe." };

  const parsed = getSectionSchema(key).safeParse(values);
  if (!parsed.success) return { ok: false, error: "Hay campos con errores: revisalos y volvé a guardar." };

  try {
    const doc = await saveSection(key, parsed.data, user.name);
    const record = doc.sections[key];
    return {
      ok: true,
      values: parsed.data,
      meta: { updatedAt: record?.updatedAt ?? null, updatedBy: record?.updatedBy ?? null },
      published: await notifySite(),
    };
  } catch (error) {
    return { ok: false, error: storeError(error) };
  }
}

/** Vuelve la sección a los textos y fotos con los que se lanzó la web. */
export async function resetSectionAction(key: string): Promise<SaveResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: SESSION_EXPIRED_MESSAGE };
  if (!isSectionKey(key)) return { ok: false, error: "Esa sección no existe." };

  try {
    await resetSection(key);
    return {
      ok: true,
      values: SECTIONS[key].defaults as unknown as Record<string, unknown>,
      meta: { updatedAt: null, updatedBy: null },
      published: await notifySite(),
    };
  } catch (error) {
    return { ok: false, error: storeError(error) };
  }
}
