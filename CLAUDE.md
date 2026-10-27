@AGENTS.md

# OFIR landing · guía para Claude Code

- Leé primero `../docs/landing-ofir.md` (objetivos y contenido de cada sección) y `README.md`.
- **Marca:** única fuente en `../../branding/`. No edites `src/brand/`, `public/brand/` ni `public/proyectos/`: se generan con `npm run sync:brand`. Reglas visuales en `../../branding/manual_marca_ofir/manual_de_marca_ofir.html`.
- **Textos y datos** viven en `src/content/`. Los componentes no tienen copy hardcodeado.
- **Voz:** tuteo, frases cortas, sin superlativos ni "!!!". Sin datos inventados: medidas, plazos, clientes y testimonios solo si están confirmados. Obras con `publicable: false` no se muestran (falta permiso del cliente).
- **Colores:** Cal / Azul Acero / Azul Plano / Grafito. El oro (`bg-oro`) solo como acento chico (la "junta"), nunca en superficies grandes ni texto chico.
- **React Bits:** van sin modificar en `src/components/reactbits/`; la personalización va en wrappers. Si un componente usa `Math.random()`/`Date` al renderizar, cargarlo con `next/dynamic` y `ssr: false` (Cache Components rompe el prerender).
- **Server Components por defecto.** Solo las islas interactivas son `"use client"` (archivos `*Client.tsx`).
- Antes de terminar: `npm run typecheck && npm run lint && npm run build`.
