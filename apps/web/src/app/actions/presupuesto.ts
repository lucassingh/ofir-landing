"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { quoteSchema, type QuoteInput, type QuoteState } from "@/lib/quote-schema";
import { quoteEmailHtml, quoteEmailText, confirmationEmailHtml } from "@/lib/quote-email";
import { getSiteContent } from "@/lib/content";

/**
 * Server Action del formulario de presupuesto → Resend.
 *
 * Variables de entorno (ver .env.example):
 *   RESEND_API_KEY   clave de Resend
 *   CONTACT_TO       a dónde llega el pedido (ej. ofirsolucionesintegrales@gmail.com)
 *   CONTACT_FROM     remitente verificado en Resend (ej. "OFIR Web <web@ofirsolucionesintegrales.com>")
 *
 * Protección básica: honeypot + límite por IP en memoria.
 * TODO(producción): reemplazar el rate limit en memoria por Upstash/Vercel KV (en serverless no persiste).
 */
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;

function rateLimited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  return list.length > MAX_HITS;
}

export async function enviarPresupuesto(_prev: QuoteState, formData: FormData): Promise<QuoteState> {
  const raw = Object.fromEntries(
    ["nombre", "telefono", "email", "localidad", "servicio", "medidas", "mensaje", "contacto", "sitio_web"].map((k) => [k, String(formData.get(k) ?? "")]),
  );

  // honeypot: si viene lleno, fingimos éxito y no enviamos nada
  if (raw.sitio_web) return { status: "success", nombre: raw.nombre };

  const parsed = quoteSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof QuoteInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof QuoteInput;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "error", kind: "campos", message: "Revisá los campos marcados en rojo.", fieldErrors, values: raw };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (rateLimited(ip)) {
    return { status: "error", kind: "limite", message: "Recibimos varios pedidos seguidos desde tu conexión. Probá en unos minutos o mandanos el pedido por WhatsApp.", values: raw };
  }

  const data = parsed.data;
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM;

  if (!apiKey || !to || !from) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[presupuesto] Resend sin configurar. Pedido recibido:", data);
      return { status: "success", nombre: data.nombre, contacto: data.contacto, conEmail: !!data.email };
    }
    console.error("[presupuesto] Faltan RESEND_API_KEY / CONTACT_TO / CONTACT_FROM");
    return { status: "error", kind: "envio", message: "El formulario no está disponible en este momento. Tu pedido no se perdió: mandalo por WhatsApp con un toque.", values: raw };
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: to.split(",").map((s) => s.trim()),
    replyTo: data.email || undefined,
    subject: `Presupuesto · ${data.nombre} · ${data.servicio}`,
    html: quoteEmailHtml(data),
    text: quoteEmailText(data),
  });

  if (error) {
    console.error("[presupuesto] Resend:", error);
    return { status: "error", kind: "envio", message: "Hubo un problema al enviar tu pedido. Probá de nuevo en un momento, o mandalo por WhatsApp con un toque.", values: raw };
  }

  if (data.email) {
    // confirmación al cliente: si falla no bloquea el pedido
    const { company } = await getSiteContent();
    await resend.emails
      .send({ from, to: data.email, subject: "Recibimos tu pedido · OFIR", html: confirmationEmailHtml(data.nombre, company) })
      .catch((e) => console.warn("[presupuesto] confirmación:", e));
  }

  return { status: "success", nombre: data.nombre, contacto: data.contacto, conEmail: !!data.email };
}
