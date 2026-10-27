# OFIR · Landing — documentación comercial y de diseño

> Sitio: **ofirsolucionesintegrales.com** · Proyecto: `ofir-web/ofir-landing` · Versión 0.1 · Octubre 2026
> Este documento explica **qué tiene que lograr** la web y **por qué** cada sección está donde está. Es la referencia para escribir copy, sumar secciones o revisar diseño. Lo técnico (cómo correrla, estructura de carpetas) está en `ofir-landing/README.md`.

---

## 1. Objetivo

**Que una persona de Venado Tuerto y la zona que necesita un trabajo de herrería, una estructura, un piso o un techo, nos escriba.**

| | |
|---|---|
| **Conversión principal** | Mensaje de WhatsApp (botón del hero, navbar, cards de servicios, botón flotante en mobile). Es el canal que la gente de la zona ya usa y el que OFIR responde más rápido. |
| **Conversión secundaria** | Formulario de presupuesto (sección Contacto). Para quien prefiere dejar los datos ordenados, consulta desde la compu o es una empresa que necesita un registro por mail. Llega por Resend al mail de OFIR con todos los datos y un botón "Responder por WhatsApp". |
| **Objetivo de apoyo** | Credibilidad: que en 10 segundos se vea que el taller existe, que los trabajos son reales y que cubre lo que la persona necesita. |
| **Qué medimos** | Clics a WhatsApp (por ubicación del botón), formularios enviados, scroll hasta Obras. Ver § 8. |

**Audiencias, en orden de prioridad**
1. **Comercios y pymes** de la zona: necesitan estanterías, barras, rejas, techos, pisos. Deciden rápido, miran fotos.
2. **Industrias y plantas**: buscan un taller con criterio técnico (planos, montaje, plazos). Miran que haya obras industriales reales.
3. **Particulares**: un portón, una reja, una mesa, un techo con filtraciones.

**Lo que NO es la web:** no es un catálogo con precios, ni un blog, ni una tienda. Es una vidriera que lleva a una conversación.

---

## 2. Principios de diseño

**Estilo "Apple" sobre la marca de OFIR.** Fondo gris muy claro (`--page #F2F1EE`, un Cal un punto más frío), cards blancas grandes con **radio 28 px** (36 px en las bandas a todo el ancho) y sombra larga y suave. Las bandas azules (hero, proceso, contacto) son **cards** separadas del borde, no fondos a sangre: eso da el aire "objeto" de la referencia (biz-ideas) sin perder la sobriedad industrial.

| Decisión | Por qué |
|---|---|
| Navbar flotante tipo píldora, blanca, con el CTA de WhatsApp siempre visible | Patrón de la referencia. El CTA principal nunca sale de pantalla. |
| Títulos en **Archivo Expanded ExtraBold** (`stretch-expanded`), texto en **IBM Plex Sans**, datos en **Plex Mono** | Tipografías del manual. El ancho expandido es la firma visual de OFIR. |
| Paleta: Azul Acero (bandas, botones), Azul Plano (acentos), Cal / blanco (superficies), Grafito (texto) | Manual. Proporción aprox. Cal 60 / Azul 25 / Grafito 10 / Azul Plano 3 / Oro 2. |
| **Oro solo como "junta"**: el cuadradito de los eyebrows, el punto del marco de obra, la esquina de las bandas | Regla del manual: el oro es único y chico. Nunca en superficies ni texto. |
| Recursos del manual: **marco de obra** en fotos del hero, **grilla de plano** en las bandas azules, **símbolo recortado** asomando en hero y CTA | Un recurso principal por bloque, siempre tenue y por detrás. |
| **Solo fotos reales** de OFIR, con su recuadre | Manual. Es el principal argumento de confianza. |
| Animaciones de **React Bits** con intención, no decoración (ver § 6) | Impacto en el primer scroll sin castigar la velocidad. Todas respetan `prefers-reduced-motion`. |
| Mobile primero en lo funcional | La mayoría llega desde Instagram en el celular: botón flotante de WhatsApp, menú simple, form de una columna. |

**Accesibilidad (WCAG AA):** pares de color del manual (texto sobre Cal y sobre Azul Acero), foco visible, "Saltar al contenido", `aria` en menú, filtros (`tablist`) y visor de fotos (`<dialog>` nativo con teclado), formulario con `label`, errores anunciados (`role="alert"`) y funcionando sin JavaScript (Server Action).

---

## 3. Árbol de información

Landing de **una sola página** con anclas. Más adelante, si hace falta posicionar por servicio, se suman páginas propias (§ 9).

```
ofirsolucionesintegrales.com
│
├── Navbar (fija)        Logo · Servicios · Obras · Cómo trabajamos · Preguntas · Contacto · [WhatsApp]
│
├── 01 Hero              Propuesta de valor + CTA WhatsApp + CTA formulario + 3 pruebas
├── 02 Cinta de oficios  Rejas · Portones · Estructuras · Cabreadas · Pisos epoxi · Impermeabilización
├── 03 Servicios         #servicios   4 cards: Industria · Herrería · Pisos epoxi · Techos PROTEX
├── 04 Números           10 años de garantía · 3 frentes · $0 presupuesto · 100 % fotos reales
├── 05 Obras             #obras       Galería filtrable por frente + visor de fotos
├── 06 Cómo trabajamos   #proceso     5 pasos
├── 07 El taller         Concepto (el oro de Ofir) + misión social
├── 08 Preguntas         #preguntas   6 preguntas (FAQ + datos estructurados)
├── 09 Banda CTA         "¿Tenés un trabajo en mente?" → WhatsApp / formulario
├── 10 Contacto          #contacto    Datos + formulario de presupuesto (→ Resend)
│
├── Footer               Logo con slogan · Servicios · Navegación · Contacto · © · "Cada unión, bien hecha."
└── WhatsApp flotante    (solo mobile)
```

**Recorrido esperado:** Hero → (WhatsApp) **o** Hero → Servicios → Obras → (WhatsApp desde una card) **o** … → Preguntas → Contacto (formulario).
Hay un CTA a WhatsApp a no más de un scroll de distancia en cualquier punto de la página.

---

## 4. Secciones: objetivo, contenido y diseño

### Navbar
- **Objetivo:** orientar y tener el WhatsApp siempre a mano.
- **Contenido:** logo horizontal color · 5 anclas · botón "Escribinos" (WhatsApp).
- **Diseño:** píldora blanca 90 % con desenfoque, centrada (máx. 1024 px), sombra que aparece al scrollear. En mobile: logo + "WhatsApp" + menú desplegable en card.
- **Archivo:** `components/layout/Navbar.tsx`

### 01 · Hero
- **Objetivo:** en 5 segundos: quiénes somos, qué hacemos, dónde, y el primer clic a WhatsApp.
- **Contenido:**
  - Eyebrow: *Taller en Venado Tuerto, Santa Fe*
  - H1: **Ingeniería y oficio, a tu medida.** (slogan de la marca)
  - Línea rotativa: *Hacemos [rejas y portones · estructuras metálicas · pisos epoxi · techos impermeables · muebles de hierro y madera]* — muestra la amplitud sin una lista larga.
  - Bajada con los tres frentes y "presupuesto sin cargo".
  - CTA 1: **Escribinos por WhatsApp** (blanco, magnético). CTA 2: *Pedir presupuesto* → #contacto.
  - Muesca inferior con 3 pruebas: *Presupuesto sin cargo · Garantía hasta 10 años · Pago en cuotas con factura*.
  - Dos fotos reales con marco de obra (mesa ratona + cabreadas: uno doméstico y uno industrial).
- **Diseño:** card Azul Acero con grilla de plano y símbolo recortado. La muesca "come" la esquina de la card con el color de la página (patrón de la referencia).
- **React Bits:** BlurText (título), RotatingText (línea), Magnet (CTA).
- **Archivos:** `sections/Hero.tsx`, `sections/HeroClient.tsx`

### 02 · Cinta de oficios
- **Objetivo:** ritmo visual y palabras clave grandes (lo que la gente busca).
- **Diseño:** dos filas que se mueven en sentidos opuestos y aceleran con el scroll; una fila sólida y otra en contorno; separador = junta de oro.
- **React Bits:** ScrollVelocity. **Archivo:** `sections/Marquee.tsx`

### 03 · Servicios — "Tres frentes, un mismo taller."
- **Objetivo:** que cada audiencia se encuentre en una card y pueda escribir desde ahí, con el mensaje ya armado.
- **Contenido (4 cards):** cada una con foto real, etiqueta, título, resumen, 4 ítems y "Consultar por WhatsApp" (mensaje precargado distinto por servicio, así OFIR sabe de qué viene la consulta).
  1. **Ingeniería y herrería industrial** — estructuras, cabreadas, puentes grúa, dispositivos, equipamiento, planos.
  2. **Hierro y madera para tu casa o tu local** — rejas, portones, puertas de seguridad, galerías, mesas, barras, estanterías.
  3. **Pisos y revestimientos epoxi** — plantas, talleres, gimnasios, escuelas, demarcación.
  4. **Techos y muros con línea PROTEX** — diagnóstico sin cargo, con o sin materiales, garantía hasta 10 años.
- **Diseño:** bento 7/5 – 5/7 en desktop, cards blancas grandes con luz que sigue el cursor.
- **React Bits:** SpotlightCard, AnimatedContent. **Datos:** `content/services.ts`

### 04 · Números
- **Objetivo:** reforzar con datos **reales** (regla del manual: nada inventado).
- **Contenido:** 10 años de garantía (impermeabilización, según sistema) · 3 frentes · $0 el presupuesto · 100 % fotos reales.
- **Pendiente:** si OFIR confirma años de oficio u obras realizadas, reemplazar "3 frentes" o "100 %".
- **Diseño:** 4 bloques de color de la paleta, escalonados. **React Bits:** CountUp.

### 05 · Obras — "Trabajos reales, hechos en el taller."
- **Objetivo:** la prueba. Que la persona vea un trabajo parecido al suyo.
- **Contenido:** obras de `ofir-web/assets-proyectos` con título y una línea. Filtro por frente. Al tocar, visor con todas las fotos de esa obra.
- **Regla:** se muestran solo las obras con `publicable: true`. Barra del local, mesas de laurel y prensa quedan ocultas hasta tener el permiso del cliente.
- **Diseño:** cards 4:5 con la foto a sangre, degradé azul abajo y texto blanco; chips de filtro tipo píldora.
- **Datos:** `content/projects.ts` · **Archivos:** `sections/Projects.tsx`, `sections/ProjectsGallery.tsx`

### 06 · Cómo trabajamos — "De tu mensaje a la obra terminada."
- **Objetivo:** bajar la incertidumbre ("¿cómo sigue si escribo?").
- **Contenido:** 1 Nos escribís · 2 Visita y diagnóstico · 3 Presupuesto sin cargo · 4 Fabricación en el taller · 5 Entrega y garantía.
- **Diseño:** banda azul con grilla, 5 cards translúcidas numeradas en Plex Mono; el primer paso lleva el punto de oro.
- **Datos:** `content/steps.ts`

### 07 · El taller — "El valor está en lo que se forja."
- **Objetivo:** diferenciar por valores (la persona vale más que el oro) y por la misión social (jóvenes en el oficio).
- **Contenido:** concepto del nombre + misión + foto del banco de trabajo.
- **Pendiente:** reemplazar la foto por una del **equipo trabajando** (con protección) cuando esté la sesión de fotos del manual.

### 08 · Preguntas — "Lo que más nos preguntan."
- **Objetivo:** responder objeciones antes de que frenen el contacto, y SEO (FAQPage en JSON-LD).
- **Contenido:** costo del presupuesto · zona · cuotas · garantía · con o sin materiales · trabajos industriales.
- **Pendiente:** validar cada respuesta con OFIR. **Datos:** `content/faq.ts`

### 09 · Banda CTA — "¿Tenés un trabajo en mente?"
- **Objetivo:** el último empujón antes del formulario.
- **Diseño:** card Azul Plano a lo ancho, símbolo recortado, esquina de oro. CTA WhatsApp + "Completar el formulario".

### 10 · Contacto — "Pedí tu presupuesto sin cargo."
- **Objetivo:** capturar a quien no quiere escribir por WhatsApp, con datos útiles para cotizar.
- **Card azul (datos):** WhatsApp destacado, teléfono, celular, email, Instagram, dirección (abre Google Maps), horario *(a confirmar)*.
- **Card blanca (formulario):**

  | Campo | Tipo | Obligatorio | Por qué |
  |---|---|---|---|
  | Nombre y apellido | texto | sí | |
  | Teléfono / WhatsApp | tel | sí | es como responde OFIR |
  | Email | email | no (sí si elige "Email") | confirmación + responder |
  | Localidad | texto | no | saber si está en zona |
  | ¿Qué necesitás? | chips | sí | Industria · Herrería · Muebles · Piso epoxi · Impermeabilización · Otro |
  | Contanos el trabajo | textarea | sí (≥ 10) | |
  | Medidas aproximadas | texto (mono) | no | ayuda a pre-cotizar |
  | Preferís contacto por | segmentado | sí | WhatsApp · Llamada · Email |

- **Envío:** Server Action (`app/actions/presupuesto.ts`) → validación con zod → **Resend** a `CONTACT_TO`, con `reply-to` del cliente y botón "Responder por WhatsApp" en el mail. Si el cliente dejó email, recibe una confirmación con la marca.
- **Anti-spam:** honeypot + límite de 5 envíos cada 10 min por IP (en memoria; pasar a Upstash en producción).
- **Estados:** error por campo · error general con salida a WhatsApp · éxito con agradecimiento y link a WhatsApp si es urgente.

### Footer
- Logo con slogan, frase de taller, columnas Servicios / Navegación / Contacto, © y "Cada unión, bien hecha."

---

## 5. Copy y voz

- **Tuteo**, frases cortas, verbos concretos ("medimos, te asesoramos y te pasamos el número").
- Nombrar el trabajo por su nombre: portón, cabreada, membrana, piso epoxi.
- **Sin** superlativos ("los mejores"), sin "!!!", sin "el precio más bajo", sin "Soluciones Integrales" como descriptor.
- **Sin datos inventados.** Si un número, plazo o cliente no está confirmado, no va.
- Todo el texto vive en `src/content/*.ts`: se edita ahí, no en los componentes.

**Palabras clave (SEO local):** herrería en Venado Tuerto · rejas y portones Venado Tuerto · estructuras metálicas · cabreadas · pisos epoxi · piso industrial · impermeabilización de techos · membrana PROTEX · muebles de hierro y madera.

---

## 6. React Bits: qué se usa y para qué

| Componente | Sección | Para qué (no decoración) |
|---|---|---|
| **BlurText** | Hero, H1 | Entrada del mensaje principal palabra por palabra: primera impresión. |
| **RotatingText** | Hero | Mostrar 5 oficios en una línea. Se carga solo en cliente. |
| **Magnet** | Hero, CTA WhatsApp | El botón "atrae" el cursor: invita al clic principal. |
| **ScrollVelocity** | Cinta de oficios | Ritmo y palabras clave grandes, responde al scroll. |
| **SpotlightCard** | Servicios | Feedback de hover en cards grandes, con luz en Azul Plano. |
| **CountUp** | Números | Da peso a datos reales. |
| **AnimatedContent** | Todas (Reveal) | Aparición suave al entrar en pantalla. |

Candidatos para la próxima iteración (evaluar peso y sentido): *TiltedCard* para el visor de obras, *LogoLoop* si hay logos de clientes **con permiso**, *ClickSpark* en el botón de enviar.
Reglas: componentes sin modificar en `components/reactbits/`, personalización en wrappers, máximo un efecto fuerte por sección, respetar `prefers-reduced-motion`.

---

## 7. SEO técnico y rendimiento

- **Metadata** (título, descripción, Open Graph en es-AR) en `app/layout.tsx`; `sitemap.xml`, `robots.txt` y favicon (símbolo) generados por Next.
- **JSON-LD:** `HomeAndConstructionBusiness` (nombre, dirección, teléfono, zona, Instagram, servicios) + `FAQPage`.
- **Imágenes:** `next/image` (AVIF/WebP automáticos, `sizes` por layout). Las fotos actuales vienen de Instagram (~1300 px): sirven, pero conviene reemplazarlas por originales.
- **Fuentes:** `next/font/local` con woff2 subset latino (≈ 190 KB en total), sin pedidos a Google.
- **Página estática** (prerender): solo las islas interactivas mandan JS.
- **Objetivo Lighthouse:** ≥ 90 en Performance, Accesibilidad, Buenas prácticas y SEO en mobile.
- **Pendiente:** imagen OG propia 1200×630 con la marca (`app/opengraph-image.tsx`) y alta en Google Business Profile con el mismo NAP (nombre, dirección, teléfono).

---

## 8. Medición

- **Eventos:** `click_whatsapp` (con `ubicacion`: navbar / hero / servicio-<id> / fab / cta / contacto), `form_submit_success`, `form_submit_error`, `view_obras`.
- **Herramienta sugerida:** Vercel Analytics (sin cookies) o GA4 con consentimiento. Para que WhatsApp sea medible, usar el mensaje precargado distinto por ubicación (ya está por servicio).
- **Revisión mensual:** clics a WhatsApp por ubicación, formularios recibidos, consultas que terminan en presupuesto (dato de OFIR).

---

## 9. Pendientes y próximos pasos

**Antes de publicar (contenido, depende de OFIR)**
- [ ] Confirmar horario de atención (`content/site.ts`).
- [ ] Validar las respuestas de Preguntas.
- [ ] Permisos: barra y mesas del local gastronómico, prensa, Corven (foto 04). Pasar `publicable` a `true` cuando estén.
- [ ] Datos de cada obra (cliente si se puede nombrar, localidad, medidas) para enriquecer el visor.
- [ ] Fotos originales en alta y una del equipo trabajando.

**Técnico (para Claude Code)**
- [ ] Resend: verificar el dominio, cargar las variables en Vercel y probar un envío real.
- [ ] Rate limit persistente (Upstash / Vercel KV).
- [ ] Analytics + eventos de § 8.
- [ ] `opengraph-image.tsx` con la marca.
- [ ] Subir fotos al formulario (Vercel Blob o Resend con adjuntos), opcional.
- [ ] Tests: validación del schema (unit) y envío del formulario (Playwright).
- [ ] Revisión Lighthouse y de accesibilidad en mobile real.

**Fase 2 (si el SEO lo pide):** páginas por servicio (`/herreria`, `/pisos-epoxi`, `/impermeabilizacion`, `/industria`) y por obra (`/obras/[slug]`), reutilizando `content/`.
