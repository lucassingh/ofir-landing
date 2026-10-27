/**
 * JSON para <script type="application/ld+json">. Escapa "<" para que un texto
 * cargado desde el panel (ej. "</script>") no pueda cerrar el script.
 */
export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
