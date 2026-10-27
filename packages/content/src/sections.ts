import type { Field, LeafField, SectionDefinition, SectionKey } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Tipos del contenido de cada sección (lo que reciben los componentes de la landing)
// ─────────────────────────────────────────────────────────────────────────────

/** Los cuatro servicios son fijos: el filtro de obras y el bento dependen de ellos. */
export const SERVICE_IDS = ["industria", "herreria", "epoxi", "techos"] as const;
export type ServiceId = (typeof SERVICE_IDS)[number];

export const SERVICE_OPTIONS = [
  { value: "industria", label: "Industria" },
  { value: "herreria", label: "Herrería" },
  { value: "epoxi", label: "Pisos y revestimientos epoxi" },
  { value: "techos", label: "Impermeabilización" },
] as const satisfies readonly { value: ServiceId; label: string }[];

/** Anclas del menú, en el mismo orden que `menu.links`. */
export const NAV_ANCHORS = ["#servicios", "#obras", "#proceso", "#preguntas", "#contacto"] as const;

export interface HeroContent {
  eyebrow: string;
  title: string;
  rotatingPrefix: string;
  rotatingTexts: string[];
  description: string;
  whatsappLabel: string;
  quoteLabel: string;
  photoMain: string;
  photoMainAlt: string;
  photoSecondary: string;
  photoSecondaryAlt: string;
  proof: string[];
}

export interface MarqueeContent {
  line1: string;
  line2: string;
}

export interface ServiceCard {
  kicker: string;
  title: string;
  summary: string;
  items: string[];
  photo: string;
  photoAlt: string;
  whatsappMessage: string;
}

export interface ServicesContent {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  lede: string;
  cards: ServiceCard[];
}

export interface StatItem {
  prefix: string;
  value: number;
  suffix: string;
  unit: string;
  label: string;
}

export interface StatsContent {
  items: StatItem[];
}

export interface ProjectItem {
  visible: boolean;
  title: string;
  service: ServiceId;
  summary: string;
  photos: string[];
}

export interface ProjectsContent {
  eyebrow: string;
  title: string;
  lede: string;
  items: ProjectItem[];
}

export interface ProcessContent {
  eyebrow: string;
  title: string;
  lede: string;
  steps: { title: string; text: string }[];
}

export interface MissionContent {
  eyebrow: string;
  title: string;
  body: string;
  footnote: string;
  photo: string;
  photoAlt: string;
}

export interface FaqContent {
  eyebrow: string;
  title: string;
  lede: string;
  items: { question: string; answer: string }[];
}

export interface CtaContent {
  title: string;
  description: string;
  whatsappLabel: string;
  formLabel: string;
}

export interface ContactContent {
  eyebrow: string;
  title: string;
  description: string;
}

export interface CompanyContent {
  whatsappNumber: string;
  whatsappDisplay: string;
  whatsappMessage: string;
  phones: { label: string; display: string; number: string }[];
  email: string;
  instagramHandle: string;
  instagramUrl: string;
  addressStreet: string;
  addressCity: string;
  addressRegion: string;
  mapsUrl: string;
  area: string;
}

export interface MenuContent {
  links: { label: string }[];
  ctaLabel: string;
  footerTagline: string;
}

export interface SeoContent {
  title: string;
  description: string;
  shareTitle: string;
}

export interface SiteContent {
  hero: HeroContent;
  marquee: MarqueeContent;
  services: ServicesContent;
  stats: StatsContent;
  projects: ProjectsContent;
  process: ProcessContent;
  mission: MissionContent;
  faq: FaqContent;
  cta: CtaContent;
  contact: ContactContent;
  company: CompanyContent;
  menu: MenuContent;
  seo: SeoContent;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers para declarar campos sin repetir boilerplate
// ─────────────────────────────────────────────────────────────────────────────

const text = (key: string, label: string, maxLength: number, help?: string, optional = false): LeafField => ({
  kind: "text",
  key,
  label,
  maxLength,
  help,
  optional,
});

const textarea = (key: string, label: string, maxLength: number, help?: string, rows?: number): LeafField => ({
  kind: "textarea",
  key,
  label,
  maxLength,
  help,
  rows,
});

const image = (key: string, label: string, help?: string, aspect?: string): LeafField => ({
  kind: "image",
  key,
  label,
  help,
  aspect,
});

const ALT_HELP =
  "Describí qué se ve en la foto, en una frase. Lo leen los lectores de pantalla y Google; no se muestra en la web.";

const alt = (key: string): LeafField => text(key, "Descripción de la foto", 140, ALT_HELP);

/** Número de teléfono para links (wa.me, tel:): solo dígitos, con código de país. */
const digits = (key: string, label: string, help: string): LeafField => ({
  kind: "text",
  key,
  label,
  maxLength: 15,
  help,
  pattern: { regex: "^\\d{8,15}$", message: "Solo números, sin +, espacios ni guiones (ej. 543462549129)" },
});

/** Encabezado estándar de sección: etiqueta con punto de oro + título + bajada. */
const heading = (eyebrow: string): Field[] => [
  text("eyebrow", "Etiqueta chica", 24, `Va en mayúsculas sobre el título, con el punto de oro (ej. “${eyebrow}”). Máx. 24 caracteres.`),
  text("title", "Título", 60, "Máx. 60 caracteres: entra en dos o tres renglones."),
  textarea("lede", "Bajada", 180, "Una o dos oraciones debajo del título. Máx. 180 caracteres.", 2),
];

// ─────────────────────────────────────────────────────────────────────────────
// Registro de secciones. Orden = orden de scroll en la web, después los datos generales.
// ─────────────────────────────────────────────────────────────────────────────

export const SECTIONS: { [K in SectionKey]: SectionDefinition<SiteContent[K]> } = {
  hero: {
    key: "hero",
    navLabel: "Portada",
    label: "Portada",
    description: "La primera pantalla: el título grande, los trabajos que van rotando, los botones, las dos fotos y las tres pruebas de abajo.",
    area: "page",
    href: "/",
    previewTarget: "hero",
    groups: [
      {
        title: "Textos",
        fields: [
          text("eyebrow", "Etiqueta chica", 40, "Va arriba del título, con el punto de oro. Máx. 40 caracteres."),
          text("title", "Título", 60, "Letras grandes. Máx. 60 caracteres para que no pase de tres renglones."),
          text("rotatingPrefix", "Palabra antes de los trabajos que rotan", 20, "Ej. “Hacemos”. Máx. 20 caracteres."),
          {
            kind: "stringList",
            key: "rotatingTexts",
            label: "Trabajos que rotan",
            help: "Aparecen de a uno en el recuadro, cada 2,4 segundos. Cortos: máx. 28 caracteres cada uno.",
            min: 1,
            max: 8,
            maxLength: 28,
            itemLabel: "Trabajo",
          },
          textarea("description", "Texto debajo", 220, "Máx. 220 caracteres.", 3),
        ],
      },
      {
        title: "Botones",
        help: "El blanco abre WhatsApp; el otro baja hasta el formulario de contacto.",
        fields: [
          text("whatsappLabel", "Botón de WhatsApp", 32, "Máx. 32 caracteres."),
          text("quoteLabel", "Botón de presupuesto", 28, "Máx. 28 caracteres."),
        ],
      },
      {
        title: "Fotos",
        help: "Solo se ven en computadora. Usá fotos reales de obras, horizontales o cuadradas.",
        fields: [
          image("photoMain", "Foto grande", "Se recorta casi cuadrada.", "45 / 44"),
          alt("photoMainAlt"),
          image("photoSecondary", "Foto chica", "Va abajo a la izquierda, cuadrada.", "1 / 1"),
          alt("photoSecondaryAlt"),
        ],
      },
      {
        title: "Pruebas",
        help: "Las frases cortas con flecha dorada en el recorte de abajo a la derecha (en celular van debajo de la portada).",
        fields: [
          {
            kind: "stringList",
            key: "proof",
            label: "Frases",
            help: "Hasta 3, de máx. 34 caracteres cada una.",
            min: 1,
            max: 3,
            maxLength: 34,
            itemLabel: "Frase",
          },
        ],
      },
    ],
    defaults: {
      eyebrow: "En Venado Tuerto, Santa Fe",
      title: "Ingeniería y oficio, a tu medida.",
      rotatingPrefix: "Hacemos",
      rotatingTexts: ["rejas y portones", "estructuras metálicas", "pisos epoxi", "techos impermeables", "muebles de hierro y madera"],
      description:
        "Herrería industrial y doméstica, pisos epoxi e impermeabilización con línea PROTEX. Medimos, te asesoramos y te pasamos el presupuesto sin cargo.",
      whatsappLabel: "Escribinos por WhatsApp",
      quoteLabel: "Pedir presupuesto",
      photoMain: "/proyectos/cabreadas-galpon/01_cabreadas-y-galpon.jpg",
      photoMainAlt: "Cabreadas metálicas de un galpón hechas por OFIR",
      photoSecondary: "/proyectos/muebles-metal-y-madera/02_mesa-ratona.jpg",
      photoSecondaryAlt: "Mesa ratona de madera maciza y hierro hecha por OFIR",
      proof: ["Presupuesto sin cargo", "Garantía hasta 10 años", "Pago en cuotas · con factura"],
    },
  },

  marquee: {
    key: "marquee",
    navLabel: "Cinta de oficios",
    label: "Cinta de oficios",
    description: "Las dos líneas de texto gigante que se mueven de costado debajo de la portada y aceleran con el scroll.",
    area: "page",
    href: "/",
    previewTarget: "marquee",
    groups: [
      {
        title: "Textos",
        help: "Separá las palabras con “ · ” (espacio, punto medio, espacio). Cada línea se repite en loop.",
        fields: [
          text("line1", "Línea 1 (llena)", 70, "Máx. 70 caracteres."),
          text("line2", "Línea 2 (contorno)", 70, "Máx. 70 caracteres."),
        ],
      },
    ],
    defaults: {
      line1: "Rejas · Portones · Estructuras · Cabreadas",
      line2: "Pisos epoxi · Impermeabilización · PROTEX",
    },
  },

  services: {
    key: "services",
    navLabel: "Servicios",
    label: "Servicios",
    description: "Las cuatro tarjetas grandes con foto, lista de trabajos y botón de WhatsApp con mensaje armado.",
    area: "page",
    href: "/#servicios",
    previewTarget: "services",
    groups: [
      {
        title: "Encabezado",
        fields: [
          text("eyebrow", "Etiqueta chica", 24, "Va sobre el título, con el punto de oro. Máx. 24 caracteres."),
          text("titleLine1", "Título — línea 1", 30, "Máx. 30 caracteres."),
          text("titleLine2", "Título — línea 2", 30, "Máx. 30 caracteres."),
          textarea("lede", "Bajada", 200, "Máx. 200 caracteres.", 2),
        ],
      },
      {
        title: "Tarjetas",
        help: "Son cuatro y van en este orden. La categoría de cada una es también el filtro de la sección Obras.",
        fields: [
          {
            kind: "list",
            key: "cards",
            label: "Tarjetas",
            itemLabel: "Tarjeta",
            itemLabels: [
              "Tarjeta 1 · Industria (ancha)",
              "Tarjeta 2 · Herrería",
              "Tarjeta 3 · Revestimientos",
              "Tarjeta 4 · Impermeabilización (ancha)",
            ],
            titleKey: "title",
            min: 4,
            max: 4,
            fields: [
              text("kicker", "Categoría", 32, "Va en la etiqueta blanca sobre la foto, en el filtro de Obras y en el pie de página. Máx. 32 caracteres."),
              text("title", "Título", 48, "Máx. 48 caracteres."),
              textarea("summary", "Descripción", 220, "Máx. 220 caracteres.", 3),
              {
                kind: "stringList",
                key: "items",
                label: "Lista de trabajos",
                help: "Van con un check, en dos columnas. Entre 1 y 6, de máx. 60 caracteres.",
                min: 1,
                max: 6,
                maxLength: 60,
                itemLabel: "Trabajo",
              },
              image("photo", "Foto", "Se recorta apaisada (16:9).", "16 / 9"),
              alt("photoAlt"),
              textarea(
                "whatsappMessage",
                "Mensaje de WhatsApp",
                160,
                "El texto que ya aparece escrito cuando tocan “Consultar por WhatsApp” en esta tarjeta. Máx. 160 caracteres.",
                2,
              ),
            ],
          },
        ],
      },
    ],
    defaults: {
      eyebrow: "Qué hacemos",
      titleLine1: "Tres frentes,",
      titleLine2: "un mismo taller.",
      lede: "De una estructura para tu planta a la mesa de tu local. Todo se diseña, se fabrica y se termina en nuestro taller.",
      cards: [
        {
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
          whatsappMessage: "Hola OFIR, necesito un trabajo industrial / estructura metálica.",
        },
        {
          kicker: "Herrería doméstica y comercial",
          title: "Hierro y madera para tu casa o tu local",
          summary: "Rejas, portones, puertas de seguridad y muebles de metal y madera maciza, hechos para durar.",
          items: [
            "Rejas, portones y puertas de seguridad",
            "Galerías, pérgolas y cerramientos",
            "Equipamiento para comercios y gastronomía",
            "Mesas, bancos, barras y estanterías",
          ],
          photo: "/proyectos/muebles-metal-y-madera/02_mesa-ratona.jpg",
          photoAlt: "Mesa ratona de madera maciza con estructura de hierro negro",
          whatsappMessage: "Hola OFIR, quiero consultar por un trabajo de herrería.",
        },
        {
          kicker: "Revestimientos",
          title: "Pisos y revestimientos epoxi",
          summary:
            "Pisos resistentes, fáciles de limpiar y con las áreas de trabajo bien marcadas. Elegimos el sistema según el uso de cada espacio.",
          items: ["Plantas, talleres y galpones", "Gimnasios, escuelas y oficinas", "Superficies anticorrosivas", "Demarcación de áreas"],
          photo: "/proyectos/pisos-epoxi-planta-industrial/01_demarcacion-naranja.jpg",
          photoAlt: "Piso epoxi industrial con demarcación naranja",
          whatsappMessage: "Hola OFIR, quiero un presupuesto de piso epoxi.",
        },
        {
          kicker: "Impermeabilización",
          title: "Techos y muros con línea PROTEX",
          summary:
            "Aplicación y distribución oficial PROTEX. Diagnóstico de cada superficie y garantía de hasta 10 años según el sistema.",
          items: ["Diagnóstico sin cargo", "Membranas y sistemas de alto rendimiento", "Garantía de hasta 10 años", "Con o sin provisión de materiales"],
          photo: "/proyectos/impermeabilizacion-techo-escolar/01_techo-general.jpg",
          photoAlt: "Techo de escuela impermeabilizado con membrana",
          whatsappMessage: "Hola OFIR, quiero impermeabilizar un techo.",
        },
      ],
    },
  },

  stats: {
    key: "stats",
    navLabel: "Números",
    label: "Números",
    description: "Las cuatro tarjetas de colores con un número grande que se cuenta solo al aparecer. Solo datos reales.",
    area: "page",
    href: "/#numeros",
    previewTarget: "stats",
    groups: [
      {
        title: "Tarjetas",
        help: "El número se anima contando desde cero. Si es 0 (ej. “$0”), aparece fijo.",
        fields: [
          {
            kind: "list",
            key: "items",
            label: "Tarjetas",
            itemLabel: "Tarjeta",
            itemLabels: ["Tarjeta 1 (azul)", "Tarjeta 2 (azul plano)", "Tarjeta 3 (blanca)", "Tarjeta 4 (grafito)"],
            titleKey: "label",
            min: 4,
            max: 4,
            fields: [
              text("prefix", "Antes del número", 3, "Opcional, ej. “$”. Máx. 3 caracteres.", true),
              { kind: "number", key: "value", label: "Número", min: 0, max: 99_999, help: "Solo el número, sin puntos." },
              text("suffix", "Pegado al número", 3, "Opcional, ej. “%” o “+”. Máx. 3 caracteres.", true),
              text("unit", "Unidad", 12, "Opcional, va más chica al lado (ej. “años”). Máx. 12 caracteres.", true),
              textarea("label", "Qué significa", 90, "Va arriba del número. Máx. 90 caracteres.", 2),
            ],
          },
        ],
      },
    ],
    defaults: {
      items: [
        { prefix: "", value: 10, suffix: "", unit: "años", label: "de garantía en impermeabilización, según el sistema" },
        { prefix: "", value: 3, suffix: "", unit: "frentes", label: "industria, herrería y revestimientos en un solo taller" },
        { prefix: "$", value: 0, suffix: "", unit: "", label: "cuesta el presupuesto: medimos y asesoramos sin cargo" },
        { prefix: "", value: 100, suffix: "%", unit: "", label: "fotos reales: todo lo que ves acá lo hicimos nosotros" },
      ],
    },
  },

  projects: {
    key: "projects",
    navLabel: "Obras",
    label: "Obras",
    description: "El portfolio: cada obra con su categoría, una descripción corta y sus fotos. Al tocarla se abre el visor.",
    area: "page",
    href: "/#obras",
    previewTarget: "projects",
    groups: [
      { title: "Encabezado", fields: heading("Obras") },
      {
        title: "Obras",
        help: "Se muestran en este orden. Subí solo trabajos con permiso del cliente para publicarlos (que no se vean marcas, carteles ni personas sin su OK).",
        fields: [
          {
            kind: "list",
            key: "items",
            label: "Obras",
            itemLabel: "Obra",
            titleKey: "title",
            min: 1,
            max: 30,
            fields: [
              { kind: "boolean", key: "visible", label: "Mostrar en la web", help: "Apagalo para ocultar la obra sin borrarla." },
              text("title", "Título", 48, "Máx. 48 caracteres."),
              { kind: "select", key: "service", label: "Categoría", options: SERVICE_OPTIONS, help: "Define en qué filtro aparece." },
              textarea("summary", "Descripción corta", 140, "Una oración. Máx. 140 caracteres.", 2),
              {
                kind: "gallery",
                key: "photos",
                label: "Fotos",
                help: "La primera es la portada (se recorta vertical, 4:5). Entre 1 y 12 fotos.",
                min: 1,
                max: 12,
              },
            ],
          },
        ],
      },
    ],
    defaults: {
      eyebrow: "Obras",
      title: "Trabajos reales, hechos en el taller.",
      lede: "Cada foto es un trabajo nuestro. Tocá una obra para ver más.",
      // Solo obras con permiso del cliente. Las que esperan permiso
      // (barra y mesas del local gastronómico, adecuación de prensa) se suben desde el panel cuando llegue el OK.
      items: [
        {
          visible: true,
          title: "Cabreadas para galpón",
          service: "industria",
          summary: "Cabreadas reticuladas para la cubierta de un galpón de mampostería.",
          photos: ["/proyectos/cabreadas-galpon/01_cabreadas-y-galpon.jpg", "/proyectos/cabreadas-galpon/02_cabreadas-detalle.jpg"],
        },
        {
          visible: true,
          title: "Estructura para puente grúa",
          service: "industria",
          summary: "Vigas y estructura fabricadas y pintadas en el taller.",
          photos: ["/proyectos/puente-grua/01_vigas-pintadas.jpg"],
        },
        {
          visible: true,
          title: "Vigas, bastidores y escaleras",
          service: "industria",
          summary: "Estructura metálica fabricada a medida para planta.",
          photos: [
            "/proyectos/estructuras-metalicas/03_perfiles-terminados.jpg",
            "/proyectos/estructuras-metalicas/01_vigas-bastidores.jpg",
            "/proyectos/estructuras-metalicas/02_escalera.jpg",
          ],
        },
        {
          visible: true,
          title: "Dispositivo de montaje",
          service: "industria",
          summary: "Dispositivo de sujeción para el montaje en línea de motocicletas.",
          photos: ["/proyectos/dispositivo-montaje-motos/01_dispositivo.jpg"],
        },
        {
          visible: true,
          title: "Mesas de trabajo para planta",
          service: "industria",
          summary: "Puestos de trabajo fabricados y montados en planta.",
          photos: [
            "/proyectos/montajes-planta-corven/03_mesa-de-trabajo-roja.jpg",
            "/proyectos/montajes-planta-corven/04_bancos-en-planta-hd.jpg",
          ],
        },
        {
          visible: true,
          title: "Muebles de metal y madera",
          service: "herreria",
          summary: "Madera maciza y hierro reforzado: mesas, sillas, estantes y barras.",
          photos: [
            "/proyectos/muebles-metal-y-madera/07_mesa-y-sillas.jpg",
            "/proyectos/muebles-metal-y-madera/01_banco-de-trabajo-con-tablero.jpg",
            "/proyectos/muebles-metal-y-madera/02_mesa-ratona.jpg",
            "/proyectos/muebles-metal-y-madera/03_estante-blanco.jpg",
            "/proyectos/muebles-metal-y-madera/04_estante-triple.jpg",
            "/proyectos/muebles-metal-y-madera/05_estante-esquinero.jpg",
            "/proyectos/muebles-metal-y-madera/06_estante-bar.jpg",
          ],
        },
        {
          visible: true,
          title: "Paneles con malla galvanizada",
          service: "herreria",
          summary: "Hierro ángulo con refuerzos y malla galvanizada.",
          photos: [
            "/proyectos/cerramientos-malla-galvanizada/01_paneles-acopiados.jpg",
            "/proyectos/cerramientos-malla-galvanizada/02_panel-frente.jpg",
          ],
        },
        {
          visible: true,
          title: "Piso epoxi en planta",
          service: "epoxi",
          summary: "Revestimiento epoxi con demarcación de áreas de trabajo.",
          photos: [
            "/proyectos/pisos-epoxi-planta-industrial/01_demarcacion-naranja.jpg",
            "/proyectos/pisos-epoxi-planta-industrial/02_terminacion-brillante.jpg",
            "/proyectos/pisos-epoxi-planta-industrial/03_circulacion-vertical.jpg",
            "/proyectos/pisos-epoxi-planta-industrial/04_circulacion.jpg",
            "/proyectos/pisos-epoxi-planta-industrial/05_demarcacion-blanca.jpg",
          ],
        },
        {
          visible: true,
          title: "Techo de escuela",
          service: "techos",
          summary: "Impermeabilización integral con membrana de terminación.",
          photos: [
            "/proyectos/impermeabilizacion-techo-escolar/01_techo-general.jpg",
            "/proyectos/impermeabilizacion-techo-escolar/02_detalle-membrana-azul.jpg",
            "/proyectos/impermeabilizacion-techo-escolar/03_membrana-terminacion.jpg",
          ],
        },
      ],
    },
  },

  process: {
    key: "process",
    navLabel: "Cómo trabajamos",
    label: "Cómo trabajamos",
    description: "El bloque azul con los cinco pasos numerados, del primer mensaje a la entrega.",
    area: "page",
    href: "/#proceso",
    previewTarget: "process",
    groups: [
      { title: "Encabezado", fields: heading("Cómo trabajamos") },
      {
        title: "Pasos",
        help: "Son cinco y van numerados en este orden.",
        fields: [
          {
            kind: "list",
            key: "steps",
            label: "Pasos",
            itemLabel: "Paso",
            itemLabels: ["Paso 1", "Paso 2", "Paso 3", "Paso 4", "Paso 5"],
            titleKey: "title",
            min: 5,
            max: 5,
            fields: [
              text("title", "Título", 36, "Máx. 36 caracteres."),
              textarea("text", "Texto", 140, "Máx. 140 caracteres.", 3),
            ],
          },
        ],
      },
    ],
    defaults: {
      eyebrow: "Cómo trabajamos",
      title: "De tu mensaje a la obra terminada.",
      lede: "Un mismo equipo te acompaña de punta a punta.",
      steps: [
        { title: "Nos escribís", text: "Por WhatsApp o con el formulario. Contanos qué necesitás y, si podés, mandá fotos." },
        { title: "Visita y diagnóstico", text: "Vamos, medimos y revisamos la superficie, la estructura o el espacio." },
        { title: "Presupuesto sin cargo", text: "Te pasamos una propuesta clara, con plazos, materiales y forma de pago." },
        { title: "Fabricación en el taller", text: "Diseñamos y fabricamos a medida, cuidando cada unión y cada terminación." },
        { title: "Entrega y garantía", text: "Instalamos, revisamos el trabajo con vos y dejamos la garantía por escrito." },
      ],
    },
  },

  mission: {
    key: "mission",
    navLabel: "El taller",
    label: "El taller",
    description: "El concepto de la marca y la misión: una tarjeta blanca con texto y una foto del taller al lado.",
    area: "page",
    href: "/#taller",
    previewTarget: "mission",
    groups: [
      {
        title: "Textos",
        fields: [
          text("eyebrow", "Etiqueta chica", 24, "Máx. 24 caracteres."),
          text("title", "Título", 60, "Máx. 60 caracteres."),
          textarea("body", "Texto", 360, "Máx. 360 caracteres.", 4),
          text("footnote", "Frase de cierre", 90, "Va abajo, en letra técnica, junto al punto de oro. Máx. 90 caracteres."),
        ],
      },
      { title: "Foto", fields: [image("photo", "Foto", "Ocupa la tarjeta de la derecha, vertical.", "4 / 5"), alt("photoAlt")] },
    ],
    defaults: {
      eyebrow: "El taller",
      title: "El valor está en lo que se forja.",
      body: "Ofir era la tierra del oro más fino. Nosotros lo buscamos en el trabajo bien hecho y en las personas que lo hacen: en el taller formamos a jóvenes que quieren crecer en el oficio.",
      footnote: "Construimos dignidad y futuro · Cada unión, bien hecha.",
      photo: "/proyectos/muebles-metal-y-madera/01_banco-de-trabajo-con-tablero.jpg",
      photoAlt: "Banco de trabajo con herramientas en el taller",
    },
  },

  faq: {
    key: "faq",
    navLabel: "Preguntas",
    label: "Preguntas frecuentes",
    description: "Las preguntas que se abren al tocarlas. Google también las lee para mostrarlas en los resultados.",
    area: "page",
    href: "/#preguntas",
    previewTarget: "faq",
    groups: [
      { title: "Encabezado", fields: heading("Preguntas") },
      {
        title: "Preguntas",
        help: "Se muestran en este orden. Respuestas cortas y concretas; sin prometer lo que no está confirmado.",
        fields: [
          {
            kind: "list",
            key: "items",
            label: "Preguntas",
            itemLabel: "Pregunta",
            titleKey: "question",
            min: 1,
            max: 15,
            fields: [text("question", "Pregunta", 120, "Máx. 120 caracteres."), textarea("answer", "Respuesta", 500, "Máx. 500 caracteres.", 3)],
          },
        ],
      },
    ],
    defaults: {
      eyebrow: "Preguntas",
      title: "Lo que más nos preguntan.",
      lede: "Si tenés otra duda, escribinos y te respondemos.",
      items: [
        { question: "¿El presupuesto tiene costo?", answer: "No. Vamos, medimos y te pasamos el presupuesto sin cargo en Venado Tuerto y la zona." },
        { question: "¿En qué zona trabajan?", answer: "En Venado Tuerto y la zona. Para obras industriales más lejos, consultanos." },
        { question: "¿Puedo pagar en cuotas?", answer: "Sí, hay opciones de pago en cuotas y emitimos factura." },
        {
          question: "¿Qué garantía tiene una impermeabilización?",
          answer: "Hasta 10 años, según el sistema aplicado y las condiciones de la obra. La garantía queda por escrito.",
        },
        { question: "¿Trabajan con o sin materiales?", answer: "Las dos: podés contratar solo la mano de obra o el servicio completo con materiales." },
        {
          question: "¿Hacen trabajos a medida para industrias?",
          answer: "Sí. Diseñamos, hacemos los planos, fabricamos y montamos en planta: estructuras, dispositivos, equipos y adecuaciones.",
        },
      ],
    },
  },

  cta: {
    key: "cta",
    navLabel: "Cierre",
    label: "Cierre",
    description: "La banda azul con el degradé animado, justo antes del contacto: el último empujón para escribir.",
    area: "page",
    href: "/#cierre",
    previewTarget: "cta",
    groups: [
      {
        title: "Textos",
        fields: [
          text("title", "Título", 60, "Máx. 60 caracteres."),
          textarea("description", "Texto", 180, "Máx. 180 caracteres.", 2),
          text("whatsappLabel", "Botón de WhatsApp", 32, "Máx. 32 caracteres."),
          text("formLabel", "Botón del formulario", 32, "Baja hasta el formulario de contacto. Máx. 32 caracteres."),
        ],
      },
    ],
    defaults: {
      title: "¿Tenés un trabajo en mente?",
      description: "Contanos qué necesitás. Medimos, te asesoramos y te pasamos el número sin cargo.",
      whatsappLabel: "Escribinos por WhatsApp",
      formLabel: "Completar el formulario",
    },
  },

  contact: {
    key: "contact",
    navLabel: "Contacto",
    label: "Contacto",
    description: "La tarjeta azul junto al formulario de presupuesto. Los teléfonos, el email y las redes se cambian en “Datos de contacto”.",
    area: "page",
    href: "/#contacto",
    previewTarget: "contact",
    groups: [
      {
        title: "Textos",
        fields: [
          text("eyebrow", "Etiqueta chica", 24, "Máx. 24 caracteres."),
          text("title", "Título", 60, "Máx. 60 caracteres."),
          textarea("description", "Texto", 180, "Máx. 180 caracteres.", 2),
        ],
      },
    ],
    defaults: {
      eyebrow: "Contacto",
      title: "Pedí tu presupuesto sin cargo.",
      description: "Completá el formulario o escribinos directo. Respondemos en el día hábil.",
    },
  },

  company: {
    key: "company",
    navLabel: "Datos de contacto",
    label: "Datos de contacto",
    description: "WhatsApp, teléfonos, email, Instagram y dirección. Se usan en toda la web: botones, contacto, pie de página y Google.",
    area: "global",
    href: "/#contacto",
    previewTarget: "contact",
    groups: [
      {
        title: "WhatsApp",
        help: "Todos los botones de WhatsApp de la web abren este número.",
        fields: [
          digits("whatsappNumber", "Número", "Con código de país y de área, sin el 15: ej. 543462549129."),
          text("whatsappDisplay", "Cómo se muestra", 30, "Ej. “3462 54-9129”. Máx. 30 caracteres."),
          textarea("whatsappMessage", "Mensaje que aparece escrito", 160, "Lo que ya trae el chat al tocar un botón de WhatsApp. Máx. 160 caracteres.", 2),
        ],
      },
      {
        title: "Teléfonos",
        help: "Se muestran en el pie de página y en la tarjeta de contacto (el que coincide con el WhatsApp no se repite ahí).",
        fields: [
          {
            kind: "list",
            key: "phones",
            label: "Teléfonos",
            itemLabel: "Teléfono",
            titleKey: "label",
            min: 0,
            max: 4,
            fields: [
              text("label", "Etiqueta", 20, "Ej. “Celular”. Máx. 20 caracteres."),
              text("display", "Cómo se muestra", 30, "Máx. 30 caracteres."),
              digits("number", "Número para llamar", "Con código de país, sin + ni espacios: ej. 5492954273822."),
            ],
          },
        ],
      },
      {
        title: "Email y redes",
        fields: [
          { kind: "email", key: "email", label: "Email", help: "Se muestra en contacto y en el pie de página." },
          text("instagramHandle", "Usuario de Instagram", 40, "Con @ adelante. Máx. 40 caracteres."),
          { kind: "url", key: "instagramUrl", label: "Link de Instagram", help: "El link completo al perfil (empieza con https://).", placeholder: "https://www.instagram.com/…" },
        ],
      },
      {
        title: "Dirección",
        fields: [
          text("addressStreet", "Calle y número", 60, "Máx. 60 caracteres."),
          text("addressCity", "Ciudad", 40, "Máx. 40 caracteres."),
          text("addressRegion", "Provincia", 40, "Máx. 40 caracteres."),
          { kind: "url", key: "mapsUrl", label: "Link de Google Maps", help: "Se abre al tocar la dirección en el pie de página.", placeholder: "https://www.google.com/maps/…" },
          text("area", "Zona de trabajo", 60, "No se muestra: le dice a Google dónde trabajan. Máx. 60 caracteres."),
        ],
      },
    ],
    defaults: {
      whatsappNumber: "543462549129",
      whatsappDisplay: "3462 54-9129",
      whatsappMessage: "Hola OFIR, quiero pedir un presupuesto.",
      phones: [
        { label: "Teléfono", display: "3462 54-9129", number: "543462549129" },
        { label: "Celular", display: "+54 9 2954 27-3822", number: "5492954273822" },
      ],
      email: "ofirsolucionesintegrales@gmail.com",
      instagramHandle: "@ofirsolucionesintegrales",
      instagramUrl: "https://www.instagram.com/ofirsolucionesintegrales",
      addressStreet: "Monti 102",
      addressCity: "Venado Tuerto",
      addressRegion: "Santa Fe",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Monti+102+Venado+Tuerto+Santa+Fe",
      area: "Venado Tuerto y la zona",
    },
  },

  menu: {
    key: "menu",
    navLabel: "Menú y pie",
    label: "Menú y pie de página",
    description: "Los nombres del menú de arriba, el botón de la barra y la frase del pie de página.",
    area: "global",
    href: "/",
    previewTarget: "footer",
    groups: [
      {
        title: "Menú",
        help: "Cada opción lleva siempre a la misma sección; acá se cambia solo cómo se llama.",
        fields: [
          {
            kind: "list",
            key: "links",
            label: "Opciones",
            itemLabel: "Opción",
            itemLabels: ["Lleva a Servicios", "Lleva a Obras", "Lleva a Cómo trabajamos", "Lleva a Preguntas", "Lleva a Contacto"],
            titleKey: "label",
            min: 5,
            max: 5,
            fields: [text("label", "Nombre", 20, "Máx. 20 caracteres.")],
          },
          text("ctaLabel", "Botón de la barra", 16, "El botón azul de WhatsApp en la barra de arriba (en celular dice “WhatsApp”). Máx. 16 caracteres."),
        ],
      },
      { title: "Pie de página", fields: [text("footerTagline", "Frase de cierre", 50, "Va abajo a la derecha. Máx. 50 caracteres.")] },
    ],
    defaults: {
      links: [{ label: "Servicios" }, { label: "Obras" }, { label: "Cómo trabajamos" }, { label: "Preguntas" }, { label: "Contacto" }],
      ctaLabel: "Escribinos",
      footerTagline: "Cada unión, bien hecha.",
    },
  },

  seo: {
    key: "seo",
    navLabel: "Google y redes",
    label: "Google y redes",
    description: "Cómo aparece la web en Google, en la pestaña del navegador y cuando se comparte el link por WhatsApp o redes.",
    area: "global",
    href: "/",
    previewTarget: null,
    groups: [
      {
        title: "Google",
        fields: [
          text("title", "Título", 70, "El título azul en Google y el nombre de la pestaña. Máx. 70 caracteres: Google corta los más largos."),
          textarea(
            "description",
            "Descripción",
            200,
            "El texto gris debajo del título en Google. Google muestra unos 160 caracteres y corta el resto; máx. 200.",
            3,
          ),
        ],
      },
      {
        title: "Al compartir el link",
        fields: [text("shareTitle", "Título al compartir", 70, "Aparece en la tarjeta que arma WhatsApp o Facebook con el link. Máx. 70 caracteres.")],
      },
    ],
    defaults: {
      title: "OFIR · Herrería, pisos epoxi e impermeabilización en Venado Tuerto",
      description:
        "Taller de Venado Tuerto que une ingeniería y oficio: herrería industrial y doméstica, estructuras metálicas, pisos epoxi e impermeabilización con línea PROTEX. Presupuesto sin cargo.",
      shareTitle: "OFIR · Ingeniería y oficio, a tu medida",
    },
  },
};

/** Orden del panel: la página en orden de scroll y después los datos generales. */
export const SECTION_ORDER: SectionKey[] = [
  "hero",
  "marquee",
  "services",
  "stats",
  "projects",
  "process",
  "mission",
  "faq",
  "cta",
  "contact",
  "company",
  "menu",
  "seo",
];

export const SECTION_AREA_LABELS = {
  page: "Página, de arriba hacia abajo",
  global: "Datos generales",
} as const;
