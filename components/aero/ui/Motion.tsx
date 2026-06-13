"use client";
import { MotionConfig } from "framer-motion";

/**
 * Respeta prefers-reduced-motion del sistema en TODAS las animaciones de
 * framer-motion (entradas, reveals, hovers). Con reducedMotion="user",
 * framer-motion degrada transform/layout a estados finales cuando el usuario
 * pidió menos movimiento. Complementa el bloque @media de globals.css que
 * desactiva las animaciones CSS-keyframe del radar.
 */
export default function Motion({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
