"use client";
import { motion } from "framer-motion";

type Variant = "primary" | "solid" | "ghost";

interface Props {
  href?: string;
  onClick?: () => void;
  label: string;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  target?: string;
  rel?: string;
}

const base =
  "group inline-flex items-center justify-center gap-2.5 px-8 py-4 font-body font-medium text-[12px] tracking-[0.12em] uppercase transition-colors duration-200 cursor-pointer select-none";

// Cian #7FD9EC = rgb(127,217,236). Usamos rgba con alpha animable (0→1)
// para que framer-motion pueda animar el relleno (no anima desde "transparent").
// El boxShadow arranca en alpha 0 para que el glow de hover anime suave.
const styleFor: Record<Variant, React.CSSProperties> = {
  // Contorno cian — se rellena al hover
  primary: { border: "1px solid var(--aero-cyan)", color: "var(--aero-text)", backgroundColor: "rgba(127, 217, 236, 0)", boxShadow: "0 0 0px rgba(127, 217, 236, 0)" },
  // Relleno cian sólido
  solid: { border: "1px solid var(--aero-cyan)", color: "#04111A", backgroundColor: "var(--aero-cyan)", boxShadow: "0 0 0px rgba(127, 217, 236, 0)" },
  // Discreto, hairline
  ghost: { border: "1px solid var(--aero-line)", color: "var(--aero-muted)", backgroundColor: "rgba(127, 217, 236, 0)" },
};

const hoverFor: Record<Variant, Record<string, string>> = {
  primary: { backgroundColor: "rgba(127, 217, 236, 1)", color: "#04111A", boxShadow: "0 0 24px rgba(127, 217, 236, 0.18)" },
  solid: { backgroundColor: "#A6E7F4", borderColor: "#A6E7F4", boxShadow: "0 0 24px rgba(127, 217, 236, 0.22)" },
  ghost: { borderColor: "var(--aero-cyan-dim)", color: "var(--aero-text)" },
};

export default function CyanButton({
  href,
  onClick,
  label,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
  target,
  rel,
}: Props) {
  const content = (
    <>
      {label}
      <span
        aria-hidden
        className="text-[1.1em] leading-none -mt-px transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
      >
        &rarr;
      </span>
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={rel}
        className={`${base} ${className}`}
        style={styleFor[variant]}
        whileHover={hoverFor[variant]}
        transition={{ duration: 0.2 }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
      style={styleFor[variant]}
      whileHover={disabled ? {} : hoverFor[variant]}
      transition={{ duration: 0.2 }}
    >
      {content}
    </motion.button>
  );
}
