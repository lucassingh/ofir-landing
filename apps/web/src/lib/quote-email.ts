import type { CompanyContent } from "@ofir/content";
import { SERVICIOS, CONTACTO, type QuoteInput } from "./quote-schema";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const label = (list: readonly { value: string; label: string }[], v: string) => list.find((x) => x.value === v)?.label ?? v;

/** Mail que recibe OFIR. HTML simple con tablas (compatible con Gmail/Outlook) y colores de marca. */
export function quoteEmailHtml(d: QuoteInput) {
  const rows: [string, string][] = [
    ["Nombre", d.nombre],
    ["Teléfono / WhatsApp", d.telefono],
    ["Email", d.email || "—"],
    ["Localidad", d.localidad || "—"],
    ["Servicio", label(SERVICIOS, d.servicio)],
    ["Medidas aprox.", d.medidas || "—"],
    ["Prefiere contacto por", label(CONTACTO, d.contacto)],
  ];
  const wa = `https://wa.me/${d.telefono.replace(/\D/g, "")}`;
  return `<!doctype html><html><body style="margin:0;background:#F5F3EF;font-family:Arial,Helvetica,sans-serif;color:#22262A">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F3EF;padding:24px 0"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden">
<tr><td style="background:#16324F;padding:22px 28px;color:#fff;font-size:20px;font-weight:bold">Nuevo pedido de presupuesto <span style="display:inline-block;width:10px;height:10px;background:#B8862B;margin-left:6px"></span></td></tr>
<tr><td style="padding:24px 28px"><table width="100%" cellpadding="0" cellspacing="0">
${rows.map(([k, v]) => `<tr><td style="padding:8px 0;border-bottom:1px solid #E2DDD3;color:#5E6770;font-size:12px;text-transform:uppercase;letter-spacing:1px;width:40%">${k}</td><td style="padding:8px 0;border-bottom:1px solid #E2DDD3;font-size:15px">${esc(v)}</td></tr>`).join("")}
</table>
<p style="margin:22px 0 8px;color:#5E6770;font-size:12px;text-transform:uppercase;letter-spacing:1px">Mensaje</p>
<p style="margin:0;font-size:15px;line-height:1.55;white-space:pre-wrap">${esc(d.mensaje)}</p>
<p style="margin:28px 0 0"><a href="${wa}" style="background:#16324F;color:#fff;text-decoration:none;padding:12px 20px;border-radius:999px;font-weight:bold;font-size:14px">Responder por WhatsApp</a></p>
</td></tr></table>
<p style="color:#8B949C;font-size:12px">Enviado desde ofirsolucionesintegrales.com</p>
</td></tr></table></body></html>`;
}

export function quoteEmailText(d: QuoteInput) {
  return `Nuevo pedido de presupuesto
Nombre: ${d.nombre}
Teléfono: ${d.telefono}
Email: ${d.email || "-"}
Localidad: ${d.localidad || "-"}
Servicio: ${label(SERVICIOS, d.servicio)}
Medidas: ${d.medidas || "-"}
Contacto: ${label(CONTACTO, d.contacto)}

${d.mensaje}`;
}

/** Confirmación al cliente (solo si dejó email). Teléfono y dirección salen del panel. */
export function confirmationEmailHtml(nombre: string, company: CompanyContent) {
  return `<!doctype html><html><body style="margin:0;background:#F5F3EF;font-family:Arial,Helvetica,sans-serif;color:#22262A">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;padding:28px">
<tr><td><p style="font-size:20px;font-weight:bold;color:#16324F;margin:0 0 12px">¡Gracias, ${esc(nombre)}!</p>
<p style="font-size:15px;line-height:1.55;margin:0 0 12px">Recibimos tu pedido de presupuesto. Te contactamos a la brevedad.</p>
<p style="font-size:15px;line-height:1.55;margin:0">Si querés adelantar, escribinos por WhatsApp al <a href="https://wa.me/${esc(company.whatsappNumber)}" style="color:#16324F">${esc(company.whatsappDisplay)}</a>.</p>
<p style="font-size:13px;color:#5E6770;margin:24px 0 0">OFIR · Ingeniería y oficio, a tu medida · ${esc(company.addressStreet)}, ${esc(company.addressCity)}</p></td></tr>
</table></td></tr></table></body></html>`;
}
