import Image from "next/image";
import { AIRCRAFT_GALLERY as PHOTOS } from "@/lib/aero";

/* ─────────────────────────────────────────────────────────────
   Galería de la aeronave — placeholders a la espera de fotos reales.
   Contenido en lib/aero.ts (AIRCRAFT_GALLERY): completar `src` con rutas
   en public/aircraft/ cuando lleguen las fotos.
   ───────────────────────────────────────────────────────────── */

export default function AircraftGallery() {
  return (
    <div className="mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-4">
      {PHOTOS.map((p) => (
        <figure key={p.label} className="m-0">
          <div
            className="relative aspect-[4/3] overflow-hidden flex items-center justify-center"
            style={{ background: "var(--aero-panel)", border: "1px solid var(--aero-line)" }}
          >
            {p.src ? (
              <Image src={p.src} alt={p.alt} fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" />
            ) : (
              <div
                className="absolute inset-3 flex flex-col items-center justify-center gap-3"
                style={{ border: "1px dashed var(--aero-cyan-dim)" }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--aero-dim)" strokeWidth="1.2" aria-hidden>
                  <rect x="3" y="5" width="18" height="14" rx="1" />
                  <circle cx="9" cy="10" r="1.6" />
                  <path d="M3 17l5-4 4 3 4-5 5 6" />
                </svg>
                <span className="font-body text-[10px] tracking-[0.22em] uppercase text-[var(--aero-dim)]">
                  Foto pendiente
                </span>
              </div>
            )}
          </div>
          <figcaption className="mt-3 font-body text-[11px] tracking-[0.18em] uppercase text-[var(--aero-muted)]">
            {p.label}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
