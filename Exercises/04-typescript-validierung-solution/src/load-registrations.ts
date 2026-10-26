import { parseRegistrations, type Registration } from "./registration.ts";

/** Was die Seite gerade anzeigt. */
export type ViewState =
  | { kind: "initial" }
  | { kind: "loading" }
  | { kind: "success"; registrations: Registration[] }
  | { kind: "empty" }
  | { kind: "error"; message: string };

/**
 * Lädt die Anmeldungen von `url` und meldet jeden Zustand an `onChange`.
 * `fetchFn` wird übergeben, damit Tests eine Attrappe statt des Netzwerks verwenden können.
 */
export async function loadRegistrations(
  url: string,
  fetchFn: typeof fetch,
  onChange: (state: ViewState) => void,
): Promise<void> {
  onChange({ kind: "loading" });
  onChange(await fetchRegistrations(url, fetchFn));
}

async function fetchRegistrations(url: string, fetchFn: typeof fetch): Promise<ViewState> {
  try {
    const response = await fetchFn(url);
    if (!response.ok) {
      return {
        kind: "error",
        message: `Die Daten konnten nicht geladen werden (HTTP-Status ${response.status}).`,
      };
    }

    const json: unknown = await response.json();
    const result = parseRegistrations(json);
    if (!result.success) {
      return { kind: "error", message: `Die Antwort enthält ungültige Daten:\n${result.message}` };
    }
    if (result.registrations.length === 0) {
      return { kind: "empty" };
    }
    return { kind: "success", registrations: result.registrations };
  } catch (error) {
    return { kind: "error", message: error instanceof Error ? error.message : String(error) };
  }
}
