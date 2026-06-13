"use client";
import { motion } from "framer-motion";
import SectionHeading from "@/components/aero/ui/SectionHeading";
import Reveal from "@/components/aero/ui/Reveal";
import { WHY_US, COPY, CTA } from "@/lib/aero";

export default function WhyUs() {
  return (
    <section
      id="por-que"
      className="py-[140px] md:py-[200px] relative overflow-hidden"
      style={{ background: "var(--aero-deep)", borderTop: "1px solid var(--aero-line)", scrollMarginTop: "76px" }}
    >
      {/* sin glow de color — estética editorial plana */}

      <div className="relative max-w-[1440px] mx-auto px-6 md:px-16">
        <div className="max-w-[640px] mb-16 md:mb-20">
          <SectionHeading
            eyebrow={COPY.whyUs.eyebrow}
            heading={<>{COPY.whyUs.titlePre}<span className="aero-text-cyan">{COPY.whyUs.titleAccent}</span>{COPY.whyUs.titlePost}</>}
            sub={COPY.whyUs.sub}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px"
          style={{ background: "var(--aero-line)", border: "1px solid var(--aero-line)" }}>
          {WHY_US.map((w, i) => (
            <Reveal key={w.code} delay={(i % 3) * 0.08} className="h-full">
              <motion.div
                className="h-full p-9 md:p-12"
                style={{ background: "var(--aero-deep)" }}
                whileHover={{ backgroundColor: "#0C141C" }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-display font-medium text-[24px] md:text-[27px] tracking-[-0.01em] text-[var(--aero-text)] mb-4 leading-[1.2]">
                  {w.title}
                </h3>
                <p className="font-body font-light text-[15px] leading-[1.8] text-[var(--aero-muted)]">
                  {w.desc}
                </p>
              </motion.div>
            </Reveal>
          ))}

          {/* Celda final de cierre */}
          <Reveal delay={0.16} className="h-full">
            <div
              className="h-full p-9 md:p-10 flex flex-col justify-between"
              style={{ background: "var(--aero-deep)" }}
            >
              <span className="font-body text-[11px] font-light tracking-[0.22em] uppercase text-[var(--aero-muted)]">
                {COPY.whyUs.nextLabel}
              </span>
              <div>
                <p className="font-display font-medium text-[20px] tracking-[-0.02em] text-[var(--aero-text)] mb-4 leading-[1.3]">
                  {COPY.whyUs.nextTitle}
                </p>
                <a
                  href="#cotizar"
                  className="inline-flex items-center gap-2 font-body font-medium text-[12px] tracking-[0.1em] uppercase text-[var(--aero-cyan)] group"
                >
                  {CTA.cotizar}
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
