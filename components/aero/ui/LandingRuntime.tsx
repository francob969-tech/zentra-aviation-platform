"use client";
import { useEffect } from "react";
import { track } from "@/lib/track";

/**
 * Comportamiento global de la landing (sin UI):
 *
 * 1. Deep-links con hash (/#cotizar): salta INSTANTÁNEO a la sección en el
 *    primer paint. Sin esto, `scroll-behavior: smooth` recorre toda la página
 *    y el visitante ve segundos de pantalla negra (los reveals de las
 *    secciones intermedias no llegan a disparar).
 *
 * 2. Tracking por delegación: cualquier click en enlaces a wa.me / mailto:
 *    registra wa_click / email_click sin tener que instrumentar cada CTA.
 */
export default function LandingRuntime() {
  useEffect(() => {
    const { hash } = window.location;
    if (hash) {
      // requestAnimationFrame: espera al primer layout para que el target exista
      requestAnimationFrame(() => {
        document
          .querySelector(hash)
          ?.scrollIntoView({ behavior: "instant", block: "start" });
      });
    }

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.("a[href]");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      if (href.includes("wa.me")) {
        track("wa_click", { location: a.closest("section")?.id || "global" });
      } else if (href.startsWith("mailto:")) {
        track("email_click");
      }
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
