interface Props {
  label: string;
  align?: "left" | "center";
  className?: string;
}

/** Kicker editorial: hairline champagne + etiqueta en versalitas sobrias (Inter). */
export default function Eyebrow({ label, align = "left", className = "" }: Props) {
  return (
    <div
      className={`flex items-center gap-4 ${
        align === "center" ? "justify-center" : ""
      } ${className}`}
    >
      <span
        aria-hidden
        className="h-px w-8 shrink-0"
        style={{ background: "var(--aero-cyan)" }}
      />
      <span className="font-body text-[11px] font-light tracking-[0.28em] uppercase text-[var(--aero-muted)]">
        {label}
      </span>
    </div>
  );
}
