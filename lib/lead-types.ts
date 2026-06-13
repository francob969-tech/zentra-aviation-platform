/* Tipos y constantes de leads compartidos entre servidor (leads-store) y
   cliente (AdminPanel). Sin imports de Node para que bundlee en el browser. */

export const LEAD_STATUSES = ["nuevo", "contactado", "cotizado", "ganado", "perdido"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export interface Lead {
  id: string;
  createdAt: string; // ISO
  depCode: string;
  destCode: string;
  date: string;
  returnDate: string;
  pax: number;
  roundTrip: boolean;
  requirements: string;
  nombre: string;
  whatsapp: string;
  status: LeadStatus;
  notes: string;
}
