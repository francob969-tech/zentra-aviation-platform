# supabase/ — Base de datos de producción

Fuente de verdad del esquema de la base de datos. Cualquier desarrollador puede
**recrear la base de producción desde cero** usando solo este directorio.

```
supabase/
├── schema.sql   ← esquema canónico (tabla, índices, RLS, constraints)
└── README.md    ← este archivo
```

## Propósito

La plataforma captura solicitudes de vuelo (leads) desde el formulario público y
las gestiona en `/admin`. En desarrollo se guardan en un archivo local
(`.data/leads.json`); **en producción (Vercel/Netlify) el filesystem es de solo
lectura**, así que se usa **Supabase (PostgreSQL gestionado)**. El cambio entre
ambos es automático según las variables de entorno — no requiere cambios de código.

El adaptador que habla con esta base es `lib/leads-store.ts` (vía PostgREST).
`schema.sql` está alineado 1:1 con ese adaptador.

## Setup (crear el proyecto)

1. https://supabase.com → **New project**.
2. Nombre, contraseña de DB (guardala) y región: **South America (São Paulo)**.
3. Esperá ~2 min a que aprovisione.

## Cómo aplicar el esquema

1. En el proyecto → **SQL Editor → New query**.
2. Pegá **todo el contenido de `schema.sql`** y **Run**.
3. Verificá en **Table Editor → leads** que la tabla existe (vacía).

> `schema.sql` es **idempotente**: podés re-ejecutarlo sin error (usa
> `if not exists` y un bloque `DO` para el constraint).

## Variables de entorno requeridas

Ambas son **privadas** (server-side). Nunca `NEXT_PUBLIC_*`, nunca en el repo.

| Variable | De dónde sale | Notas |
|---|---|---|
| `SUPABASE_URL` | Settings → API → **Project URL** | `https://<proj>.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Settings → API → **service_role** secret | Bypassea RLS; solo en el hosting |

Cargalas en **Vercel → Settings → Environment Variables** (scope Production) y
hacé un **Redeploy** para que tomen efecto.

> ⚠ Usá la key **service_role** (empieza con `eyJ`), no la `anon`. El adaptador
> la envía como `apikey` y `Authorization: Bearer`; al bypassear RLS es lo que
> permite que la app lea/escriba mientras el público queda bloqueado.

## Verificar (post-setup)

**1. Insert end-to-end** (desde la web en vivo; reemplazá el dominio):
```bash
curl -s -w " [%{http_code}]\n" -X POST https://<tu-deploy>/api/quote \
  -H "Content-Type: application/json" \
  -d '{"depCode":"SADF","destCode":"SACO","date":"2026-09-01","returnDate":"","pax":2,"roundTrip":false,"requirements":"","nombre":"Prueba Supabase","whatsapp":"+54 9 11 5555 5555","website":""}'
# Esperado: {"ok":true} [200]  → la fila aparece en Table Editor → leads
```

**2. Panel admin:** entrá a `/admin`, logueate. El **aviso amarillo** de
"almacenamiento local" debe **desaparecer** (confirma que detecta Supabase) y la
solicitud de prueba aparece en la lista. Cambiá su estado → recargá → persiste.

**3. Persistencia tras deploy:** hacé un **Redeploy** en Vercel y volvé a
`/admin`: la solicitud **sigue ahí** (en modo demo se perdía).

**4. Seguridad (RLS):** confirmá que la key anónima NO puede leer:
```bash
curl -s "https://<proj>.supabase.co/rest/v1/leads?select=*" \
  -H "apikey: <ANON_KEY>" -H "Authorization: Bearer <ANON_KEY>"
# Esperado: [] (RLS bloquea lectura anónima). Con la service key sí trae filas.
```

## Recrear la base desde cero

1. Crear proyecto Supabase (sección Setup).
2. Correr `schema.sql` en el SQL Editor.
3. Cargar `SUPABASE_URL` + `SUPABASE_SERVICE_KEY` en el hosting.
4. Redeploy. Listo: la base queda idéntica a producción.

---

Guía operativa extendida (deploy, dónde pegar en Vercel/Netlify): ver
`SUPABASE_SETUP.md` en la raíz del repo.
