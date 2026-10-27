@AGENTS.md

# OFIR landing · guía para Claude Code

- Leé primero `../../docs/landing-ofir.md` (objetivos y contenido de cada sección), `README.md` y el `README.md` de la raíz (CMS y deploy).
- **Marca:** única fuente en `../../../branding/`. No edites `src/brand/`, `public/brand/` ni `public/proyectos/`: se generan con `npm run sync:brand`. Reglas visuales en `../../../branding/manual_marca_ofir/manual_de_marca_ofir.html`.
- **Textos y fotos** se editan desde el panel (`apps/admin`). Su declaración y los textos originales están en `packages/content/src/sections.ts`; los componentes los reciben por la prop `content` (`getSiteContent()` en `src/lib/content.ts`). Los componentes no tienen copy hardcodeado.
- Cada sección lleva `data-cms-section="<clave>"` (la usa la vista previa del panel en `/preview`).
- **Voz:** tuteo, frases cortas, sin superlativos ni "!!!". Sin datos inventados: medidas, plazos, clientes y testimonios solo si están confirmados. Obras sin permiso del cliente no se publican.
- **Colores:** Cal / Azul Acero / Azul Plano / Grafito. El oro (`bg-oro`) solo como acento chico (la "junta"), nunca en superficies grandes ni texto chico.
- **React Bits:** van sin modificar en `src/components/reactbits/`; la personalización va en wrappers. Si un componente usa `Math.random()`/`Date` al renderizar, cargarlo con `next/dynamic` y `ssr: false` (Cache Components rompe el prerender).
- **Server Components por defecto.** Solo las islas interactivas son `"use client"` (archivos `*Client.tsx`). Ojo: `/preview` renderiza las secciones dentro de un componente cliente, así que no pueden usar APIs solo de servidor (pasar los datos armados por props, como el año del footer).
- JSON-LD siempre con `jsonLd()` de `src/lib/json-ld.ts` (escapa `<`: los textos vienen del panel).
- Antes de terminar: `npm run typecheck && npm run lint && npm run build`.
