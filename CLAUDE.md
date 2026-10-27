# OFIR · monorepo (web + panel)

- `apps/web`: landing. Guía propia en `apps/web/CLAUDE.md`.
- `apps/admin`: panel (template de dashboard adaptado). Guía propia en `apps/admin/CLAUDE.md`.
- `packages/content`: registro único del CMS. Arquitectura y deploy en `README.md`.

## Reglas

- **Ningún texto ni foto de la landing va hardcodeado.** Todo sale de `packages/content/src/sections.ts`
  (campos + defaults) y llega a los componentes por la prop `content`. Para un texto nuevo: campo + default
  ahí, consumirlo en el componente, `npm test`.
- Cambiar un `maxLength`/`min`/`max` puede invalidar contenido ya guardado (esa sección vuelve a sus
  originales en la web). Los defaults tienen que pasar su propia validación (lo verifica `npm test`).
- Las secciones de la landing llevan `data-cms-section="<clave>"`: la vista previa del panel las usa.
- Almacenamiento: Vercel Blob (`@ofir/content/store`). Sin base de datos. Local y prod comparten el store.
- Auth del panel: `apps/admin/src/config/users.ts` + `ADMIN_PASSWORD_HASH` + `AUTH_SECRET`. Cada página
  del panel llama a `requireUser()` y cada Server Action a `getCurrentUser()` (el proxy no es la única barrera).
- Next 16 con Cache Components en las dos apps: leer `node_modules/next/dist/docs/` antes de usar APIs de caché.
- Antes de terminar: `npm run typecheck && npm run lint && npm test && npm run build`.
