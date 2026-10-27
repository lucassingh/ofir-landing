# React Bits

Componentes copiados de [React Bits](https://reactbits.dev) (variante TypeScript + Tailwind), de David Haz.
Licencia: MIT + Commons Clause (uso libre en proyectos, no se pueden revender los componentes como tales).

Se copian tal cual (sin cambios de lógica) para poder actualizarlos fácil. La personalización
de marca se hace en los wrappers, no acá:

| Componente | Dónde se usa | Wrapper |
|---|---|---|
| BlurText | Título del hero | `sections/HeroClient.tsx` |
| RotatingText | "Hacemos …" en el hero (solo cliente: usa Math.random) | `sections/HeroClient.tsx` |
| Magnet | Botón de WhatsApp del hero | `sections/HeroClient.tsx` |
| ScrollVelocity | Cinta de oficios | `sections/Marquee.tsx` |
| SpotlightCard | Cards de servicios | `sections/ServicesClient.tsx` |
| CountUp | Números | `sections/StatsClient.tsx` |
| AnimatedContent | Aparición al scrollear | `ui/Reveal.tsx` |

Para sumar otro: `src/ts-tailwind/<Categoria>/<Nombre>/<Nombre>.tsx` del repo
DavidHDev/react-bits, o `npx shadcn@latest add https://reactbits.dev/r/<Nombre>-TS-TW`.
