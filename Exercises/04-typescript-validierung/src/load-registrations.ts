import type { Registration } from "./registration.ts";

/** Was die Seite gerade anzeigt. */
export interface ViewState {
  isLoading: boolean;
  error?: string;
  data?: Registration[];
}

/**
 * Lädt die Anmeldungen von `url` in `state` und ruft `onChange` nach jeder Änderung auf.
 * `fetchFn` wird übergeben, damit Tests eine Attrappe statt des Netzwerks verwenden können.
 */
export async function loadRegistrations(
  state: ViewState,
  url: string,
  fetchFn: typeof fetch,
  onChange: () => void,
): Promise<void> {
  state.isLoading = true;
  onChange();

  try {
    const response = await fetchFn(url);
    if (!response.ok) {
      throw new Error(`Die Daten konnten nicht geladen werden (HTTP-Status ${response.status}).`);
    }
    state.data = (await response.json()) as Registration[];
  } catch (error) {
    state.error = error instanceof Error ? error.message : String(error);
  } finally {
    state.isLoading = false;
  }

  onChange();
}
