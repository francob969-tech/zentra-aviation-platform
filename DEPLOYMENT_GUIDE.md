# Deployment Guide — Aero Ejecutivo SF

Guía de despliegue para demo pública y producción. Auditada por DevOps.
Stack: Next.js 16 (App Router) · runtime Node.js · funciones serverless.

> Documentos relacionados: `SUPABASE_SETUP.md` (base de datos), `PRODUCTION_CHECKLIST.md`
> (checklist de datos del cliente), `.env.example` (plantilla de variables).

---

## Arquitectura de runtime (qué se despliega)

| Ruta | Tipo | En el hosting |
|---|---|---|
| `/`, `/cessna-402` | Estática (○) | HTML pre-renderizado en CDN |
| `/opengraph-image`, `/icon.svg`, `/manifest.webmanifest`, `/robots.txt`, `/sitemap.xml` | Estática (○) | Generadas en build, servidas desde CDN |
| `/admin` | Dinámica (ƒ) | Función serverless (lee cookie de sesión) |
| `/api/quote`, `/api/admin/*` | Dinámica (ƒ) | Funciones serverless (runtime Node.js) |

**Importante:** las rutas dinámicas usan **runtime Node.js** (no Edge), porque
dependen de `crypto` (firma de sesión) y del cliente de almacenamiento. No
cambiar a `runtime = "edge"`. La imagen Open Graph se genera en **build time**
(es estática), así que no requiere runtime especial.

---

## Opción A — Vercel (recomendada)

Plataforma de primera parte para Next.js: cero configuración para App Router,
funciones Node.js nativas y soporte directo de `next/og`.

1. **Subí el código a un repo** (GitHub/GitLab/Bitbucket).
   ✅ El `.gitignore` ya protege `.env.local`, `.data/` y `node_modules`.
2. En https://vercel.com → **Add New → Project** → importá el repo.
3. Vercel detecta Next.js automáticamente. **No toques** Build Command ni Output
   Directory (autodetectados: `next build` / `.next`).
4. **Environment Variables** → cargá las de la tabla de abajo (scope: Production;
   agregá Preview si vas a probar en branches).
5. **Deploy.** Primer build ~2–4 min.
6. **Dominio:** Project → Settings → Domains → agregá el dominio final y seguí
   las instrucciones de DNS. Actualizá `NEXT_PUBLIC_SITE_URL` con ese dominio y
   **redeploy** (impacta canonical, sitemap, OG).

> Node: Vercel usa Node 20+ por defecto para Next 16. No requiere config extra.

## Opción B — Netlify

El proyecto ya incluye `netlify.toml` con `@netlify/plugin-nextjs` v5 y Node 20.

1. Subí el código a un repo (mismo `.gitignore`).
2. En https://app.netlify.com → **Add new site → Import an existing project**.
3. Build command y publish los toma de `netlify.toml` (`npm run build`, plugin
   Next). No cambiar.
4. **Site configuration → Environment variables** → cargá las variables (scope
   Production).
5. **Deploy site.**
6. **Dominio:** Domain management → add custom domain → DNS. Actualizá
   `NEXT_PUBLIC_SITE_URL` y volvé a deployar.

---

## Variables de entorno requeridas

Cargar en el panel del hosting (NUNCA en el repo). Plantilla en `.env.example`.

| Variable | Obligatoria | Tipo | Notas |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | **sí** | pública | dominio final, sin barra final |
| `NEXT_PUBLIC_WA_NUMBER` | **sí** | pública | WhatsApp real, formato `549…` sin `+` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | **sí** | pública | email visible en el sitio |
| `SUPABASE_URL` | **sí (prod)** | privada | persistencia de leads — ver `SUPABASE_SETUP.md` |
| `SUPABASE_SERVICE_KEY` | **sí (prod)** | privada | service_role; **nunca** `NEXT_PUBLIC_*` |
| `ADMIN_PASSWORD` | **sí** | privada | acceso al panel; cambiar la de demo |
| `ADMIN_SESSION_SECRET` | recomendada | privada | string aleatorio largo (≠ password) |
| `RESEND_API_KEY` | recomendada | privada | email de aviso por lead |
| `QUOTE_FROM_EMAIL` | con Resend | privada | remitente verificado |
| `QUOTE_TO_EMAIL` | con Resend | privada | casilla del operador |
| `N8N_WEBHOOK_URL` | opcional | privada | integración CRM/Sheets |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | opcional | pública | analytics |

Generar `ADMIN_SESSION_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

---

## Production checklist (antes de publicar)

- [ ] **`.gitignore` presente** ✅ (incluido) — confirmá que `.env.local` NO está en el repo.
- [ ] **Supabase configurado** — proyecto + tabla `leads` + `SUPABASE_URL`/`SUPABASE_SERVICE_KEY`.
      *Sin esto los leads NO persisten en serverless (filesystem de solo lectura).*
- [ ] **`ADMIN_PASSWORD` cambiada** (no usar `aero-admin-2026`).
- [ ] **`ADMIN_SESSION_SECRET` generado** y cargado.
- [ ] **Resend configurado** (recomendado) para aviso por email.
- [ ] **WhatsApp, email y datos legales reales** cargados (`CLIENT_DATA_REQUIRED.md`).
- [ ] **`NEXT_PUBLIC_SITE_URL` = dominio final** y redeploy hecho.
- [ ] **`DEMO_MODE.active = false`** en `lib/aero.ts` si ya no es demo.
- [ ] `npm run build` local sin errores.

---

## Post-deployment verification checklist

Una vez deployado, verificá sobre la URL pública:

- [ ] **Home carga** y se ve sin errores (desktop + móvil real).
- [ ] **`/cessna-402`** carga.
- [ ] **`/robots.txt`** muestra el dominio correcto y bloquea `/admin` y `/api/`.
- [ ] **`/sitemap.xml`** lista home + `/cessna-402` con el dominio correcto.
- [ ] **OG preview:** pegá la URL en https://www.opengraph.xyz — debe mostrar la imagen.
- [ ] **`/manifest.webmanifest`** y **`/icon.svg`** responden 200.
- [ ] **Formulario end-to-end:** completar → llega email (si Resend) + aparece en `/admin` + **persiste tras un redeploy** (confirma Supabase).
- [ ] **`/admin`:** login con la contraseña nueva; **sin** el aviso amarillo de almacenamiento local (confirma Supabase activo).
- [ ] **Seguridad:** `GET /api/admin/leads` sin sesión → 401.
- [ ] **`/admin` no indexado:** el HTML tiene `<meta name="robots" content="noindex, nofollow">`.
- [ ] **CTAs de WhatsApp** abren la app con el número real.
- [ ] **Headers** presentes (X-Content-Type-Options, X-Frame-Options, Referrer-Policy).

---

## Veredicto DevOps

### 1. ¿El proyecto está listo para deploy?
**Sí.** Lint y build pasan limpios (0 errores). Todas las rutas estáticas y
dinámicas se generan correctamente; la imagen OG es estática (sin riesgo de
runtime); las funciones serverless usan runtime Node.js (compatible con `crypto`
y el cliente de datos); la autenticación responde 401 sin sesión y la cookie es
httpOnly + secure-en-producción + firmada con HMAC. Para **demo pública** se
puede deployar tal cual.

### 2. Blockers
- **(RESUELTO en esta auditoría)** Faltaba `.gitignore` — riesgo de commitear
  `.env.local` con la contraseña de admin. **Ya creado.**
- **No es blocker de deploy, sí de producción real:** sin `SUPABASE_URL` +
  `SUPABASE_SERVICE_KEY`, los leads **no persisten** en serverless (el fallback a
  archivo JSON no puede escribir en el filesystem de solo lectura; la solicitud
  se valida y responde OK pero se pierde). El panel muestra un aviso claro
  mientras esto pasa. **Para una demo de UI es aceptable; para captar clientes
  reales, Supabase es obligatorio.**
- **Recordatorio de seguridad:** cambiar `ADMIN_PASSWORD` de demo.

### 3. Plataforma recomendada
**Vercel.** Es la plataforma nativa de Next.js: detecta todo solo, soporta el
runtime Node.js de las funciones y `next/og` sin configuración, y el flujo de
env vars + dominio es el más directo. Netlify queda como alternativa válida (ya
configurada vía `netlify.toml`).

### 4. Tiempo estimado de deploy
- **Demo rápida (sin Supabase):** ~10 min — push del repo + import en Vercel +
  3 env vars públicas + deploy.
- **Producción completa:** ~30–45 min — incluye crear Supabase y la tabla
  (~15 min), cargar todas las env vars (~5 min), conectar dominio + DNS
  (~5 min de setup; la propagación puede tardar más), y verificación
  post-deploy (~10 min).
