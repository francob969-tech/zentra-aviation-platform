import { SITE_NAME } from "@/lib/aero";

/** Marca minimalista: delta de vuelo en cian. */
export function BrandMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M16 4 L28 28 L16 22 L4 28 Z"
        stroke="var(--aero-cyan)"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <line x1="16" y1="11" x2="16" y2="22" stroke="var(--aero-cyan)" strokeOpacity="0.45" strokeWidth="1.2" />
      <circle cx="16" cy="6.5" r="1.4" fill="var(--aero-cyan)" />
    </svg>
  );
}

/** Marca + nombre. */
export function Wordmark({ size = 26 }: { size?: number }) {
  return (
    <span className="flex items-center gap-3">
      <BrandMark size={size} />
      <span className="font-display font-medium text-[14px] tracking-[0.14em] uppercase text-[var(--aero-text)]">
        {SITE_NAME}
      </span>
    </span>
  );
}
