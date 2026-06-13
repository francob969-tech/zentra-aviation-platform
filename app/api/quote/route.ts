import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { quoteSchema } from "@/lib/quote-schema";
import { addLead } from "@/lib/leads-store";

/**
 * POST /api/quote — captura del lead ("doble disparo").
 * El formulario abre WhatsApp en el dispositivo del visitante Y ADEMÁS postea
 * acá, así el pedido queda registrado aunque el visitante no concrete el envío.
 *
 * Salidas (todas opcionales, por variables de entorno):
 *  - RESEND_API_KEY + QUOTE_TO_EMAIL → email al operador vía Resend
 *  - N8N_WEBHOOK_URL                 → webhook a n8n (Sheets, CRM, WhatsApp interno…)
 * Sin env vars configuradas, el endpoint valida y responde ok (modo boceto).
 */

// Rate limit simple en memoria: 5 solicitudes/minuto por IP. Suficiente para
// una landing de bajo tráfico; si escala, migrar a Upstash Ratelimit.
const hits = new Map<string, { n: number; t: number }>();
function limited(ip: string): boolean {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.t > 60_000) {
    hits.set(ip, { n: 1, t: now });
    return false;
  }
  h.n++;
  return h.n > 5;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  const q = parsed.data;
  // Honeypot con contenido → bot. Respondemos ok sin procesar para no darle señal.
  if (q.website) return NextResponse.json({ ok: true });

  // Guardar el lead para el panel de administración (/admin).
  // Si el almacén falla, el flujo sigue: email/webhook son canales redundantes.
  await addLead(q).catch(console.error);

  const lines = [
    `Origen: ${q.depCode}`,
    `Destino: ${q.destCode}`,
    `Salida: ${q.date}`,
    q.roundTrip ? `Regreso: ${q.returnDate}` : "Solo ida",
    `Pasajeros: ${q.pax}`,
    `Requerimientos: ${q.requirements || "—"}`,
    "",
    `Nombre: ${q.nombre}`,
    `WhatsApp: ${q.whatsapp}`,
  ].join("\n");

  if (process.env.RESEND_API_KEY && process.env.QUOTE_TO_EMAIL) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails
      .send({
        from: process.env.QUOTE_FROM_EMAIL ?? "onboarding@resend.dev",
        to: process.env.QUOTE_TO_EMAIL,
        subject: `✈ Solicitud de vuelo — ${q.nombre} → ${q.destCode} (${q.date})`,
        text: lines,
      })
      .catch(console.error);
  }

  if (process.env.N8N_WEBHOOK_URL) {
    await fetch(process.env.N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "landing", ip, ...q }),
    }).catch(console.error);
  }

  return NextResponse.json({ ok: true });
}
