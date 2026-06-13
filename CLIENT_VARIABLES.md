# Client Variables — Catálogo de configuración

*Por ZENTRA Studio · especificación de la Capa 2 (configuración)*

Catálogo completo de **todo lo configurable** por cliente, agrupado por las
categorías del producto. Cada variable indica: **dónde vive hoy**, **dónde
debería vivir** (config consolidada) y un ejemplo.

> Leyenda de estado:
> ✅ ya en `lib/aero.ts` (config) · ⚠️ hoy hardcodeado, mover a config · 🎨 asset/tema

Destino objetivo de la config: **`lib/client.config.ts`** (hoy `lib/aero.ts`).

---

## 1. Branding (marca)

| Variable | Estado | Dónde vive | Ejemplo |
|---|---|---|---|
| Nombre de la empresa | ✅ | `SITE_NAME` | `"Aero Ejecutivo SF"` |
| Tagline | ✅ | `SITE_TAGLINE` | `"Taxi aéreo privado"` |
| Logo (marca SVG) | 🎨 | `components/aero/ui/Logo.tsx` → `theme.logo` | path SVG / componente |
| Favicon | 🎨 | `app/icon.svg` | SVG con color de marca |
| Colores (paleta) | 🎨 | tokens `--aero-*` en `globals.css` → `theme.colors` | `void`, `text`, `accent`, etc. |
| Fuentes | 🎨 | `next/font` en `app/layout.tsx` → `theme.fonts` | display: Cormorant · body: Inter |

> **Tema recomendado en config:**
> ```ts
> theme: {
>   colors: { void:"#060A10", deep:"#090E16", panel:"#0D141D",
>             text:"#EDF2F6", muted:"#97A4B0", accent:"#7FD9EC", accentDim:"#3E6B78" },
>   fonts:  { display:"Cormorant_Garamond", body:"Inter" },
>   logo:   "delta",   // id del set de logo o ruta a SVG
> }
> ```
> Los tokens CSS se inyectan desde `theme.colors` (variables en `:root` via
> `style` en `layout.tsx` o un `<style>` generado), eliminando el hardcode en CSS.

## 2. Business (negocio)

| Variable | Estado | Dónde vive | Ejemplo |
|---|---|---|---|
| WhatsApp | ✅ | `WA_NUMBER` (env `NEXT_PUBLIC_WA_NUMBER`) | `"5491155555555"` |
| Email | ✅ | `CONTACT_EMAIL` (env) | `"vuelos@..."` |
| Teléfono fijo | ⚠️ agregar | `BUSINESS.phone` | `"+54 11 ..."` (opcional) |
| Dirección | ⚠️ agregar | `BUSINESS.address` | texto / mapa |
| Aeropuerto base | ✅ | `BASE` (name, city, icao, coords) | San Fernando · SADF |
| URL del sitio | ✅ | `SITE_URL` (env) | `"https://..."` |

## 3. Aircraft (aeronave)

| Variable | Estado | Dónde vive | Ejemplo |
|---|---|---|---|
| Tipo / modelo | ✅ | `AIRCRAFT.model`, `.type` | `"Cessna 402"`, `"Bimotor a pistón"` |
| Descripción | ✅ | `AIRCRAFT.description` | texto cauto |
| Ficha (specs cualitativas) | ⚠️ | `Aircraft.tsx` + `cessna-402/page.tsx` → `AIRCRAFT.specs[]` | tipo, categoría, config, operación |
| Copy experiencia/operación/seguridad | ⚠️ | `cessna-402/page.tsx` → `AIRCRAFT.sections` | arrays de texto |
| Galería de fotos | ⚠️/🎨 | `AircraftGallery.tsx` + `public/aircraft/` → `AIRCRAFT.gallery[]` | rutas a imágenes |
| Slug de la página | ⚠️ | ruta `app/cessna-402/` → `AIRCRAFT.slug` | `"cessna-402"` |

> Para **flota** (charter/broker/aeroclub): `AIRCRAFT` pasa de objeto a `AIRCRAFT[]`.

## 4. Commercial (contenido comercial)

| Variable | Estado | Dónde vive | Ejemplo |
|---|---|---|---|
| Servicios | ✅ | `SERVICES[]` | 5 servicios con code/title/desc |
| Destinos (+ coords del mapa) | ✅ | `DESTINATIONS[]` (city, icao, region, x, y) | 7 destinos |
| "Por qué elegirnos" | ✅ | `WHY_US[]` | 5 motivos |
| FAQs | ⚠️ | `Faq.tsx` → `FAQS[]` | pregunta/respuesta |
| Pasos del proceso | ⚠️ | `Process.tsx` → `PROCESS[]` | 4 pasos concierge |
| Rutas de la calculadora de tiempo | ⚠️ | `TimeSaved.tsx` → `TIME_ROUTES[]` | km, auto, aerolínea, privado |
| Métricas de confianza | ⚠️ | `TrustMetrics.tsx` → `TRUST_METRICS[]` | base, aeronave, operación |
| CTAs (textos) | ⚠️ parcial | dispersos → `CTA` | "Cotizar vuelo", "Consultar disponibilidad" |

## 5. SEO

| Variable | Estado | Dónde vive | Ejemplo |
|---|---|---|---|
| Title | ✅ deriva | `app/layout.tsx` (usa SITE_NAME) | "Aero Ejecutivo SF — ..." |
| Description | ⚠️ literal | `app/layout.tsx` → `SEO.description` | texto |
| Keywords | ⚠️ (removido) | `SEO.keywords` (opcional) | — |
| Open Graph (imagen) | ⚠️/🎨 | `app/opengraph-image.tsx` (usa SITE_NAME, BASE) | generada |
| Open Graph (textos) | ⚠️ literal | `app/layout.tsx` → `SEO.og` | title/description |
| Schema / JSON-LD | ⚠️ parcial | `app/layout.tsx` (LocalBusiness, usa config) → `SEO.schema` | tipo + datos |
| Canonical / URL | ✅ | `SITE_URL` | — |

> Gran parte del SEO ya se **deriva** de la config (title y JSON-LD usan
> `SITE_NAME`, `BASE`, `CONTACT_EMAIL`). Falta exponer `description`, textos OG y
> el subtipo de schema como variables.

## 6. Legal

| Variable | Estado | Dónde vive | Ejemplo |
|---|---|---|---|
| Razón social | ✅ | `LEGAL.razonSocial` | "Aero Ejecutivo SF S.R.L." |
| CUIT | ✅ | `LEGAL.cuit` | "30-..." |
| Habilitación / explotador (ANAC) | ✅ | `LEGAL.anac` | nº certificado |
| Matrícula de aeronave | ✅ | `LEGAL.matricula` | "LV-XXX" |
| Aviso global (disclaimer) | ✅ deriva | `AeroFooter.tsx` (texto cauto) → `LEGAL.disclaimer` | "Servicio sujeto a disponibilidad…" |

> Los campos legales vacíos **no se muestran** (lógica ya implementada en el footer).

---

## 7. Operación / infraestructura (env vars, no marca)

No son "variables de cliente" de contenido, pero se setean por cliente en el
hosting (ver `.env.example`, `DEPLOYMENT_GUIDE.md`):
`SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`,
`RESEND_API_KEY`, `QUOTE_FROM_EMAIL`, `QUOTE_TO_EMAIL`, `N8N_WEBHOOK_URL`,
`NEXT_PUBLIC_PLAUSIBLE_DOMAIN`.

---

## 8. Flags de secciones (para verticalización)

Recomendado agregar a la config para activar/ocultar secciones según el vertical:

```ts
sections: {
  trustMetrics: true,
  services: true,
  aircraft: true,
  destinations: true,
  whyUs: true,
  timeSaved: true,    // ocultar en escuela/broker/aeroclub
  process: true,
  faq: true,
  quoteForm: true,
}
```
La home renderiza solo las secciones `true`. Cero ramas de código por cliente.

*ZENTRA Studio · [studio-zentra.com](https://studio-zentra.com/)*
