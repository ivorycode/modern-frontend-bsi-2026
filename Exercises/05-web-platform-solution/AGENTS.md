# Übung 5: Geräteverleih

Kleines Vite+-Projekt mit TypeScript, Zod und Mock Service Worker (MSW 3) ohne Framework. Die Seite lädt Geräte mit `fetch` von einer lokalen API in `server/api.ts` (Node.js ohne Framework, Port 3105, anderer Origin als die Seite). Über `?scenario=…` liefert die API absichtlich Fehlerantworten; `/api/devices/archived` sendet absichtlich keinen CORS-Header. Laden und Fehlerklasse in `src/api.ts`, Schemas in `src/device.ts`, Oberfläche in `src/device-view.ts`, MSW-Handler in `src/mocks/`. Aufgabe und Lernziele stehen in `README.md`.

## Projektbefehle

Alle Werkzeuge sind lokal installiert; kein globales `vp` verwenden oder voraussetzen.

- `npm ci` – Abhängigkeiten installieren
- `npm run api` – Geräte-API auf `http://localhost:3105/` (startet bei Änderungen neu)
- `npm run dev` – Entwicklungsserver auf `http://localhost:5277/` (fester Port; die API erlaubt nur diesen Origin)
- `npm run check` – Formatierung, Linting und Typprüfung; `npx vp check --fix` korrigiert Formatierung
- `npm test` – Unit-Tests (Vitest, `src/**/*.test.ts`) mit MSW; Imports aus `vite-plus/test`
- `npm run e2e` – Playwright-Tests in `e2e/` im installierten Chrome; startet API und Entwicklungsserver bei Bedarf

## Browser untersuchen

Die laufende Seite mit der Playwright CLI öffnen und bedienen, nicht nur aus dem Code schliessen. API und Entwicklungsserver müssen laufen.

- `npx playwright cli open --browser=chrome http://localhost:5277/`
- `npx playwright cli snapshot`, `select`, `click`, `console error`, `requests`, `screenshot`
- `npx playwright cli close` am Ende

Keine eigenen Browser herunterladen (`playwright install` nicht ausführen); `channel: "chrome"` ist konfiguriert.

## Regeln für Änderungen

- Die Szenarien in `server/api.ts` sind Testfälle der Übung; nicht entfernen oder «reparieren», um Fehler auf der Seite zu beheben. Ausnahme: der fehlende CORS-Header in Teil 2.
- Tests verwenden MSW wie in `src/test-setup.ts` vorbereitet: Antworten pro Test mit `server.use(…)`. Kein `vi.stubGlobal` oder `vi.spyOn` für `fetch`, kein echtes Netzwerk, keine echten Wartezeiten. `onUnhandledFrame: "error"` und die Prüfung auf Requests ohne Handler nicht lockern.
- CORS-Fehler nicht mit `mode: "no-cors"` umgehen; die Antwort wäre opak und unlesbar.
- Kein `any`, keine Type Assertion (`as`) und keine Non-Null Assertion (`!`) im Code. Antworten als `unknown` behandeln und mit Zod prüfen.
- Zuerst einen Test schreiben, der fehlschlägt; danach `npm run check`, `npm test` und `npm run e2e` ausführen.
