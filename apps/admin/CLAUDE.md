@AGENTS.md

# Panel de OFIR · guía para Claude Code

Dashboard starter adaptado a OFIR: edita el contenido de la landing (`apps/web`). Arquitectura en `../../README.md`.

## Marca

- Colores: `src/config/theme.css` (Azul Acero = primary, Azul Plano = secondary, Oro = accent solo para
  detalles). `--brand-*` son fijos para superficies de marca (login). Contraste de cada `*-foreground`
  verificado ≥ 4.5:1: si se cambia un color, volver a medir.
- Tipografías: `src/config/fonts.ts` (IBM Plex Sans/Mono + Archivo para títulos con `font-display`).
- Identidad y URL de la web: `src/config/site.ts`. Logo: `public/brand/`.

## Contenido (CMS)

- Las secciones, sus campos y sus textos originales están en `packages/content/src/sections.ts`. El menú
  (`src/config/navigation.ts`), el formulario (`components/content/fields.tsx`) y la validación salen de ahí.
- Un editor para todas: `app/(dashboard)/contenido/[section]` → `components/content/section-editor.tsx`
  (react-hook-form + el schema Zod de la sección). Guardar = Server Action en `actions.ts`.
- Vista previa: `components/content/live-preview.tsx` muestra `<web>/preview` en un iframe y le manda el
  contenido por postMessage (protocolo en `packages/content/src/preview.ts`). El iframe no se desmonta al
  cambiar de tamaño: no tocar esa estructura sin revisar que no recargue.
- Fotos: `lib/upload.ts` (achica en el navegador y sube a Blob) + `app/api/upload/route.ts` (firma el permiso).
  Las rutas `/proyectos/…` son fotos originales de la web: se muestran con `mediaUrl()`.
- Tipos de campo nuevos: agregarlos en `packages/content/src/types.ts`, `schema.ts` (validación),
  `index.ts` (normalización) y `components/content/fields.tsx` (control).

## Auth

- `src/proxy.ts` redirige a `/login` sin sesión. No es la única barrera: cada página llama a
  `requireUser()` y cada Server Action a `getCurrentUser()` (devuelve error en vez de redirigir, para no
  perder lo que se estaba editando).
- Cuentas en `src/config/users.ts`; contraseña en `ADMIN_PASSWORD_HASH`; firma en `AUTH_SECRET`.

## Estructura de una pantalla

```tsx
<PageHeader eyebrow="Sección" title="Título" description="…" actions={<Button>…</Button>} />
<PageBody>
  <Card>…</Card>
</PageBody>
```

Cards blancas con borde fino (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`).
Para una pantalla nueva vacía: `<PlaceholderView href="/ruta" />` y su item en `config/navigation.ts`.

## Convenciones (del starter)

- Colores siempre por token (`bg-primary`, `bg-surface`, `text-muted-foreground`…), nunca hex en componentes.
- Avisos: `import { toast } from "@/lib/toast"`; acciones reversibles con `action: { label: "Deshacer" }`.
- Skeletons: `components/ui/skeleton.tsx` y presets en `components/views/skeletons.tsx`.
- Animación: CSS para micro-interacciones, `motion/react` para alturas `auto`. Todo respeta
  `prefers-reduced-motion`.
- `cacheComponents` activo: `cookies()` y lecturas sin caché van dentro de `<Suspense>` o en páginas con
  `loading.tsx` (el panel nunca cachea el contenido: siempre lee lo último).
- Fechas que se muestran en componentes cliente: `formatDateTime` (zona horaria fija → igual en servidor y navegador).
- Con RHF, desestructurar `field` (`{ ref, value, onChange }`): la regla `react-hooks/refs` marca `field.value`.

## Tests

`npm test`: navegación, formato, preferencias, UI, sesión y contraseña, y en `lib/content.test.ts` +
`lib/store.test.ts` el registro de secciones (los defaults pasan su validación) y el almacenamiento con Blob simulado.

```bash
npm run dev  ·  npm run build  ·  npm run lint  ·  npm run typecheck  ·  npm test
```
