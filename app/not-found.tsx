import Link from "next/link";
import { SITE_NAME } from "@/lib/aero";

export default function NotFound() {
  return (
    <div
      className="aero-root min-h-screen flex items-center justify-center px-6"
      style={{ background: "var(--aero-void)" }}
    >
      <div className="text-center max-w-[480px]">
        <p className="font-body text-[12px] font-light tracking-[0.34em] uppercase text-[var(--aero-muted)] mb-6">
          {SITE_NAME}
        </p>
        <h1
          className="font-display font-medium tracking-[-0.01em] text-[var(--aero-text)] leading-[1.05]"
          style={{ fontSize: "clamp(40px, 8vw, 72px)" }}
        >
          Ruta <span className="aero-text-cyan">no encontrada.</span>
        </h1>
        <p className="mt-6 font-body text-[16px] leading-[1.8] text-[var(--aero-muted)]">
          La página que buscás no existe o cambió de destino.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-10 px-7 py-4 font-body font-medium text-[12px] tracking-[0.14em] uppercase"
          style={{ background: "var(--aero-cyan)", color: "#04111A" }}
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
