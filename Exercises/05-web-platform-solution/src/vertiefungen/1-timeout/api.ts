// Vertiefung 1: loadDevices mit Timeout. Eigenständige Variante von src/api.ts;
// die Hauptlösung bleibt unverändert.

import { z } from "zod";
import { deviceListSchema, type Device } from "../../device.ts";

/** Warum das Laden fehlgeschlagen ist; neu mit `timeout`. */
export type LoadErrorReason = "network" | "timeout" | "http" | "invalid-json" | "invalid-data";

/** Fehler beim Laden von der API, mit Grund und einer Meldung für die Anzeige. */
export class LoadError extends Error {
  readonly reason: LoadErrorReason;

  constructor(reason: LoadErrorReason, message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "LoadError";
    this.reason = reason;
  }
}

/**
 * Lädt die Geräteliste von `url`; bricht nach `timeoutMs` Millisekunden ab.
 * Wirft bei jedem Fehler einen `LoadError`.
 */
export async function loadDevices(url: string | URL, timeoutMs = 3000): Promise<Device[]> {
  let response: Response;
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
  } catch (error) {
    // AbortSignal.timeout meldet einen TimeoutError, ein eigener AbortController einen AbortError.
    if (error instanceof DOMException && error.name === "TimeoutError") {
      throw new LoadError("timeout", "Der Server antwortet nicht rechtzeitig.", { cause: error });
    }
    // fetch lehnt nur ab, wenn keine HTTP-Antwort zustande kommt.
    throw new LoadError("network", "Der Server ist nicht erreichbar.", { cause: error });
  }

  if (!response.ok) {
    throw new LoadError("http", `Der Server meldet einen Fehler (HTTP-Status ${response.status}).`);
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch (error) {
    // Läuft der Timeout erst beim Lesen des Bodys ab, landet er hier.
    throw new LoadError("invalid-json", "Die Antwort des Servers ist kein gültiges JSON.", {
      cause: error,
    });
  }

  const result = deviceListSchema.safeParse(json);
  if (!result.success) {
    throw new LoadError(
      "invalid-data",
      `Die Antwort des Servers enthält ungültige Daten:\n${z.prettifyError(result.error)}`,
      { cause: result.error },
    );
  }
  return result.data;
}
