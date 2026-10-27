# OFIR · panel de la web

Panel para editar los textos y las fotos de ofirsolucionesintegrales.com. Basado en el dashboard starter
(Next 16 · React 19 · Tailwind 4 · Radix · Motion), con la marca de OFIR.

```bash
npm run dev:admin    # desde la raíz → http://localhost:3001
```

Arquitectura, almacenamiento y deploy: [`../../README.md`](../../README.md).

## Pantallas

| Ruta | Qué hace |
|---|---|
| `/login` | Email + contraseña. Bloque de marca a la izquierda (el degradé del cierre de la web). |
| `/` | Todas las secciones en orden, con su estado (original / con cambios, cuándo y quién). |
| `/contenido/[sección]` | Editor: formulario a la izquierda, la web real a la derecha (computadora o celular) actualizándose mientras se escribe. Guardar publica al instante. |
| `/ajustes` | Tema del panel, cuentas con acceso y estado de las conexiones. |

En el editor: `Ctrl S` / `⌘S` guarda, "Descartar cambios" vuelve a lo publicado y "Restaurar original" vuelve a
los textos con los que se lanzó la web. Si hay cambios sin guardar, avisa antes de salir.

## Acceso

- Cuentas: `src/config/users.ts` (OFIR y Andrés, las dos superadmin).
- Contraseña: una sola, en `ADMIN_PASSWORD_HASH` (`npm run hash-password -- "..."` desde la raíz).
- Sesión: cookie firmada (`AUTH_SECRET`), dura 30 días.

## Variables

Ver `.env.example`.
