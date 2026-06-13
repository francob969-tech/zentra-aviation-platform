"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/aero/ui/SectionHeading";
import Reveal from "@/components/aero/ui/Reveal";
import {
  DESTINATIONS,
  SITE_NAME,
  CONTACT_EMAIL,
  buildWaLink,
  COPY,
} from "@/lib/aero";
import { quoteSchema } from "@/lib/quote-schema";
import { track } from "@/lib/track";

/* ── Catálogo de aeropuertos ─────────────────────────── */
const SAN_FERNANDO = { city: "San Fernando", icao: "SADF" };
const DEPARTURES = [SAN_FERNANDO, ...DESTINATIONS];
const PRIVATE = { city: "Estancia / aeródromo privado", icao: "PVT" };
const ALL = [SAN_FERNANDO, ...DESTINATIONS, PRIVATE];

function lookup(code: string): { icao: string; city: string } {
  if (!code) return { icao: "—", city: "" };
  if (code === "OTRO") return { icao: "—", city: "A confirmar" };
  const a = ALL.find((x) => x.icao === code);
  return a ? { icao: a.icao, city: a.city } : { icao: "—", city: "" };
}

/* ── Formato de fecha sin Date() (determinista) ──────── */
const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
function fmtDate(iso: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`;
}

/* Hoy en formato YYYY-MM-DD en la zona horaria del visitante */
function localTodayIso(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toLocaleDateString("sv-SE"); // sv-SE = YYYY-MM-DD
}

interface RequestState {
  depCode: string;
  destCode: string;
  date: string;
  returnDate: string;
  pax: number;
  roundTrip: boolean;
  requirements: string;
  nombre: string;
  whatsapp: string;
}

const initial: RequestState = {
  depCode: "SADF",
  destCode: "",
  date: "",
  returnDate: "",
  pax: 2,
  roundTrip: false,
  requirements: "",
  nombre: "",
  whatsapp: "",
};

/* Campo del formulario → id del elemento, para enfocar el primer error */
const FIELD_IDS: Record<string, string> = {
  destCode: "dest",
  date: "date",
  returnDate: "returnDate",
  nombre: "nombre",
  whatsapp: "whatsapp",
};

function buildText(f: RequestState): string {
  const dep = lookup(f.depCode);
  const dest = lookup(f.destCode);
  return [
    `Solicitud de vuelo privado — ${SITE_NAME}`,
    ``,
    `Origen: ${dep.city || "—"} (${dep.icao})`,
    `Destino: ${dest.city || "—"} (${dest.icao})`,
    `Fecha de salida: ${fmtDate(f.date)}`,
    `Pasajeros: ${f.pax}`,
    `Viaje: ${f.roundTrip ? "Ida y vuelta" : "Solo ida"}`,
    ...(f.roundTrip ? [`Fecha de regreso: ${fmtDate(f.returnDate)}`] : []),
    `Requisitos adicionales: ${f.requirements || "—"}`,
    ``,
    `Nombre: ${f.nombre || "—"}`,
    `WhatsApp: ${f.whatsapp || "—"}`,
  ].join("\n");
}

export default function QuoteForm() {
  const [form, setForm] = useState<RequestState>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [honeypot, setHoneypot] = useState("");
  const [sent, setSent] = useState<null | "wa" | "email">(null);
  // min de los date-pickers: el "hoy" del visitante solo existe en el cliente,
  // así que se aplica al DOM post-mount (no se puede renderizar en el servidor)
  const dateRef = useRef<HTMLInputElement>(null);
  const returnRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dateRef.current?.setAttribute("min", localTodayIso());
  }, []);

  useEffect(() => {
    if (form.roundTrip) {
      returnRef.current?.setAttribute("min", form.date || localTodayIso());
    }
  }, [form.roundTrip, form.date]);

  const set = <K extends keyof RequestState>(k: K, v: RequestState[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    // limpiar el error del campo al corregirlo
    if (k in FIELD_IDS) setErrors((e) => (e[k] ? { ...e, [k]: "" } : e));
  };

  /* Valida con el mismo schema que usa /api/quote. Devuelve el payload o null. */
  const validate = () => {
    const payload = {
      depCode: form.depCode,
      destCode: form.destCode,
      date: form.date,
      returnDate: form.roundTrip ? form.returnDate : "",
      pax: form.pax,
      roundTrip: form.roundTrip,
      requirements: form.requirements,
      nombre: form.nombre,
      whatsapp: form.whatsapp,
      website: honeypot,
    };
    const parsed = quoteSchema.safeParse(payload);
    const errs: Record<string, string> = {};
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "");
        if (key && !errs[key]) errs[key] = issue.message;
      }
    }
    // Regla solo-cliente: la salida no puede ser pasada (el servidor no conoce
    // la zona horaria del visitante).
    const todayIso = localTodayIso();
    if (form.date && form.date < todayIso && !errs.date) {
      errs.date = "La fecha de salida no puede ser pasada";
    }
    setErrors(errs);
    const firstError = ["destCode", "date", "returnDate", "nombre", "whatsapp"].find((k) => errs[k]);
    if (firstError) {
      document.getElementById(FIELD_IDS[firstError])?.focus();
      return null;
    }
    return parsed.success ? parsed.data : null;
  };

  /* Doble disparo: registra el lead en /api/quote (fire-and-forget) y abre
     WhatsApp/email en el mismo gesto del usuario (evita popup blockers). */
  const persistLead = (payload: unknown) => {
    fetch("/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      /* el flujo WhatsApp/email sigue siendo el canal principal */
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = validate();
    if (!payload) return;
    track("quote_submit", { dest: form.destCode, channel: "whatsapp" });
    persistLead(payload);
    window.open(buildWaLink(buildText(form)), "_blank", "noopener");
    setSent("wa");
    setTimeout(() => setSent(null), 6000);
  };

  const sendEmail = () => {
    const payload = validate();
    if (!payload) return;
    track("quote_submit", { dest: form.destCode, channel: "email" });
    persistLead(payload);
    const subject = encodeURIComponent(`Solicitud de vuelo — ${form.nombre || "Consulta"}`);
    const body = encodeURIComponent(buildText(form));
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSent("email");
    setTimeout(() => setSent(null), 6000);
  };

  const dep = lookup(form.depCode);
  const dest = lookup(form.destCode);

  return (
    <section
      id="cotizar"
      className="py-[140px] md:py-[200px] relative overflow-hidden"
      style={{ background: "var(--aero-void)", borderTop: "1px solid var(--aero-line)", scrollMarginTop: "76px" }}
    >
      <div className="relative max-w-[1440px] mx-auto px-6 md:px-16">
        <div className="max-w-[640px] mb-16 md:mb-20">
          <SectionHeading
            eyebrow={COPY.quote.eyebrow}
            heading={<>{COPY.quote.titlePre}<span className="aero-text-cyan">{COPY.quote.titleAccent}</span></>}
            sub={COPY.quote.sub}
          />
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Honeypot anti-bots: invisible para humanos, los bots lo completan */}
          <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
            <label htmlFor="website">No completar este campo</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(360px,440px)] gap-12 lg:gap-16 items-start">
            {/* ── Campos ── */}
            <Reveal y={24} className="order-2 lg:order-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
                <div>
                  <Label htmlFor="dep">Aeropuerto de salida</Label>
                  <select id="dep" className="aero-field" value={form.depCode} onChange={(e) => set("depCode", e.target.value)}>
                    {DEPARTURES.map((a) => (
                      <option key={a.icao} value={a.icao}>{a.city} · {a.icao}</option>
                    ))}
                    <option value="OTRO">Otro aeropuerto</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="dest" required>Aeropuerto de destino</Label>
                  <select
                    id="dest"
                    className="aero-field"
                    value={form.destCode}
                    onChange={(e) => set("destCode", e.target.value)}
                    aria-required="true"
                    aria-invalid={!!errors.destCode}
                    aria-describedby={errors.destCode ? "dest-error" : undefined}
                  >
                    <option value="">Elegí un destino</option>
                    {DESTINATIONS.map((a) => (
                      <option key={a.icao} value={a.icao}>{a.city} · {a.icao}</option>
                    ))}
                    <option value="PVT">Estancia / aeródromo privado</option>
                    <option value="OTRO">Otro destino</option>
                  </select>
                  <FieldError id="dest-error" message={errors.destCode} />
                </div>

                <div>
                  <Label htmlFor="date" required>Fecha de salida</Label>
                  <input
                    id="date"
                    type="date"
                    ref={dateRef}
                    className="aero-field"
                    value={form.date}
                    onChange={(e) => set("date", e.target.value)}
                    aria-required="true"
                    aria-invalid={!!errors.date}
                    aria-describedby={errors.date ? "date-error" : undefined}
                  />
                  <FieldError id="date-error" message={errors.date} />
                </div>

                <div>
                  <Stepper value={form.pax} onChange={(v) => set("pax", v)} />
                </div>

                {/* Tipo de viaje */}
                <div className="sm:col-span-2">
                  <span id="trip-label" className="block font-body text-[13px] tracking-[0.01em] text-[var(--aero-muted)] mb-2.5">
                    Tipo de viaje
                  </span>
                  <div role="radiogroup" aria-labelledby="trip-label" className="grid grid-cols-2 gap-2 max-w-[320px]">
                    <TripButton active={!form.roundTrip} onClick={() => set("roundTrip", false)} label="Solo ida" />
                    <TripButton active={form.roundTrip} onClick={() => set("roundTrip", true)} label="Ida y vuelta" />
                  </div>
                </div>

                {/* Fecha de regreso (condicional) */}
                <AnimatePresence initial={false}>
                  {form.roundTrip && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="sm:col-span-2 overflow-hidden"
                    >
                      <div className="max-w-[320px] pt-1">
                        <Label htmlFor="returnDate" required>Fecha de regreso</Label>
                        <input
                          id="returnDate"
                          type="date"
                          ref={returnRef}
                          className="aero-field"
                          value={form.returnDate}
                          onChange={(e) => set("returnDate", e.target.value)}
                          aria-required="true"
                          aria-invalid={!!errors.returnDate}
                          aria-describedby={errors.returnDate ? "returnDate-error" : undefined}
                        />
                        <FieldError id="returnDate-error" message={errors.returnDate} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Requisitos */}
                <div className="sm:col-span-2">
                  <Label htmlFor="req">Requerimientos adicionales</Label>
                  <textarea id="req" rows={3} className="aero-field" placeholder="Catering, traslado en tierra, mascota a bordo, equipaje especial, horario preferido…" value={form.requirements} onChange={(e) => set("requirements", e.target.value)} />
                </div>

                {/* Contacto */}
                <div>
                  <Label htmlFor="nombre" required>Nombre</Label>
                  <input
                    id="nombre"
                    type="text"
                    className="aero-field"
                    placeholder="Tu nombre"
                    value={form.nombre}
                    autoComplete="name"
                    onChange={(e) => set("nombre", e.target.value)}
                    aria-required="true"
                    aria-invalid={!!errors.nombre}
                    aria-describedby={errors.nombre ? "nombre-error" : undefined}
                  />
                  <FieldError id="nombre-error" message={errors.nombre} />
                </div>
                <div>
                  <Label htmlFor="whatsapp" required>WhatsApp</Label>
                  <input
                    id="whatsapp"
                    type="tel"
                    inputMode="tel"
                    className="aero-field"
                    placeholder="+54 9 11 ..."
                    value={form.whatsapp}
                    autoComplete="tel"
                    onChange={(e) => set("whatsapp", e.target.value)}
                    aria-required="true"
                    aria-invalid={!!errors.whatsapp}
                    aria-describedby={errors.whatsapp ? "whatsapp-error" : undefined}
                  />
                  <FieldError id="whatsapp-error" message={errors.whatsapp} />
                </div>
              </div>
            </Reveal>

            {/* ── Tarjeta itinerario + envío ── */}
            <Reveal y={28} delay={0.1} className="order-1 lg:order-2 lg:sticky lg:top-28">
              <TripSummaryCard dep={dep} dest={dest} form={form} />

              <div className="mt-6 flex flex-col sm:flex-row items-stretch gap-3">
                <motion.button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-2.5 py-4 font-body font-medium text-[12px] tracking-[0.14em] uppercase"
                  style={{ background: "var(--aero-cyan)", color: "#04111A", border: "1px solid var(--aero-cyan)" }}
                  whileHover={{ backgroundColor: "#A6E7F4", borderColor: "#A6E7F4" }}
                  transition={{ duration: 0.2 }}
                >
                  Enviar solicitud
                </motion.button>
                <button
                  type="button"
                  onClick={sendEmail}
                  className="inline-flex items-center justify-center px-6 py-4 font-body font-medium text-[12px] tracking-[0.1em] uppercase text-[var(--aero-muted)] border border-[color:var(--aero-line)] hover:text-[var(--aero-text)] hover:border-[color:var(--aero-cyan-dim)] transition-colors duration-200 cursor-pointer"
                >
                  Email
                </button>
              </div>

              <AnimatePresence>
                {sent && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 font-body text-[13px] text-[var(--aero-cyan)]"
                  >
                    {sent === "wa"
                      ? "Abrimos WhatsApp con tu solicitud cargada. Si no se abrió, revisá el bloqueo de ventanas emergentes."
                      : "Abrimos tu cliente de email con la solicitud lista para enviar."}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Vía directa, sin formulario */}
              <p className="mt-5 font-body text-[13px] leading-[1.6] text-[var(--aero-muted)]">
                {COPY.quote.directPrefix}{" "}
                <a
                  href={buildWaLink(`Hola ${SITE_NAME}, quiero cotizar un vuelo privado.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--aero-cyan)] underline underline-offset-4 transition-colors duration-200"
                  style={{ textDecorationColor: "rgba(127, 217, 236, 0.4)" }}
                >
                  Cotizar por WhatsApp
                </a>
              </p>

              <p className="mt-4 font-body text-[12px] leading-[1.6] text-[var(--aero-dim)]">
                {COPY.quote.privacy}
              </p>
            </Reveal>
          </div>
        </form>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   Tarjeta itinerario — refleja la solicitud en vivo
   ════════════════════════════════════════════════════════ */
function TripSummaryCard({
  dep,
  dest,
  form,
}: {
  dep: { icao: string; city: string };
  dest: { icao: string; city: string };
  form: RequestState;
}) {
  return (
    <div className="aero-glass aero-corners p-7 sm:p-9">
      <div className="flex items-center justify-between mb-9">
        <span className="font-body text-[10px] font-light tracking-[0.3em] uppercase text-[var(--aero-muted)]">
          Itinerario
        </span>
        <span className="font-display italic text-[15px] text-[var(--aero-cyan)] leading-none">
          {SITE_NAME}
        </span>
      </div>

      {/* Ruta */}
      <div className="flex items-start justify-between gap-3">
        <RouteEnd code={dep.icao} city={dep.city || "Salida"} align="left" />
        <RouteLine roundTrip={form.roundTrip} />
        <RouteEnd code={dest.icao} city={dest.city || "Elegí destino"} align="right" />
      </div>

      <div className="h-px my-8" style={{ background: "var(--aero-line)" }} aria-hidden />

      {/* Detalles */}
      <dl className="grid grid-cols-2 gap-x-6 gap-y-6">
        <Detail k="Salida" v={fmtDate(form.date)} />
        <Detail k="Pasajeros" v={String(form.pax)} />
        <Detail k="Viaje" v={form.roundTrip ? "Ida y vuelta" : "Solo ida"} />
        {form.roundTrip && <Detail k="Regreso" v={fmtDate(form.returnDate)} />}
      </dl>

      {form.requirements?.trim() && (
        <>
          <div className="h-px my-7" style={{ background: "var(--aero-line)" }} aria-hidden />
          <Detail k="Requerimientos" v={form.requirements} />
        </>
      )}

      <p className="mt-9 font-body text-[11px] leading-[1.6] text-[var(--aero-dim)]">
        Sujeto a confirmación de disponibilidad y configuración de la aeronave.
      </p>
    </div>
  );
}

function RouteEnd({ code, city, align }: { code: string; city: string; align: "left" | "right" }) {
  return (
    <div className={align === "right" ? "text-right" : "text-left"}>
      <div className="font-body font-medium text-[28px] sm:text-[32px] tracking-[0.06em] text-[var(--aero-text)] leading-none">
        {code}
      </div>
      <div className="mt-2 font-body text-[11px] leading-[1.3] text-[var(--aero-muted)] max-w-[120px]">
        {city}
      </div>
    </div>
  );
}

function RouteLine({ roundTrip }: { roundTrip: boolean }) {
  const CH = "var(--aero-cyan)";
  return (
    <div className="relative flex-1 mx-1 pt-3" aria-hidden>
      <div className="relative h-3">
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 border-t border-dashed" style={{ borderColor: "rgba(127,217,236,0.45)" }} />
        <span className="absolute top-1/2 left-0 -translate-y-1/2 h-1.5 w-1.5 rounded-full" style={{ background: CH }} />
        <span className="absolute top-1/2 right-0 -translate-y-1/2 h-1.5 w-1.5 rounded-full" style={{ background: CH }} />
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-1.5" style={{ background: "#0C141C" }}>
          <svg width="11" height="11" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path d="M2 1 L8 5 L2 9 Z" fill={CH} />
          </svg>
        </span>
      </div>
      {roundTrip && (
        <div className="relative h-3 mt-1.5 opacity-70">
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 border-t border-dashed" style={{ borderColor: "rgba(127,217,236,0.3)" }} />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-1.5" style={{ background: "#0C141C" }}>
            <svg width="11" height="11" viewBox="0 0 10 10" fill="none" aria-hidden>
              <path d="M8 1 L2 5 L8 9 Z" fill={CH} />
            </svg>
          </span>
        </div>
      )}
    </div>
  );
}

function Detail({ k, v }: { k: string; v: string }) {
  return (
    <div className="min-w-0">
      <dt className="font-body text-[10px] font-light tracking-[0.18em] uppercase text-[var(--aero-dim)] mb-1.5">
        {k}
      </dt>
      <dd className="font-body text-[14px] leading-[1.5] text-[var(--aero-text)] break-words">
        {v}
      </dd>
    </div>
  );
}

/* ── Subcomponentes de formulario ── */
function Label({ htmlFor, required, children }: { htmlFor: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block font-body text-[13px] tracking-[0.01em] text-[var(--aero-muted)] mb-2.5">
      {children}
      {required && <span aria-hidden="true" className="ml-1 text-[var(--aero-cyan)]">*</span>}
    </label>
  );
}

/* Mensaje de error inline — rosado AA sobre fondo tinta */
function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-2 font-body text-[12px] leading-[1.5]" style={{ color: "#D89B9B" }}>
      {message}
    </p>
  );
}

function Stepper({ value, onChange, min = 1, max = 8 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  const btn =
    "h-9 w-9 flex items-center justify-center border text-[18px] leading-none transition-colors duration-200 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer";
  return (
    <div role="group" aria-labelledby="pax-label">
      <span id="pax-label" className="block font-body text-[13px] tracking-[0.01em] text-[var(--aero-muted)] mb-2.5">
        Pasajeros
      </span>
      <div className="flex items-center justify-between border-b pb-2.5" style={{ borderColor: "rgba(220,235,244,0.12)" }}>
        <button
          type="button"
          aria-label="Quitar un pasajero"
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className={btn}
          style={{ borderColor: "var(--aero-line)", color: "var(--aero-muted)" }}
        >
          −
        </button>
        <span className="font-display font-medium text-[22px] text-[var(--aero-text)]" aria-live="polite">
          {value}
        </span>
        <button
          type="button"
          aria-label="Agregar un pasajero"
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          className={btn}
          style={{ borderColor: "var(--aero-line)", color: "var(--aero-muted)" }}
        >
          +
        </button>
      </div>
    </div>
  );
}

function TripButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      role="radio"
      onClick={onClick}
      aria-checked={active}
      className="py-3 px-4 font-body text-[12px] tracking-[0.08em] uppercase transition-colors duration-200 cursor-pointer border"
      style={
        active
          ? { background: "var(--aero-cyan)", color: "#04111A", borderColor: "var(--aero-cyan)" }
          : { background: "transparent", color: "var(--aero-muted)", borderColor: "var(--aero-line)" }
      }
    >
      {label}
    </button>
  );
}
