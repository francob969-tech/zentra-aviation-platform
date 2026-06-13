"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/aero/ui/SectionHeading";
import Reveal from "@/components/aero/ui/Reveal";
import CyanButton from "@/components/aero/ui/CyanButton";
import { TIME_ROUTES as ROUTES, TIME_MODES as MODES, COPY } from "@/lib/aero";

/* ─────────────────────────────────────────────────────────────
   TimeSaved — "No comprás un avión. Comprás tiempo."
   Comparador puerta a puerta: auto vs aerolínea comercial vs taxi aéreo.
   Contenido en lib/aero.ts (TIME_ROUTES, TIME_MODES). Valores APROXIMADOS
   y conservadores; validar con el operador.
   ───────────────────────────────────────────────────────────── */

function fmtH(h: number): string {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return mm ? `${hh} h ${String(mm).padStart(2, "0")}` : `${hh} h`;
}

const ease = [0.22, 1, 0.36, 1] as const;

export default function TimeSaved() {
  const [code, setCode] = useState(ROUTES[0].code);
  const route = ROUTES.find((r) => r.code === code) ?? ROUTES[0];
  const bestTraditional = Math.min(route.car, route.airline);
  const saved = bestTraditional - route.private;
  const maxH = Math.max(route.car, route.airline, route.private);

  return (
    <section
      id="tiempo"
      className="py-[140px] md:py-[200px]"
      style={{ background: "var(--aero-void)", borderTop: "1px solid var(--aero-line)", scrollMarginTop: "76px" }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        <div className="max-w-[680px] mb-14 md:mb-16">
          <SectionHeading
            eyebrow={COPY.timeSaved.eyebrow}
            heading={<>{COPY.timeSaved.titlePre}<span className="aero-text-cyan">{COPY.timeSaved.titleAccent}</span></>}
            sub={COPY.timeSaved.sub}
          />
        </div>

        {/* Selector de destino */}
        <Reveal>
          <div role="radiogroup" aria-label="Elegí un destino para comparar" className="flex flex-wrap items-center gap-2 mb-4">
            {ROUTES.map((r) => (
              <button
                key={r.code}
                type="button"
                role="radio"
                aria-checked={code === r.code}
                onClick={() => setCode(r.code)}
                className="px-5 py-3 font-body text-[12px] tracking-[0.1em] uppercase cursor-pointer transition-colors duration-200 border"
                style={
                  code === r.code
                    ? { background: "var(--aero-cyan)", color: "#04111A", borderColor: "var(--aero-cyan)" }
                    : { background: "transparent", color: "var(--aero-muted)", borderColor: "var(--aero-line)" }
                }
              >
                {r.city}
              </button>
            ))}
          </div>
          <p className="font-body text-[12px] tracking-[0.14em] uppercase text-[var(--aero-dim)] mb-12">
            San Fernando → {route.city} · ≈ {route.km} km · vuelo directo
          </p>
        </Reveal>

        {/* Tarjetas comparativas */}
        <Reveal delay={0.08}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px" style={{ background: "var(--aero-line)", border: "1px solid var(--aero-line)" }}>
            {MODES.map((m) => {
              const hours = route[m.key];
              const isPrivate = m.key === "private";
              return (
                <div
                  key={m.key}
                  className={`relative p-8 md:p-10 ${isPrivate ? "aero-corners" : ""}`}
                  style={{ background: isPrivate ? "var(--aero-panel)" : "var(--aero-deep)" }}
                >
                  <p
                    className="font-body text-[11px] font-medium tracking-[0.2em] uppercase mb-7"
                    style={{ color: isPrivate ? "var(--aero-cyan)" : "var(--aero-dim)" }}
                  >
                    {m.label}
                  </p>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={`${route.code}-${m.key}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.3, ease }}
                      className="font-display font-medium leading-none"
                      style={{ fontSize: "clamp(34px, 4vw, 48px)", color: "var(--aero-text)" }}
                    >
                      ≈ {fmtH(hours)}
                    </motion.p>
                  </AnimatePresence>
                  <p className="mt-3 font-body font-light text-[13px] leading-[1.6] text-[var(--aero-muted)]">
                    {m.sub}
                  </p>
                  {/* Barra proporcional, estilo pista */}
                  <div className="mt-7 h-px relative" style={{ background: "var(--aero-line)" }} aria-hidden>
                    <motion.div
                      className="absolute left-0 top-0 h-px"
                      style={{ background: isPrivate ? "var(--aero-cyan)" : "var(--aero-silver)", opacity: isPrivate ? 1 : 0.45 }}
                      animate={{ width: `${(hours / maxH) * 100}%` }}
                      transition={{ duration: 0.6, ease }}
                    />
                    {isPrivate && (
                      <motion.span
                        className="absolute top-1/2 -translate-y-1/2 h-[3px] w-[3px] rounded-full"
                        style={{ background: "var(--aero-cyan)" }}
                        animate={{ left: `calc(${(hours / maxH) * 100}% - 2px)` }}
                        transition={{ duration: 0.6, ease }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* Tiempo recuperado */}
        <Reveal delay={0.14}>
          <div
            className="mt-10 md:mt-12 flex flex-col md:flex-row md:items-center justify-between gap-8 p-8 md:p-10 aero-glass"
          >
            <div>
              <p className="font-body text-[11px] font-light tracking-[0.26em] uppercase text-[var(--aero-muted)] mb-3">
                {COPY.timeSaved.recoveredLabel}
              </p>
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={route.code}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease }}
                  className="font-display font-medium leading-none aero-text-cyan"
                  style={{ fontSize: "clamp(40px, 5.6vw, 64px)" }}
                >
                  ≈ {fmtH(saved)}
                </motion.p>
              </AnimatePresence>
              <p className="mt-3 font-body font-light text-[14px] leading-[1.7] text-[var(--aero-muted)] max-w-[420px]">
                {COPY.timeSaved.recoveredNote}
              </p>
            </div>
            <div className="shrink-0">
              <CyanButton href="#cotizar" label={`Cotizar ${route.city}`} variant="solid" />
            </div>
          </div>
        </Reveal>

        {/* Disclaimer */}
        <Reveal delay={0.18}>
          <p className="mt-6 font-body text-[12px] leading-[1.6] text-[var(--aero-dim)]">
            {COPY.timeSaved.disclaimer}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
