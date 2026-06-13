"use client";
import { motion, type HTMLMotionProps } from "framer-motion";

type Props = HTMLMotionProps<"div"> & {
  /** Retardo de entrada en segundos (útil para escalonar listas). */
  delay?: number;
  /** Desplazamiento vertical inicial en px. */
  y?: number;
};

/**
 * Envoltorio de animación reveal-on-scroll.
 * Aparece con fade + slide al entrar en viewport. Una sola vez.
 * Respeta prefers-reduced-motion vía el <MotionConfig reducedMotion="user">
 * que envuelve la página (ver components/aero/ui/Motion.tsx).
 */
export default function Reveal({
  delay = 0,
  y = 22,
  children,
  ...rest
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
