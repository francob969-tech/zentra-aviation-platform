import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-auth";
import { listLeads } from "@/lib/leads-store";
import { SECTIONS } from "@/lib/aero";

/** GET /api/admin/leads — lista de solicitudes (requiere sesión) */
export async function GET(req: NextRequest) {
  if (!SECTIONS.adminCRM) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  if (!verifySessionToken(req.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  try {
    const leads = await listLeads();
    return NextResponse.json({ ok: true, leads });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "store_error" }, { status: 500 });
  }
}
