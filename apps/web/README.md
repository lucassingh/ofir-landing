# OFIR · landing

Landing de **ofirsolucionesintegrales.com**. Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS v4 · React Bits (motion + GSAP) · Resend.

La documentación comercial (objetivo de cada sección, árbol de información, copy, criterios de diseño) está en [`../../docs/landing-ofir.md`](../../docs/landing-ofir.md).

Los textos y las fotos se editan desde el panel (`apps/admin`). Cómo funciona el CMS y el deploy de las dos apps: [`../../README.md`](../../README.md).

## Arrancar

```bash
npm install                    # desde la raíz del monorepo
cp .env.example .env.local     # Resend + Blob + REVALIDATE_SECRET
npm run dev:web                # desde la raíz; corre sync:brand antes de levantar
```

Sin claves de Resend, en desarrollo el formulario funciona igual: el pedido se imprime en la consola del servidor.
Sin `BLOB_READ_WRITE_TOKEN`, la web muestra los textos originales del código.

## Marca y fotos: una sola fuente

Nada de la marca se edita en este proyecto. `npm run sync:brand` copia desde el workspace:

| Desde | Hacia |
|---|---|
| `branding/tokens/ofir-tokens.css` | `src/brand/ofir-tokens.css` (colores → `@theme` de Tailwind) |
| `branding/tipografía/web/*.woff2` | `src/brand/fonts/` (next/font/local) |
| `branding/logo/svg/` | `public/brand/` y `src/app/icon.svg` |
| `ofir-web/assets-proyectos/<obra>/` | `public/proyectos/<obra>/` (solo las carpetas que usan los textos originales del CMS) |

Los archivos copiados se versionan para que el deploy no dependa de las carpetas hermanas.
Las obras sin permiso del cliente **no se copian a `public/`**: no suben al deploy. Cuando llegue el permiso, se suben las fotos desde el panel (Obras → Agregar obra).
Si cambia un color o un logo: se cambia en `branding/`, se corre `npm run sync:brand` y se commitea.

## Estructura

```
src/
  app/
    layout.tsx            fuentes y metadata (título y descripción salen del panel)
    (site)/layout.tsx     navbar, footer, botones flotantes, JSON-LD
    (site)/page.tsx       las secciones
    preview/page.tsx      vista previa para el panel (iframe, noindex)
    api/revalidate/       el panel avisa acá cuando guarda
    actions/presupuesto.ts  Server Action → Resend
    sitemap.ts robots.ts icon.svg
  content/site.ts         datos fijos de la marca (nombre, dominio); el resto viene de packages/content
  components/
    layout/               Navbar, Footer, FloatingDock (redes + volver arriba), JsonLd
    sections/             una por sección (+ *Client.tsx para las islas interactivas)
    forms/QuoteForm.tsx   formulario de presupuesto (useActionState)
    ui/                   Logo, Eyebrow, SectionHeading, ObraFrame, Reveal, SlideIn, icons
    reactbits/            componentes de React Bits sin modificar
  lib/                    content (lee el CMS, cacheado), json-ld, cn, quote-schema (zod), quote-email
  brand/                  generado por sync:brand (no editar)
scripts/sync-brand.mjs
```

## Deploy (Vercel)

El repo es el monorepo (`ofir-web`). En Vercel, el proyecto de la web usa **Root Directory: `apps/web`**. Framework Next.js, sin cambiar comandos. El panel es otro proyecto (ver el README de la raíz).

Variables de entorno (Production y Preview):

| Variable | Valor |
|---|---|
| `RESEND_API_KEY` | clave de Resend (solo permiso de envío) |
| `CONTACT_TO` | `ofirsolucionesintegrales@gmail.com` (se pueden poner varios separados por coma) |
| `CONTACT_FROM` | `OFIR Web <web@ofirsolucionesintegrales.com>` |
| `BLOB_READ_WRITE_TOKEN` | se crea solo al conectar el Blob store (Storage) |
| `REVALIDATE_SECRET` | el mismo valor que en el panel |
| `NEXT_PUBLIC_ADMIN_URL` | URL del panel, ej. `https://admin.ofirsolucionesintegrales.com` |

Dominio: en Vercel → Settings → Domains agregar `ofirsolucionesintegrales.com` y `www`, y cargar en el DNS los registros que indica Vercel.
Los registros de Resend (DKIM, SPF/MX de envío) conviven con los de Vercel: no se pisan.

### Cómo llega el formulario a Gmail

No hace falta una casilla en el dominio. Resend **envía** desde `web@ofirsolucionesintegrales.com` (dominio verificado)
**hacia** la cuenta de Gmail de `CONTACT_TO`. El campo *Responder a* es el email del cliente, así que en Gmail se toca
**Responder** y le contesta directo. Si el cliente dejó su email, además recibe una confirmación automática.

Primera vez: si el mail cae en Spam, marcarlo "No es spam" y agregar `web@ofirsolucionesintegrales.com` a contactos.

## Pendientes

Ver la lista completa en `../../docs/landing-ofir.md` § 9.
