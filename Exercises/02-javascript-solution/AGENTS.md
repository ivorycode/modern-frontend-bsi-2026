# Übung 2: Einkaufslisten

Kleines Vite+-Projekt mit TypeScript ohne Framework. Fachlogik in `src/shopping-list.ts` (ohne DOM), Oberfläche in `src/list-view.ts`. Aufgabe und Lernziele stehen in `README.md`.

## Projektbefehle

Alle Werkzeuge sind lokal installiert; kein globales `vp` verwenden oder voraussetzen.

- `npm ci` – Abhängigkeiten installieren
- `npm run dev` – Entwicklungsserver auf `http://localhost:5274/` (fester Port)
- `npm run check` – Formatierung, Linting und Typprüfung; `npx vp check --fix` korrigiert Formatierung
- `npm test` – Unit-Tests (Vitest, `src/**/*.test.ts`); Imports aus `vite-plus/test`
- `npm run e2e` – Playwright-Tests in `e2e/` im installierten Chrome

## Browser untersuchen

Die laufende Seite mit der Playwright CLI öffnen und bedienen, nicht nur aus dem Code schliessen:

- `npx playwright cli open --browser=chrome http://localhost:5274/`
- `npx playwright cli snapshot`, `fill`, `click`, `console error`, `screenshot`
- `npx playwright cli close` am Ende

Keine eigenen Browser herunterladen (`playwright install` nicht ausführen); `channel: "chrome"` ist konfiguriert.

## Vorgehen bei Fehlern

1. Fehler im Browser reproduzieren und Console prüfen.
2. Zuerst einen Test schreiben, der fehlschlägt.
3. Ursache beheben, nicht das Symptom überdecken: keine tiefen Kopien, um Mutationen auszugleichen; keine Tests, die geteilten Zustand verstecken.
4. `npm run check`, `npm test` und `npm run e2e` ausführen.
