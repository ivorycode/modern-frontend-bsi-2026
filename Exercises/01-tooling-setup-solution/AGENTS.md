# Übung 1: Prämienrechner

Kleines Vite+-Projekt mit TypeScript ohne Framework. Die fachlichen Regeln R1 bis R7 stehen in `docs/REGELN.md`; erwartete Werte in Tests daraus ableiten, nicht aus dem aktuellen Verhalten.

`README.md` nicht lesen: Es ist die Anleitung für die Teilnehmenden und enthält die Lösungen.

## Projektbefehle

Alle Werkzeuge sind lokal installiert; kein globales `vp` verwenden oder voraussetzen.

- `npm ci` – Abhängigkeiten installieren
- `npm run dev` – Entwicklungsserver auf `http://localhost:5273/`
- `npm run check` – Formatierung, Linting und Typprüfung; `npx vp check --fix` korrigiert Formatierung
- `npm test` – Unit-Tests (Vitest, `src/**/*.test.ts`); Imports aus `vite-plus/test`
- `npm run e2e` – Playwright-Tests in `e2e/` im installierten Chrome
- `npm run build` – Produktionsbuild

## Browser untersuchen

Die laufende Seite mit der Playwright CLI öffnen und bedienen, nicht nur aus dem Code schliessen:

- `npx playwright cli open --browser=chrome http://localhost:5273/`
- `npx playwright cli snapshot`, `fill`, `select`, `click`, `console error`, `screenshot`
- `npx playwright cli close` am Ende

Keine eigenen Browser herunterladen (`playwright install` nicht ausführen); `channel: "chrome"` ist konfiguriert.

## Vorgehen bei Fehlern

1. Fehler im Browser reproduzieren und Console prüfen.
2. Zuerst einen Test schreiben, der fehlschlägt.
3. Ursache beheben, nicht das Symptom überdecken (kein `try`/`catch`, das Fehler verschluckt).
4. `npm run check`, `npm test` und `npm run e2e` ausführen.
