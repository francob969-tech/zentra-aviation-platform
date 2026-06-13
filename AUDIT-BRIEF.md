# Auditoría + Brief de implementación — Aero Ejecutivo SF

> ✅ **IMPLEMENTADO** (2026-06-12): todo lo de este brief ya está aplicado al código,
> salvo el rename cosmético `--aero-cyan` → `--aero-accent` (P2.1, opcional).
> Lo que falta del cliente está en **PENDIENTES-CLIENTE.md**.

> **Cómo usar este archivo:** abrí esta carpeta en VS Code, iniciá Claude Code y decile:
> *"Leé AUDIT-BRIEF.md e implementá todas las tareas en orden de prioridad (P0 → P1 → P2). Verificá con `npm run build` al final."*

Proyecto: landing one-page Next.js 16 (App Router) + Tailwind 4 + Framer Motion para taxi aéreo con Cessna 402, base SADF (San Fernando). Hoy es **100% frontend**: el formulario `#cotizar` arma un mensaje y lo abre en WhatsApp/email del visitante. No hay API routes, no se guardan leads.

---

## P0 — Bloqueantes para publicar

### P0.1 — Datos placeholder en `lib/aero.ts`
- `WA_NUMBER = "5491100000000"` (línea 19) y `CONTACT_EMAIL` son falsos. **Todos** los CTAs del sitio (nav, float, footer, formulario, FinalCTA) apuntan a ese número.
- `SITE_URL` / `metadataBase` apuntan a `aeroejecutivosf.com` sin confirmar que sea el dominio real.
- **Tarea:** mover estos valores a variables de entorno públicas (`NEXT_PUBLIC_WA_NUMBER`, `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_SITE_URL`) con fallback a los actuales, y crear `.env.example` documentándolas. Así el cliente se configura sin tocar código.

### P0.2 — Página `/brokerage` de otro demo sigue deployada
- `app/brokerage/page.tsx` es el demo "Jets & Props" (otra marca, otro rubro). Si se publica, queda indexable y confunde.
- **Tarea:** eliminar `app/brokerage/` y los componentes que solo usa esa página (`components/sections/*`, `components/AircraftCard.tsx`, `components/Nav.tsx`, `components/Footer.tsx`, `components/WhatsAppFloat.tsx` raíz, `components/ui/GoldButton.tsx`, `components/ui/SectionHeading.tsx` raíz, `data/aircraft.ts`, `lib/whatsapp.ts`). Verificar con `npm run build` que nada de la landing aero los importe. Limpiar también de `globals.css` los tokens muertos del tema viejo (`--gold`, `--bg-deep`, `.text-gold-gradient`, `.field-input`, `.glass`, `.hairline`, líneas 4–97).

### P0.3 — Pantalla negra al entrar directo a `/#cotizar` (verificado en navegador)
- Al abrir un deep-link con hash, `html { scroll-behavior: smooth }` hace un scroll suave de ~8 pantallas: el visitante ve **segundos de pantalla negra** porque los `Reveal` (whileInView, `once: true`) de las secciones intermedias no llegan a mostrarse. Este link se va a compartir por WhatsApp ("cotizá acá") — es el peor lugar para esta falla.
- **Tarea:** crear `components/aero/ui/HashJump.tsx` (client) que en el primer mount, si hay `location.hash`, haga `scrollIntoView({ behavior: "instant" })` al target, y montarlo en `app/page.tsx`. El smooth scroll queda solo para clicks internos. Además agregar en `globals.css`:
  ```css
  @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
  ```

### P0.4 — El formulario se puede "enviar" vacío
- `QuoteForm.tsx`: el form tiene `noValidate` y ningún campo es requerido. Hoy se abre WhatsApp con "Destino: — / Fecha: — / Nombre: —".
- **Tarea:** validación en cliente antes de abrir WhatsApp/email:
  - Requeridos: destino, fecha de salida, nombre, WhatsApp del cliente.
  - `min` de fecha de salida = hoy; si es ida y vuelta, `returnDate >= date` (y requerida).
  - WhatsApp del cliente: `inputMode="tel"`, aceptar `+`, dígitos y espacios, mínimo 8 dígitos.
  - Mostrar errores inline (texto 12px bajo el campo, color `#D08A8A` o similar AA sobre fondo oscuro) y `aria-invalid` + `aria-describedby` en el campo. Foco al primer campo con error.

### P0.5 — Sin favicon, sin OG image, sin íconos
- `public/` está **vacío** y no hay `app/icon.*`. La card de Twitter declara `summary_large_image` sin imagen → no valida.
- **Tarea:**
  - `app/icon.svg`: el delta del `BrandMark` (`components/aero/ui/Logo.tsx`, path `M16 4 L28 28 L16 22 L4 28 Z`) en `#C4B79F` sobre fondo `#0B0C0E`, con colores hardcodeados (en favicon no hay CSS vars).
  - `app/opengraph-image.tsx` con `ImageResponse` (1200×630): fondo `#0B0C0E`, delta, "AERO EJECUTIVO SF", "Taxi aéreo privado · San Fernando (SADF)" en marfil `#ECE8E1` y acento `#C4B79F`. Y `app/twitter-image.tsx` reexportando lo mismo.
  - `app/manifest.ts` básico (name, theme_color `#0B0C0E`).

---

## P1 — Antes de la campaña

### P1.1 — BACKEND: captura de leads (lo más importante de esta lista)
Hoy, si el visitante no concreta el envío en WhatsApp (popup bloqueado, se arrepiente, no tiene WA Web), **el lead se pierde sin rastro**. Patrón a implementar: **doble disparo** — el submit guarda el lead en el backend *y además* abre WhatsApp como hasta ahora.

**Dependencias:** `npm i zod resend`

**`lib/quote-schema.ts`** — schema compartido cliente/servidor:
```ts
import { z } from "zod";

export const quoteSchema = z.object({
  depCode: z.string().min(1),
  destCode: z.string().min(1, "Elegí un destino"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida"),
  returnDate: z.string().optional().default(""),
  pax: z.number().int().min(1).max(8),
  roundTrip: z.boolean(),
  requirements: z.string().max(1000).optional().default(""),
  nombre: z.string().min(2, "Ingresá tu nombre").max(120),
  whatsapp: z.string().regex(/^[+\d][\d\s-]{7,20}$/, "Número inválido"),
  // honeypot: los bots lo completan, los humanos no lo ven
  website: z.string().max(0).optional().default(""),
}).refine(
  (d) => !d.roundTrip || (d.returnDate && d.returnDate >= d.date),
  { message: "La fecha de regreso debe ser posterior a la de salida", path: ["returnDate"] }
);
export type QuoteInput = z.infer<typeof quoteSchema>;
```

**`app/api/quote/route.ts`**:
```ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { quoteSchema } from "@/lib/quote-schema";

// Rate limit simple en memoria (suficiente para una landing de bajo tráfico;
// si escala, migrar a Upstash Ratelimit)
const hits = new Map<string, { n: number; t: number }>();
function limited(ip: string): boolean {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.t > 60_000) { hits.set(ip, { n: 1, t: now }); return false; }
  h.n++;
  return h.n > 5;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  const q = parsed.data;
  if (q.website) return NextResponse.json({ ok: true }); // honeypot: 200 silencioso

  const lines = [
    `Origen: ${q.depCode}`,
    `Destino: ${q.destCode}`,
    `Salida: ${q.date}`,
    q.roundTrip ? `Regreso: ${q.returnDate}` : `Solo ida`,
    `Pasajeros: ${q.pax}`,
    `Requerimientos: ${q.requirements || "—"}`,
    ``,
    `Nombre: ${q.nombre}`,
    `WhatsApp: ${q.whatsapp}`,
  ].join("\n");

  // 1) Email al operador (Resend)
  if (process.env.RESEND_API_KEY && process.env.QUOTE_TO_EMAIL) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.QUOTE_FROM_EMAIL ?? "onboarding@resend.dev",
      to: process.env.QUOTE_TO_EMAIL,
      subject: `✈ Solicitud de vuelo — ${q.nombre} → ${q.destCode} (${q.date})`,
      text: lines,
    }).catch(console.error); // el lead no se pierde si falla el email: queda el webhook
  }

  // 2) Webhook opcional a n8n (notificación WhatsApp al operador, Sheets, CRM…)
  if (process.env.N8N_WEBHOOK_URL) {
    fetch(process.env.N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "landing", ...q }),
    }).catch(console.error);
  }

  return NextResponse.json({ ok: true });
}
```

**`.env.example`**:
```
NEXT_PUBLIC_SITE_URL=https://aeroejecutivosf.com
NEXT_PUBLIC_WA_NUMBER=5491100000000
NEXT_PUBLIC_CONTACT_EMAIL=vuelos@aeroejecutivosf.com
RESEND_API_KEY=
QUOTE_FROM_EMAIL=cotizaciones@TU-DOMINIO.com
QUOTE_TO_EMAIL=
N8N_WEBHOOK_URL=
```

**Cambios en `QuoteForm.tsx`:**
- En `handleSubmit`: validar con `quoteSchema` (reusar el mismo schema) → si pasa, `fetch("/api/quote", …)` **sin esperar el resultado para abrir WhatsApp** (fire-and-forget con `keepalive: true`) y abrir `wa.me` en el mismo gesto del usuario (evita popup blockers: no meter el `window.open` dentro de un `await`).
- Agregar input honeypot oculto: `<input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px]" …>`.
- Estados: `idle / sending / sent / error`. Si la API falla, el flujo WhatsApp sigue funcionando igual (no bloquear).
- Actualizar el texto legal "No se almacena información en este sitio" → ya no es cierto: cambiar por "Usamos tus datos solo para responder tu solicitud." (y este texto debe quedar consistente con la realidad del backend).
- Nota: el flujo email (`mailto:`) puede quedar como botón secundario igual que hoy.

### P1.2 — SEO técnico
- **`app/robots.ts`**: allow all + `sitemap: ${SITE_URL}/sitemap.xml`.
- **`app/sitemap.ts`**: solo la home.
- **JSON-LD** en `app/layout.tsx` o `page.tsx`: `LocalBusiness` (subtipo razonable; no existe "AirTaxi" en schema.org, usar `LocalBusiness` con `additionalType` aviación) con name, url, email, telephone (cuando exista el real), address (San Fernando, Buenos Aires), `areaServed`, `makesOffer` (vuelos privados a demanda). Inyectar con `<script type="application/ld+json">`.
- `metadata.alternates.canonical = "/"`.
- Quitar `keywords` (obsoleto, ignorado por Google) — opcional.
- `openGraph.images` y `twitter.images` quedan resueltos por P0.5.

### P1.3 — Analytics + tracking de conversión
- Instalar **Plausible** (`next/script`, dominio configurable por env) o GA4 — elegir uno.
- Trackear eventos: `quote_submit` (submit del form), `wa_click` (float + nav + footer + FinalCTA), `email_click`. Sin esto la campaña "first $1,000" no se puede medir.

### P1.4 — Ícono del float es un teléfono, no WhatsApp
- `components/aero/WhatsAppFloat.tsx:24-26`: el SVG es un auricular de teléfono, pero el `aria-label` y el destino son WhatsApp. Confunde y baja CTR.
- **Tarea:** reemplazar por el glyph oficial de WhatsApp (path SVG mono-color, mismo estilo stroke/fill `var(--aero-cyan)`).

### P1.5 — Confianza y contenido real (para conversión)
- No hay **ninguna foto real**: el avión es un schematic SVG. Para vender vuelos en un avión real, una galería corta (3–4 fotos: exterior, cabina, plataforma SADF) es el mayor salto de conversión disponible. Dejar preparado un componente `Gallery` en la sección Aeronave que lea de `public/aircraft/*.webp` (con `next/image`; quitar `images.unoptimized` de `next.config.ts` si no es export estático).
- Agregar al footer los datos de habilitación cuando existan: razón social, **CUIT, habilitación ANAC / N° de certificado de explotador, matrícula de la aeronave, seguro**. Para taxi aéreo esto es señal de confianza *y* va a ser requerido. Dejar placeholders comentados en `AeroFooter.tsx` + constantes en `lib/aero.ts` (`LEGAL = { cuit: "", anac: "", matricula: "" }`).
- Sección FAQ corta (4–6 preguntas: ¿cuánto cuesta?, ¿con cuánta anticipación?, ¿qué incluye?, equipaje, mascotas, clima) — formato `<details>` estilizado, sin JS. Sumar JSON-LD `FAQPage`.

### P1.6 — `app/not-found.tsx`
- 404 personalizada mínima con el branding aero y link a la home. Hoy cae al default de Next.

---

## P2 — Mejoras

1. **Naming del token `--aero-cyan`**: es champagne (`#C4B79F`), no cian. Renombrar a `--aero-accent` (y `aero-text-cyan` → `aero-text-accent`, `CyanButton` → `AccentButton`) para que el código no mienta. Hacerlo con search&replace global.
2. **Stepper de pasajeros**: el `<Label htmlFor="pax-dec">` apunta al botón "−". Mejor: `role="group"` + `aria-label="Pasajeros"` en el contenedor y un `<span id>` referenciado con `aria-labelledby`. Tipo de viaje: envolver los dos `TripButton` en `role="radiogroup"` con `aria-label="Tipo de viaje"`.
3. **Validar capacidad**: máx. 8 pasajeros está bien como tope de UI, pero confirmar con el operador la configuración real de cabina del 402 (suele ser 5–7 en charter) y ajustar `max` + texto.
4. **Security headers** en `next.config.ts`: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`.
5. **Performance**: la página entera es client-side por Framer Motion. Está bien para esta escala (sin imágenes pesa poco), pero si se agregan fotos: `next/image` + `loading="lazy"`. No hace falta tocar nada más ahora.
6. **`netlify.toml` vs Vercel**: hay config de Netlify. Decidir plataforma; si va a Vercel, borrar `netlify.toml` y `@netlify/plugin-nextjs`.
7. Mensajes WhatsApp pre-cargados: incluir la URL de origen (`utm_source=web`) en el texto para distinguir leads de la web vs orgánicos.

---

## Qué está BIEN (no tocar)

- Accesibilidad por encima del promedio: labels reales, `aria-expanded`/`aria-controls` en el burger, focus trap parcial + Escape en menú móvil, `focus-visible` on-brand, `aria-live` en el stepper, `prefers-reduced-motion` respetado vía `MotionConfig` + CSS.
- `scrollMarginTop` en todas las secciones ancladas (el header fijo no tapa).
- Datos de aviación reales (ICAO correctos: SADF, SAAR, SACO, SAME, SAZM, SULS, SAZN, SAZS) y redacción cauta sin inventar specs del avión.
- Fechas formateadas sin `Date()` en render (sin hydration mismatch).
- Sistema visual consistente (champagne/marfil/tinta) con tokens CSS.

## Verificación final (hacer al terminar)

1. `npm run build` sin errores ni warnings de ESLint.
2. Abrir `http://localhost:3000/#cotizar` en pestaña nueva → el formulario debe verse **inmediatamente** (sin pantalla negra).
3. Submit con campos vacíos → errores inline, no abre WhatsApp.
4. Submit válido → `POST /api/quote` responde 200 (ver Network) **y** se abre `wa.me` con el texto correcto.
5. `curl -X POST localhost:3000/api/quote -d '{}'` → 400. Repetir 6 veces rápido → 429.
6. Lighthouse: Performance ≥ 90, SEO = 100, Accessibility ≥ 95.
7. `/brokerage` → 404.
