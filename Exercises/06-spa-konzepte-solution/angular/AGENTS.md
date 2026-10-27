# Übung 6 (Angular): Schadenfälle

Kleine SPA mit Angular 22 (Standalone Components, Signals, zoneless), Angular Router und Angular CLI; kein Vite+. Sie lädt Schadenfälle von einer lokalen API in `server/api.ts` (Node.js ohne Framework, Port 3283, Antworten mit 600 ms Verzögerung). Der Entwicklungsserver (`ng serve`, Port 5283) leitet `/api` per Proxy (`proxy.conf.json`) an die API weiter; die Seite verwendet relative URLs. Serverzustand mit `httpResource` in `src/app/claims/claim-resources.ts`, reine Filterfunktion in `src/app/claims/filter-claims.ts`, Seiten in `src/app/pages/`, Routen in `src/app/app.routes.ts`. `withComponentInputBinding()` bindet Routen- und Query-Parameter an Inputs. Aufgabe und Lernziele stehen in `README.md`.

Dieselbe Übung existiert als eigenständiges Projekt in `../react` und `../vue`. Es gibt keinen gemeinsamen Code; nichts aus anderen Ordnern importieren oder verlinken.

## Projektbefehle

Alle Werkzeuge sind lokal installiert; keine globale Angular CLI verwenden oder voraussetzen (`npx ng …`).

- `npm ci` – Abhängigkeiten installieren
- `npm run api` – Schadenfall-API auf `http://localhost:3283/` (startet bei Änderungen neu)
- `npm run dev` – Entwicklungsserver auf `http://localhost:5283/` (fester Port, Proxy für `/api`)
- `npm run check` – Prettier (`--check`), `ng lint` (angular-eslint) und `ng build` als Typprüfung der Templates; `npx prettier --write .` korrigiert Formatierung
- `npm test` – Unit-Tests mit `ng test` (Vitest, `src/**/*.spec.ts`); Imports aus `vitest`
- `npm run e2e` – Playwright-Tests in `e2e/` im installierten Chrome; startet API und Entwicklungsserver bei Bedarf

## Browser untersuchen

Die laufende Seite mit der Playwright CLI öffnen und bedienen, nicht nur aus dem Code schliessen. API und Entwicklungsserver müssen laufen.

- `npx playwright cli open --browser=chrome http://localhost:5283/`
- `npx playwright cli snapshot`, `fill`, `click`, `go-back`, `console error`, `requests`, `screenshot`
- `npx playwright cli close` am Ende

Keine eigenen Browser herunterladen (`playwright install` nicht ausführen); `channel: "chrome"` ist konfiguriert.

## Regeln für Änderungen

- Die Schwächen in `src/app/pages/claim-list-page.ts` und `.html` sind der Ausgangsstand der Übung. Nur ändern, wenn die Aufgabe es verlangt.
- `server/api.ts` nicht ändern; Daten und Verzögerung sind Teil der Übung.
- Suchbegriff als Query-Parameter `q` in der URL, Detailroute `/claims/:id`. Abgeleiteten Zustand mit `computed` berechnen, nicht mit `signal` und `effect` nachführen. Für das Filtern `filterClaims` verwenden.
- `e2e/claims.spec.ts` muss unverändert auch in `../react` und `../vue` laufen: nur nutzernahe Locators (`getByRole`, `getByLabel`, `getByText`), keine CSS-Selektoren, kein `data-testid`, kein `waitForTimeout`. Erwartete Texte nicht an fehlerhaftes Verhalten anpassen.
- Kein `any`, keine Non-Null Assertion (`!`). Imports ohne Dateiendung, wie in Angular üblich.
- Danach `npm run check`, `npm test` und `npm run e2e` ausführen.
