import CyanButton from "@/components/aero/ui/CyanButton";
import Reveal from "@/components/aero/ui/Reveal";
import { buildWaLink, SITE_NAME, BASE, CTA, COPY } from "@/lib/aero";

export default function FinalCTA() {
  const waLink = buildWaLink(`Hola ${SITE_NAME}, quiero consultar disponibilidad para un vuelo.`);

  return (
    <section
      className="relative overflow-hidden py-[130px] md:py-[180px]"
      style={{ background: "var(--aero-deep)", borderTop: "1px solid var(--aero-line)" }}
    >
      {/* Fondo */}
      {/* sin glow de color — estética editorial plana */}
      {/* Trayectoria que cruza — estática */}
      <div
        className="absolute top-1/2 left-0 right-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(to right, transparent, rgba(127,217,236,0.22), transparent)" }}
        aria-hidden
      />

      <div className="relative max-w-[1000px] mx-auto px-6 text-center">
        <Reveal>
          <div className="flex items-center justify-center gap-3 mb-8">
            <span aria-hidden className="h-px w-8" style={{ background: "linear-gradient(to right, transparent, var(--aero-cyan))" }} />
            <span className="font-body text-[11px] font-light tracking-[0.28em] uppercase text-[var(--aero-muted)]">
              {COPY.finalCta.eyebrow}
            </span>
            <span aria-hidden className="h-px w-8" style={{ background: "linear-gradient(to left, transparent, var(--aero-cyan))" }} />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h2
            className="font-display font-medium tracking-[-0.01em] leading-[1.06] text-[var(--aero-text)]"
            style={{ fontSize: "clamp(36px, 6.4vw, 76px)" }}
          >
            {COPY.finalCta.titleLine1}
            <br className="hidden sm:block" />{COPY.finalCta.titleLine2}
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-7 font-body text-[17px] leading-[1.75] text-[var(--aero-muted)] max-w-[520px] mx-auto">
            {COPY.finalCta.subPre}{BASE.icao}{COPY.finalCta.subPost}
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-11 flex flex-wrap items-center justify-center gap-4">
            <CyanButton href="#cotizar" label={CTA.cotizar} variant="solid" />
            <CyanButton href={waLink} label={CTA.whatsapp} variant="primary" target="_blank" rel="noopener noreferrer" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
