# Aviation Platform — Arquitectura de producto reutilizable

*Por ZENTRA Studio · documento de arquitectura interno*

Convierte el sitio de Aero Ejecutivo SF en un **producto repetible** para el
sector aviación: escuelas de vuelo, taxis aéreos, charter, brokers de aeronaves
y aeroclubes. Objetivo: **80–90% de reutilización de código** y lanzar un cliente
nuevo en **menos de 4 horas**.

---

## 1. Principio de arquitectura

El sitio se separa en **tres capas**:

```
┌─────────────────────────────────────────────────────────┐
│  CAPA 1 · MOTOR (universal, no se toca entre clientes)    │
│  Componentes, layout, formulario, API, panel admin,       │
│  almacén de leads, auth, SEO técnico, animaciones.        │
│  → 80–90% del código. Reutilizable tal cual.              │
├─────────────────────────────────────────────────────────┤
│  CAPA 2 · CONFIGURACIÓN (1 archivo por cliente)           │
│  Marca, negocio, aeronave, contenido comercial, SEO,      │
│  legal, tema visual. Todo data, cero lógica.              │
│  → lib/client.config.ts (hoy: lib/aero.ts)                │
├─────────────────────────────────────────────────────────┤
│  CAPA 3 · ASSETS (archivos del cliente)                   │
│  Logo, favicon, fotos de la aeronave, fuentes.            │
│  → public/ + app/icon.svg + tokens de tema                │
└─────────────────────────────────────────────────────────┘
```

**Regla de oro:** un componente nunca contiene texto, color, número de teléfono
ni dato de cliente. Todo eso vive en la Capa 2. Si un componente necesita un
dato, lo importa de la config.

---

## 2. Estado actual (auditoría)

El proyecto ya está **~70% en este modelo**. `lib/aero.ts` es el hub de config y
se importa en 21 lugares. Lo que falta es mover el contenido todavía
hardcodeado en componentes a la config, y parametrizar tema/fuentes/logo.

| Capa | Estado | Detalle |
|---|---|---|
| Motor (componentes, API, admin, leads) | ✅ Universal | No requiere cambios por cliente |
| Config de marca/negocio/legal/aeronave/servicios/destinos | ✅ Centralizado | En `lib/aero.ts` |
| **Contenido: FAQs, pasos del proceso, rutas de la calculadora, specs y copy de aeronave, métricas de confianza** | ⚠️ Hardcodeado | En `Faq.tsx`, `Process.tsx`, `TimeSaved.tsx`, `Aircraft.tsx`, `cessna-402/page.tsx`, `TrustMetrics.tsx` |
| **Tema (colores)** | ⚠️ En CSS | Tokens `--aero-*` en `globals.css` |
| **Fuentes** | ⚠️ En layout | `next/font` en `app/layout.tsx` |
| **Logo / favicon / OG** | ⚠️ En código/assets | `Logo.tsx`, `app/icon.svg`, `opengraph-image.tsx` |

> **Refactor recomendado (one-time, ~1 día):** renombrar `lib/aero.ts` →
> `lib/client.config.ts` y mover los arrays de contenido hardcodeado a esa config.
> A partir de ahí, cada cliente nuevo = editar 1 archivo + reemplazar assets.
> Detalle del catálogo en `CLIENT_VARIABLES.md`; pasos en `REBRANDING_GUIDE.md`.

---

## 3. Modelo de verticalización (5 segmentos)

El mismo motor sirve a los 5 con **cambios solo de configuración**. Lo que varía
es el énfasis del contenido, no el código:

| Segmento | Hero / foco | Calculadora | "Aeronave" | CTA principal | Secciones que se activan/ocultan |
|---|---|---|---|---|---|
| **Taxi aéreo** (base actual) | Vuelos privados a demanda | Tiempo ahorrado por ruta | Página de la aeronave | Cotizar vuelo | Todas |
| **Escuela de vuelo** | Formación de pilotos | — (se oculta) | Flota de instrucción | Inscribite / Vuelo de bautismo | Cursos en lugar de Servicios; Instructores |
| **Charter** | Chárter ejecutivo y grupal | Tiempo ahorrado | Flota (múltiples aeronaves) | Solicitar presupuesto | Flota en vez de una aeronave |
| **Broker de aeronaves** | Compra/venta de aeronaves | — | Catálogo de aeronaves | Consultar disponibilidad | Listado/fichas en vez de servicios |
| **Aeroclub** | Membresía y comunidad | — | Flota del club | Asociate | Membresías, eventos |

**Implicancia de arquitectura:** las secciones deben poder **activarse/ocultarse
por config** (un flag `sections.timeSaved: true/false`). El motor renderiza solo
las secciones habilitadas. Esto permite cubrir los 5 verticales sin ramas de
código.

> Para soportar "flota" (charter/broker/aeroclub) la config de `AIRCRAFT`
> (objeto único) evoluciona a `AIRCRAFT[]` (array). La página de aeronave ya
> existe; se generaliza a listado. Es la única extensión estructural real.

---

## 4. Qué NO se toca nunca (el motor)

Estos archivos son producto, no cliente. Se mejoran una vez y todos los clientes
heredan:

- **Componentes de UI base:** `components/aero/ui/*` (botones, headings, reveal, motion)
- **Secciones (estructura):** reciben su contenido por props/config
- **Formulario + validación:** `QuoteForm.tsx`, `lib/quote-schema.ts`
- **Backend de leads:** `lib/leads-store.ts` (adaptador dual file/Supabase)
- **Panel admin + auth:** `components/admin/*`, `lib/admin-auth.ts`, `app/api/admin/*`
- **API pública:** `app/api/quote/route.ts`
- **SEO técnico:** `robots.ts`, `sitemap.ts`, `manifest.ts` (leen de config)
- **Runtime de landing:** `LandingRuntime.tsx`, `track.ts`

---

## 5. Roadmap de plataforma

1. **v1 — Config consolidada** (refactor inicial): mover todo el contenido a
   `lib/client.config.ts`. Resultado: cliente nuevo en <4h editando 1 archivo.
2. **v2 — Secciones por flags:** activar/ocultar secciones desde config para
   cubrir los 5 verticales sin tocar código.
3. **v3 — Multi-aeronave (flota):** `AIRCRAFT[]` + listado, para charter/broker.
4. **v4 — Theming por preset:** paquetes de tema (navy/cian actual, y variantes)
   seleccionables por config; generador de favicon/OG desde el logo.
5. **v5 — Templating del repo:** convertir en template de GitHub o CLI
   (`create-aviation-site`) que pida los datos y genere el `client.config.ts`.

---

## 6. Métrica de éxito
- **Reutilización:** ≥80% de archivos sin cambios entre cliente y cliente.
- **Tiempo de lanzamiento:** <4h con datos y assets del cliente en mano.
- **Superficie de error:** un solo archivo de config editable + carpeta de assets.

*ZENTRA Studio · [studio-zentra.com](https://studio-zentra.com/)*
