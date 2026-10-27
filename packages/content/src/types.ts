/**
 * Contenido autoadministrable de la landing (CMS liviano).
 *
 * Cada sección se describe UNA sola vez en `sections.ts` con una lista de
 * campos. De esa descripción salen:
 *   · el schema Zod que valida al guardar (`schema.ts`)
 *   · el formulario del panel, con ayudas y contadores de caracteres
 *   · los límites que protegen el diseño (máximo de caracteres, cantidad de ítems)
 */

export type SectionKey =
  | "hero"
  | "marquee"
  | "services"
  | "stats"
  | "projects"
  | "process"
  | "mission"
  | "faq"
  | "cta"
  | "contact"
  | "company"
  | "menu"
  | "seo";

interface BaseField {
  key: string;
  /** Nombre del campo tal como lo ve la persona que edita. */
  label: string;
  /** Explicación en lenguaje simple: dónde se ve y qué límites tiene. */
  help?: string;
}

export interface TextField extends BaseField {
  kind: "text";
  maxLength: number;
  optional?: boolean;
  placeholder?: string;
  /** Formato obligatorio (ej. solo números). */
  pattern?: { regex: string; message: string };
}

export interface TextareaField extends BaseField {
  kind: "textarea";
  maxLength: number;
  rows?: number;
  optional?: boolean;
}

export interface NumberField extends BaseField {
  kind: "number";
  min: number;
  max: number;
}

export interface EmailField extends BaseField {
  kind: "email";
}

export interface UrlField extends BaseField {
  kind: "url";
  placeholder?: string;
}

export interface ImageField extends BaseField {
  kind: "image";
  optional?: boolean;
  /** Proporción con la que se recorta en la web (solo para la miniatura del panel). */
  aspect?: string;
}

/** Varias fotos en orden. La primera es la portada. */
export interface GalleryField extends BaseField {
  kind: "gallery";
  min: number;
  max: number;
}

/** Lista de frases cortas (viñetas, textos que rotan, etc.). */
export interface StringListField extends BaseField {
  kind: "stringList";
  min: number;
  max: number;
  maxLength: number;
  /** Cómo se llama cada ítem: "Frase", "Viñeta"… */
  itemLabel: string;
}

export interface SelectField extends BaseField {
  kind: "select";
  options: readonly { value: string; label: string }[];
}

export interface BooleanField extends BaseField {
  kind: "boolean";
}

export type LeafField =
  | TextField
  | TextareaField
  | NumberField
  | EmailField
  | UrlField
  | ImageField
  | GalleryField
  | StringListField
  | SelectField
  | BooleanField;

/**
 * Lista de ítems con varios campos (tarjetas, obras, preguntas).
 * `min === max` = largo fijo: se editan pero no se agregan ni se quitan.
 */
export interface ListField extends BaseField {
  kind: "list";
  min: number;
  max: number;
  /** Nombre de cada ítem por posición (para listas de largo fijo). */
  itemLabels?: readonly string[];
  /** Nombre genérico del ítem en listas variables: "Obra", "Pregunta". */
  itemLabel: string;
  /** Campo cuyo valor se usa como título del ítem en el panel. */
  titleKey?: string;
  fields: LeafField[];
}

export type Field = LeafField | ListField;

/** Bloque del formulario: en el panel cada grupo es una tarjeta. */
export interface FieldGroup {
  title: string;
  help?: string;
  fields: Field[];
}

/** `page`: parte de la página, en orden de scroll · `global`: datos que se usan en varios lugares. */
export type SectionArea = "page" | "global";

export interface SectionDefinition<T> {
  key: SectionKey;
  /** Nombre corto para el menú lateral. */
  navLabel: string;
  /** Título de la pantalla de edición. */
  label: string;
  /** Qué es y dónde se ve, en lenguaje de usuario. */
  description: string;
  area: SectionArea;
  /** Ruta en la web para "Ver en la web" (ej. "/#servicios"). */
  href: string;
  /**
   * Parte de la landing que muestra la vista previa al editar
   * (`data-cms-section` en la web). null = la sección no se ve en la página
   * (ej. Google), el panel muestra su propia vista previa.
   */
  previewTarget: string | null;
  groups: FieldGroup[];
  /** Textos y fotos con los que se lanzó la web: se usan si nunca se editó la sección. */
  defaults: T;
}
