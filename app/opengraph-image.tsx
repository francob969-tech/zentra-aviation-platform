import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE, BASE, THEME } from "@/lib/aero";

export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Card social generada en build — colores desde THEME (lib/aero.ts).
   ImageResponse no soporta variables CSS, por eso usa los valores literales. */
export default function OpengraphImage() {
  const c = THEME.colors;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: c.void,
          color: c.text,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <svg width="56" height="56" viewBox="0 0 32 32">
            <path
              d="M16 4 L28 28 L16 22 L4 28 Z"
              fill="none"
              stroke={c.accent}
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <circle cx="16" cy="6.5" r="1.4" fill={c.accent} />
          </svg>
          <div
            style={{
              fontSize: 30,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: c.muted,
            }}
          >
            {SITE_NAME}
          </div>
        </div>
        <div style={{ marginTop: 56, fontSize: 84, lineHeight: 1.05, display: "flex", flexDirection: "column" }}>
          <span>Taxi aéreo privado</span>
          <span style={{ color: c.accent, fontStyle: "italic" }}>desde San Fernando</span>
        </div>
        <div style={{ marginTop: 48, fontSize: 28, color: c.muted }}>
          {`Vuelos regionales a demanda · ${BASE.icao} · Buenos Aires`}
        </div>
      </div>
    ),
    size
  );
}
