import { Observable, switchMap } from "rxjs";
import type { SearchTerms } from "./search-api.ts";

export interface SearchResult {
  query: string;
  results: string[];
}

/**
 * Macht aus einem Strom von Suchbegriffen einen Strom von Suchresultaten.
 * Vertiefung 2: Veraltete Antworten dürfen kein neueres Resultat überschreiben.
 */
export function searchResults(
  queries: Observable<string>,
  searchTerms: SearchTerms,
): Observable<SearchResult> {
  return queries.pipe(
    switchMap(
      (query) =>
        new Observable<SearchResult>((subscriber) => {
          const controller = new AbortController();
          searchTerms(query, controller.signal).then(
            (results) => {
              subscriber.next({ query, results });
              subscriber.complete();
            },
            (error) => subscriber.error(error),
          );
          // Läuft, wenn switchMap auf einen neuen Suchbegriff wechselt.
          return () => controller.abort();
        }),
    ),
  );
}
