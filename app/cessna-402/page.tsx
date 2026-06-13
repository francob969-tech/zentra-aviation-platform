import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Motion from "@/components/aero/ui/Motion";
import LandingRuntime from "@/components/aero/ui/LandingRuntime";
import AeroNav from "@/components/aero/AeroNav";
import AeroFooter from "@/components/aero/AeroFooter";
import WhatsAppFloat from "@/components/aero/WhatsAppFloat";
import SectionHeading from "@/components/aero/ui/SectionHeading";
import Eyebrow from "@/components/aero/ui/Eyebrow";
import Reveal from "@/components/aero/ui/Reveal";
import CyanButton from "@/components/aero/ui/CyanButton";
import AircraftSchematic from "@/components/aero/AircraftSchematic";
import AircraftGallery from "@/components/aero/AircraftGallery";
import {
  AIRCRAFT_EXPERIENCE as EXPERIENCE,
  AIRCRAFT_OPERATIONS as OPERATIONS,
  AIRCRAFT_SAFETY as SAFETY,
  AIRCRAFT_SPECS as specs,
  AIRCRAFT_SEO,
  CTA,
  SECTIONS,
  COPY,
} from "@/lib/aero";

/* ─────────────────────────────────────────────────────────────
   /cessna-402 — página dedicada de la aeronave.
   Regla editorial: NINGUNA cifra inventada (velocidad, alcance,
   consumo, capacidad, certificaciones). Todo cualitativo y cauto;
   los datos duros se confirman en la cotización.
   ───────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: AIRCRAFT_SEO.title,
  description: AIRCRAFT_SEO.description,
  alternates: { canonical: "/cessna-402" },
  openGraph: {
    title: AIRCRAFT_SEO.title,
    description: AIRCRAFT_SEO.ogDescription,
    type: "website",
    url: "/cessna-402",
  },
};

/* Contenido (experiencia, operaciones, seguridad, specs) en lib/aero.ts.
   Regla editorial: ninguna cifra inventada; todo cualitativo y cauto. */

export default function Cessna402Page() {
  // Flag de plataforma: si la página de aeronave está desactivada, 404.
  if (!SECTIONS.aircraftPage) notFound();
  return (
    <div className="aero-root min-h-screen">
      <LandingRuntime />
      <Motion>
        <AeroNav />
        <main>
          {/* ── 1 · Hero ── */}
          <section className="relative pt-[170px] md:pt-[220px] pb-[100px] md:pb-[140px] overflow-hidden" style={{ background: "var(--aero-void)" }}>
            <div aria-hidden className="absolute inset-0 pointer-events-none aero-hero-grid" />
            <div aria-hidden className="absolute inset-0 pointer-events-none aero-hero-glow" />
            <div className="relative max-w-[1440px] mx-auto px-6 md:px-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
                <div>
                  <Reveal>
                    <Eyebrow label={COPY.aircraftPage.heroEyebrow} className="mb-7" />
                    <h1
                      className="font-display font-medium leading-[1.05] tracking-[-0.015em] text-[var(--aero-text)]"
                      style={{ fontSize: "clamp(40px, 6.2vw, 84px)" }}
                    >
                      {COPY.aircraftPage.h1Pre}<span className="aero-text-cyan">{COPY.aircraftPage.h1Accent}</span>{COPY.aircraftPage.h1Post}
                    </h1>
                  </Reveal>
                  <Reveal delay={0.12}>
                    <p className="mt-8 font-body font-light text-[17px] md:text-[18px] leading-[1.8] text-[var(--aero-muted)] max-w-[520px]">
                      {COPY.aircraftPage.heroSubtitle}
                    </p>
                  </Reveal>
                  <Reveal delay={0.2} className="mt-10 flex flex-wrap items-center gap-5">
                    <CyanButton href="/#cotizar" label={CTA.consultarDisponibilidad} variant="solid" />
                    <CyanButton href="/#destinos" label={CTA.verDestinos} variant="ghost" />
                  </Reveal>
                </div>
                <Reveal delay={0.15}>
                  <div className="aspect-square max-w-[460px] mx-auto">
                    <AircraftSchematic />
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          {/* ── 2 · Overview ── */}
          <section className="py-[110px] md:py-[150px]" style={{ background: "var(--aero-deep)", borderTop: "1px solid var(--aero-line)" }}>
            <div className="max-w-[1440px] mx-auto px-6 md:px-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-24 items-start">
                <SectionHeading
                  eyebrow={COPY.aircraftPage.overviewEyebrow}
                  heading={<>{COPY.aircraftPage.overviewTitlePre}<span className="aero-text-cyan">{COPY.aircraftPage.overviewTitleAccent}</span></>}
                  sub={COPY.aircraftPage.overviewSub}
                />
                <Reveal delay={0.1}>
                  <dl style={{ borderTop: "1px solid var(--aero-line)" }}>
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
                  <p className="mt-6 font-body text-[13px] leading-[1.7] text-[var(--aero-dim)]">
                    {COPY.aircraftPage.overviewSpecsNote}
                  </p>
                </Reveal>
              </div>
            </div>
          </section>

          {/* ── 3 · Experiencia del pasajero ── */}
          <section className="py-[110px] md:py-[150px]" style={{ background: "var(--aero-void)", borderTop: "1px solid var(--aero-line)" }}>
            <div className="max-w-[1440px] mx-auto px-6 md:px-16">
              <div className="max-w-[640px] mb-14 md:mb-16">
                <SectionHeading
                  eyebrow={COPY.aircraftPage.experienceEyebrow}
                  heading={<>{COPY.aircraftPage.experienceTitlePre}<span className="aero-text-cyan">{COPY.aircraftPage.experienceTitleAccent}</span></>}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: "var(--aero-line)", border: "1px solid var(--aero-line)" }}>
                {EXPERIENCE.map((e, i) => (
                  <Reveal key={e.title} delay={i * 0.08} className="h-full">
                    <div className="h-full p-9 md:p-11" style={{ background: "var(--aero-void)" }}>
                      <h3 className="font-display font-medium text-[23px] md:text-[26px] tracking-[-0.01em] text-[var(--aero-text)] mb-4 leading-[1.2]">
                        {e.title}
                      </h3>
                      <p className="font-body font-light text-[15px] leading-[1.8] text-[var(--aero-muted)]">
                        {e.desc}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── 4 · Perfil operativo ── */}
          <section className="py-[110px] md:py-[150px]" style={{ background: "var(--aero-deep)", borderTop: "1px solid var(--aero-line)" }}>
            <div className="max-w-[1440px] mx-auto px-6 md:px-16">
              <div className="max-w-[640px] mb-14 md:mb-16">
                <SectionHeading
                  eyebrow={COPY.aircraftPage.operationsEyebrow}
                  heading={<>{COPY.aircraftPage.operationsTitlePre}<span className="aero-text-cyan">{COPY.aircraftPage.operationsTitleAccent}</span></>}
                />
              </div>
              <div style={{ borderTop: "1px solid var(--aero-line)" }}>
                {OPERATIONS.map((o, i) => (
                  <Reveal key={o.code} delay={i * 0.06}>
                    <div
                      className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-3 items-start py-8 md:py-9 px-1 md:px-4"
                      style={{ borderBottom: "1px solid var(--aero-line)" }}
                    >
                      <span className="md:col-span-1 font-body text-[12px] tracking-[0.1em] text-[var(--aero-dim)] pt-1">
                        {o.code}
                      </span>
                      <h3 className="md:col-span-4 font-display font-medium text-[22px] md:text-[26px] tracking-[-0.02em] text-[var(--aero-text)] leading-[1.2]">
                        {o.title}
                      </h3>
                      <p className="md:col-span-7 font-body text-[15px] leading-[1.7] text-[var(--aero-muted)] max-w-[520px]">
                        {o.desc}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── 5 · Seguridad ── */}
          <section className="py-[110px] md:py-[150px]" style={{ background: "var(--aero-void)", borderTop: "1px solid var(--aero-line)" }}>
            <div className="max-w-[1440px] mx-auto px-6 md:px-16">
              <div className="max-w-[640px] mb-14 md:mb-16">
                <SectionHeading
                  eyebrow={COPY.aircraftPage.safetyEyebrow}
                  heading={<>{COPY.aircraftPage.safetyTitlePre}<span className="aero-text-cyan">{COPY.aircraftPage.safetyTitleAccent}</span></>}
                  sub={COPY.aircraftPage.safetySub}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px" style={{ background: "var(--aero-line)", border: "1px solid var(--aero-line)" }}>
                {SAFETY.map((s, i) => (
                  <Reveal key={s.title} delay={(i % 2) * 0.08} className="h-full">
                    <div className="h-full p-9 md:p-11" style={{ background: "var(--aero-void)" }}>
                      <h3 className="font-display font-medium text-[22px] md:text-[24px] tracking-[-0.01em] text-[var(--aero-text)] mb-4 leading-[1.2]">
                        {s.title}
                      </h3>
                      <p className="font-body font-light text-[15px] leading-[1.8] text-[var(--aero-muted)]">
                        {s.desc}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── 6 · Galería (placeholders hasta tener fotos reales) ── */}
          <section className="py-[110px] md:py-[150px]" style={{ background: "var(--aero-deep)", borderTop: "1px solid var(--aero-line)" }}>
            <div className="max-w-[1440px] mx-auto px-6 md:px-16">
              <div className="max-w-[640px] mb-4">
                <SectionHeading
                  eyebrow={COPY.aircraftPage.galleryEyebrow}
                  heading={<>{COPY.aircraftPage.galleryTitlePre}<span className="aero-text-cyan">{COPY.aircraftPage.galleryTitleAccent}</span></>}
                  sub={COPY.aircraftPage.gallerySub}
                />
              </div>
              <Reveal delay={0.1}>
                <AircraftGallery />
              </Reveal>
            </div>
          </section>

          {/* ── 7 · CTA final ── */}
          <section className="py-[110px] md:py-[150px]" style={{ background: "var(--aero-void)", borderTop: "1px solid var(--aero-line)" }}>
            <div className="max-w-[1000px] mx-auto px-6 text-center">
              <Reveal>
                <h2
                  className="font-display font-medium tracking-[-0.01em] leading-[1.06] text-[var(--aero-text)]"
                  style={{ fontSize: "clamp(34px, 5.6vw, 68px)" }}
                >
                  {COPY.aircraftPage.finalTitlePre}<span className="aero-text-cyan">{COPY.aircraftPage.finalTitleAccent}</span>
                </h2>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="mt-7 font-body font-light text-[16px] leading-[1.8] text-[var(--aero-muted)] max-w-[480px] mx-auto">
                  {COPY.aircraftPage.finalSub}
                </p>
              </Reveal>
              <Reveal delay={0.25}>
                <div className="mt-11 flex flex-wrap items-center justify-center gap-4">
                  <CyanButton href="/#cotizar" label={CTA.consultarDisponibilidad} variant="solid" />
                </div>
              </Reveal>
            </div>
          </section>
        </main>
        <AeroFooter />
        <WhatsAppFloat />
      </Motion>
    </div>
  );
}
