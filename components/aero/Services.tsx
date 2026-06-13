"use client";
import { motion } from "framer-motion";
import SectionHeading from "@/components/aero/ui/SectionHeading";
import Reveal from "@/components/aero/ui/Reveal";
import { SERVICES, COPY } from "@/lib/aero";

export default function Services() {
  return (
    <section
      id="servicios"
      className="py-[140px] md:py-[200px]"
      style={{ background: "var(--aero-void)", scrollMarginTop: "76px" }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        <div className="max-w-[640px] mb-16 md:mb-20">
          <SectionHeading
            eyebrow={COPY.services.eyebrow}
            heading={<>{COPY.services.titlePre}<span className="aero-text-cyan">{COPY.services.titleAccent}</span></>}
            sub={COPY.services.sub}
          />
        </div>

        <div style={{ borderTop: "1px solid var(--aero-line)" }}>
          {SERVICES.map((s, i) => (
            <Reveal key={s.code} delay={i * 0.06}>
              <motion.a
                href="#cotizar"
                className="group grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-3 items-start py-8 md:py-9 px-1 md:px-4 cursor-pointer"
                style={{ borderBottom: "1px solid var(--aero-line)" }}
                whileHover={{ x: 6 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="md:col-span-1 font-body text-[12px] tracking-[0.1em] text-[var(--aero-dim)] pt-1">
                  {s.code}
                </span>
                <h3 className="md:col-span-4 font-display font-medium text-[22px] md:text-[26px] tracking-[-0.02em] text-[var(--aero-text)] leading-[1.2]">
                  {s.title}
                </h3>
                <p className="md:col-span-6 font-body text-[15px] leading-[1.7] text-[var(--aero-muted)] max-w-[460px]">
                  {s.desc}
                </p>
                <span
                  aria-hidden
                  className="hidden md:flex md:col-span-1 justify-end pt-1 text-[var(--aero-dim)] group-hover:text-[var(--aero-cyan)] transition-colors duration-200"
                >
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 text-[18px]">
                    &rarr;
                  </span>
                </span>
              </motion.a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
