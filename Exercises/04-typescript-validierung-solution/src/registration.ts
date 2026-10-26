import { z } from "zod";

// Fehlermeldungen von Zod auf Deutsch.
z.config(z.locales.de());

export const registrationStatusSchema = z.enum(["confirmed", "waitlist", "cancelled"]);

/** Eine Kursanmeldung, wie sie die API liefert. */
export const registrationSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  email: z.email(),
  status: registrationStatusSchema,
  /** Sitzplatz; nur bei bestätigten Anmeldungen vergeben. */
  seat: z.number().int().positive().optional(),
});

export const registrationListSchema = z.array(registrationSchema);

export type RegistrationStatus = z.infer<typeof registrationStatusSchema>;
export type Registration = z.infer<typeof registrationSchema>;

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

export const STATUS_LABELS: Record<RegistrationStatus, string> = {
  confirmed: "Bestätigt",
  waitlist: "Warteliste",
  cancelled: "Storniert",
};

/** Nächste freie Anmeldenummer: eins mehr als die höchste vergebene. */
export function nextId(registrations: readonly Registration[]): number {
  let highest = 0;
  for (const registration of registrations) {
    if (registration.id > highest) highest = registration.id;
  }
  return highest + 1;
}
