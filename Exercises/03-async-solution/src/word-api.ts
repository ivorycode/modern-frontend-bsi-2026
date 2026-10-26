/** Anzahl Wörter im Satz der Wort-API. */
export const WORD_COUNT = 9;

/** Lädt das Wort mit dem angegebenen Index (ab 0). */
export type FetchWord = (index: number) => Promise<string>;

/**
 * Lädt ein einzelnes Wort von der Wort-API.
 * Im Szenario «error» antwortet die API für Wort 5 mit einem Serverfehler.
 * Bei einem HTTP-Fehler wird das Promise abgelehnt.
 */
export async function fetchWord(index: number, scenario = "ok"): Promise<string> {
  const response = await fetch(`/api/words/${index}?scenario=${scenario}`);
  if (!response.ok) {
    throw new Error(`Wort ${index + 1} konnte nicht geladen werden (HTTP ${response.status}).`);
  }
  const data: { word: string } = await response.json();
  return data.word;
}
