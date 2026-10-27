import type { ThemePreference } from "@/lib/preferences";

/**
 * Identidad del panel. Junto con theme.css y navigation.ts es todo lo que
 * define la marca del dashboard.
 */
export const siteConfig = {
  name: "OFIR",
  tagline: "Panel de la web",
  description: "Panel para editar los textos y las fotos de ofirsolucionesintegrales.com.",
  /** Símbolo de la marca; en tema oscuro se usa la versión negativa. */
  logo: "/brand/ofir_simbolo_color.svg" as string | null,
  logoDark: "/brand/ofir_simbolo_negativo.svg" as string | null,
  lang: "es",
  locale: "es-AR",
  version: "v1.0.0",
  /** La marca es de tema claro: el oscuro queda como opción en Ajustes. */
  defaultTheme: "light" as ThemePreference,
  /** URL pública de la web: vista previa, "Ver en la web" y miniaturas de las fotos originales. */
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ofirsolucionesintegrales.com").replace(/\/$/, ""),
};
