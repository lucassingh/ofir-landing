/** Reglas de las fotos que se suben desde el panel (las comparten el navegador y la ruta que firma). */
export const UPLOAD_PREFIX = "cms/images/";
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"] as const;
export const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
/** Lado más largo después de achicarla en el navegador (la web nunca la muestra más grande). */
export const MAX_IMAGE_SIDE = 2400;
