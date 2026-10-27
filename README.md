# OFIR · web + panel

Monorepo de **ofirsolucionesintegrales.com** y su panel de contenido.

| Carpeta | Qué es | Puerto local |
|---|---|---|
| `apps/web` | La landing (Next 16, Cache Components). | 3000 |
| `apps/admin` | El panel: login, inicio y un editor por sección con vista previa en vivo. | 3001 |
| `packages/content` | El CMS: secciones, campos, textos originales, validación y almacenamiento. Lo usan las dos apps. | — |

```bash
npm install
npm run dev          # las dos apps (turbo)
npm run dev:web      # solo la web
npm run dev:admin    # solo el panel
npm run build        # build de las dos
npm test             # tests del panel (incluye el registro de secciones y el almacenamiento)
```

## Cómo funciona (sin base de datos)

No hay Neon ni ninguna base: todo vive en **un Blob store de Vercel**, compartido por las dos apps.

```
panel ──guarda──▶ Vercel Blob: cms/content.json  (textos)
  │                            cms/images/*      (fotos subidas)
  │                            cms/history/*     (copia de cada guardado, quedan 30)
  └──POST /api/revalidate──▶ web ──lee content.json──▶ página estática regenerada
```

- **Textos**: un solo JSON. Solo están las secciones que se editaron; el resto usa los textos originales que están en el código (`packages/content/src/sections.ts`). Si el JSON falta o algo no valida, la web muestra los originales: nunca se rompe por contenido.
- **Fotos**: el navegador las achica (2400 px, WebP) y las sube directo a Blob; en el JSON queda la URL.
- **Publicar**: al guardar, el panel avisa a la web (`/api/revalidate` con `REVALIDATE_SECRET`) y la próxima visita ya ve el cambio. La web sigue siendo estática; igual se refresca sola una vez por día por si un aviso no llega.
- **Concurrencia**: se escribe con `ifMatch` (ETag): si dos personas guardan a la vez, la segunda se aplica sobre la versión de la primera, no la pisa.
- **Login**: las cuentas están en `apps/admin/src/config/users.ts` (las dos son superadmin). La contraseña es una sola, guardada como hash en `ADMIN_PASSWORD_HASH`. La sesión es una cookie firmada con `AUTH_SECRET`. Sin registro ni validación de email.
- **Vista previa**: el panel muestra la web real (`/preview`) en un iframe y le manda por `postMessage` lo que se está escribiendo. Solo acepta mensajes del origen del panel (`NEXT_PUBLIC_ADMIN_URL`).

Un solo entorno: local y producción usan el **mismo** Blob store. Lo que se guarda desde el panel local se ve en la web publicada (con `REVALIDATE_URLS` el panel local avisa a las dos webs).

## Deploy en Vercel

Dos proyectos apuntando al mismo repo.

**1. Web (el proyecto que ya existe)**
- Settings → General → **Root Directory: `apps/web`**. Framework Next.js, sin cambiar comandos.
- Variables: las de Resend que ya tiene + `REVALIDATE_SECRET` + `NEXT_PUBLIC_ADMIN_URL` (la URL del panel).

**2. Panel (proyecto nuevo)**
- Add New → Project → mismo repo → **Root Directory: `apps/admin`**.
- Variables: `AUTH_SECRET`, `ADMIN_PASSWORD_HASH`, `REVALIDATE_SECRET` (el mismo de la web), `NEXT_PUBLIC_SITE_URL=https://ofirsolucionesintegrales.com`.
- Dominio sugerido: `admin.ofirsolucionesintegrales.com`.

**3. Almacenamiento**
- Storage → Create → **Blob** → conectarlo a **los dos** proyectos (crea `BLOB_READ_WRITE_TOKEN` en cada uno).
- Para desarrollo: copiar ese token a `apps/web/.env.local` y `apps/admin/.env.local`.

Las variables `NEXT_PUBLIC_*` se fijan en el build: si se cambian, hay que volver a hacer deploy.

Cada app tiene su `.env.example` con todo explicado.

## Cambiar la contraseña

```bash
npm run hash-password -- "NuevaContraseña"
```

Pegar el resultado en `ADMIN_PASSWORD_HASH` (Vercel, proyecto del panel) y volver a hacer deploy.

## Agregar un texto editable

1. Agregar el campo a su sección en `packages/content/src/sections.ts` (tipo, campo y default).
2. Usarlo en el componente de la landing desde `content`.
3. `npm test` verifica que los defaults pasen su propia validación.

El formulario del panel, la validación y la vista previa salen solos de esa declaración.
