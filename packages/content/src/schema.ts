import { z } from "zod";
import type { Field, FieldGroup, LeafField } from "./types";

// Imágenes: subidas al almacenamiento (https://…) o propias de la web (/proyectos/…).
const IMAGE_RE = /^(https:\/\/|\/)/;
const HTTP_RE = /^https?:\/\//;

const imageSchema = (optional: boolean) => {
  const base = z.string().trim().max(2048, "El link de la imagen es demasiado largo");
  return optional
    ? base.refine((v) => v === "" || IMAGE_RE.test(v), "La imagen no es válida: volvé a subirla")
    : base.min(1, "Subí una imagen").regex(IMAGE_RE, "La imagen no es válida: volvé a subirla");
};

function leafSchema(field: LeafField): z.ZodType {
  switch (field.kind) {
    case "text":
    case "textarea": {
      const base = z.string().trim().max(field.maxLength, `Máximo ${field.maxLength} caracteres`);
      const required = field.optional ? base : base.min(1, "Este texto no puede quedar vacío");
      if (field.kind === "text" && field.pattern) {
        const re = new RegExp(field.pattern.regex);
        return required.refine((v) => v === "" || re.test(v), field.pattern.message);
      }
      return required;
    }
    case "number":
      return z
        .number({ error: "Ingresá un número" })
        .int("Sin decimales")
        .min(field.min, `Mínimo ${field.min}`)
        .max(field.max, `Máximo ${field.max}`);
    case "email":
      return z.string().trim().pipe(z.email("Ingresá un email válido"));
    case "url":
      return z.string().trim().max(2048, "El link es demasiado largo").regex(HTTP_RE, "Tiene que ser un link completo (empieza con https://)");
    case "image":
      return imageSchema(field.optional ?? false);
    case "gallery":
      return z
        .array(imageSchema(false))
        .min(field.min, field.min === 1 ? "Subí al menos una foto" : `Subí al menos ${field.min} fotos`)
        .max(field.max, `Máximo ${field.max} fotos`);
    case "stringList":
      return z
        .array(z.string().trim().min(1, "No puede quedar vacío").max(field.maxLength, `Máximo ${field.maxLength} caracteres`))
        .min(field.min, field.min === 1 ? "Tiene que haber al menos uno" : `Tiene que haber al menos ${field.min}`)
        .max(field.max, `Máximo ${field.max}`);
    case "select":
      return z.enum(field.options.map((o) => o.value) as [string, ...string[]], { error: "Elegí una opción" });
    case "boolean":
      return z.boolean();
  }
}

function fieldSchema(field: Field): z.ZodType {
  if (field.kind !== "list") return leafSchema(field);
  const item: Record<string, z.ZodType> = {};
  for (const leaf of field.fields) item[leaf.key] = leafSchema(leaf);
  const list = z.array(z.object(item));
  return field.min === field.max
    ? list.length(field.min, `Tiene que haber exactamente ${field.min}`)
    : list.min(field.min, `Tiene que haber al menos ${field.min}`).max(field.max, `Máximo ${field.max}`);
}

/**
 * Schema Zod de una sección a partir de sus campos. Es la ÚNICA fuente de
 * validación: la usan el formulario del panel y la acción que guarda, así
 * nunca se desincronizan.
 */
export function buildSectionSchema(groups: FieldGroup[]) {
  const shape: Record<string, z.ZodType> = {};
  for (const field of groups.flatMap((g) => g.fields)) shape[field.key] = fieldSchema(field);
  return z.object(shape);
}

export type SectionSchema = ReturnType<typeof buildSectionSchema>;
