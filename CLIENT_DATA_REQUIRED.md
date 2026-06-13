# Datos a recibir del cliente — Aero Ejecutivo SF

> El sitio está en **DEMO_MODE** (ver `lib/aero.ts`). Todo lo de abajo es
> placeholder o está pendiente. Cuando llegue cada dato, se carga en el lugar
> indicado y se desactiva el modo demo (`DEMO_MODE.active = false`).
>
> Marcá cada ítem a medida que llega.

## 1. Marca e identidad
- [ ] **Nombre comercial definitivo** — hoy "Aero Ejecutivo SF" → `lib/aero.ts` `SITE_NAME`
- [ ] **Logo** (SVG o PNG fondo transparente, alta resolución) → reemplaza el delta en `components/aero/ui/Logo.tsx` + `app/icon.svg`
- [ ] **Tono / estilo de marca** — cómo le gusta comunicar (sobrio, cercano, técnico, lujo) para ajustar textos
- [ ] **Colores de marca** (si tiene) — hoy paleta navy + cian de muestra

## 2. Contacto (config por variables de entorno — `.env.local`)
- [ ] **WhatsApp real** — formato internacional sin "+", ej. `5491155555555` → `NEXT_PUBLIC_WA_NUMBER`
- [ ] **Email de contacto** → `NEXT_PUBLIC_CONTACT_EMAIL`
- [ ] **Dominio final** → `NEXT_PUBLIC_SITE_URL`

## 3. Datos legales / de operador (footer — `lib/aero.ts` `LEGAL`)
> Mientras estén vacíos no se muestran. Para taxi aéreo son señal de confianza
> y suelen ser exigibles.
- [ ] **Razón social** (nombre legal de la empresa) → `LEGAL.razonSocial`
- [ ] **CUIT** → `LEGAL.cuit`
- [ ] **Habilitación / autorización ANAC** (Nº de certificado de explotador, CETA/TAA) → `LEGAL.anac`
- [ ] **Matrícula de la aeronave** (ej. LV-XXX) → `LEGAL.matricula`

## 4. Aeronave (Cessna 402)
- [ ] **Capacidad de pasajeros a confirmar** — la calculadora topea en 8; confirmar la config real de cabina del avión → `components/aero/QuoteForm.tsx` (`Stepper max`) y textos
- [ ] **Fotos reales del Cessna 402** — idealmente 3+ en `.webp` (~1600px ancho): exterior, cabina, plataforma en SADF → `public/aircraft/` + completar `src` en `components/aero/AircraftGallery.tsx`
- [ ] Specs que el dueño quiera mostrar (opcional; hoy todo es cualitativo, sin cifras inventadas)

## 5. Operación y rutas
- [ ] **Destinos preferidos / habituales** — hoy hay 7 de muestra → `lib/aero.ts` `DESTINATIONS`
- [ ] **Tiempos de ruta validados** — los de la calculadora son estimados a crucero típico; validar con el operador → `components/aero/TimeSaved.tsx` (`ROUTES`)
- [ ] Políticas reales (anticipación, clima, equipaje, mascotas) para ajustar el FAQ → `components/aero/Faq.tsx`

## 6. Producción (cuando haya dominio)
- [ ] Cuenta de hosting (Vercel o Netlify) y carga de variables de entorno
- [ ] **Supabase** (obligatorio en producción para que los leads persistan) — `SUPABASE_URL` + `SUPABASE_SERVICE_KEY` (SQL de la tabla en `PENDIENTES-CLIENTE.md`)
- [ ] **Resend** para email de leads — `RESEND_API_KEY`, `QUOTE_FROM_EMAIL`, `QUOTE_TO_EMAIL`
- [ ] `ADMIN_PASSWORD` y `ADMIN_SESSION_SECRET` propios (cambiar el de demo)
- [ ] (Opcional) Plausible Analytics — `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`

---

**Al completar todo:** poner `DEMO_MODE.active = false` en `lib/aero.ts` y correr `npm run build`.
