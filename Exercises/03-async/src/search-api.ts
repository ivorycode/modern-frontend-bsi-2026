/** Sucht Begriffe; ein übergebenes Signal kann die Suche abbrechen. */
export type SearchTerms = (query: string, signal?: AbortSignal) => Promise<string[]>;

/**
 * Sucht über die Such-API nach Begriffen.
 * Kurze Suchbegriffe (ein oder zwei Zeichen) beantwortet die API absichtlich langsam.
 */
export async function searchTerms(query: string, signal?: AbortSignal): Promise<string[]> {
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal });
  if (!response.ok) {
    throw new Error(`Die Suche ist fehlgeschlagen (HTTP ${response.status}).`);
  }
  const data: { results: string[] } = await response.json();
  return data.results;
}
