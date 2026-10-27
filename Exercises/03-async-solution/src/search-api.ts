import type { Observable } from "rxjs";
import { fromFetch } from "rxjs/fetch";

/** Sucht Begriffe; ein übergebenes Signal kann die Suche abbrechen. */
export type SearchTerms = (query: string, signal?: AbortSignal) => Promise<string[]>;

/** Sucht Begriffe als Observable; Abmelden bricht die Suche ab. */
export type SearchTerms$ = (query: string) => Observable<string[]>;

const searchUrl = (query: string) => `/api/search?q=${encodeURIComponent(query)}`;

async function readResults(response: Response): Promise<string[]> {
  if (!response.ok) {
    throw new Error(`Die Suche ist fehlgeschlagen (HTTP ${response.status}).`);
  }
  const data: { results: string[] } = await response.json();
  return data.results;
}

/**
 * Sucht über die Such-API nach Begriffen (Vertiefung 1).
 * Kurze Suchbegriffe (ein oder zwei Zeichen) beantwortet die API absichtlich langsam.
 */
export async function searchTerms(query: string, signal?: AbortSignal): Promise<string[]> {
  return readResults(await fetch(searchUrl(query), { signal }));
}

/**
 * Dieselbe Suche als Observable (Vertiefung 2). `fromFetch` startet den Request
 * erst beim Anmelden und bricht ihn beim Abmelden mit einem `AbortController` ab.
 * Dank `selector` gilt das auch noch, während die Antwort gelesen wird.
 */
export const searchTerms$: SearchTerms$ = (query) =>
  fromFetch(searchUrl(query), { selector: readResults });
