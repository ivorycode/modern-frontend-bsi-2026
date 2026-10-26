// Vertiefung 2: Gerät per POST erfassen. Ergänzt src/api.ts, ohne es zu ändern.

import { z } from "zod";
import { LoadError } from "../../api.ts";
import { deviceSchema, type Device, type NewDevice } from "../../device.ts";

const validationErrorSchema = z.object({
  fieldErrors: z.record(z.string(), z.array(z.string())),
});

export type FieldErrors = Partial<Record<string, string[]>>;

export type CreateResult =
  | { success: true; device: Device }
  | { success: false; fieldErrors: FieldErrors };

/** Sendet ein neues Gerät als JSON; Validierungsfehler des Servers gehören zum Ergebnis. */
export async function createDevice(url: string | URL, input: NewDevice): Promise<CreateResult> {
  let response: Response;
  try {
    // Content-Type: application/json macht den Request «nicht einfach»: Preflight (OPTIONS).
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  } catch (error) {
    throw new LoadError("network", "Der Server ist nicht erreichbar.", { cause: error });
  }

  // Ein Validierungsfehler ist ein erwartetes Ergebnis, kein Ausnahmefall.
  // invalid-json fehlt der Kürze halber.
  if (response.status === 400) {
    const body = validationErrorSchema.safeParse(await response.json());
    if (body.success) return { success: false, fieldErrors: body.data.fieldErrors };
  }
  if (!response.ok) {
    throw new LoadError("http", `Der Server meldet einen Fehler (HTTP-Status ${response.status}).`);
  }

  const device = deviceSchema.safeParse(await response.json());
  if (!device.success) {
    throw new LoadError("invalid-data", "Die Antwort des Servers enthält ungültige Daten.", {
      cause: device.error,
    });
  }
  return { success: true, device: device.data };
}
