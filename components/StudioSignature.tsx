/**
 * StudioSignature — firma de Zentra Studio para el pie de cada sitio.
 *
 * Formato: "Built by Zentra Studio →" — el nombre va en el naranja de la marca
 * Zentra, subrayado, y enlaza a studio-zentra.com. El resto en gris neutro con
 * alpha, así funciona sobre cualquier footer oscuro (aero, brokerage…).
 * El estilo del enlace vive en globals.css (.studio-sig-link).
 *
 * Reutilizable: dropeá <StudioSignature /> alineado a la derecha en el footer.
 */
import { STUDIO } from "@/lib/aero";

export default function StudioSignature({ className = "" }: { className?: string }) {
  return (
    <p
      className={`font-body text-[13px] tracking-[0.02em] leading-none ${className}`}
      style={{ color: "rgba(233, 241, 246, 0.45)" }}
    >
      Built by{" "}
      <a
        href={STUDIO.url}
        target="_blank"
        rel="noopener noreferrer"
        className="studio-sig-link"
      >
        {STUDIO.name}
      </a>{" "}
      <span aria-hidden="true">→</span>
    </p>
  );
}
