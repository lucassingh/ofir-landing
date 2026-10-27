import { site } from "@/content/site";

/** Link a WhatsApp con mensaje precargado (wa.me funciona en desktop y mobile). */
export function whatsappUrl(message = "Hola OFIR, quiero pedir un presupuesto.") {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`;
}
