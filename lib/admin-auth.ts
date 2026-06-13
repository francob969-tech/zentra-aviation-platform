import { createHmac, timingSafeEqual } from "crypto";

/* ─────────────────────────────────────────────────────────────
   Autenticación del panel: contraseña única (ADMIN_PASSWORD) y
   sesión por cookie firmada con HMAC (sin dependencias ni DB).
   Suficiente para un panel de un solo operador; si algún día hay
   varios usuarios, migrar a Supabase Auth.
   ───────────────────────────────────────────────────────────── */

export const ADMIN_COOKIE = "aero_admin";
const SESSION_DAYS = 7;

const secret = () =>
  process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";

export function isAuthConfigured(): boolean {
  return !!process.env.ADMIN_PASSWORD;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export function checkPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(password, expected);
}

/** Token: `<expiraciónMs>.<firma>` */
export function createSessionToken(): string {
  const exp = String(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  return `${exp}.${sign(exp)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token || !isAuthConfigured()) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig) return false;
  if (Number(exp) < Date.now()) return false;
  return safeEqual(sig, sign(exp));
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_DAYS * 24 * 60 * 60,
};
