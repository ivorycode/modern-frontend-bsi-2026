import { map, mergeMap, type Observable } from "rxjs";
import type { SearchTerms$ } from "./search-api.ts";

/** Treffer zu einem Suchbegriff oder der Fehler, an dem die Suche gescheitert ist. */
export type SearchResult = { query: string; results: string[] } | { query: string; error: unknown };

/**
 * Macht aus einem Strom von Suchbegriffen einen Strom von Suchresultaten.
 * Vertiefung 2: Veraltete Antworten dürfen kein neueres Resultat überschreiben,
 * und nach einem Fehler muss die Suche weiter funktionieren.
 */
export function searchResults(
  queries: Observable<string>,
  searchTerms$: SearchTerms$,
): Observable<SearchResult> {
  return queries.pipe(
    mergeMap((query) => searchTerms$(query).pipe(map((results) => ({ query, results })))),
  );
}
