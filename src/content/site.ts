/** Datos de la empresa. Única fuente para toda la web (header, footer, JSON-LD, form). */
export const site = {
  name: "OFIR",
  slogan: "Ingeniería y oficio, a tu medida",
  concept: "El valor está en lo que se forja.",
  url: "https://ofirsolucionesintegrales.com",
  description:
    "Taller de Venado Tuerto que une ingeniería y oficio: herrería industrial y doméstica, estructuras metálicas, pisos epoxi e impermeabilización con línea PROTEX. Presupuesto sin cargo.",
  whatsapp: { number: "543462549129", display: "3462 54-9129" },
  phones: [
    { label: "Teléfono", display: "3462 54-9129", href: "tel:+543462549129" },
    { label: "Celular", display: "+54 9 2954 27-3822", href: "tel:+5492954273822" },
  ],
  email: "ofirsolucionesintegrales@gmail.com",
  instagram: { handle: "@ofirsolucionesintegrales", url: "https://www.instagram.com/ofirsolucionesintegrales" },
  address: {
    street: "Monti 102",
    city: "Venado Tuerto",
    region: "Santa Fe",
    country: "AR",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Monti+102+Venado+Tuerto+Santa+Fe",
  },
  area: "Venado Tuerto y la zona",
  /** TODO: confirmar horarios con el cliente antes de publicar */
  hours: "[Lunes a viernes · horario a confirmar]",
} as const;

export const nav = [
  { label: "Servicios", href: "#servicios" },
  { label: "Obras", href: "#obras" },
  { label: "Cómo trabajamos", href: "#proceso" },
  { label: "Preguntas", href: "#preguntas" },
  { label: "Contacto", href: "#contacto" },
] as const;
