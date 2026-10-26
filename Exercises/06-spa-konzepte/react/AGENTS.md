# Übung 6 (React): Schadenfälle

Kleine SPA mit React 19, React Router (Declarative Mode, `BrowserRouter`) und Vite+. Sie lädt Schadenfälle von einer lokalen API in `server/api.ts` (Node.js ohne Framework, Port 3181, Antworten mit 600 ms Verzögerung). Der Entwicklungsserver (Port 5181) leitet `/api` per Proxy an die API weiter; die Seite verwendet relative URLs. Serverzustand in `src/claims/use-claims.ts`, reine Filterfunktion in `src/claims/filter-claims.ts`, Seiten in `src/pages/`, Routen in `src/App.tsx`. Aufgabe und Lernziele stehen in `README.md`.

Dieselbe Übung existiert als eigenständiges Projekt in `../vue` und `../angular`. Es gibt keinen gemeinsamen Code; nichts aus anderen Ordnern importieren oder verlinken.

## Projektbefehle

Alle Werkzeuge sind lokal installiert; kein globales `vp` verwenden oder voraussetzen.

- `npm ci` – Abhängigkeiten installieren
- `npm run api` – Schadenfall-API auf `http://localhost:3181/` (startet bei Änderungen neu)
- `npm run dev` – Entwicklungsserver auf `http://localhost:5181/` (fester Port, Proxy für `/api`)
- `npm run check` – Formatierung, Linting und Typprüfung; `npx vp check --fix` korrigiert Formatierung
- `npm test` – Unit-Tests (Vitest, `src/**/*.test.ts`); Imports aus `vite-plus/test`
- `npm run e2e` – Playwright-Tests in `e2e/` im installierten Chrome; startet API und Entwicklungsserver bei Bedarf

## Browser untersuchen

Die laufende Seite mit der Playwright CLI öffnen und bedienen, nicht nur aus dem Code schliessen. API und Entwicklungsserver müssen laufen.

- `npx playwright cli open --browser=chrome http://localhost:5181/`
- `npx playwright cli snapshot`, `fill`, `click`, `go-back`, `console error`, `requests`, `screenshot`
- `npx playwright cli close` am Ende

Keine eigenen Browser herunterladen (`playwright install` nicht ausführen); `channel: "chrome"` ist konfiguriert.

## Regeln für Änderungen

- Die Schwächen in `src/pages/ClaimListPage.tsx` sind der Ausgangsstand der Übung. Nur ändern, wenn die Aufgabe es verlangt.
- `server/api.ts` nicht ändern; Daten und Verzögerung sind Teil der Übung.
- Suchbegriff als Query-Parameter `q` in der URL, Detailroute `/claims/:id`. Abgeleiteten Zustand berechnen, nicht mit `useState` und `useEffect` nachführen. Für das Filtern `filterClaims` verwenden.
- `e2e/claims.spec.ts` muss unverändert auch in `../vue` und `../angular` laufen: nur nutzernahe Locators (`getByRole`, `getByLabel`, `getByText`), keine CSS-Selektoren, kein `data-testid`, kein `waitForTimeout`. Erwartete Texte nicht an fehlerhaftes Verhalten anpassen.
- Kein `any`, keine Non-Null Assertion (`!`).
- Danach `npm run check`, `npm test` und `npm run e2e` ausführen.
