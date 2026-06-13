"use client";
import { motion } from "framer-motion";
import SectionHeading from "@/components/aero/ui/SectionHeading";
import Reveal from "@/components/aero/ui/Reveal";
import CyanButton from "@/components/aero/ui/CyanButton";
import AircraftSchematic from "@/components/aero/AircraftSchematic";
import AircraftGallery from "@/components/aero/AircraftGallery";
import { AIRCRAFT, CTA, SECTIONS, COPY } from "@/lib/aero";

const specs = [
  { k: "Tipo", v: "Bimotor a pistón" },
  { k: "Categoría", v: "Transporte regional liviano" },
  { k: "Configuración", v: "Cabina ejecutiva privada" },
  { k: "Operación", v: "Vuelos privados a demanda" },
];

export default function Aircraft() {
  return (
    <section
      id="aeronave"
      className="py-[140px] md:py-[200px] relative overflow-hidden"
      style={{ background: "var(--aero-deep)", borderTop: "1px solid var(--aero-line)", scrollMarginTop: "76px" }}
    >
      <div className="relative max-w-[1440px] mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Esquema */}
          <Reveal y={30} className="order-2 lg:order-1">
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="aspect-square max-w-[480px] mx-auto"
              >
                <AircraftSchematic />
              </motion.div>
              {/* sin glow de color — estética editorial plana */}
            </div>
          </Reveal>

          {/* Texto */}
          <div className="order-1 lg:order-2">
            <SectionHeading
              eyebrow={COPY.aircraftHome.eyebrow}
              heading={<>{COPY.aircraftHome.titleLine1}<br /><span className="aero-text-cyan">{COPY.aircraftHome.titleAccent}</span></>}
            />
            <Reveal delay={0.1}>
              <p className="mt-6 font-body text-[17px] leading-[1.8] text-[var(--aero-muted)] max-w-[520px]">
                {AIRCRAFT.description}{COPY.aircraftHome.intro}
              </p>
            </Reveal>

            {/* Especificaciones cautas */}
            <Reveal delay={0.18} className="mt-10" style={{ borderTop: "1px solid var(--aero-line)" }}>
              <dl>
                {specs.map((s) => (
                  <div
                    key={s.k}
                    className="flex items-center justify-between py-4 gap-6"
                    style={{ borderBottom: "1px solid var(--aero-line)" }}
                  >
                    <dt className="font-body text-[11px] tracking-[0.16em] uppercase text-[var(--aero-dim)]">
                      {s.k}
                    </dt>
                    <dd className="font-body text-[15px] text-[var(--aero-text)] text-right">
                      {s.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.24}>
              <p className="mt-6 font-body text-[13px] leading-[1.7] text-[var(--aero-dim)] max-w-[480px]">
                {COPY.aircraftHome.specsNote}
              </p>
            </Reveal>

            <Reveal delay={0.3} className="mt-9 flex flex-wrap items-center gap-4">
              <CyanButton href="#cotizar" label={CTA.consultarDisponibilidad} variant="primary" />
              {SECTIONS.aircraftPage && (
                <CyanButton href="/cessna-402" label={CTA.conocerAeronave} variant="ghost" />
              )}
            </Reveal>
          </div>
        </div>

        {/* Fotos reales de la aeronave (placeholders hasta que las pase el cliente) */}
        <Reveal delay={0.1}>
          <AircraftGallery />
        </Reveal>
      </div>
    </section>
  );
}
