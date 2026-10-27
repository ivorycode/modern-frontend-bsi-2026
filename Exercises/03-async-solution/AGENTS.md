# Übung 3: Wörter laden

Kleines Vite+-Projekt mit TypeScript ohne Framework. Die Seite lädt einen Satz Wort für Wort mit `fetch` von einer lokalen API in `server/api.ts` (Node.js ohne Framework, Port 3103, zufällige Verzögerung 0,2–1,2 s pro Wort). Der Entwicklungsserver leitet `/api` an die API weiter. Fachlogik in `src/sentence.ts` (ohne DOM), Oberfläche in `src/sentence-view.ts`, Attrappen für Tests in `src/test-helpers.ts`. Die Vertiefungen verwenden `suche.html` mit `src/search.ts` (Promise-Variante) und `src/search-rx.ts` (RxJS). `src/search-api.ts` sucht als Promise (`searchTerms`) und als Observable mit `fromFetch` (`searchTerms$`). Aufgabe und Lernziele stehen in `README.md`.

## Projektbefehle

Alle Werkzeuge sind lokal installiert; kein globales `vp` verwenden oder voraussetzen.

- `npm ci` – Abhängigkeiten installieren
- `npm run api` – Wort- und Such-API auf `http://localhost:3103/` (startet bei Änderungen neu)
- `npm run dev` – Entwicklungsserver auf `http://localhost:5275/` (fester Port; leitet `/api` an die API weiter)
- `npm run check` – Formatierung, Linting und Typprüfung; `npx vp check --fix` korrigiert Formatierung
- `npm test` – Unit-Tests (Vitest, `src/**/*.test.ts`); Imports aus `vite-plus/test`
- `npm run e2e` – Playwright-Tests in `e2e/` im installierten Chrome; startet API und Entwicklungsserver bei Bedarf

## Browser untersuchen

Die laufende Seite mit der Playwright CLI öffnen und bedienen, nicht nur aus dem Code schliessen. API und Entwicklungsserver müssen laufen.

- `npx playwright cli open --browser=chrome http://localhost:5275/` (Suche: `/suche.html`, RxJS-Variante: `/suche.html?umsetzung=rxjs`)
- `npx playwright cli snapshot`, `select`, `click`, `type`, `console error`, `requests`, `screenshot`
- `npx playwright cli close` am Ende

Keine eigenen Browser herunterladen (`playwright install` nicht ausführen); `channel: "chrome"` ist konfiguriert.

## Regeln für Änderungen

- `server/api.ts`, `src/search-api.ts`, `src/test-helpers.ts` und `e2e/` nicht ändern. Verzögerungen und das Fehlerszenario der API sind Teil der Übung.
- Unit-Tests verwenden die Attrappen aus `src/test-helpers.ts` und `flushPromises`: kein echtes Netzwerk, kein `vi.stubGlobal` für `fetch`, keine echten Wartezeiten (`setTimeout` mit Verzögerung, `vi.waitFor`), keine Fake Timers.
- Tests zur Reihenfolge prüfen die Reihenfolge der Anfragen (`requestedIndexes`), nicht nur das Endergebnis.
- Fehler in `src/sentence.ts` nicht abfangen; die Lade-Funktionen lehnen ab, die Ansicht stellt den Fehler dar.
- Race Conditions in der Suche durch Abbruch beheben, nicht allein durch Debouncing: in `src/search.ts` mit `AbortController`, in `src/search-rx.ts` mit `switchMap` über `searchTerms$` (`fromFetch` bricht beim Abmelden ab; kein eigener `AbortController`). Fehler dort mit `catchError` innerhalb von `switchMap` abfangen, damit die Suche weiterläuft.
- Zuerst einen Test schreiben, der fehlschlägt; danach `npm run check`, `npm test` und `npm run e2e` ausführen.
