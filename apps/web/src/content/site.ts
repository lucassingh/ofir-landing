import { NAV_ANCHORS, type MenuContent } from "@ofir/content";

/**
 * Datos fijos de la marca. Todo lo demás (textos, fotos, teléfonos, redes) se
 * edita desde el panel: ver packages/content.
 */
export const site = {
  name: "OFIR",
  slogan: "Ingeniería y oficio, a tu medida",
  url: "https://ofirsolucionesintegrales.com",
} as const;

/** Menú: las anclas son fijas, los nombres vienen del panel. */
export function navLinks(menu: MenuContent) {
  return NAV_ANCHORS.map((href, i) => ({ href, label: menu.links[i]?.label ?? href.slice(1) }));
}
