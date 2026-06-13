"use client";
import { motion } from "framer-motion";
import RadarFlightPath from "@/components/aero/RadarFlightPath";
import CyanButton from "@/components/aero/ui/CyanButton";
import { buildWaLink, SITE_NAME, CTA, COPY } from "@/lib/aero";

const ease = [0.22, 1, 0.36, 1] as const;

/* Luces de pista: opacidades fijas (array estático — nada aleatorio en render) */
const RUNWAY_LIGHTS = [1, 0.82, 0.64, 0.48, 0.34, 0.22, 0.12];

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[100svh] flex items-center overflow-hidden"
      style={{ background: "var(--aero-void)" }}
    >
      {/* Atmósfera: grilla radar + resplandor de horizonte (solo CSS) */}
      <div aria-hidden className="absolute inset-0 pointer-events-none aero-hero-grid" />
      <div aria-hidden className="absolute inset-0 pointer-events-none aero-hero-glow" />

      {/* Gráfico: globo + trayectoria */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, delay: 0.3, ease }}
        className="absolute pointer-events-none
          inset-x-0 top-[36%] mx-auto w-[122vw] max-w-[520px] opacity-[0.16]
          lg:inset-y-0 lg:right-[-4%] lg:left-auto lg:top-1/2 lg:-translate-y-1/2 lg:mx-0
          lg:w-[50vw] lg:max-w-[760px] lg:opacity-90"
      >
        <RadarFlightPath />
      </motion.div>
      {/* Velo de legibilidad (monocromo, funcional) */}
      <div
        className="absolute inset-0 pointer-events-none hidden lg:block"
        style={{ background: "linear-gradient(100deg, var(--aero-void) 40%, transparent 74%)" }}
      />
      <div
        className="absolute inset-0 pointer-events-none lg:hidden"
        style={{ background: "linear-gradient(180deg, var(--aero-void) 32%, rgba(11,12,14,0.4) 56%, transparent 82%)" }}
      />

      {/* Contenido */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-20 pt-32 pb-24">
        <div className="max-w-[840px]">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease }}
            className="flex items-center gap-4 mb-10"
          >
            <span aria-hidden className="h-px w-12" style={{ background: "var(--aero-cyan)" }} />
            <span className="font-body text-[12px] font-light tracking-[0.34em] uppercase text-[var(--aero-muted)]">
              {COPY.hero.eyebrow}
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease }}
            className="font-display leading-[1.0] tracking-[-0.01em] text-[var(--aero-text)]"
            style={{ fontSize: "clamp(46px, 8vw, 104px)", fontWeight: 500 }}
          >
            {COPY.hero.h1Line1}
            <br />
            <span className="text-[var(--aero-muted)]">{COPY.hero.h1Muted}</span>
            <span className="aero-text-cyan">{COPY.hero.h1Accent}</span>
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease }}
            className="mt-10 font-body font-light text-[18px] md:text-[19px] leading-[1.8] text-[var(--aero-muted)] max-w-[560px]"
          >
            {COPY.hero.subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75, ease }}
            className="mt-12 flex flex-wrap items-center gap-5"
          >
            <CyanButton href="#cotizar" label={CTA.cotizar} variant="solid" />
            <CyanButton
              href={buildWaLink(`Hola ${SITE_NAME}, quiero cotizar un vuelo privado.`)}
              label={CTA.cotizarWhatsApp}
              variant="primary"
              target="_blank"
              rel="noopener noreferrer"
            />
            <CyanButton href="#destinos" label={CTA.verDestinos} variant="ghost" />
          </motion.div>

          {/* Disponibilidad */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mt-20 flex items-center gap-5 pt-9"
            style={{ borderTop: "1px solid var(--aero-line)" }}
          >
            {/* Luces de pista convergiendo */}
            <span aria-hidden className="flex items-center gap-[10px]">
              {RUNWAY_LIGHTS.map((o, i) => (
                <span
                  key={i}
                  className="h-[3px] w-[3px] rounded-full"
                  style={{ background: "var(--aero-cyan)", opacity: o }}
                />
              ))}
            </span>
            <span className="font-body text-[12px] font-light tracking-[0.26em] uppercase text-[var(--aero-muted)]">
              {COPY.hero.availability}
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
