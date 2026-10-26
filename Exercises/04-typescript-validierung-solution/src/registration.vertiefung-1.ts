// Vertiefung 1: Fachliche Regel im Schema.
// Ein Sitzplatz ist nur bei bestätigten Anmeldungen erlaubt, und jede bestätigte Anmeldung
// braucht einen. Eigenständige Variante von `registration.ts`; die Hauptlösung bleibt unverändert.
// Um sie zu übernehmen, die Schemas und Typen hier nach `registration.ts` kopieren und in
// `renderRow` (`registration-view.ts`) die Platzspalte mit `seatLabel` bzw. Narrowing darstellen.
import { z } from "zod";

// Fehlermeldungen von Zod auf Deutsch.
z.config(z.locales.de());

const baseSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  email: z.email(),
});

/** Eine Kursanmeldung; `seat` gibt es genau bei bestätigten Anmeldungen. */
export const registrationSchema = z.discriminatedUnion("status", [
  baseSchema.extend({
    status: z.literal("confirmed"),
    seat: z.number().int().positive(),
  }),
  // `strictObject`: Ein Sitzplatz auf der Warteliste wird abgelehnt statt stillschweigend entfernt.
  z.strictObject({
    ...baseSchema.shape,
    status: z.enum(["waitlist", "cancelled"]),
  }),
]);

export const registrationListSchema = z.array(registrationSchema);

export type Registration = z.infer<typeof registrationSchema>;
export type RegistrationStatus = Registration["status"];

export type ParseResult =
  | { success: true; registrations: Registration[] }
  | { success: false; message: string };

/** Prüft unbekannte Daten, zum Beispiel eine API-Antwort, gegen das Schema. */
export function parseRegistrations(input: unknown): ParseResult {
  const result = registrationListSchema.safeParse(input);
  if (!result.success) {
    return { success: false, message: z.prettifyError(result.error) };
  }
  return { success: true, registrations: result.data };
}

/**
 * Inhalt der Spalte «Platz». Mit dem Schema oben meldet `npm run check` in `renderRow`
 * `Property 'seat' does not exist on type …`, weil `seat` nur noch im Fall `confirmed`
 * existiert. Nach der Prüfung von `status` kennt TypeScript `seat` (Narrowing).
 */
export function seatLabel(registration: Registration): string {
  return registration.status === "confirmed" ? String(registration.seat) : "–";
}
