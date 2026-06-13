"use client";
import { motion } from "framer-motion";
import { HUB, DESTINATIONS } from "@/lib/aero";

/**
 * RouteMap — mapa premium de rutas desde San Fernando (SADF).
 *
 * Estética radar/aviación: anillos concéntricos, graticule tenue, rutas curvas
 * finas con glow que se dibujan al entrar en viewport, hub pulsante y un punto
 * recorriendo la ruta más larga. No es cartografía exacta: es cobertura.
 *
 * Determinismo: TODAS las posiciones, curvaturas y anclas de etiqueta salen de
 * arrays/maps estáticos de módulo (nada aleatorio en render → cero problemas
 * de hidratación). Las animaciones son sutiles y respetan reduced-motion:
 * framer vía <MotionConfig reducedMotion="user">, CSS/SMIL vía media queries.
 */

const CYAN = "#7FD9EC";
const SILVER = "#97A4B0";
const ease = [0.22, 1, 0.36, 1] as const;

/* Curvatura por destino (predefinida): offset perpendicular del punto de
   control de la Bézier respecto de la recta hub→destino. */
const BEND: Record<string, number> = {
  SAAR: -5,
  SACO: -8,
  SAME: -11,
  SAZM: 6,
  SULS: -5,
  SAZN: 8,
  SAZS: 12,
};

function routePath(d: { x: number; y: number; icao: string }): string {
  const dx = d.x - HUB.x;
  const dy = d.y - HUB.y;
  const len = Math.hypot(dx, dy) || 1;
  const b = BEND[d.icao] ?? 0;
  const cx = (HUB.x + d.x) / 2 + (-dy / len) * b;
  const cy = (HUB.y + d.y) / 2 + (dx / len) * b;
  return `M ${HUB.x} ${HUB.y} Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${d.x} ${d.y}`;
}

const ROUTES = DESTINATIONS.map((d) => ({ ...d, path: routePath(d) }));

/* Ruta más larga (Bariloche): por ella viaja el punto */
const FLIER_PATH = ROUTES.find((r) => r.icao === "SAZS")?.path ?? "";

/* Anclas de etiqueta predefinidas para que no pisen rutas ni bordes */
const LABEL: Record<string, { dx: number; dy: number; anchor: "start" | "middle" | "end" }> = {
  SAAR: { dx: 0, dy: -2.4, anchor: "middle" },
  SACO: { dx: 0, dy: -2.4, anchor: "middle" },
  SAME: { dx: 0, dy: -2.8, anchor: "middle" },
  SAZM: { dx: 2.8, dy: 1, anchor: "start" },
  SULS: { dx: 0, dy: 4.6, anchor: "middle" },
  SAZN: { dx: 0, dy: 4.4, anchor: "middle" },
  SAZS: { dx: 0, dy: 4.6, anchor: "middle" },
};

/* Pistas privadas ilustrativas (estancias / aeródromos) — puntos fijos */
const PRIVATE_STRIPS = [
  { x: 42, y: 59 },
  { x: 56, y: 73 },
  { x: 37, y: 46 },
];

/* Anillos de radar centrados en el hub */
const RADAR_RINGS = [9, 18, 30, 44, 60];

/* Graticule tenue (líneas de referencia fijas) */
const GRID_X = [20, 40, 60, 80];
const GRID_Y = [18.4, 36.8, 55.2, 73.6];

export default function RouteMap({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 92"
      className={`w-full h-full ${className}`}
      role="img"
      aria-label="Mapa de rutas: vuelos privados desde San Fernando hacia Rosario, Córdoba, Mendoza, Mar del Plata, Punta del Este, Neuquén, Bariloche y aeródromos privados"
    >
      {/* Fondo panel */}
      <rect x="0" y="0" width="100" height="92" fill="#090E16" />

      {/* Graticule */}
      {GRID_X.map((x) => (
        <line key={`gx-${x}`} x1={x} y1="0" x2={x} y2="92" stroke={CYAN} strokeOpacity="0.035" strokeWidth="0.2" />
      ))}
      {GRID_Y.map((y) => (
        <line key={`gy-${y}`} x1="0" y1={y} x2="100" y2={y} stroke={CYAN} strokeOpacity="0.035" strokeWidth="0.2" />
      ))}

      {/* Anillos de radar desde el hub */}
      {RADAR_RINGS.map((r) => (
        <circle
          key={`ring-${r}`}
          cx={HUB.x}
          cy={HUB.y}
          r={r}
          fill="none"
          stroke={CYAN}
          strokeOpacity="0.06"
          strokeWidth="0.25"
        />
      ))}
      {/* Cruz del radar */}
      <line x1={HUB.x - 64} y1={HUB.y} x2={HUB.x + 64} y2={HUB.y} stroke={CYAN} strokeOpacity="0.05" strokeWidth="0.2" />
      <line x1={HUB.x} y1={HUB.y - 64} x2={HUB.x} y2={HUB.y + 64} stroke={CYAN} strokeOpacity="0.05" strokeWidth="0.2" />

      {/* Rutas: glow ancho + trazo fino, dibujadas al entrar en viewport */}
      {ROUTES.map((r, i) => (
        <g key={`route-${r.icao}`}>
          <motion.path
            d={r.path}
            fill="none"
            stroke={CYAN}
            strokeOpacity="0.10"
            strokeWidth="1.1"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.4, delay: 0.15 + i * 0.1, ease }}
          />
          <motion.path
            d={r.path}
            fill="none"
            stroke={CYAN}
            strokeOpacity="0.55"
            strokeWidth="0.28"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.4, delay: 0.15 + i * 0.1, ease }}
          />
        </g>
      ))}

      {/* Punto en vuelo por la ruta más larga (SMIL; oculto si reduced-motion) */}
      {FLIER_PATH && (
        <circle r="0.55" fill={CYAN} className="aero-map-flier" opacity="0.9">
          <animateMotion dur="9s" repeatCount="indefinite" path={FLIER_PATH} begin="2s" />
        </circle>
      )}

      {/* Pistas privadas ilustrativas */}
      {PRIVATE_STRIPS.map((p, i) => (
        <motion.g
          key={`pvt-${i}`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 1 + i * 0.15 }}
        >
          <line x1={p.x - 1} y1={p.y} x2={p.x + 1} y2={p.y} stroke={SILVER} strokeOpacity="0.55" strokeWidth="0.28" />
          <line x1={p.x} y1={p.y - 1} x2={p.x} y2={p.y + 1} stroke={SILVER} strokeOpacity="0.55" strokeWidth="0.28" />
          <circle cx={p.x} cy={p.y} r="1.8" fill="none" stroke={SILVER} strokeOpacity="0.25" strokeWidth="0.22" strokeDasharray="0.7 1" />
        </motion.g>
      ))}

      {/* Nodos de destino + etiqueta ICAO */}
      {ROUTES.map((d, i) => {
        const l = LABEL[d.icao] ?? { dx: 2.6, dy: 1, anchor: "start" as const };
        return (
          <motion.g
            key={`n-${d.icao}`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.6 + i * 0.1 }}
          >
            <circle cx={d.x} cy={d.y} r="0.85" fill={CYAN} />
            <circle cx={d.x} cy={d.y} r="1.9" fill="none" stroke={CYAN} strokeOpacity="0.4" strokeWidth="0.25" />
            <text
              x={d.x + l.dx}
              y={d.y + l.dy}
              textAnchor={l.anchor}
              fontSize="2.3"
              fontFamily="var(--font-inter), sans-serif"
              fill={SILVER}
              letterSpacing="0.25"
            >
              {d.icao}
            </text>
          </motion.g>
        );
      })}

      {/* Hub — San Fernando, base operativa */}
      <g>
        {/* pulso (CSS keyframes, desactivado con reduced-motion) */}
        <circle cx={HUB.x} cy={HUB.y} r="3.4" fill="none" stroke={CYAN} strokeOpacity="0.5" strokeWidth="0.3" className="aero-map-pulse" />
        <circle cx={HUB.x} cy={HUB.y} r="3.4" fill={CYAN} fillOpacity="0.10" />
        <circle cx={HUB.x} cy={HUB.y} r="1.5" fill={CYAN} />
        <circle cx={HUB.x} cy={HUB.y} r="2.9" fill="none" stroke={CYAN} strokeOpacity="0.65" strokeWidth="0.3" />
        {/* Etiqueta con línea guía hacia el cuadrante superior derecho (despejado) */}
        <line
          x1={HUB.x + 2.3}
          y1={HUB.y - 2.3}
          x2={HUB.x + 5.5}
          y2={HUB.y - 6.2}
          stroke={CYAN}
          strokeOpacity="0.4"
          strokeWidth="0.22"
        />
        <text
          x={HUB.x + 6.5}
          y={HUB.y - 7.4}
          fontSize="2.7"
          fontFamily="var(--font-inter), sans-serif"
          fill="#EDF2F6"
          letterSpacing="0.4"
        >
          {HUB.icao} · BASE
        </text>
        <text
          x={HUB.x + 6.5}
          y={HUB.y - 4.4}
          fontSize="2.1"
          fontFamily="var(--font-inter), sans-serif"
          fill={SILVER}
          letterSpacing="0.25"
        >
          SAN FERNANDO
        </text>
      </g>

      {/* Leyenda */}
      <g>
        <line x1="4" y1="87.6" x2="6" y2="87.6" stroke={SILVER} strokeOpacity="0.55" strokeWidth="0.28" />
        <line x1="5" y1="86.6" x2="5" y2="88.6" stroke={SILVER} strokeOpacity="0.55" strokeWidth="0.28" />
        <text
          x="8"
          y="88.5"
          fontSize="2.1"
          fontFamily="var(--font-inter), sans-serif"
          fill="#76838F"
          letterSpacing="0.2"
        >
          Estancias y aeródromos privados · a demanda
        </text>
      </g>
    </svg>
  );
}
