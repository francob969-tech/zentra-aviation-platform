import SectionHeading from "@/components/aero/ui/SectionHeading";
import { FAQS, COPY } from "@/lib/aero";

/* Contenido en lib/aero.ts (FAQS). El JSON-LD se deriva del mismo array. */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function Faq() {
  return (
    <section
      id="faq"
      className="py-[120px] md:py-[160px]"
      style={{ background: "var(--aero-deep)", borderTop: "1px solid var(--aero-line)", scrollMarginTop: "76px" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(280px,420px)_1fr] gap-12 lg:gap-20 items-start">
          <SectionHeading
            eyebrow={COPY.faq.eyebrow}
            heading={<>{COPY.faq.titlePre}<span className="aero-text-cyan">{COPY.faq.titleAccent}</span></>}
            sub={COPY.faq.sub}
          />

          <div style={{ borderTop: "1px solid var(--aero-line)" }}>
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="group"
                style={{ borderBottom: "1px solid var(--aero-line)" }}
              >
                <summary className="flex items-center justify-between gap-6 py-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <span className="font-display font-medium text-[19px] md:text-[21px] tracking-[-0.01em] text-[var(--aero-text)] leading-[1.3]">
                    {f.q}
                  </span>
                  <span
                    aria-hidden
                    className="shrink-0 text-[20px] leading-none text-[var(--aero-muted)] transition-transform duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="pb-7 pr-10 font-body text-[15px] leading-[1.8] text-[var(--aero-muted)] max-w-[640px]">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
