import type { FetchWord } from "./word-api.ts";

// Beide Funktionen erhalten die Lade-Funktion als Parameter. Die Seite übergibt
// das echte fetchWord, die Tests eine Attrappe (siehe test-helpers.ts).
// WORD_COUNT aus word-api.ts gibt an, wie viele Wörter der Satz hat.

/**
 * Fragt alle Wörter gleichzeitig an und liefert sie in der Reihenfolge des Satzes,
 * sobald alle eingetroffen sind.
 */
export async function loadSentenceParallel(fetchWord: FetchWord): Promise<string[]> {
  // TODO Schritt 1.4: Bisher wird nur das erste Wort geladen.
  return [await fetchWord(0)];
}

/**
 * Lädt die Wörter nacheinander: Das nächste Wort wird erst angefragt, wenn das
 * vorherige eingetroffen ist. Ruft `onWord` für jedes Wort auf, sobald es da ist.
 */
export async function loadSentenceSequential(
  fetchWord: FetchWord,
  onWord: (word: string) => void,
): Promise<string[]> {
  // TODO Schritt 1.6: Bisher wird nur das erste Wort geladen.
  const word = await fetchWord(0);
  onWord(word);
  return [word];
}
