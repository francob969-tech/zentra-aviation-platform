"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DESTINATIONS, SITE_NAME, COPY } from "@/lib/aero";
import type { Lead, LeadStatus } from "@/lib/lead-types";
import { LEAD_STATUSES } from "@/lib/lead-types";

/* ─────────────────────────────────────────────────────────────
   Panel de administración — /admin
   Login con contraseña (ADMIN_PASSWORD) y gestión de solicitudes:
   estado, notas internas y respuesta directa por WhatsApp.
   ───────────────────────────────────────────────────────────── */

const CITY: Record<string, string> = Object.fromEntries([
  ["SADF", "San Fernando"],
  ...DESTINATIONS.map((d) => [d.icao, d.city] as [string, string]),
  ["PVT", "Aeród. privado"],
  ["OTRO", "A confirmar"],
]);

const STATUS_META: Record<LeadStatus, { label: string; color: string }> = {
  nuevo: { label: "Nuevo", color: "#7FD9EC" },
  contactado: { label: "Contactado", color: "#8FB4CC" },
  cotizado: { label: "Cotizado", color: "#D8C27A" },
  ganado: { label: "Ganado", color: "#8FC9A0" },
  perdido: { label: "Perdido", color: "#76838F" },
};

function fmtDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("es-AR", { day: "numeric", month: "short" }) +
    " " + d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
}

function fmtFlightDate(iso: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function waReplyLink(lead: Lead): string {
  const digits = lead.whatsapp.replace(/\D/g, "");
  const msg = `Hola ${lead.nombre}, te escribimos de ${SITE_NAME} por tu solicitud de vuelo ${CITY[lead.depCode] ?? lead.depCode} → ${CITY[lead.destCode] ?? lead.destCode} para el ${fmtFlightDate(lead.date)}.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
}

export default function AdminPanel({
  initialAuthed,
  configured,
  supabaseConfigured,
}: {
  initialAuthed: boolean;
  configured: boolean;
  supabaseConfigured: boolean;
}) {
  const [authed, setAuthed] = useState(initialAuthed);
  return (
    <div className="aero-root min-h-screen" style={{ background: "var(--aero-void)" }}>
      {authed ? (
        <Dashboard onLogout={() => setAuthed(false)} supabaseConfigured={supabaseConfigured} />
      ) : (
        <Login configured={configured} onLogin={() => setAuthed(true)} />
      )}
    </div>
  );
}

/* ════════════════ Login ════════════════ */

function Login({ configured, onLogin }: { configured: boolean; onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        onLogin();
      } else {
        setError(
          res.status === 429
            ? "Demasiados intentos. Esperá un minuto."
            : "Contraseña incorrecta."
        );
      }
    } catch {
      setError("No se pudo conectar. Probá de nuevo.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-[400px]">
        <div className="mb-10 text-center">
          <p className="font-body text-[11px] font-light tracking-[0.34em] uppercase text-[var(--aero-muted)] mb-4">
            {SITE_NAME}
          </p>
          <h1 className="font-display font-medium text-[34px] tracking-[-0.01em] text-[var(--aero-text)]">
            {COPY.admin.loginTitlePre}<span className="aero-text-cyan">{COPY.admin.loginTitleAccent}</span>
          </h1>
        </div>

        {!configured ? (
          <div className="aero-glass p-7 font-body text-[14px] leading-[1.8] text-[var(--aero-muted)]">
            El panel no está configurado todavía: definí{" "}
            <code className="text-[var(--aero-cyan)]">ADMIN_PASSWORD</code> en{" "}
            <code className="text-[var(--aero-cyan)]">.env.local</code> (ver{" "}
            <code>.env.example</code>) y reiniciá el servidor.
          </div>
        ) : (
          <form onSubmit={submit} className="aero-glass p-7 sm:p-9">
            <label
              htmlFor="admin-pass"
              className="block font-body text-[13px] text-[var(--aero-muted)] mb-2.5"
            >
              Contraseña
            </label>
            <input
              id="admin-pass"
              type="password"
              className="aero-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              autoComplete="current-password"
            />
            {error && (
              <p role="alert" className="mt-3 font-body text-[12px]" style={{ color: "#D89B9B" }}>
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={busy || !password}
              className="mt-7 w-full py-4 font-body font-medium text-[12px] tracking-[0.14em] uppercase cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
              style={{ background: "var(--aero-cyan)", color: "#04111A" }}
            >
              {busy ? "Ingresando…" : "Ingresar"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ════════════════ Dashboard ════════════════ */

// Auto-actualización del panel: cada 20 s busca solicitudes nuevas sola.
const POLL_MS = 20000;

function Dashboard({ onLogout, supabaseConfigured }: { onLogout: () => void; supabaseConfigured: boolean }) {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<LeadStatus | "todos">("todos");
  const [search, setSearch] = useState("");
  // ids de solicitudes recién llegadas (para destacarlas) y hora de última actualización
  const [freshIds, setFreshIds] = useState<Set<string>>(new Set());
  const [lastUpdated, setLastUpdated] = useState("");
  // ids ya conocidos entre refrescos — ref, no provoca render
  const knownIds = useRef<Set<string> | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/leads", { cache: "no-store" });
      if (res.status === 401) {
        onLogout();
        return;
      }
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      const incoming = data.leads as Lead[];
      // Detectar las que aparecieron desde el último refresco (no en la 1ª carga)
      if (knownIds.current) {
        const added = incoming.filter((l) => !knownIds.current!.has(l.id)).map((l) => l.id);
        if (added.length) {
          setFreshIds((prev) => {
            const next = new Set(prev);
            added.forEach((id) => next.add(id));
            return next;
          });
        }
      }
      knownIds.current = new Set(incoming.map((l) => l.id));
      setLeads(incoming);
      setLastUpdated(
        new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })
      );
      setError("");
    } catch {
      setError("No se pudieron cargar las solicitudes.");
    }
  }, [onLogout]);

  // Carga inicial
  useEffect(() => {
    load();
  }, [load]);

  // Auto-refresco: cada POLL_MS, en pausa si la pestaña no está visible.
  // Al volver a la pestaña, refresca de inmediato.
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    const start = () => {
      if (!timer) timer = setInterval(() => { if (!document.hidden) load(); }, POLL_MS);
    };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
    const onVisible = () => {
      if (document.hidden) stop();
      else { load(); start(); }
    };
    start();
    document.addEventListener("visibilitychange", onVisible);
    return () => { stop(); document.removeEventListener("visibilitychange", onVisible); };
  }, [load]);

  const markAllSeen = () => setFreshIds(new Set());

  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" }).catch(() => {});
    onLogout();
  };

  const patchLead = async (id: string, patch: { status?: LeadStatus; notes?: string }) => {
    const res = await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.status === 401) {
      onLogout();
      return false;
    }
    if (!res.ok) return false;
    const data = await res.json();
    setLeads((ls) => ls?.map((l) => (l.id === id ? (data.lead as Lead) : l)) ?? ls);
    // Atender una solicitud la quita del resaltado de "nuevas"
    setFreshIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    return true;
  };

  const today = new Date().toLocaleDateString("sv-SE");
  const stats = useMemo(() => {
    const all = leads ?? [];
    return {
      total: all.length,
      nuevos: all.filter((l) => l.status === "nuevo").length,
      proximos: all.filter((l) => l.date >= today && l.status !== "perdido").length,
    };
  }, [leads, today]);

  const visible = useMemo(() => {
    let list = leads ?? [];
    if (filter !== "todos") list = list.filter((l) => l.status === filter);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (l) =>
          l.nombre.toLowerCase().includes(q) ||
          l.whatsapp.toLowerCase().includes(q) ||
          (CITY[l.destCode] ?? l.destCode).toLowerCase().includes(q)
      );
    }
    return list;
  }, [leads, filter, search]);

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-10 md:py-14">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div>
          <p className="font-body text-[10px] font-light tracking-[0.3em] uppercase text-[var(--aero-muted)] mb-2">
            {SITE_NAME}
          </p>
          <h1 className="font-display font-medium text-[30px] md:text-[36px] tracking-[-0.01em] text-[var(--aero-text)] leading-none">
            {COPY.admin.dashTitlePre}<span className="aero-text-cyan">{COPY.admin.dashTitleAccent}</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-2 mr-1 font-body text-[11px] text-[var(--aero-dim)]">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full aero-live-dot" style={{ background: "var(--aero-cyan)" }} />
            {lastUpdated ? `Se actualiza solo · ${lastUpdated}` : "Se actualiza solo"}
          </span>
          <button onClick={load} className="admin-btn" type="button">
            Actualizar
          </button>
          <button onClick={logout} className="admin-btn" type="button">
            Salir
          </button>
        </div>
      </div>

      {/* Aviso de solicitudes nuevas (llegan solas por auto-actualización) */}
      {freshIds.size > 0 && (
        <div
          role="status"
          className="mb-8 flex flex-wrap items-center justify-between gap-3 p-4 md:p-5"
          style={{ background: "rgba(127, 217, 236, 0.07)", border: "1px solid var(--aero-cyan-dim)" }}
        >
          <span className="flex items-center gap-3 font-body text-[14px]" style={{ color: "var(--aero-cyan)" }}>
            <span aria-hidden className="h-2 w-2 rounded-full aero-live-dot" style={{ background: "var(--aero-cyan)" }} />
            {freshIds.size === 1
              ? "1 solicitud nueva recibida"
              : `${freshIds.size} solicitudes nuevas recibidas`}
          </span>
          <button onClick={markAllSeen} className="admin-btn" type="button">
            Marcar como vistas
          </button>
        </div>
      )}

      {/* Aviso: almacén local (no persiste en producción serverless) */}
      {!supabaseConfigured && (
        <div
          role="alert"
          className="mb-10 flex items-start gap-3 p-4 md:p-5"
          style={{ background: "rgba(216, 155, 122, 0.08)", border: "1px solid rgba(216, 155, 122, 0.35)" }}
        >
          <span aria-hidden className="mt-0.5 shrink-0 text-[15px]" style={{ color: "#E0A878" }}>
            ⚠
          </span>
          <div>
            <p className="font-body text-[13px] font-medium tracking-[0.02em]" style={{ color: "#E8B488" }}>
              Almacenamiento local (JSON) activo. Los leads no van a persistir en producción.
            </p>
            <p className="mt-1.5 font-body text-[12px] leading-[1.6] text-[var(--aero-muted)]">
              Las solicitudes se guardan en un archivo del servidor — sirve para desarrollo y
              demo, pero en Vercel/Netlify se pierden en cada deploy. Configurá Supabase
              (<code className="text-[var(--aero-cyan)]">SUPABASE_URL</code> y{" "}
              <code className="text-[var(--aero-cyan)]">SUPABASE_SERVICE_KEY</code>) antes de
              publicar. Ver <code>SUPABASE_SETUP.md</code>.
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-px mb-10" style={{ background: "var(--aero-line)", border: "1px solid var(--aero-line)" }}>
        <Stat label="Total" value={stats.total} />
        <Stat label="Nuevas" value={stats.nuevos} accent />
        <Stat label="Vuelos próximos" value={stats.proximos} />
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <FilterChip active={filter === "todos"} onClick={() => setFilter("todos")} label="Todas" />
        {LEAD_STATUSES.map((s) => (
          <FilterChip
            key={s}
            active={filter === s}
            onClick={() => setFilter(s)}
            label={STATUS_META[s].label}
            dot={STATUS_META[s].color}
          />
        ))}
        <input
          type="search"
          placeholder="Buscar nombre, WhatsApp o destino…"
          className="aero-field ml-auto !w-auto min-w-[240px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Buscar solicitudes"
        />
      </div>

      {/* Lista */}
      {error && (
        <p className="font-body text-[14px] mb-6" style={{ color: "#D89B9B" }}>
          {error}{" "}
          <button onClick={load} className="underline cursor-pointer" type="button">
            Reintentar
          </button>
        </p>
      )}
      {leads === null && !error && (
        <p className="font-body text-[14px] text-[var(--aero-muted)]">Cargando…</p>
      )}
      {leads !== null && visible.length === 0 && (
        <div className="aero-glass p-10 text-center font-body text-[14px] text-[var(--aero-muted)]">
          {leads.length === 0
            ? "Todavía no hay solicitudes. Cuando alguien complete el formulario de la web, aparece acá."
            : "Ninguna solicitud coincide con el filtro."}
        </div>
      )}
      <div className="flex flex-col gap-4">
        {visible.map((lead) => (
          <LeadCard key={lead.id} lead={lead} onPatch={patchLead} fresh={freshIds.has(lead.id)} />
        ))}
      </div>

    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="p-6 md:p-8" style={{ background: "var(--aero-deep)" }}>
      <p className="font-body text-[10px] tracking-[0.22em] uppercase text-[var(--aero-dim)] mb-3">
        {label}
      </p>
      <p
        className="font-display font-medium text-[34px] leading-none"
        style={{ color: accent ? "var(--aero-cyan)" : "var(--aero-text)" }}
      >
        {value}
      </p>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  dot,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  dot?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="inline-flex items-center gap-2 px-4 py-2 font-body text-[11px] tracking-[0.1em] uppercase cursor-pointer transition-colors duration-200 border"
      style={
        active
          ? { background: "var(--aero-cyan)", color: "#04111A", borderColor: "var(--aero-cyan)" }
          : { background: "transparent", color: "var(--aero-muted)", borderColor: "var(--aero-line)" }
      }
    >
      {dot && !active && (
        <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: dot }} />
      )}
      {label}
    </button>
  );
}

/* ════════════════ Tarjeta de solicitud ════════════════ */

function LeadCard({
  lead,
  onPatch,
  fresh,
}: {
  lead: Lead;
  onPatch: (id: string, patch: { status?: LeadStatus; notes?: string }) => Promise<boolean>;
  fresh: boolean;
}) {
  const [notes, setNotes] = useState(lead.notes);
  const [savingNotes, setSavingNotes] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const meta = STATUS_META[lead.status];

  const saveNotes = async () => {
    setSavingNotes(true);
    await onPatch(lead.id, { notes });
    setSavingNotes(false);
  };

  return (
    <article
      className="aero-glass p-6 md:p-7 relative"
      style={fresh ? { borderColor: "var(--aero-cyan)", boxShadow: "0 0 0 1px var(--aero-cyan), 0 0 24px rgba(127, 217, 236, 0.10)" } : undefined}
    >
      {fresh && (
        <span
          className="absolute -top-2 left-6 px-2 py-0.5 font-body text-[10px] tracking-[0.16em] uppercase"
          style={{ background: "var(--aero-cyan)", color: "#04111A" }}
        >
          Nueva
        </span>
      )}
      <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-5">
        {/* Ruta + fechas */}
        <div className="min-w-[220px]">
          <div className="flex items-baseline gap-3">
            <span className="font-body font-medium text-[22px] tracking-[0.04em] text-[var(--aero-text)]">
              {lead.depCode}
            </span>
            <span aria-hidden className="text-[var(--aero-cyan)]">→</span>
            <span className="font-body font-medium text-[22px] tracking-[0.04em] text-[var(--aero-text)]">
              {lead.destCode}
            </span>
          </div>
          <p className="mt-1 font-body text-[12px] text-[var(--aero-muted)]">
            {CITY[lead.depCode] ?? lead.depCode} → {CITY[lead.destCode] ?? lead.destCode}
          </p>
          <p className="mt-3 font-body text-[13px] text-[var(--aero-text)]">
            {fmtFlightDate(lead.date)}
            {lead.roundTrip && (
              <span className="text-[var(--aero-muted)]"> · vuelve {fmtFlightDate(lead.returnDate)}</span>
            )}
            <span className="text-[var(--aero-muted)]"> · {lead.pax} pax</span>
          </p>
        </div>

        {/* Contacto */}
        <div className="min-w-[180px]">
          <p className="font-body text-[10px] tracking-[0.2em] uppercase text-[var(--aero-dim)] mb-2">
            Contacto
          </p>
          <p className="font-body text-[15px] text-[var(--aero-text)]">{lead.nombre}</p>
          <p className="font-body text-[13px] text-[var(--aero-muted)]">{lead.whatsapp}</p>
          <p className="mt-2 font-body text-[11px] text-[var(--aero-dim)]">
            Recibida {fmtDateTime(lead.createdAt)}
          </p>
        </div>

        {/* Acciones */}
        <div className="flex flex-col items-stretch gap-2.5 min-w-[190px]">
          <label className="sr-only" htmlFor={`status-${lead.id}`}>
            Estado
          </label>
          <div className="flex items-center gap-2.5">
            <span aria-hidden className="h-2 w-2 rounded-full shrink-0" style={{ background: meta.color }} />
            <select
              id={`status-${lead.id}`}
              className="admin-select flex-1"
              value={lead.status}
              onChange={(e) => onPatch(lead.id, { status: e.target.value as LeadStatus })}
            >
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_META[s].label}
                </option>
              ))}
            </select>
          </div>
          <a
            href={waReplyLink(lead)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-center px-4 py-2.5 font-body text-[11px] font-medium tracking-[0.12em] uppercase text-[var(--aero-cyan)] border border-[var(--aero-cyan)] hover:bg-[var(--aero-cyan)] hover:text-[#04111A] transition-colors duration-200"
          >
            Responder por WhatsApp
          </a>
          <button type="button" onClick={() => setShowNotes(!showNotes)} className="admin-btn">
            {showNotes ? "Ocultar notas" : notes ? "Ver notas" : "Agregar notas"}
          </button>
        </div>
      </div>

      {/* Requerimientos del cliente */}
      {lead.requirements && (
        <p className="mt-5 pt-5 font-body text-[13px] leading-[1.7] text-[var(--aero-muted)]" style={{ borderTop: "1px solid var(--aero-line)" }}>
          <span className="text-[var(--aero-dim)] uppercase tracking-[0.16em] text-[10px] mr-2">Requerimientos</span>
          {lead.requirements}
        </p>
      )}

      {/* Notas internas */}
      {showNotes && (
        <div className="mt-5 pt-5" style={{ borderTop: "1px solid var(--aero-line)" }}>
          <label
            htmlFor={`notes-${lead.id}`}
            className="block font-body text-[10px] tracking-[0.2em] uppercase text-[var(--aero-dim)] mb-2"
          >
            Notas internas
          </label>
          <textarea
            id={`notes-${lead.id}`}
            rows={3}
            className="aero-field"
            placeholder="Cotización enviada, valores, condiciones acordadas…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <button
            type="button"
            onClick={saveNotes}
            disabled={savingNotes || notes === lead.notes}
            className="admin-btn mt-3 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {savingNotes ? "Guardando…" : "Guardar notas"}
          </button>
        </div>
      )}
    </article>
  );
}
