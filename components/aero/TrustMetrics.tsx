"use client";
import Reveal from "@/components/aero/ui/Reveal";
import { TRUST_METRICS } from "@/lib/aero";

export default function TrustMetrics() {
  return (
    <section
      className="relative"
      style={{ background: "var(--aero-deep)", borderTop: "1px solid var(--aero-line)", borderBottom: "1px solid var(--aero-line)" }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {TRUST_METRICS.map((m, i) => (
            <Reveal
              key={m.code}
              delay={i * 0.1}
              className="py-11 md:py-14 md:px-10 first:md:pl-0 last:md:pr-0
                border-t md:border-t-0 md:border-l first:border-t-0 md:first:border-l-0
                border-[color:var(--aero-line)]"
            >
              <span className="block font-body text-[11px] font-light tracking-[0.24em] uppercase text-[var(--aero-muted)] mb-6">
                {m.code}
              </span>
              <p className="font-display font-medium text-[24px] md:text-[27px] tracking-[-0.01em] text-[var(--aero-text)] mb-2.5 leading-[1.2]">
                {m.value}
              </p>
              <p className="font-body font-light text-[14px] leading-[1.7] text-[var(--aero-muted)]">
                {m.sub}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
