import fotos from "./fotos.generated.json";
import type { ServiceId } from "./services";

/**
 * Obras que se muestran en la web. Las fotos salen de ofir-web/assets-proyectos
 * (sincronizadas con `npm run sync:brand`). Los textos se cargan acá.
 *
 * `publicable: false` = falta permiso del cliente (se ve su marca o su local).
 * No se muestran hasta tener el OK. Ver ofir-web/assets-proyectos/LEEME.md
 */
export type Project = {
  slug: keyof typeof fotos;
  title: string;
  service: ServiceId;
  summary: string;
  cover: string;
  publicable: boolean;
};

export const projects: Project[] = [
  { slug: "cabreadas-galpon", service: "industria", title: "Cabreadas para galpón", summary: "Cabreadas reticuladas para la cubierta de un galpón de mampostería.", cover: "01_cabreadas-y-galpon.jpg", publicable: true },
  { slug: "puente-grua", service: "industria", title: "Estructura para puente grúa", summary: "Vigas y estructura fabricadas y pintadas en el taller.", cover: "01_vigas-pintadas.jpg", publicable: true },
  { slug: "estructuras-metalicas", service: "industria", title: "Vigas, bastidores y escaleras", summary: "Estructura metálica fabricada a medida para planta.", cover: "03_perfiles-terminados.jpg", publicable: true },
  { slug: "dispositivo-montaje-motos", service: "industria", title: "Dispositivo de montaje", summary: "Dispositivo de sujeción para el montaje en línea de motocicletas.", cover: "01_dispositivo.jpg", publicable: true },
  { slug: "montajes-planta-corven", service: "industria", title: "Mesas de trabajo para planta", summary: "Puestos de trabajo fabricados y montados en planta.", cover: "03_mesa-de-trabajo-roja.jpg", publicable: true },
  { slug: "modificacion-prensa-hidraulica", service: "industria", title: "Adecuación de prensa", summary: "De puerta vertical a puerta lateral: más cómoda y segura de operar.", cover: "02_despues-puerta-lateral.jpg", publicable: false },
  { slug: "muebles-metal-y-madera", service: "herreria", title: "Muebles de metal y madera", summary: "Madera maciza y hierro reforzado: mesas, sillas, estantes y barras.", cover: "07_mesa-y-sillas.jpg", publicable: true },
  { slug: "cerramientos-malla-galvanizada", service: "herreria", title: "Paneles con malla galvanizada", summary: "Hierro ángulo con refuerzos y malla galvanizada.", cover: "01_paneles-acopiados.jpg", publicable: true },
  { slug: "mesas-y-bancos-laurel", service: "herreria", title: "Mesas y bancos en laurel", summary: "Estructuras de caño y tapas de laurel para un local gastronómico.", cover: "03_tapas-de-laurel.jpg", publicable: false },
  { slug: "barra-local-gastronomico", service: "herreria", title: "Barra estilo industrial", summary: "Barra exterior con chapa vertical y tapa de madera.", cover: "03_barra-instalada.jpg", publicable: false },
  { slug: "pisos-epoxi-planta-industrial", service: "epoxi", title: "Piso epoxi en planta", summary: "Revestimiento epoxi con demarcación de áreas de trabajo.", cover: "01_demarcacion-naranja.jpg", publicable: true },
  { slug: "impermeabilizacion-techo-escolar", service: "techos", title: "Techo de escuela", summary: "Impermeabilización integral con membrana de terminación.", cover: "01_techo-general.jpg", publicable: true },
];

export const photosOf = (slug: Project["slug"]) =>
  (fotos[slug] as string[]).map((f) => `/proyectos/${slug}/${f}`);
