import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { QuoteInput } from "@/lib/quote-schema";

/* ─────────────────────────────────────────────────────────────
   Almacén de solicitudes (leads) con adaptador dual:

   - Con SUPABASE_URL + SUPABASE_SERVICE_KEY  → tabla `leads` de Supabase
     (vía PostgREST, sin dependencias extra). SQL de la tabla en
     PENDIENTES-CLIENTE.md.
   - Sin esas env vars → archivo local `.data/leads.json` (modo boceto).
     ⚠ El archivo local NO persiste en serverless (Vercel/Netlify):
     para producción es obligatorio Supabase.
   ───────────────────────────────────────────────────────────── */

import type { Lead, LeadStatus } from "@/lib/lead-types";

export { LEAD_STATUSES } from "@/lib/lead-types";
export type { Lead, LeadStatus } from "@/lib/lead-types";

const hasSupabase = () =>
  !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY);

/** ¿Hay un almacén persistente (Supabase) configurado? Para avisos en el panel.
 *  false → modo archivo local (.data/leads.json), no persiste en serverless. */
export function isSupabaseConfigured(): boolean {
  return hasSupabase();
}

/* ── Adaptador Supabase (PostgREST, columnas snake_case) ────── */

function sbHeaders(): Record<string, string> {
  const key = process.env.SUPABASE_SERVICE_KEY!;
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
}

const sbUrl = () => `${process.env.SUPABASE_URL!.replace(/\/$/, "")}/rest/v1/leads`;

type LeadRow = {
  id: string;
  created_at: string;
  dep_code: string;
  dest_code: string;
  flight_date: string;
  return_date: string | null;
  pax: number;
  round_trip: boolean;
  requirements: string | null;
  nombre: string;
  whatsapp: string;
  status: LeadStatus;
  notes: string | null;
};

function fromRow(r: LeadRow): Lead {
  return {
    id: r.id,
    createdAt: r.created_at,
    depCode: r.dep_code,
    destCode: r.dest_code,
    date: r.flight_date,
    returnDate: r.return_date ?? "",
    pax: r.pax,
    roundTrip: r.round_trip,
    requirements: r.requirements ?? "",
    nombre: r.nombre,
    whatsapp: r.whatsapp,
    status: r.status,
    notes: r.notes ?? "",
  };
}

/* ── Adaptador archivo local (modo boceto) ──────────────────── */

const FILE = path.join(process.cwd(), ".data", "leads.json");

async function fileRead(): Promise<Lead[]> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as Lead[];
  } catch {
    return [];
  }
}

async function fileWrite(leads: Lead[]): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(leads, null, 2), "utf8");
}

/* ── API pública del almacén ────────────────────────────────── */

export async function addLead(q: QuoteInput): Promise<Lead> {
  const lead: Lead = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    depCode: q.depCode,
    destCode: q.destCode,
    date: q.date,
    returnDate: q.returnDate ?? "",
    pax: q.pax,
    roundTrip: q.roundTrip,
    requirements: q.requirements ?? "",
    nombre: q.nombre,
    whatsapp: q.whatsapp,
    status: "nuevo",
    notes: "",
  };

  if (hasSupabase()) {
    const res = await fetch(sbUrl(), {
      method: "POST",
      headers: sbHeaders(),
      body: JSON.stringify({
        id: lead.id,
        created_at: lead.createdAt,
        dep_code: lead.depCode,
        dest_code: lead.destCode,
        flight_date: lead.date,
        return_date: lead.returnDate || null,
        pax: lead.pax,
        round_trip: lead.roundTrip,
        requirements: lead.requirements || null,
        nombre: lead.nombre,
        whatsapp: lead.whatsapp,
        status: lead.status,
        notes: null,
      }),
    });
    if (!res.ok) throw new Error(`Supabase insert failed: ${res.status}`);
    return lead;
  }

  const leads = await fileRead();
  leads.unshift(lead);
  await fileWrite(leads);
  return lead;
}

export async function listLeads(): Promise<Lead[]> {
  if (hasSupabase()) {
    const res = await fetch(`${sbUrl()}?select=*&order=created_at.desc`, {
      headers: sbHeaders(),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Supabase list failed: ${res.status}`);
    return ((await res.json()) as LeadRow[]).map(fromRow);
  }
  return fileRead();
}

export async function updateLead(
  id: string,
  patch: { status?: LeadStatus; notes?: string }
): Promise<Lead | null> {
  if (hasSupabase()) {
    const body: Record<string, unknown> = {};
    if (patch.status !== undefined) body.status = patch.status;
    if (patch.notes !== undefined) body.notes = patch.notes;
    const res = await fetch(`${sbUrl()}?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { ...sbHeaders(), Prefer: "return=representation" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Supabase update failed: ${res.status}`);
    const rows = (await res.json()) as LeadRow[];
    return rows[0] ? fromRow(rows[0]) : null;
  }

  const leads = await fileRead();
  const lead = leads.find((l) => l.id === id);
  if (!lead) return null;
  if (patch.status !== undefined) lead.status = patch.status;
  if (patch.notes !== undefined) lead.notes = patch.notes;
  await fileWrite(leads);
  return lead;
}
