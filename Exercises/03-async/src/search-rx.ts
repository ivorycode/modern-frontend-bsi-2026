import { mergeMap, type Observable } from "rxjs";
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
  return queries.pipe(mergeMap(async (query) => ({ query, results: await searchTerms(query) })));
}
