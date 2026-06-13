/**
 * Gráfico de hero ESTÁTICO y editorial — globo de meridianos finos con una
 * única trayectoria de vuelo (great-circle). Evoca alcance global de forma
 * sobria, sin radar/dashboard, sin animación ni degradados de color. Solo
 * paths predefinidos y hairlines champagne. (El nombre del archivo se mantiene
 * por compatibilidad de imports.)
 */

const CH = "#7FD9EC"; // champagne / platino cálido
const GLOBE = "rgba(236, 232, 224, 0.085)";
const GLOBE_SOFT = "rgba(236, 232, 224, 0.05)";
const LABEL_FONT = { fontFamily: "var(--font-inter), system-ui, sans-serif" };

export default function RadarFlightPath({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 480"
      className={`w-full h-full ${className}`}
      role="img"
      aria-label="Globo con una trayectoria de vuelo desde San Fernando"
    >
      {/* Globo */}
      <circle cx="240" cy="240" r="190" fill="none" stroke={GLOBE} strokeWidth="1" />

      {/* Meridianos */}
      <ellipse cx="240" cy="240" rx="64" ry="190" fill="none" stroke={GLOBE_SOFT} strokeWidth="1" />
      <ellipse cx="240" cy="240" rx="130" ry="190" fill="none" stroke={GLOBE_SOFT} strokeWidth="1" />
      <line x1="240" y1="50" x2="240" y2="430" stroke={GLOBE_SOFT} strokeWidth="1" />

      {/* Paralelos */}
      <ellipse cx="240" cy="240" rx="190" ry="64" fill="none" stroke={GLOBE_SOFT} strokeWidth="1" />
      <line x1="50" y1="240" x2="430" y2="240" stroke={GLOBE_SOFT} strokeWidth="1" />

      {/* Trayectoria de vuelo (great-circle) */}
      <path d="M 120 322 Q 230 120 372 150" fill="none" stroke={CH} strokeWidth="1.25" strokeOpacity="0.6" strokeDasharray="1.5 5" />

      {/* Aeronave en el apex */}
      <path d="M 238 173 l 5.5 11 -5.5 -3.5 -5.5 3.5 z" fill={CH} />

      {/* Nodo origen — San Fernando */}
      <circle cx="120" cy="322" r="3.5" fill={CH} />
      <circle cx="120" cy="322" r="8" fill="none" stroke={CH} strokeOpacity="0.45" strokeWidth="1" />

      {/* Nodo destino */}
      <circle cx="372" cy="150" r="3" fill={CH} fillOpacity="0.85" />
      <circle cx="372" cy="150" r="7" fill="none" stroke={CH} strokeOpacity="0.4" strokeWidth="1" />

      {/* Etiqueta de origen — sans tracked, sobria */}
      <text x="120" y="346" textAnchor="middle" fontSize="9" letterSpacing="2.5" fill="#97A4B0" style={LABEL_FONT}>
        SAN FERNANDO
      </text>
    </svg>
  );
}
