// Vertiefung 2: Meldungen pro Anmeldung und Feld statt `z.prettifyError`.
// Eigenständige Variante von `parseRegistrations`; die Hauptlösung in `registration.ts`
// bleibt unverändert. Zum Übernehmen die Funktionen nach `registration.ts` kopieren.
import type { z } from "zod";
import { registrationListSchema, type ParseResult } from "./registration.ts";

/** Prüft unbekannte Daten und meldet jeden Fehler mit Nummer der Anmeldung und Feld. */
export function parseRegistrations(input: unknown): ParseResult {
  const result = registrationListSchema.safeParse(input);
  if (!result.success) {
    return { success: false, message: result.error.issues.map(describeIssue).join("\n") };
  }
  return { success: true, registrations: result.data };
}

/** Beschreibt einen Validierungsfehler mit Nummer der Anmeldung und Feld. */
function describeIssue(issue: z.core.$ZodIssue): string {
  const [index, ...field] = issue.path;
  if (typeof index !== "number") return issue.message;

  const location = field.length > 0 ? `, Feld «${field.map(String).join(".")}»` : "";
  return `Anmeldung ${index + 1}${location}: ${issue.message}`;
}
