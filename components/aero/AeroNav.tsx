"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Wordmark } from "@/components/aero/ui/Logo";
import { buildWaLink, SITE_NAME, SECTIONS } from "@/lib/aero";

// Rutas absolutas ("/#sección") para que funcionen también desde subpáginas
// como /cessna-402. En la home, el navegador las trata como anclas normales.
// El link a la aeronave se oculta si la página está desactivada (flag).
const links = [
  { href: "/#servicios", label: "Servicios" },
  { href: "/cessna-402", label: "Aeronave" },
  { href: "/#destinos", label: "Destinos" },
  { href: "/#por-que", label: "Por qué" },
  { href: "/#cotizar", label: "Cotizar" },
].filter((l) => SECTIONS.aircraftPage || l.href !== "/cessna-402");

export default function AeroNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menú móvil: cerrar con Escape (devolviendo el foco al botón) y llevar el
  // foco al primer enlace al abrir.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        burgerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const waLink = buildWaLink(
    `Hola ${SITE_NAME}, quiero consultar por un vuelo privado.`
  );

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? "rgba(5, 8, 14, 0.82)" : "transparent",
          backdropFilter: scrolled ? "blur(18px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(18px)" : "none",
          borderBottom: scrolled
            ? "1px solid var(--aero-line)"
            : "1px solid transparent",
        }}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 h-[76px] flex items-center justify-between">
          <Link href="/" aria-label={SITE_NAME} className="group">
            <Wordmark />
          </Link>

          <nav className="hidden lg:flex items-center gap-9" aria-label="Navegación principal">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="aero-navlink font-body text-[12px] font-medium tracking-[0.1em] uppercase text-[var(--aero-muted)] hover:text-[var(--aero-text)] transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 px-5 py-2.5 font-body text-[11px] font-medium tracking-[0.12em] uppercase text-[var(--aero-cyan)] border border-[var(--aero-cyan)] hover:bg-[var(--aero-cyan)] hover:text-[#04111A] transition-colors duration-200"
            >
              WhatsApp
            </a>
          </nav>

          {/* Mobile burger */}
          <button
            ref={burgerRef}
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden flex flex-col items-center justify-center gap-[5px] min-h-[44px] min-w-[44px] -mr-2"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            aria-controls="aero-mobile-nav"
          >
            <span className={`w-5 h-px bg-[var(--aero-text)] block transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
            <span className={`w-5 h-px bg-[var(--aero-text)] block transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`w-3 h-px bg-[var(--aero-text)] block transition-all duration-200 self-end ${menuOpen ? "-rotate-45 -translate-y-[6px] w-5" : ""}`} />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={panelRef}
            id="aero-mobile-nav"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[76px] left-0 right-0 z-40 lg:hidden border-t border-b"
            style={{
              background: "rgba(5, 8, 14, 0.97)",
              backdropFilter: "blur(18px)",
              borderColor: "var(--aero-line)",
            }}
          >
            <nav className="px-6 py-7 flex flex-col gap-5">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-body text-[15px] font-medium tracking-[0.08em] uppercase text-[var(--aero-muted)] hover:text-[var(--aero-text)] transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="self-start mt-1 px-5 py-2.5 font-body text-[11px] font-medium tracking-[0.12em] uppercase text-[var(--aero-cyan)] border border-[var(--aero-cyan)]"
              >
                WhatsApp
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
