import Link from "next/link";
import { BrandMark } from "@/components/aero/ui/Logo";
import StudioSignature from "@/components/StudioSignature";
import {
  SITE_NAME,
  SITE_TAGLINE,
  BASE,
  CONTACT_EMAIL,
  LEGAL,
  SECTIONS,
  buildWaLink,
} from "@/lib/aero";

// Rutas absolutas para que el footer funcione también desde /cessna-402.
// El link a la aeronave se oculta si la página está desactivada (flag).
const nav = [
  { label: "Servicios", href: "/#servicios" },
  { label: "La aeronave · Cessna 402", href: "/cessna-402" },
  { label: "Destinos", href: "/#destinos" },
  { label: "Por qué elegirnos", href: "/#por-que" },
  { label: "Cotizar vuelo", href: "/#cotizar" },
].filter((l) => SECTIONS.aircraftPage || l.href !== "/cessna-402");

export default function AeroFooter() {
  const year = new Date().getFullYear();
  const waLink = buildWaLink(`Hola ${SITE_NAME}, quiero consultar por un vuelo privado.`);

  return (
    <footer style={{ background: "var(--aero-void)", borderTop: "1px solid var(--aero-line)" }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Marca */}
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-3 mb-5" aria-label={SITE_NAME}>
              <BrandMark size={24} />
              <span className="font-display font-medium text-[14px] tracking-[0.14em] uppercase text-[var(--aero-text)]">
                {SITE_NAME}
              </span>
            </Link>
            <p className="font-body text-[14px] leading-[1.75] text-[var(--aero-muted)] max-w-[300px]">
              {SITE_TAGLINE} desde el {BASE.name}. Vuelos regionales directos,
              flexibles y a demanda.
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--aero-cyan)" }} aria-hidden />
              <span className="font-body text-[10px] tracking-[0.2em] uppercase text-[var(--aero-dim)]">
                {BASE.icao} · {BASE.coords}
              </span>
            </div>
          </div>

          {/* Navegación */}
          <div className="md:col-span-3">
            <h4 className="font-body text-[10px] tracking-[0.2em] uppercase text-[var(--aero-dim)] mb-5">
              Navegación
            </h4>
            <ul className="flex flex-col gap-3">
              {nav.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="font-body text-[14px] text-[var(--aero-muted)] hover:text-[var(--aero-text)] transition-colors duration-200">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div className="md:col-span-4">
            <h4 className="font-body text-[10px] tracking-[0.2em] uppercase text-[var(--aero-dim)] mb-5">
              Contacto
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="font-body text-[14px] text-[var(--aero-muted)] hover:text-[var(--aero-cyan)] transition-colors duration-200">
                  WhatsApp →
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-body text-[14px] text-[var(--aero-muted)] hover:text-[var(--aero-cyan)] transition-colors duration-200 break-all">
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li className="font-body text-[14px] text-[var(--aero-muted)]">
                {BASE.name}
              </li>
            </ul>
          </div>
        </div>

        <div className="h-px my-12" style={{ background: "var(--aero-line)" }} aria-hidden />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-body text-[12px] text-[var(--aero-dim)] tracking-[0.02em]">
              © {year} {SITE_NAME} · Taxi aéreo privado · Buenos Aires, Argentina
            </p>
            {/* Aviso global cauto — siempre visible, protege con redacción prudente */}
            <p className="mt-2 font-body text-[11px] leading-[1.6] text-[var(--aero-dim)] max-w-[460px]">
              Servicio sujeto a disponibilidad. Operaciones coordinadas según
              normativa aplicable. Tiempos y condiciones estimados; se confirman
              al consultar disponibilidad.
            </p>
            {/* Datos del operador — se muestran solo si están cargados en lib/aero.ts (LEGAL) */}
            {(LEGAL.razonSocial || LEGAL.cuit || LEGAL.anac || LEGAL.matricula) && (
              <p className="mt-2 font-body text-[11px] text-[var(--aero-dim)] tracking-[0.02em]">
                {[
                  LEGAL.razonSocial,
                  LEGAL.cuit && `CUIT ${LEGAL.cuit}`,
                  LEGAL.anac && `Habilitación ANAC ${LEGAL.anac}`,
                  LEGAL.matricula && `Matrícula ${LEGAL.matricula}`,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
          </div>
          <p className="font-body text-[10px] tracking-[0.18em] uppercase text-[var(--aero-dim)]">
            Vuelos privados a demanda
          </p>
        </div>

        {/* Firma del estudio — abajo a la derecha */}
        <div className="mt-8 flex justify-end">
          <StudioSignature />
        </div>
      </div>
    </footer>
  );
}
