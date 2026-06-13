import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ADMIN_COOKIE, isAuthConfigured, verifySessionToken } from "@/lib/admin-auth";
import { isSupabaseConfigured } from "@/lib/leads-store";
import { SECTIONS } from "@/lib/aero";
import AdminPanel from "@/components/admin/AdminPanel";

export const metadata: Metadata = {
  title: "Panel de administración — Aero Ejecutivo SF",
  robots: { index: false, follow: false },
};

// La sesión vive en una cookie → esta página nunca se prerenderiza
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Flag de plataforma: si el CRM está desactivado, /admin no existe.
  if (!SECTIONS.adminCRM) notFound();
  const jar = await cookies();
  const authed = verifySessionToken(jar.get(ADMIN_COOKIE)?.value);
  return (
    <AdminPanel
      initialAuthed={authed}
      configured={isAuthConfigured()}
      supabaseConfigured={isSupabaseConfigured()}
    />
  );
}
