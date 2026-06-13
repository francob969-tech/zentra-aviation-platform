"use client";
import { motion } from "framer-motion";
import SectionHeading from "@/components/aero/ui/SectionHeading";
import Reveal from "@/components/aero/ui/Reveal";
import RouteMap from "@/components/aero/RouteMap";
import { DESTINATIONS, SECTIONS, COPY } from "@/lib/aero";

export default function Destinations() {
  return (
    <section
      id="destinos"
      className="py-[140px] md:py-[200px]"
      style={{ background: "var(--aero-void)", scrollMarginTop: "76px" }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        <div className={`grid grid-cols-1 gap-14 lg:gap-20 items-center ${SECTIONS.routeMap ? "lg:grid-cols-2" : ""}`}>
          {/* Mapa (flag de plataforma: routeMap) */}
          {SECTIONS.routeMap && (
            <Reveal y={28}>
              <div
                className="aero-corners relative aspect-[100/92] rounded-sm overflow-hidden"
                style={{ border: "1px solid var(--aero-line)" }}
              >
                <RouteMap className="relative" />
              </div>
            </Reveal>
          )}

          {/* Lista */}
          <div>
            <SectionHeading
              eyebrow={COPY.destinations.eyebrow}
              heading={<>{COPY.destinations.titlePre}<span className="aero-text-cyan">{COPY.destinations.titleAccent}</span></>}
              sub={COPY.destinations.sub}
            />

            <div className="mt-10" style={{ borderTop: "1px solid var(--aero-line)" }}>
              {DESTINATIONS.map((d, i) => (
                <Reveal key={d.icao} delay={i * 0.05}>
                  <motion.a
                    href="#cotizar"
                    aria-label={`Cotizar vuelo a ${d.city}`}
                    className="group flex items-center justify-between py-4 gap-4"
                    style={{ borderBottom: "1px solid var(--aero-line)" }}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="font-display font-medium text-[18px] text-[var(--aero-text)] group-hover:text-[var(--aero-cyan)] transition-colors duration-200">
                        {d.city}
                      </span>
                      <span className="font-body text-[12px] text-[var(--aero-dim)]">
                        {d.region}
                      </span>
                    </div>
                    <span className="font-body text-[12px] tracking-[0.12em] text-[var(--aero-muted)]">
                      {d.icao}
                    </span>
                  </motion.a>
                </Reveal>
              ))}

              {/* Privados */}
              <Reveal delay={DESTINATIONS.length * 0.05}>
                <div
                  className="flex items-center justify-between py-4 gap-4"
                  style={{ borderBottom: "1px solid var(--aero-line)" }}
                >
                  <span className="font-display font-medium text-[18px] text-[var(--aero-muted)]">
                    {COPY.destinations.privateLabel}
                  </span>
                  <span className="font-body text-[12px] tracking-[0.12em] text-[var(--aero-dim)]">
                    PVT
                  </span>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.1}>
              <p className="mt-7 font-body text-[14px] leading-[1.7] text-[var(--aero-dim)]">
                {COPY.destinations.closing}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
