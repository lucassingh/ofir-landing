import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/content/site";
import { getSiteContent } from "@/lib/content";
import "./globals.css";

// Tipografías del manual de marca (woff2 en branding/tipografía/web, sincronizadas a src/brand/fonts)
const archivo = localFont({
  src: "../brand/fonts/Archivo-Variable.woff2",
  variable: "--font-archivo",
  weight: "100 900",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
});
const plex = localFont({
  src: "../brand/fonts/IBMPlexSans-Variable.woff2",
  variable: "--font-plex",
  weight: "100 700",
  display: "swap",
});
const plexMono = localFont({
  src: [
    { path: "../brand/fonts/IBMPlexMono-Regular.woff2", weight: "400" },
    { path: "../brand/fonts/IBMPlexMono-Medium.woff2", weight: "500" },
  ],
  variable: "--font-plex-mono",
  display: "swap",
});

/** Título y descripción salen del panel (Google y redes). */
export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSiteContent();
  return {
    metadataBase: new URL(site.url),
    title: { default: seo.title, template: `%s · ${site.name}` },
    description: seo.description,
    openGraph: {
      type: "website",
      locale: "es_AR",
      url: site.url,
      siteName: site.name,
      title: seo.shareTitle,
      description: seo.description,
      // la imagen la pone Next desde src/app/opengraph-image.jpg (1200×630)
    },
    twitter: { card: "summary_large_image", title: seo.shareTitle, description: seo.description },
    alternates: { canonical: "/" },
  };
}

export const viewport: Viewport = { themeColor: "#16324F" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-AR" className={`${archivo.variable} ${plex.variable} ${plexMono.variable}`}>
      <body>
        <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-card focus:px-4 focus:py-2">
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  );
}
