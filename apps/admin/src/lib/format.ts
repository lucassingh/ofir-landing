import { siteConfig } from "@/config/site";

const { locale } = siteConfig;

/** Zona horaria de OFIR: las fechas se muestran igual en el servidor (UTC) y en el navegador. */
const TIME_ZONE = "America/Argentina/Buenos_Aires";

/** Fechas sin hora (YYYY-MM-DD): se formatean en UTC para no correrse un día. */
export function formatDate(isoDate: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(locale, { timeZone: "UTC", ...options }).format(new Date(isoDate));
}

/** "27 de octubre de 2026, 17:40" en hora argentina. */
export function formatDateTime(isoDateTime: string) {
  return new Intl.DateTimeFormat(locale, {
    timeZone: TIME_ZONE,
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    // explícito: según la versión de ICU, es-AR sale en 12 h ("05:40 p. m.") y el
    // servidor y el navegador podrían no coincidir
    hourCycle: "h23",
  }).format(new Date(isoDateTime));
}

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31_536_000],
  ["month", 2_592_000],
  ["week", 604_800],
  ["day", 86_400],
  ["hour", 3_600],
  ["minute", 60],
];

/** "hace 5 minutos", "ayer", "hace 2 semanas". */
export function formatRelativeTime(isoDateTime: string, now = Date.now()) {
  const seconds = Math.round((new Date(isoDateTime).getTime() - now) / 1000);
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  for (const [unit, size] of RELATIVE_UNITS) {
    if (Math.abs(seconds) >= size) return formatter.format(Math.round(seconds / size), unit);
  }
  return formatter.format(0, "minute");
}
