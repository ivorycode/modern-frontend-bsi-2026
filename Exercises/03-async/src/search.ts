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
  return async (query) => {
    try {
      const results = await searchTerms(query);
      view.showResults(query, results);
    } catch {
      view.showError("Die Suche ist fehlgeschlagen.");
    }
  };
}
