import { NextResponse } from "next/server";

/**
 * ⚠ ENDPOINT DE DIAGNÓSTICO TEMPORAL — BORRAR DESPUÉS DE DEPURAR.
 *
 * Reporta qué está leyendo el runtime de Vercel para las variables de Supabase,
 * SIN exponer la clave completa (solo prefijo de 10 chars + longitud).
 * Sirve para distinguir una service_role JWT ("eyJ...") de una secret key
 * nueva ("sb_secret_...") y confirmar host/longitud.
 *
 * GET /api/debug-supabase
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  let urlHost: string | null = null;
  if (url) {
    try {
      urlHost = new URL(url).host;
    } catch {
      urlHost = "invalid_url";
    }
  }

  return NextResponse.json({
    hasUrl: !!url,
    hasServiceKey: !!key,
    urlHost,
    serviceKeyPrefix: key ? key.slice(0, 10) : null,
    serviceKeyLength: key ? key.length : 0,
  });
}
