# Pendientes del cliente — dónde va cada dato cuando llegue

La estructura ya está final. Cuando el dueño pase la información, esto es todo lo que hay que tocar:

## 1. Contacto (5 minutos)
Crear `.env.local` (copiar de `.env.example`) y completar:
- `NEXT_PUBLIC_WA_NUMBER` → WhatsApp real, formato `549XXXXXXXXXX` sin `+`.
  Actualiza automáticamente TODOS los CTAs (nav, botón flotante, footer, formulario, CTA final).
- `NEXT_PUBLIC_CONTACT_EMAIL` → email real.
- `NEXT_PUBLIC_SITE_URL` → dominio final cuando esté definido.
> En producción (Vercel/Netlify) cargar estas mismas variables en el panel del hosting.

## 2. Fotos del avión (10 minutos)
- Guardar 3 fotos en `public/aircraft/` (idealmente `.webp`, ~1600px ancho): exterior, cabina, plataforma.
- Completar `src` en el array `PHOTOS` de `components/aero/AircraftGallery.tsx`.
- Quitar `images.unoptimized` de `next.config.ts` para servirlas optimizadas.

## 3. Datos legales (5 minutos)
En `lib/aero.ts`, completar `LEGAL`:
- `razonSocial`, `cuit`, `anac` (habilitación/certificado de explotador), `matricula` (LV-XXX).
- Aparecen solos en el footer al completarlos (si quedan vacíos no se muestra nada).

## 4. Confirmar con el dueño
- [ ] Nombre comercial definitivo (hoy: "Aero Ejecutivo SF" en `lib/aero.ts` → `SITE_NAME`)
- [ ] Capacidad máxima real de pasajeros para charter (hoy el formulario topea en 8 — ajustar `max` del `Stepper` en `components/aero/QuoteForm.tsx` si la configuración de cabina es otra)
- [ ] Lista de destinos habituales (hoy: 7 destinos de muestra en `lib/aero.ts` → `DESTINATIONS`)
- [ ] Revisar respuestas del FAQ (`components/aero/Faq.tsx`) — redactadas en forma cauta, validar políticas reales (clima, anticipación, mascotas)

## 5. Panel de administración (/admin)
- El operador entra a `https://TU-DOMINIO/admin` con la contraseña de `ADMIN_PASSWORD`.
- En local ya funciona: la contraseña de desarrollo está en `.env.local`.
- Para producción: definir `ADMIN_PASSWORD` y `ADMIN_SESSION_SECRET` propios en el hosting, **y** configurar Supabase (sin Supabase, en serverless los leads no persisten — el archivo local `.data/leads.json` es solo para el boceto).
- Crear proyecto gratis en [Supabase](https://supabase.com) → SQL Editor → ejecutar:

```sql
create table public.leads (
  id uuid primary key,
  created_at timestamptz not null default now(),
  dep_code text not null,
  dest_code text not null,
  flight_date date not null,
  return_date date,
  pax int not null,
  round_trip boolean not null default false,
  requirements text,
  nombre text not null,
  whatsapp text not null,
  status text not null default 'nuevo',
  notes text
);
-- El sitio accede solo con la service key (servidor); bloquear acceso anónimo:
alter table public.leads enable row level security;
```

- Copiar `SUPABASE_URL` y `SUPABASE_SERVICE_KEY` (service role, Settings → API) a las env vars del hosting.

## 6. Backend de leads (cuando haya dominio)
- Cuenta en [Resend](https://resend.com) con el dominio verificado → `RESEND_API_KEY`, `QUOTE_FROM_EMAIL`, `QUOTE_TO_EMAIL` en el hosting.
- Opcional: webhook de n8n en `N8N_WEBHOOK_URL` para registrar leads en Sheets/CRM.
- Opcional: analytics — crear el sitio en Plausible y setear `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`. Eventos ya instrumentados: `quote_submit`, `wa_click`, `email_click`.

## Notas técnicas
- El demo viejo "Jets & Props" está apartado en `_legacy/` (excluido del build). Borrarlo cuando se confirme que no hace falta.
- Mejora cosmética pendiente (opcional): renombrar el token `--aero-cyan` → `--aero-accent` (el color real es champagne, no cian). Es un search&replace global en `components/aero/` + `globals.css`.
