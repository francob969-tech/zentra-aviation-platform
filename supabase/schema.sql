-- ============================================================================
-- Aero Ejecutivo SF — Esquema de base de datos (FUENTE DE VERDAD)
-- Plataforma de aviación · ZENTRA Studio
--
-- Tabla `leads`: solicitudes de vuelo capturadas por el formulario público y
-- gestionadas en el panel /admin.
--
-- Compatible 1:1 con el adaptador de almacenamiento `lib/leads-store.ts`
-- (acceso vía PostgREST, columnas snake_case). Si cambiás columnas acá,
-- actualizá también ese archivo.
--
-- Cómo aplicar: Supabase → SQL Editor → New query → pegar todo → Run.
-- Idempotente: se puede ejecutar varias veces sin error.
-- Instrucciones completas: supabase/README.md
-- ============================================================================

-- 1) Tabla -------------------------------------------------------------------
create table if not exists public.leads (
  id            uuid        primary key,                 -- generado por la app (randomUUID)
  created_at    timestamptz not null default now(),      -- alta de la solicitud
  dep_code      text        not null,                    -- ICAO de salida (ej. SADF)
  dest_code     text        not null,                    -- ICAO de destino
  flight_date   date        not null,                    -- fecha de salida (YYYY-MM-DD)
  return_date   date,                                    -- regreso si es ida y vuelta (nullable)
  pax           integer     not null,                    -- cantidad de pasajeros
  round_trip    boolean     not null default false,      -- ida y vuelta
  requirements  text,                                    -- requerimientos adicionales (nullable)
  nombre        text        not null,                    -- nombre del visitante
  whatsapp      text        not null,                    -- WhatsApp del visitante
  status        text        not null default 'nuevo',    -- nuevo|contactado|cotizado|ganado|perdido
  notes         text                                     -- notas internas del operador (nullable)
);

comment on table public.leads is
  'Solicitudes de vuelo del formulario público (lib/leads-store.ts). Gestionadas en /admin.';
comment on column public.leads.status is
  'Pipeline comercial: nuevo, contactado, cotizado, ganado, perdido.';

-- 2) Índices -----------------------------------------------------------------
-- El panel lista ordenando por fecha descendente (?order=created_at.desc).
create index if not exists leads_created_at_idx
  on public.leads (created_at desc);

-- 3) Validación de estado (idempotente) --------------------------------------
-- Refuerza en la DB los valores que ya valida el código (Zod). El bloque DO
-- evita el error "constraint already exists" al re-ejecutar el script.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'leads_status_check'
  ) then
    alter table public.leads
      add constraint leads_status_check
      check (status in ('nuevo', 'contactado', 'cotizado', 'ganado', 'perdido'));
  end if;
end $$;

-- 4) Row Level Security ------------------------------------------------------
-- La app accede SOLO con la service_role key, que BYPASSEA RLS por diseño.
-- Activamos RLS y NO creamos políticas a propósito: eso deja "deny by default"
-- para las keys anónima/autenticada (cualquier cliente público), que no pueden
-- leer ni escribir esta tabla.
--
-- ⚠ SEGURIDAD: NO agregar políticas permisivas para `anon`. Haría públicos los
-- datos de contacto de los leads. El único acceso debe ser la service_role key
-- desde el servidor (Vercel), nunca desde el navegador.
alter table public.leads enable row level security;

-- ============================================================================
-- Fin del esquema. Verificación: ver supabase/README.md (sección "Verificar").
-- ============================================================================
