import type { Metadata } from "next";
import { PreviewClient } from "@/components/preview/PreviewClient";
import { currentYear, getSiteContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Vista previa",
  robots: { index: false, follow: false },
};

/**
 * Vista previa para el panel (se abre adentro de un iframe). Muestra lo
 * publicado hasta que el editor le manda los cambios sin guardar.
 */
export default async function PreviewPage() {
  const [content, year] = await Promise.all([getSiteContent(), currentYear()]);
  return <PreviewClient initial={content} year={year} />;
}
