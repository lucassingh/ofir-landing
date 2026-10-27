import { z } from "zod";

export const SERVICIOS = [
  { value: "industria", label: "Industria / estructuras" },
  { value: "herreria", label: "Herrería" },
  { value: "muebles", label: "Muebles de metal y madera" },
  { value: "epoxi", label: "Piso epoxi" },
  { value: "techos", label: "Impermeabilización" },
  { value: "otro", label: "Otro" },
] as const;

export const CONTACTO = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "Email" },
] as const;

const servicioValues = SERVICIOS.map((s) => s.value) as [string, ...string[]];
const contactoValues = CONTACTO.map((s) => s.value) as [string, ...string[]];

/** Validación del pedido de presupuesto (se usa en el servidor; el cliente usa atributos HTML). */
export const quoteSchema = z
  .object({
    nombre: z.string().trim().min(2, "Decinos tu nombre.").max(80),
    telefono: z
      .string()
      .trim()
      .min(8, "Dejanos un teléfono o WhatsApp.")
      .max(30)
      .regex(/^[+\d\s()-]+$/, "Usá solo números, espacios o guiones."),
    email: z.union([z.literal(""), z.email("Revisá el email.")]),
    localidad: z.string().trim().max(80).optional().default(""),
    servicio: z.enum(servicioValues, { message: "Elegí qué necesitás." }),
    medidas: z.string().trim().max(200).optional().default(""),
    mensaje: z.string().trim().min(10, "Contanos un poco más (mínimo 10 caracteres).").max(2000),
    contacto: z.enum(contactoValues).default("whatsapp"),
    /** honeypot: los humanos no lo ven */
    sitio_web: z.string().max(0).optional().default(""),
  })
  .refine((d) => d.contacto !== "email" || d.email !== "", {
    path: ["email"],
    message: "Si preferís que te escribamos por email, dejanos tu email.",
  });

export type QuoteInput = z.infer<typeof quoteSchema>;

export type QuoteState =
  | { status: "idle" }
  | { status: "success"; nombre: string; contacto?: string; conEmail?: boolean }
  | {
      status: "error";
      /** campos: falta o está mal un dato · envio: falló el envío · limite: demasiados pedidos seguidos */
      kind: "campos" | "envio" | "limite";
      message: string;
      fieldErrors?: Partial<Record<keyof QuoteInput, string>>;
      values?: Record<string, string>;
    };
