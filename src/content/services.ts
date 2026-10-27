export type ServiceId = "industria" | "herreria" | "epoxi" | "techos";

export type Service = {
  id: ServiceId;
  title: string;
  kicker: string;
  summary: string;
  items: string[];
  photo: string;
  photoAlt: string;
  /** mensaje precargado para el CTA de WhatsApp de esta card */
  waMessage: string;
};

export const services: Service[] = [
  {
    id: "industria",
    kicker: "Industria",
    title: "Ingeniería y herrería industrial",
    summary:
      "Pensamos la solución antes de cortar el primer perfil. Estructuras, dispositivos y equipos a medida, con planos y montaje en planta.",
    items: [
      "Estructuras metálicas, cabreadas y puentes grúa",
      "Dispositivos, utillajes y bancos de trabajo",
      "Equipamiento especial y adecuaciones de máquinas",
      "Planos de fabricación y asesoramiento técnico",
    ],
    photo: "/proyectos/cabreadas-galpon/01_cabreadas-y-galpon.jpg",
    photoAlt: "Cabreadas metálicas reticuladas en el techo de un galpón",
    waMessage: "Hola OFIR, necesito un trabajo industrial / estructura metálica.",
  },
  {
    id: "herreria",
    kicker: "Herrería doméstica y comercial",
    title: "Hierro y madera para tu casa o tu local",
    summary:
      "Rejas, portones, puertas de seguridad y muebles de metal y madera maciza, hechos para durar.",
    items: [
      "Rejas, portones y puertas de seguridad",
      "Galerías, pérgolas y cerramientos",
      "Equipamiento para comercios y gastronomía",
      "Mesas, bancos, barras y estanterías",
    ],
    photo: "/proyectos/muebles-metal-y-madera/02_mesa-ratona.jpg",
    photoAlt: "Mesa ratona de madera maciza con estructura de hierro negro",
    waMessage: "Hola OFIR, quiero consultar por un trabajo de herrería.",
  },
  {
    id: "epoxi",
    kicker: "Revestimientos",
    title: "Pisos y revestimientos epoxi",
    summary:
      "Pisos resistentes, fáciles de limpiar y con las áreas de trabajo bien marcadas. Elegimos el sistema según el uso de cada espacio.",
    items: ["Plantas, talleres y galpones", "Gimnasios, escuelas y oficinas", "Superficies anticorrosivas", "Demarcación de áreas"],
    photo: "/proyectos/pisos-epoxi-planta-industrial/01_demarcacion-naranja.jpg",
    photoAlt: "Piso epoxi industrial con demarcación naranja",
    waMessage: "Hola OFIR, quiero un presupuesto de piso epoxi.",
  },
  {
    id: "techos",
    kicker: "Impermeabilización",
    title: "Techos y muros con línea PROTEX",
    summary:
      "Aplicación y distribución oficial PROTEX. Diagnóstico de cada superficie y garantía de hasta 10 años según el sistema.",
    items: ["Diagnóstico sin cargo", "Membranas y sistemas de alto rendimiento", "Garantía de hasta 10 años", "Con o sin provisión de materiales"],
    photo: "/proyectos/impermeabilizacion-techo-escolar/01_techo-general.jpg",
    photoAlt: "Techo de escuela impermeabilizado con membrana",
    waMessage: "Hola OFIR, quiero impermeabilizar un techo.",
  },
];
