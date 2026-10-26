# Übung 4: Kursanmeldungen

Kleines Vite+-Projekt mit TypeScript und Zod ohne Framework. Die Seite lädt Kursanmeldungen mit `fetch` aus JSON-Dateien in `public/api/` (simulierte API-Antworten, teilweise absichtlich fehlerhaft). Typ und Hilfsfunktionen in `src/registration.ts`, Anzeigezustand und Laden in `src/load-registrations.ts`, Oberfläche in `src/registration-view.ts`. Aufgabe und Lernziele stehen in `README.md`.

## Projektbefehle

Alle Werkzeuge sind lokal installiert; kein globales `vp` verwenden oder voraussetzen.

- `npm ci` – Abhängigkeiten installieren
- `npm run dev` – Entwicklungsserver auf `http://localhost:5176/` (fester Port, ohne SPA-Fallback: fehlende Dateien liefern 404)
- `npm run check` – Formatierung, Linting und Typprüfung; `npx vp check --fix` korrigiert Formatierung
- `npm test` – Unit-Tests (Vitest, `src/**/*.test.ts`); Imports aus `vite-plus/test`
- `npm run e2e` – Playwright-Tests in `e2e/` im installierten Chrome

## Browser untersuchen

Die laufende Seite mit der Playwright CLI öffnen und bedienen, nicht nur aus dem Code schliessen:

- `npx playwright cli open --browser=chrome http://localhost:5176/`
- `npx playwright cli snapshot`, `select`, `click`, `console error`, `screenshot`
- `npx playwright cli close` am Ende

Keine eigenen Browser herunterladen (`playwright install` nicht ausführen); `channel: "chrome"` ist konfiguriert.

## Regeln für Änderungen

- Die Dateien in `public/api/` sind Testdaten der Übung; nicht korrigieren, um Fehler zu beheben.
- Kein `any`, keine Type Assertion (`as`) und keine Non-Null Assertion (`!`) im Code. Daten von aussen als `unknown` behandeln und mit Zod prüfen.
- Typen aus dem Schema ableiten (`z.infer`), nicht zusätzlich von Hand schreiben.
- Tests verwenden eine `fetch`-Attrappe, kein Netzwerk und keine echten Wartezeiten.
- Zuerst einen Test schreiben, der fehlschlägt; danach `npm run check`, `npm test` und `npm run e2e` ausführen.
