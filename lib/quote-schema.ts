import { z } from "zod";

/**
 * Schema de la solicitud de vuelo — compartido entre el formulario (cliente)
 * y POST /api/quote (servidor), para que ambos validen exactamente igual.
 */
export const quoteSchema = z
  .object({
    depCode: z.string().min(1),
    destCode: z.string().min(1, "Elegí un destino"),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Indicá la fecha de salida"),
    returnDate: z.string().optional().default(""),
    pax: z.number().int().min(1).max(8),
    roundTrip: z.boolean(),
    requirements: z.string().max(1000).optional().default(""),
    nombre: z.string().trim().min(2, "Ingresá tu nombre").max(120),
    whatsapp: z
      .string()
      .regex(/^[+\d][\d\s-]{7,20}$/, "Ingresá un número válido (ej. +54 9 11 5555 5555)"),
    // Honeypot: los humanos no ven este campo; si viene con contenido, es un bot.
    website: z.string().max(0).optional().default(""),
  })
  .refine((d) => !d.roundTrip || (d.returnDate ?? "") >= d.date, {
    message: "La fecha de regreso no puede ser anterior a la de salida",
    path: ["returnDate"],
  })
  .refine((d) => !d.roundTrip || /^\d{4}-\d{2}-\d{2}$/.test(d.returnDate ?? ""), {
    message: "Indicá la fecha de regreso",
    path: ["returnDate"],
  });

export type QuoteInput = z.input<typeof quoteSchema>;
