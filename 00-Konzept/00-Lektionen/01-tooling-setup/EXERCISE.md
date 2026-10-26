# Übungsentwurf: Prämienrechner – Projekt in Betrieb nehmen, Unit-Tests und ein erster Playwright-Test

Status: Übung angelegt in [Exercises/01-tooling-setup](../../../Exercises/01-tooling-setup). Die ausführliche Anleitung für die Teilnehmenden mit Schritt-für-Schritt-Lösungshinweisen steht in deren [README.md](../../../Exercises/01-tooling-setup/README.md); dieser Entwurf fasst Absicht und Entscheidungen zusammen.

## Rahmen

- Zeitbedarf: Teil 1 etwa 15 Minuten, Teil 2 (Unit-Tests) etwa 20 Minuten, Teil 3 (Playwright) etwa 20 Minuten.
- Voraussetzungen: vorbereiteter Laptop gemäss [_PREPARATION.md](../../../_PREPARATION.md) (Git, Node.js, npm, Chrome); keine TypeScript-Vorkenntnisse über Grundtypen hinaus. Keine globale Installation von Vite+ oder Playwright.

## Lernziel

Die Teilnehmenden können das Projekt installieren, starten, prüfen und bauen. Sie lesen einen Vitest-Test, verstehen eine Fehlermeldung, korrigieren einen Fehler und ergänzen begründete Testfälle. Sie finden einen Fehler, den die Unit-Tests nicht erfassen, im Browser und sichern das korrigierte Verhalten mit einem Playwright-Test ab.

## Szenario: Prämienrechner

Ein Formular berechnet eine monatliche Krankenkassenprämie nach **fiktiven** Tarifregeln (R1 bis R7 in der Übungsanleitung):

- Alter (Kind 0–18, junge Erwachsene 19–25, Erwachsene ab 26) bestimmt die Grundprämie.
- Franchise mit monatlichem Rabatt; Kinder und Erwachsene haben unterschiedliche erlaubte Franchisen.
- Versicherungsmodell Standard oder Hausarzt (8 % Rabatt), Zahnversicherung als Zuschlag.
- Monatsprämie auf 5 Rappen gerundet, Jahresprämie = 12 × Monatsprämie.
- R7: Ist die Franchise nach einem Wechsel der Altersgruppe nicht mehr erlaubt, wird die tiefste erlaubte gewählt.

Die Fachlogik liegt in reinen Funktionen ohne DOM (`src/premium.ts`: `ageGroup`, `allowedDeductibles`, `calculatePremium`; `src/rounding.ts`: `roundToFiveRappen`). Die Oberfläche in `src/main.ts` hält einen Zustand und rendert Franchise-Optionen und Prämie.

## Ausgangslage

- Unit-Tests: vier für `roundToFiveRappen`, fünf für `calculatePremium` und `allowedDeductibles`. Bewusst fehlen die Altersgrenzen (18/19, 25/26), ungültiges Alter und die Rundung bei genau 2.5 Rappen. Die Fehlervarianten `age < 18`, `age < 25` und `Math.ceil(amount * 20 - 0.5) / 20` werden von den vorhandenen Tests nicht erkannt.
- Ein Playwright-Test: Franchise 2500, Hausarzt, Zahnversicherung, erwartet CHF 317.85 und CHF 3814.20.
- **Eingebauter Interaktionsfehler (R7 fehlt):** Der Handler des Altersfelds baut die Franchise-Optionen neu auf, passt `state.deductible` aber nicht an. Beispiel: Alter 40, Franchise 2500, dann Alter 10. Die Auswahl zeigt «CHF 0», `calculatePremium` wirft einen `RangeError` in die Console, und die Anzeige bleibt bei CHF 322.35 stehen statt CHF 104.65. Der Fehler tritt nur auf, wenn die Franchise für die neue Gruppe nicht erlaubt ist («manchmal»). Im Code ist er nicht markiert.
- `AGENTS.md` mit Projektbefehlen, Hinweisen zur Playwright CLI und zum Vorgehen bei Fehlern.

## Aufgabe im Überblick

1. **Projekt in Betrieb nehmen:** `npm ci`, `npm run dev`, HMR beobachten, Typfehler `ageInput.value = 40;` (läuft im Browser, scheitert in `npm run check`), `npm run build` und `dist/` ansehen, Breakpoint in `premium.ts` über Source Maps.
2. **Unit-Tests:** Tests lesen (Arrange, Act, Assert; `toBe`, `toEqual`, `toThrow`), Rabatt auf `0.1` ändern und Expected/Received lesen, korrigieren, Altersgrenzen mit `it.each` ergänzen, mit den Fehlervarianten prüfen, ob die neuen Tests etwas prüfen.
3. **Ablauf im Browser:** vorhandenen Playwright-Test lesen, Kundenmeldung reproduzieren (Console!), Ursache im Handler finden, fehlschlagenden Playwright-Test schreiben, R7 umsetzen, alle Prüfungen ausführen.

Abnahmekriterien, Vertiefungen und Lösungshinweise stehen in der Übungsanleitung.

## Optional mit Agent

- Der Agent untersucht die laufende Seite mit der Playwright CLI (`npx playwright cli open --browser=chrome …`, `select`, `fill`, `console error`). Im Prototyp zeigt `console error` den `RangeError` mit Zeilenangaben aus `premium.ts` und `main.ts`.
- Auftrag in der Übungsanleitung: Fehler reproduzieren, zuerst einen fehlschlagenden Playwright-Test schreiben, dann gemäss R7 beheben.
- Gegenprobe in der Demo: derselbe Auftrag ohne Browserzugriff.
- Besonders prüfen: Test vor der Korrektur rot? Erwartete Werte aus den Regeln abgeleitet? Ursache behoben statt Symptom überdeckt (z. B. `try`/`catch`)?
- Alternativen: Chrome DevTools MCP, eingebauter Browser des Agenten oder Editors.

## Technische Umsetzung (geprüft)

Geprüft am 25. Oktober 2026 mit Node 26.12, npm 11.17, `vite-plus` 1.4.0, `vitest` 5.0.5 und `@playwright/test` 1.64.1:

- `vite-plus` als Entwicklungsabhängigkeit mit npm; `overrides` für `vite` (`npm:@voidzero-dev/vite-plus-core@1.4.0`) und `vitest` (`5.0.5`). `npm ci` aus dem Lockfile funktioniert.
- npm-Skripte `dev`, `check`, `test`, `build`, `preview` rufen das lokale `vp` auf; `e2e` ruft `playwright test` auf. `npx vp …` funktioniert ebenfalls.
- Playwright mit `channel: "chrome"` und `webServer: npm run dev` im installierten Chrome, ohne Browser-Download; `trace: "retain-on-failure"`.
- `npx playwright cli` ist in `@playwright/test` enthalten. Codegen braucht `--channel=chrome`.
- Vitest ist auf `src/**/*.test.ts` beschränkt, damit `vp test` die Playwright-Dateien nicht aufgreift. `.playwright-cli/`, `test-results/` und `playwright-report/` stehen in `.gitignore`, sonst schlägt die Formatprüfung fehl.
- Lösungsweg durchgespielt: Regressionstest vor der Korrektur rot (Expected «CHF 104.65», Received «CHF 322.35»), danach grün; `toHaveValue("0")` besteht schon vorher.
- Noch zu prüfen: Node 24.11 und 22.18 mit ihrer jeweiligen npm-Version; Windows.

## Material aus 2025

- `04-web-platform/04-json/json.test.ts` im Vorjahresrepository als Beispiel für einen minimalen Vitest-Test.
- Playwright-Folie in [05-FrontendTooling.pdf](../../../../modern-frontend-bsi-2025/00-CourseMaterial/05-FrontendTooling.pdf), S. 38.

## Entscheidungen

- Szenario Prämienrechner statt Kasse, wegen der Nähe zur Versicherungsdomäne. Die Tarifregeln sind bewusst wenige und als fiktiv markiert.
- Vite+ ist Entwicklungsabhängigkeit des Übungsprojekts; die Übung läuft mit Node.js und npm aus `_PREPARATION.md`. Keine globale Installation von Vite+.
- Playwright wird bereits in Block 1 eingeführt; Block 6 und 7 vertiefen.
- Browserinspektion durch Agenten mit der Playwright CLI; Chrome DevTools MCP und eingebaute Browser als Alternativen.
- Lösungshinweise stehen ausklappbar in der Übungsanleitung, nicht in einem separaten Lösungsordner.

## Offene Punkte für die Review

- **Zeit:** Die drei Teile benötigen zusammen etwa 55 Minuten Übungszeit. Reicht das im 120-Minuten-Block, oder werden Build und Source Maps zur Demo?
- **Starter:** [01-Starter/vanilla-vite-plus](../../../01-Starter/vanilla-vite-plus) ist weiterhin auf pnpm ausgelegt. Die Übung ist eigenständig auf npm umgestellt; soll der Starter nachgezogen werden?
- **Node-Prüfung bei der Vorbereitung:** `engines` in der Übung führt bei zu alter Node-Version nur zu einer Warnung. `01-Starter/vanilla-vite` prüft die Version nicht.
