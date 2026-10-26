import type { Device } from "./device.ts";

/** Warum das Laden fehlgeschlagen ist. */
export type LoadErrorReason = "network" | "http" | "invalid-json" | "invalid-data";

/** Fehler beim Laden von der API, mit Grund und einer Meldung für die Anzeige. */
export class LoadError extends Error {
  readonly reason: LoadErrorReason;

  constructor(reason: LoadErrorReason, message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "LoadError";
    this.reason = reason;
  }
}

/** Lädt die Geräteliste von `url`. */
export function loadDevices(url: string | URL): Promise<Device[]> {
  return fetch(url).then((response) => response.json());
}
