import localFont from "next/font/local";

/**
 * Tipografías del manual de marca (las mismas woff2 de la web, en src/brand/fonts):
 * IBM Plex Sans para el texto, IBM Plex Mono para datos y Archivo para títulos.
 */
export const fontSans = localFont({
  src: "../brand/fonts/IBMPlexSans-Variable.woff2",
  variable: "--font-brand-sans",
  weight: "100 700",
  display: "swap",
});

export const fontMono = localFont({
  src: [
    { path: "../brand/fonts/IBMPlexMono-Regular.woff2", weight: "400" },
    { path: "../brand/fonts/IBMPlexMono-Medium.woff2", weight: "500" },
  ],
  variable: "--font-brand-mono",
  display: "swap",
});

export const fontDisplay = localFont({
  src: "../brand/fonts/Archivo-Variable.woff2",
  variable: "--font-brand-display",
  weight: "100 900",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
});
