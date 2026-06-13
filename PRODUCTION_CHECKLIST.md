# Checklist de producción — Aero Ejecutivo SF

Pasá todos los ítems antes de publicar. Cada uno indica dónde se hace.
Cuando esté todo: `DEMO_MODE.active = false` en `lib/aero.ts` + `npm run build`.

---

## Infraestructura / datos (bloqueantes)

- [ ] **Supabase configurado** — proyecto creado, tabla `leads` creada, y
      `SUPABASE_URL` + `SUPABASE_SERVICE_KEY` cargadas en el hosting.
      Guía completa: `SUPABASE_SETUP.md`.
      ✅ Verificación: el aviso amarillo de `/admin` desaparece.

- [ ] **`ADMIN_PASSWORD` cambiada** — NO usar la de demo (`aero-admin-2026`).
      Contraseña larga y única, cargada como env var en el hosting.

- [ ] **`ADMIN_SESSION_SECRET` generado** — string aleatorio largo (≠ a la
      contraseña). Generalo con:
      ```bash
      node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
      ```
      Pegalo como env var. (Si se omite, se firma con `ADMIN_PASSWORD`, pero es
      mejor separarlos.)

- [ ] **RESEND configurado** — `RESEND_API_KEY`, `QUOTE_FROM_EMAIL` (remitente
      verificado en tu dominio) y `QUOTE_TO_EMAIL` (casilla del operador).
      ✅ Verificación: completar el formulario y recibir el email.

## Datos del cliente (de `CLIENT_DATA_REQUIRED.md`)

- [ ] **WhatsApp real** — `NEXT_PUBLIC_WA_NUMBER` (formato `549...`, sin `+`).
      Actualiza todos los CTAs del sitio.
- [ ] **Datos legales completos** — `LEGAL` en `lib/aero.ts`: razón social,
      CUIT, habilitación ANAC, matrícula. Aparecen en el footer al cargarse.
- [ ] **Fotos reales del avión** — en `public/aircraft/`, con `src` cargados en
      `components/aero/AircraftGallery.tsx`. Quitar `images.unoptimized` de
      `next.config.ts` si corresponde.
- [ ] **Email de contacto real** — `NEXT_PUBLIC_CONTACT_EMAIL`.
- [ ] **Nombre comercial / logo definitivos** — `SITE_NAME` + `Logo.tsx`/`icon.svg`.
- [ ] (Recomendado) Validar **tiempos de ruta** (`TimeSaved.tsx`) y **capacidad
      de pasajeros** (`QuoteForm.tsx` Stepper `max`) con el operador.

## Dominio y deploy

- [ ] **Dominio configurado** — `NEXT_PUBLIC_SITE_URL` con el dominio final
      (sin barra final). Apunta el DNS al hosting y verificá el dominio en
      Vercel/Netlify.
      ✅ Impacta: canonical, sitemap, robots, Open Graph, JSON-LD.
- [ ] (Opcional) **Plausible Analytics** — `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` para
      medir conversiones (`quote_submit`, `wa_click`, `email_click`).

## Verificación final (post-deploy)

- [ ] `npm run build` sin errores.
- [ ] Formulario → llega email + aparece en `/admin` + persiste tras recargar.
- [ ] `/admin` con la contraseña nueva; sin aviso de almacenamiento local.
- [ ] `/robots.txt` y `/sitemap.xml` con el dominio correcto.
- [ ] Open Graph: pegar la URL en https://www.opengraph.xyz para previsualizar.
- [ ] `/admin` NO indexado (ya tiene `noindex`); confirmar en el HTML.
- [ ] Probar en móvil real (CTAs WhatsApp abren la app).

---

### Variables de entorno — resumen para el hosting

| Variable | Obligatoria | Notas |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | sí | dominio final |
| `NEXT_PUBLIC_WA_NUMBER` | sí | WhatsApp real |
| `NEXT_PUBLIC_CONTACT_EMAIL` | sí | email visible |
| `SUPABASE_URL` | sí | persistencia de leads |
| `SUPABASE_SERVICE_KEY` | sí | service_role (privada) |
| `ADMIN_PASSWORD` | sí | acceso al panel |
| `ADMIN_SESSION_SECRET` | recomendada | firma de sesión |
| `RESEND_API_KEY` | recomendada | email de leads |
| `QUOTE_FROM_EMAIL` | con Resend | remitente verificado |
| `QUOTE_TO_EMAIL` | con Resend | casilla del operador |
| `N8N_WEBHOOK_URL` | opcional | integración CRM/Sheets |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | opcional | analytics |
