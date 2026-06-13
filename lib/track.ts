/**
 * Tracking de eventos — wrapper fino sobre Plausible.
 * No-op si Plausible no está cargado (NEXT_PUBLIC_PLAUSIBLE_DOMAIN vacío),
 * así el código de la landing no depende del proveedor de analytics.
 */
type Plausible = (event: string, opts?: { props?: Record<string, string | number> }) => void;

export function track(event: string, props?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  const plausible = (window as Window & { plausible?: Plausible }).plausible;
  plausible?.(event, props ? { props } : undefined);
}
