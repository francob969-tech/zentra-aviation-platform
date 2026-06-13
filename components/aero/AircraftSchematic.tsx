/**
 * AircraftSchematic — silueta cenital editorial de un bimotor a pistón.
 * Líneas finas champagne, sin retícula, sin acotaciones ni callouts técnicos:
 * una ilustración sobria, no un plano de taller. Sustituible por fotografía.
 */
const STROKE = "rgba(127, 217, 236, 0.55)";
const STROKE_SOFT = "rgba(127, 217, 236, 0.22)";
const FILL = "rgba(127, 217, 236, 0.045)";

export default function AircraftSchematic({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={`w-full h-full ${className}`}
      role="img"
      aria-label="Silueta de un avión bimotor a pistón visto desde arriba"
    >
      {/* Alas */}
      <path d="M188 188 L74 208 L74 222 L188 214 Z" fill={FILL} stroke={STROKE} strokeWidth="1.25" strokeLinejoin="round" />
      <path d="M212 188 L326 208 L326 222 L212 214 Z" fill={FILL} stroke={STROKE} strokeWidth="1.25" strokeLinejoin="round" />

      {/* Tanques de punta de ala (rasgo típico del 402) */}
      <ellipse cx="74" cy="215" rx="7" ry="17" fill={FILL} stroke={STROKE} strokeWidth="1.25" />
      <ellipse cx="326" cy="215" rx="7" ry="17" fill={FILL} stroke={STROKE} strokeWidth="1.25" />

      {/* Fuselaje */}
      <path
        d="M200 58 C212 70 214 112 212 150 L210 252 C210 300 206 328 200 342 C194 328 190 300 190 252 L188 150 C186 112 188 70 200 58 Z"
        fill={FILL}
        stroke={STROKE}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />

      {/* Estabilizador horizontal */}
      <path d="M192 300 L150 312 L150 320 L192 312 Z" fill={FILL} stroke={STROKE} strokeWidth="1.25" strokeLinejoin="round" />
      <path d="M208 300 L250 312 L250 320 L208 312 Z" fill={FILL} stroke={STROKE} strokeWidth="1.25" strokeLinejoin="round" />
      <path d="M200 320 L205 344 L195 344 Z" fill={FILL} stroke={STROKE} strokeWidth="1.25" strokeLinejoin="round" />

      {/* Góndolas de motor + hélices (bimotor) */}
      {[141, 259].map((cx) => (
        <g key={cx}>
          <rect x={cx - 9} y={150} width={18} height={66} rx={9} fill={FILL} stroke={STROKE} strokeWidth="1.25" />
          <ellipse cx={cx} cy={150} rx={20} ry={6} fill="none" stroke={STROKE} strokeWidth="1.1" />
          <line x1={cx - 20} y1={150} x2={cx + 20} y2={150} stroke={STROKE_SOFT} strokeWidth="1" />
          <circle cx={cx} cy={150} r={2} fill={STROKE} />
        </g>
      ))}
    </svg>
  );
}
