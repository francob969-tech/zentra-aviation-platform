# Live Deployment Audit — Aero Ejecutivo SF

*Auditoría de producción · ZENTRA Studio*
**URL auditada:** https://zentra-aviation-platform.vercel.app/
**Estado:** ✅ En línea, sano y públicamente accesible.

Auditoría hecha contra el deploy real (requests HTTP + verificación visual),
no sobre el código local.

---

## Resultado de verificación (en vivo)

| Ítem | Resultado | Detalle |
|---|---|---|
| **Homepage** `/` | ✅ 200 | Render completo: hero, fonts (serif+sans), animaciones, grilla radar, globo de rutas |
| **Página aeronave** `/cessna-402` | ✅ 200 | Carga correcta, contenido + galería placeholder |
| **Panel admin** `/admin` | ✅ 200 | Login funciona; `noindex, nofollow` confirmado |
| **Navegación** | ✅ | Links del nav (incl. Aeronave), CTAs, footer |
| **Responsive** | ✅ | Viewport correcto; layout fluido (clamp + grids responsivos) |
| **SEO** | ✅ | title, description, canonical → dominio correcto; JSON-LD presente |
| **Open Graph** | ✅ 200 | `image/png` 1200×630, URL absoluta correcta; Twitter card completa |
| **Sitemap** `/sitemap.xml` | ✅ 200 | `/` y `/cessna-402` con el dominio del deploy |
| **Robots** `/robots.txt` | ✅ 200 | `Disallow: /admin`, `/api/`; apunta al sitemap |
| **Formulario** `/api/quote` | ✅ | POST inválido → 400, válido → 200 (responde OK) |
| **WhatsApp** | ✅ | 8 enlaces, todos al número configurado |
| **Auth API** `/api/admin/leads` | ✅ 401 | Rechaza sin sesión |
| **404** | ✅ 404 | Página de error propia |
| **Performance** | ✅ | Respuestas 0.2–0.8 s; páginas estáticas en CDN |

---

## Qué está funcionando (producción real)

- **Toda la experiencia visual y de UX**: diseño premium, animaciones, mapa de
  rutas, calculadora de tiempo, proceso, FAQ — sirviéndose rápido desde el CDN.
- **SEO técnico completo y correcto**: metadata, canonical, Open Graph (imagen
  generada en build), Twitter card, JSON-LD `LocalBusiness`, sitemap, robots.
- **Seguridad**: `/admin` con `noindex`, API admin protegida (401 sin sesión),
  headers de seguridad, rutas `/api/` bloqueadas a crawlers.
- **Formulario y WhatsApp**: validación server-side activa; los CTAs abren
  WhatsApp con el mensaje pre-armado.
- **Login de admin**: operativo con la contraseña configurada.

## Qué es solo-demo (placeholders activos)

- **Número de WhatsApp**: `5491100000000` (ficticio) — los 8 CTAs abren un chat
  que no llega a nadie real.
- **Email de contacto y contraseña de admin**: valores demo.
- **Fotos de la aeronave**: marcos "Foto pendiente" (no hay imágenes reales).
- **Datos legales** (CUIT, ANAC, matrícula): vacíos → no se muestran en el footer.
- **Dominio**: `*.vercel.app` (no es un dominio propio todavía).

## Qué NO persiste sin Supabase ⚠️

- **Los leads NO se guardan.** El filesystem de Vercel es de solo lectura, así
  que el almacén local (`.data/leads.json`) no puede escribir. La API responde
  `{ok:true}` pero el lead no queda registrado.
- **El panel `/admin` muestra la lista vacía** + el aviso amarillo
  "Almacenamiento local (JSON) activo. Los leads no van a persistir en
  producción." → comportamiento **correcto y esperado** en demo.
- **Sin email** (falta Resend) ni **webhook** (falta n8n).

> En demo, el único canal de lead que "llega" es el WhatsApp que el visitante
> envía manualmente. Para captar y guardar leads de verdad: conectar Supabase.

## Qué está production-ready a nivel código (solo falta config/datos)

Estos sistemas están construidos y probados; se activan con variables de entorno
o datos del cliente, sin tocar código:
- Captación de leads de doble registro (WhatsApp + backend persistente).
- Panel CRM con estados, notas, auto-refresh y respuesta por WhatsApp.
- Almacén Supabase (PostgreSQL) — listo, falta `SUPABASE_URL` + `SERVICE_KEY`.
- Email por Resend y webhook a n8n — listos, falta la key/URL.
- Analytics (Plausible) — listo, falta el dominio.

## Qué requiere datos del cliente

(De `CLIENT_DATA_REQUIRED.md`)
1. WhatsApp y email reales del operador.
2. 3–4 fotos reales del Cessna 402.
3. Datos legales: razón social, CUIT, habilitación ANAC, matrícula.
4. Dominio final.
5. Tiempos de ruta validados + capacidad de pasajeros.
6. Nombre comercial / logo definitivos.

---

## Veredicto

El deploy es un **demo de producción sólido y vendible**: técnicamente sano,
rápido, seguro y con SEO completo. Lo que falta no es ingeniería — es
**activación comercial**: datos reales del operador + Supabase para que la
captación de leads funcione de punta a punta. El producto está listo; ahora el
trabajo es de negocio, no de código.

*ZENTRA Studio · [studio-zentra.com](https://studio-zentra.com/)*
