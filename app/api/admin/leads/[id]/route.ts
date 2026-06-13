import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-auth";
import { LEAD_STATUSES } from "@/lib/lead-types";
import { updateLead } from "@/lib/leads-store";
import { SECTIONS } from "@/lib/aero";

const patchSchema = z
  .object({
    status: z.enum(LEAD_STATUSES).optional(),
    notes: z.string().max(2000).optional(),
  })
  .refine((d) => d.status !== undefined || d.notes !== undefined, {
    message: "empty_patch",
  });

/** PATCH /api/admin/leads/:id — actualiza estado y/o notas (requiere sesión) */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!SECTIONS.adminCRM) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  if (!verifySessionToken(req.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  try {
    const { id } = await params;
    const lead = await updateLead(id, parsed.data);
    if (!lead) {
      return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, lead });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "store_error" }, { status: 500 });
  }
}
