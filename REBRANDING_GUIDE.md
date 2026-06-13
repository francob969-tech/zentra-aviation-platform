# Rebranding Guide — Lanzar un cliente nuevo en < 4 horas

*Por ZENTRA Studio · playbook operativo*

Pasos exactos, en orden, con presupuesto de tiempo, para clonar la plataforma y
lanzar un nuevo cliente de aviación. Asume que ya tenés los datos y assets del
cliente (si no, mandales `CLIENT_DATA_REQUIRED.md` primero).

> **Estado del producto:** la config está centralizada en `lib/aero.ts` (~70%).
> Para llegar al flujo de 1 archivo, hacer **una vez** el refactor de
> consolidación de la sección 0. Hecho eso, cada cliente nuevo salta directo al
> Paso 1.

---

## Paso 0 · (UNA SOLA VEZ) Consolidar la config — ~1 día

Refactor de plataforma que se hace una vez y beneficia a todos los clientes
futuros. Mover el contenido hardcodeado a la config:

| Mover de | A (en `lib/client.config.ts`) |
|---|---|
| `Faq.tsx` `FAQS` | `FAQS[]` |
| `Process.tsx` `STEPS` | `PROCESS[]` |
| `TimeSaved.tsx` `ROUTES` | `TIME_ROUTES[]` |
| `TrustMetrics.tsx` `metrics` | `TRUST_METRICS[]` |
| `Aircraft.tsx` `specs` + `cessna-402` copy | `AIRCRAFT.specs[]`, `AIRCRAFT.sections` |
| `AircraftGallery.tsx` `PHOTOS` | `AIRCRAFT.gallery[]` |
| tokens `--aero-*` (globals.css) | `theme.colors` (inyectados en `layout.tsx`) |
| fuentes (layout.tsx) | `theme.fonts` |
| textos OG/description (layout.tsx) | `SEO` |

Además: agregar `sections` flags y renombrar `lib/aero.ts` → `lib/client.config.ts`
(con re-export temporal para no romper imports). Resultado: el resto de esta
guía toca **1 archivo de config + assets**.

---

## Lanzamiento de un cliente nuevo (post-refactor) — objetivo < 4 h

### Paso 1 · Clonar e instalar — 15 min
```bash
# clonar el template / repo base
git clone <repo-base> cliente-nuevo && cd cliente-nuevo
npm install
cp .env.example .env.local
```

### Paso 2 · Editar la configuración — 90 min
**Único archivo de contenido:** `lib/client.config.ts`. Completar por bloque
(ver `CLIENT_VARIABLES.md` para el catálogo completo):
- **Branding:** `SITE_NAME`, `SITE_TAGLINE`, `theme.colors`, `theme.fonts`
- **Business:** `BASE`, `BUSINESS` (teléfono/dirección) — WhatsApp/email/URL van por `.env.local`
- **Aircraft:** `AIRCRAFT` (modelo, descripción, specs, sections, slug, gallery)
- **Commercial:** `SERVICES`, `DESTINATIONS` (+ coords x/y del mapa), `WHY_US`, `FAQS`, `PROCESS`, `TIME_ROUTES`, `TRUST_METRICS`
- **SEO:** `SEO.description`, `SEO.og`, `SEO.schema`
- **Legal:** `LEGAL` (razón social, CUIT, ANAC, matrícula)
- **Secciones:** `sections` flags según el vertical (taxi/escuela/charter/broker/aeroclub)

> Las coordenadas `x/y` de destinos son posiciones (0–100) sobre el mapa
> estilizado — ajustar a ojo, no son geográficas.

### Paso 3 · Reemplazar assets — 45 min
- **Logo:** `components/aero/ui/Logo.tsx` (o `theme.logo` si ya está parametrizado).
- **Favicon:** `app/icon.svg` (recolorear con el acento del cliente).
- **Fotos de la aeronave:** `public/aircraft/*.webp` (3–4). Completar rutas en
  `AIRCRAFT.gallery`. Quitar `images.unoptimized` de `next.config.ts` si aplica.
- La **imagen Open Graph** se regenera sola en build (usa config + acento).

### Paso 4 · Variables de entorno — 20 min
En `.env.local` (y luego en el hosting): `NEXT_PUBLIC_SITE_URL`,
`NEXT_PUBLIC_WA_NUMBER`, `NEXT_PUBLIC_CONTACT_EMAIL`, `ADMIN_PASSWORD`,
`ADMIN_SESSION_SECRET`, y Supabase + Resend (ver `DEPLOYMENT_GUIDE.md`).

### Paso 5 · Verificación local — 30 min
```bash
npm run lint && npm run build && npm run dev
```
Recorrer: home, página de la aeronave, `/admin` (login + formulario end-to-end),
`/robots.txt`, `/sitemap.xml`, OG en https://www.opengraph.xyz. Mobile + desktop.

### Paso 6 · Deploy — 20 min
Seguir `DEPLOYMENT_GUIDE.md` (Vercel recomendado): push, importar, cargar env
vars, conectar dominio, redeploy. Checklist post-deploy incluido ahí.

---

## Presupuesto de tiempo

| Paso | Tiempo |
|---|---|
| 1 · Clonar e instalar | 0:15 |
| 2 · Editar config | 1:30 |
| 3 · Assets | 0:45 |
| 4 · Env vars | 0:20 |
| 5 · Verificación | 0:30 |
| 6 · Deploy | 0:20 |
| **Total** | **3:40** ✅ |

---

## Archivos que se tocan por cliente (la lista corta)

```
lib/client.config.ts        ← 95% del trabajo (todo el contenido + tema)
.env.local                  ← secretos e infraestructura
components/aero/ui/Logo.tsx  ← logo (si no está en theme.logo)
app/icon.svg                ← favicon
public/aircraft/*           ← fotos reales
next.config.ts              ← solo si se activan imágenes optimizadas
```

**Todo lo demás (≈90% del repo) NO se toca.** Componentes, secciones, formulario,
API, panel admin, backend de leads, auth, SEO técnico, animaciones: son el motor.

---

## Checklist de lanzamiento

- [ ] `lib/client.config.ts` completo (branding, business, aircraft, commercial, SEO, legal).
- [ ] `sections` flags ajustados al vertical del cliente.
- [ ] Logo + favicon + fotos reemplazados.
- [ ] `.env.local` y env vars del hosting cargadas (Supabase incluido).
- [ ] `DEMO_MODE.active = false`.
- [ ] `npm run lint` y `npm run build` sin errores.
- [ ] Formulario → llega a `/admin` y persiste (Supabase).
- [ ] Dominio + canonical/sitemap/OG correctos.
- [ ] Verificación móvil real.

*ZENTRA Studio · [studio-zentra.com](https://studio-zentra.com/)*
