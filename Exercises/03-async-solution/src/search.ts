import type { SearchTerms } from "./search-api.ts";

/** Darstellung der Suche; die Umsetzung mit dem DOM steht in search-main.ts. */
export interface SearchView {
  showResults: (query: string, results: string[]) => void;
  showError: (message: string) => void;
}

/**
 * Erzeugt die Funktion, die bei jeder Eingabe aufgerufen wird: Sie sucht nach
 * dem Begriff und zeigt die Treffer oder eine Fehlermeldung an.
 */
export function createSearch(
  searchTerms: SearchTerms,
  view: SearchView,
): (query: string) => Promise<void> {
  let controller: AbortController | undefined;

  return async (query) => {
    // Die vorherige Suche abbrechen, damit ihre Antwort die neuere nicht überschreibt.
    controller?.abort();
    controller = new AbortController();
    // Lokal merken: Im catch gehört `controller` womöglich schon zur nächsten Suche.
    const signal = controller.signal;

    try {
      const results = await searchTerms(query, signal);
      view.showResults(query, results);
    } catch {
      if (signal.aborted) return;
      view.showError("Die Suche ist fehlgeschlagen.");
    }
  };
}
