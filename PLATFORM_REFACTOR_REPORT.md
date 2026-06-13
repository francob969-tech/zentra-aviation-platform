# Platform Refactor Report — Consolidación de configuración

*Por ZENTRA Studio · refactor en 3 etapas para reutilización*

Objetivo cumplido: centralizar contenido, branding y flags en `lib/aero.ts` sin
cambiar el resultado visual de Aero Ejecutivo SF. **Lint y build en verde tras
cada etapa. Sitio verificado visualmente idéntico.**

Decisión de arquitectura: se mantuvo `lib/aero.ts` como hub de config (en vez de
renombrarlo a `client.config.ts`) para no tocar 21 imports sin beneficio visual.
Es la única fuente de verdad de contenido + marca + flags.

---

## 1. Archivos cambiados

### Etapa 1 — Contenido a config
- **`lib/aero.ts`** — + arrays de contenido (ver §2).
- `components/aero/TrustMetrics.tsx` — usa `TRUST_METRICS`.
- `components/aero/Process.tsx` — usa `PROCESS`.
- `components/aero/Faq.tsx` — usa `FAQS`.
- `components/aero/AircraftGallery.tsx` — usa `AIRCRAFT_GALLERY`.
- `components/aero/TimeSaved.tsx` — usa `TIME_ROUTES`, `TIME_MODES`.
- `app/cessna-402/page.tsx` — usa `AIRCRAFT_EXPERIENCE/OPERATIONS/SAFETY/SPECS`.

### Etapa 2 — Branding parametrizado
- **`lib/aero.ts`** — + `THEME`, `BRAND`, `STUDIO`, `SEO`, `AIRCRAFT_SEO`, `CTA`.
- `app/layout.tsx` — metadata + JSON-LD desde `SEO`; inyecta `THEME.colors` como variables CSS en `<html>`.
- `app/globals.css` — se eliminaron los valores `--aero-*` del `:root` (ahora vienen de `THEME`).
- `components/StudioSignature.tsx` — usa `STUDIO`.
- `app/opengraph-image.tsx` — colores desde `THEME`.
- `components/aero/Hero.tsx`, `FinalCTA.tsx`, `Aircraft.tsx`, `app/cessna-402/page.tsx` — labels desde `CTA`.

### Etapa 3 — Flags de secciones
- **`lib/aero.ts`** — + `SECTIONS`.
- `app/page.tsx` — `timeCalculator` y `faq` condicionales.
- `components/aero/Destinations.tsx` — `routeMap` condicional (grid adapta).
- `app/cessna-402/page.tsx` — `notFound()` si `aircraftPage` off.
- `app/admin/page.tsx` + `app/api/admin/login|leads|leads/[id]/route.ts` — `adminCRM` off → 404.
- `components/aero/AeroNav.tsx`, `AeroFooter.tsx`, `Aircraft.tsx` — ocultan el link/botón a la aeronave si `aircraftPage` off.

---

## 2. Campos de config agregados (todos en `lib/aero.ts`)

**Contenido (Etapa 1):** `TRUST_METRICS`, `PROCESS`, `TIME_ROUTES`, `TIME_MODES`,
`FAQS`, `AIRCRAFT_EXPERIENCE`, `AIRCRAFT_OPERATIONS`, `AIRCRAFT_SAFETY`,
`AIRCRAFT_SPECS`, `AIRCRAFT_GALLERY` (+ tipos `TrustMetric`, `ProcessStep`,
`TimeRoute`, `TimeMode`, `Faq`, `AircraftFeature`, `AircraftMission`, `Spec`,
`GalleryPhoto`).

**Branding (Etapa 2):** `THEME` (10 colores), `BRAND` (fuentes + logo),
`STUDIO` (firma), `SEO` (title, description, OG, JSON-LD, áreas), `AIRCRAFT_SEO`,
`CTA` (6 labels).

**Flags (Etapa 3):** `SECTIONS` (`aircraftPage`, `timeCalculator`, `routeMap`,
`adminCRM`, `faq`).

> Sumado a lo que ya existía: `SITE_NAME`, `SITE_TAGLINE`, `SITE_URL`, `WA_NUMBER`,
> `CONTACT_EMAIL`, `LEGAL`, `BASE`, `AIRCRAFT`, `SERVICES`, `DESTINATIONS`, `HUB`,
> `WHY_US`, `DEMO_MODE`, `buildWaLink`.

---

## 3. Contenido que sigue hardcodeado (gaps conocidos)

Honesto y a propósito (mover esto sin cambiar el visual requiere otra pasada;
no era parte de las 3 etapas):

1. **Títulos / introducciones de sección** — los `heading`, `eyebrow` y `sub` de
   cada sección siguen inline en sus componentes (ej. "Diseñemos tu vuelo",
   "De la consulta al despegue", "No comprás un avión. Comprás tiempo", títulos
   de Servicios/Destinos/Por qué/FAQ, y el H1 + subtítulo del Hero). Es el mayor
   gap restante para un rebrand 100% por config.
2. **`specs` de la sección Aeronave en la home** (`components/aero/Aircraft.tsx`) —
   array de 4 ítems, distinto al de la página `/cessna-402` (6 ítems). Se dejó
   separado a propósito para no alterar el visual de la home.
3. **Logo** — SVG en `components/aero/ui/Logo.tsx` y favicon `app/icon.svg`
   (los SVG estáticos no leen config). Swap de código/asset.
4. **Fuentes** — `next/font` en `app/layout.tsx` (macro de build, no runtime).
   `BRAND.fonts` lo documenta; el cambio real es en layout.
5. **Mensajes de WhatsApp pre-armados** — textos literales en los `buildWaLink(...)`
   de Hero/Nav/Float/FinalCTA/QuoteForm (son funcionales, no "marca").
6. **Copy del Hero y de la página de aeronave** (párrafos descriptivos) — siguen
   inline; solo se centralizaron specs/experiencia/operaciones/seguridad como datos.

> **Recomendación:** una Etapa 4 opcional movería títulos/intros a un bloque
> `COPY` en config. Llevaría el rebrand a ~95% por archivo. No se hizo para
> respetar "no cambiar el visual / etapas seguras".

---

## 4. Cómo lanzar un cliente nuevo desde este template

Estado actual (post-refactor). Para el flujo completo ver `REBRANDING_GUIDE.md`.

1. **Clonar e instalar** (`git clone`, `npm install`, `cp .env.example .env.local`).
2. **Editar `lib/aero.ts`** (el 90% del trabajo) — todos los bloques:
   - Marca: `SITE_NAME`, `SITE_TAGLINE`, `THEME.colors`, `BRAND`, `STUDIO`.
   - Negocio: `BASE`; WhatsApp/email/URL por `.env.local`.
   - Aeronave: `AIRCRAFT`, `AIRCRAFT_SPECS`, `AIRCRAFT_EXPERIENCE/OPERATIONS/SAFETY`, `AIRCRAFT_GALLERY`.
   - Comercial: `SERVICES`, `DESTINATIONS`, `WHY_US`, `FAQS`, `PROCESS`, `TIME_ROUTES`, `TRUST_METRICS`, `CTA`.
   - SEO: `SEO`, `AIRCRAFT_SEO`.
   - Legal: `LEGAL`.
   - **Flags:** `SECTIONS` según el vertical (escuela/charter/broker/aeroclub apagan lo que no aplique).
3. **Editar títulos/intros de sección** en los componentes (gap §3) — la única
   parte que aún vive en JSX. Buscar `heading=`, `eyebrow=`, `sub=` y el H1 del Hero.
4. **Assets:** logo (`Logo.tsx` + `app/icon.svg`), fotos (`public/aircraft/` + `src` en `AIRCRAFT_GALLERY`), fuentes (`layout.tsx` si cambian).
5. **Env vars + deploy:** ver `DEPLOYMENT_GUIDE.md` y `SUPABASE_SETUP.md`.
6. **Verificar:** `npm run lint && npm run build`, recorrer el sitio, probar flags.

**Reutilización lograda:** el motor (componentes, formulario, API, panel,
backend, auth, SEO técnico, animaciones) no se toca. El contenido de datos,
branding y flags ya es config. Único gap para 100%: títulos/intros de sección.

---

---

## Etapa 4 — Copy a config (títulos, eyebrows, subtítulos, marketing)

Movido todo el texto de marketing a un objeto `COPY` en `lib/aero.ts`,
preservando la estructura JSX (spans de acento, `<br>`) en los componentes —
solo las palabras viven en config. Espacios horneados en las strings para
render idéntico. **Lint y build en verde. Texto verificado a nivel DOM
(pixel-perfect) en home y página de aeronave.**

### 1. Archivos cambiados (Etapa 4)
- **`lib/aero.ts`** — + objeto `COPY`.
- `components/aero/Hero.tsx` — eyebrow, H1 (3 partes), subtítulo, badge disponibilidad.
- `components/aero/Services.tsx`, `Process.tsx`, `Faq.tsx`, `Destinations.tsx`,
  `TimeSaved.tsx`, `WhyUs.tsx`, `Aircraft.tsx` — eyebrow/título/subtítulo + prosa de cada sección.
- `components/aero/FinalCTA.tsx` — eyebrow, H2 (con `<br>`), subtítulo (con `{BASE.icao}`).
- `app/cessna-402/page.tsx` — H1, eyebrow, subtítulo, 5 SectionHeadings, notas y CTA final.
- `components/aero/QuoteForm.tsx` — heading + "¿Preferís hablar directo?" + texto de privacidad.
- `components/admin/AdminPanel.tsx` — títulos de login y dashboard.

### 2. Campos de copy agregados
`COPY` con bloques: `hero`, `services`, `aircraftHome`, `destinations`,
`whyUs`, `timeSaved`, `process`, `quote`, `faq`, `finalCta`, `aircraftPage`
(13 sub-claves), `admin`. Títulos con acento guardados como `titlePre` /
`titleAccent` / `titlePost`.

### 3. Texto que sigue hardcodeado (intencional)
Microcopy funcional / de UI, baja relevancia de rebrand y/o no es "marketing":
- **Formulario** (`QuoteForm`): labels de campos, placeholders, botones
  (Enviar solicitud / Email), tarjeta de itinerario, mensajes de validación/envío.
- **Panel admin**: UI operativa (botones, estados, stats, aviso Supabase, login
  "Contraseña"/"Ingresar").
- **Nav / footer**: "WhatsApp", "Navegación", "Contacto", tagline del footer.
- **404**: copy de la página de error.
- **Mensajes de WhatsApp pre-armados** (`buildWaLink(...)`): funcionales.
- **Datos**: `specs` (4 ítems) de la sección Aeronave de la home; labels dentro
  de los SVG (RouteMap/Schematic, muchos ya derivan de `BASE`/`HUB`).

> Todo el copy de **marketing visible** (títulos, eyebrows, subtítulos, hero,
> CTAs, intros, página de aeronave) ya está en config. Lo que queda es UI/datos.

### 4. Nuevo tiempo estimado de lanzamiento
El paso de "editar títulos/intros en componentes" desaparece: ahora es parte de
editar **un solo archivo** (`lib/aero.ts`). Rebrand de copy + branding + flags +
contenido = **~98% en un archivo**. Tiempo estimado de lanzamiento:
**~3 h 15 m** (antes ~3 h 40 m, sin el paso de buscar texto en componentes).
Resta solo: assets (logo/favicon/fotos) y env vars.

---

*ZENTRA Studio · [studio-zentra.com](https://studio-zentra.com/)*
