"use client";
import SectionHeading from "@/components/aero/ui/SectionHeading";
import Reveal from "@/components/aero/ui/Reveal";
import { PROCESS as STEPS, COPY } from "@/lib/aero";

/* ─────────────────────────────────────────────────────────────
   Process — flujo concierge "De la consulta al despegue".
   Cuatro pasos sobre una línea de tiempo continua (hairline + nodos),
   tono ejecutivo y concreto: el proceso es simple y eso genera confianza.
   Contenido en lib/aero.ts (PROCESS).
   ───────────────────────────────────────────────────────────── */

export default function Process() {
  return (
    <section
      id="proceso"
      className="py-[140px] md:py-[200px]"
      style={{ background: "var(--aero-deep)", borderTop: "1px solid var(--aero-line)", scrollMarginTop: "76px" }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        <div className="max-w-[640px] mb-16 md:mb-24">
          <SectionHeading
            eyebrow={COPY.process.eyebrow}
            heading={<>{COPY.process.titlePre}<span className="aero-text-cyan">{COPY.process.titleAccent}</span></>}
            sub={COPY.process.sub}
          />
        </div>

        {/* Línea de tiempo: los border-top de cada paso se unen en una línea
            continua (sin gap horizontal); cada nodo es una luz sobre la pista. */}
        <div className="grid grid-cols-1 md:grid-cols-4">
          {STEPS.map((s, i) => {
            const last = i === STEPS.length - 1;
            return (
              <Reveal key={s.code} delay={i * 0.12} className="relative">
                <div
                  className="relative pt-9 pb-12 md:pb-0 pr-0 md:pr-10"
                  style={{ borderTop: "1px solid var(--aero-line)" }}
                >
                  {/* Nodo sobre la línea */}
                  <span
                    aria-hidden
                    className="absolute left-0 -top-[3.5px] h-[7px] w-[7px] rounded-full"
                    style={{
                      background: last ? "var(--aero-cyan)" : "var(--aero-deep)",
                      border: "1px solid var(--aero-cyan)",
                      boxShadow: last ? "0 0 12px rgba(127, 217, 236, 0.45)" : "none",
                    }}
                  />
                  {/* Delta de despegue al final de la pista */}
                  {last && (
                    <svg
                      aria-hidden
                      className="absolute right-0 -top-[6px] hidden md:block"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path d="M1 11 L11 1 M11 1 H5.5 M11 1 V6.5" stroke="var(--aero-cyan)" strokeWidth="1" strokeLinecap="round" />
                    </svg>
                  )}

                  <span className="block font-body text-[12px] tracking-[0.22em] text-[var(--aero-dim)] mb-5">
                    {s.code}
                  </span>
                  <h3 className="font-display font-medium text-[24px] md:text-[27px] tracking-[-0.01em] text-[var(--aero-text)] leading-[1.2] mb-4">
                    {s.title}
                  </h3>
                  <p className="font-body font-light text-[14px] leading-[1.8] text-[var(--aero-muted)] max-w-[280px]">
                    {s.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
