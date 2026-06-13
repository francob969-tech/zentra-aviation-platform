# Configuración de Supabase (almacén de leads en producción)

En producción (Vercel/Netlify) el filesystem es efímero: el modo archivo
`.data/leads.json` **no persiste**. Supabase (PostgreSQL gestionado, plan free
suficiente) es obligatorio para que las solicitudes sobrevivan deploys y
reinicios. El código ya está listo: solo hay que crear la tabla y cargar 2
variables.

---

## 1. Crear el proyecto
1. Entrá a https://supabase.com → **New project**.
2. Elegí nombre, contraseña de DB y región (la más cercana: `South America (São Paulo)`).
3. Esperá a que termine de aprovisionar (~2 min).

## 2. Esquema de la tabla `leads`

| Columna        | Tipo          | Notas                                            |
|----------------|---------------|--------------------------------------------------|
| `id`           | uuid (PK)     | lo genera la app                                 |
| `created_at`   | timestamptz   | fecha/hora de la solicitud (default `now()`)     |
| `dep_code`     | text          | aeropuerto de salida (ICAO, ej. SADF)            |
| `dest_code`    | text          | aeropuerto de destino                            |
| `flight_date`  | date          | fecha de salida                                  |
| `return_date`  | date (null)   | fecha de regreso si es ida y vuelta              |
| `pax`          | int           | cantidad de pasajeros                            |
| `round_trip`   | boolean       | ida y vuelta sí/no                               |
| `requirements` | text (null)   | requerimientos adicionales                       |
| `nombre`       | text          | nombre del visitante                             |
| `whatsapp`     | text          | WhatsApp del visitante                           |
| `status`       | text          | nuevo / contactado / cotizado / ganado / perdido |
| `notes`        | text (null)   | notas internas del operador                      |

## 3. SQL para crear la tabla
En el proyecto: **SQL Editor → New query**, pegá esto y **Run**:

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

-- La app accede SOLO con la service key (lado servidor). Activamos RLS y no
-- creamos políticas públicas: así nadie puede leer la tabla con la clave
-- anónima del navegador. La service key bypassea RLS por diseño.
alter table public.leads enable row level security;
```

## 4. Variables de entorno requeridas
En el proyecto: **Settings → API**. Copiá:

| Variable                | De dónde sale                                   | Pública? |
|-------------------------|-------------------------------------------------|----------|
| `SUPABASE_URL`          | Settings → API → **Project URL**                | privada  |
| `SUPABASE_SERVICE_KEY`  | Settings → API → **service_role** secret        | privada  |

> ⚠ La `service_role` key **bypassea RLS** y da acceso total. Nunca la pongas
> en una variable `NEXT_PUBLIC_*` ni la subas al repo. Va solo en el panel del
> hosting (server-side).

## 5. Dónde pegarlas

### Vercel
**Project → Settings → Environment Variables** → agregá una por una:
- `SUPABASE_URL` = `https://xxxx.supabase.co`
- `SUPABASE_SERVICE_KEY` = `eyJ...` (service_role)
- Environment: marcá **Production** (y Preview si querés probar en branches).
- **Redeploy** para que tomen efecto.

### Netlify
**Site configuration → Environment variables → Add a variable** (mismos 2 nombres),
scope **Production**, luego **Trigger deploy → Deploy site**.

### Local (para probar antes de subir)
En `.env.local` (no se commitea):
```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
```
Reiniciá `npm run dev`. El aviso amarillo del panel `/admin` debe desaparecer.

## 6. Cómo probar insert / list / update

**A) Insert** (simula el formulario público):
```bash
curl -X POST http://localhost:3000/api/quote \
  -H "Content-Type: application/json" \
  -d '{"depCode":"SADF","destCode":"SACO","date":"2026-08-01","returnDate":"","pax":2,"roundTrip":false,"requirements":"","nombre":"Test Supabase","whatsapp":"+54 9 11 5555 5555","website":""}'
# → {"ok":true}
```
Verificá en Supabase: **Table Editor → leads** debe mostrar la fila nueva.

**B) List** (requiere sesión de admin — primero login):
```bash
# login (usa tu ADMIN_PASSWORD), guarda la cookie
curl -c cookies.txt -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" -d '{"password":"TU_ADMIN_PASSWORD"}'
# listar
curl -b cookies.txt http://localhost:3000/api/admin/leads
# → {"ok":true,"leads":[ ... ]}
```

**C) Update** (cambiar estado / notas — usá un id real del list):
```bash
curl -b cookies.txt -X PATCH http://localhost:3000/api/admin/leads/<ID> \
  -H "Content-Type: application/json" \
  -d '{"status":"contactado","notes":"Llamado, pide ida y vuelta"}'
# → {"ok":true,"lead":{...,"status":"contactado",...}}
```
Recargá el Table Editor: la fila debe reflejar el cambio. También se ve en
`/admin`.

**D) Verificación visual:** entrá a `/admin`, logueate, y confirmá que **NO**
aparece el aviso amarillo de "almacenamiento local" — eso confirma que Supabase
está activo.

---

**Listo.** Con esto el panel pasa de JSON local a PostgreSQL persistente sin
ningún cambio de código.
