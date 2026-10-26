// Hilfsmittel für die Unit-Tests: Attrappen, deren Antworten der Test selbst
// auflöst oder ablehnt. So bestimmt der Test Zeitpunkt und Reihenfolge der
// Antworten, ohne Netzwerk und ohne echte Wartezeiten.

import type { SearchTerms } from "./search-api.ts";
import type { FetchWord } from "./word-api.ts";

/**
 * Wartet, bis alle anstehenden Promise-Reaktionen gelaufen sind.
 * `setTimeout` reiht eine Task ein. Die Event Loop führt sie erst aus, wenn die
 * Microtask-Queue leer ist, also jedes `then` und jedes `await` weitergelaufen ist,
 * soweit es nicht auf eine noch offene Antwort wartet.
 */
export function flushPromises(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

interface PendingWord {
  index: number;
  resolve: (word: string) => void;
  reject: (error: Error) => void;
}

/**
 * Attrappe für `fetchWord`: Jeder Aufruf liefert ein offenes Promise, das der
 * Test mit `respond` erfüllt oder mit `fail` ablehnt.
 */
export function createFakeFetchWord() {
  const requests: PendingWord[] = [];

  const fetchWord: FetchWord = (index) => {
    const { promise, resolve, reject } = Promise.withResolvers<string>();
    requests.push({ index, resolve, reject });
    return promise;
  };

  function request(index: number): PendingWord {
    const pending = requests.find((request) => request.index === index);
    if (!pending) throw new Error(`Wort ${index} wurde (noch) nicht angefragt.`);
    return pending;
  }

  return {
    fetchWord,
    /** Indizes der bisher angefragten Wörter in der Reihenfolge der Anfragen. */
    requestedIndexes: () => requests.map((request) => request.index),
    /** Beantwortet die Anfrage für das Wort mit diesem Index. */
    respond: (index: number, word: string) => request(index).resolve(word),
    /** Lässt die Anfrage für das Wort mit diesem Index fehlschlagen. */
    fail: (index: number, error: Error) => request(index).reject(error),
  };
}

interface PendingSearch {
  query: string;
  signal: AbortSignal | undefined;
  resolve: (results: string[]) => void;
  reject: (error: Error) => void;
}

/**
 * Attrappe für `searchTerms`. Wie bei `fetch` wird das Promise abgelehnt,
 * sobald das übergebene Signal abbricht.
 */
export function createFakeSearchTerms() {
  const requests: PendingSearch[] = [];

  const searchTerms: SearchTerms = (query, signal) => {
    const { promise, resolve, reject } = Promise.withResolvers<string[]>();
    signal?.addEventListener("abort", () => reject(signal.reason));
    requests.push({ query, signal, resolve, reject });
    return promise;
  };

  function request(query: string): PendingSearch {
    const pending = requests.find((request) => request.query === query);
    if (!pending) throw new Error(`Nach «${query}» wurde (noch) nicht gesucht.`);
    return pending;
  }

  return {
    searchTerms,
    /** Suchbegriffe in der Reihenfolge der Anfragen. */
    queries: () => requests.map((request) => request.query),
    /** Wurde die Suche nach diesem Begriff abgebrochen? */
    isAborted: (query: string) => request(query).signal?.aborted ?? false,
    /** Beantwortet die Suche nach diesem Begriff. */
    respond: (query: string, results: string[]) => request(query).resolve(results),
    /** Lässt die Suche nach diesem Begriff fehlschlagen. */
    fail: (query: string, error: Error) => request(query).reject(error),
  };
}
