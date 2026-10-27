import { siteConfig } from "@/config/site";

/**
 * Las fotos originales de la web están en su carpeta pública (/proyectos/…).
 * El panel vive en otro dominio, así que para mostrarlas les antepone la URL de la web.
 */
export function mediaUrl(src: string) {
  return src.startsWith("/") ? `${siteConfig.siteUrl}${src}` : src;
}
