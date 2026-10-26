# Lektion 1: Tooling, Projekt-Setup und Testing-Grundlagen

Tag 1, 120 Minuten, davon etwa 40 Minuten Testing-Grundlagen (Vitest und ein erster Playwright-Test) und 15 bis 20 Minuten Agenten-Demonstration mit Browserinspektion.

## Ziel der Lektion

Alle Teilnehmenden arbeiten in einer funktionierenden, gemeinsamen Umgebung, verstehen die Aufgaben der Werkzeuge im Starter und nutzen Tests als unmittelbare Rückmeldung. Sie erleben, dass Unit-Tests und ein Ablauftest im Browser unterschiedliche Aussagen belegen. Die folgenden Blöcke setzen genau diesen Arbeitsablauf voraus.

## Themen

- **Kurseinstieg:** Ausrichtung des Kurses (verstehen, entwickeln, überprüfen), Übungsformat mit kleinen, unabhängigen Ausgangsständen, Coding Agents als optionale Unterstützung.
- **Aufbau eines modernen Frontend-Projekts:** `index.html` als Einstiegspunkt, `src/`, `public/`, `package.json`, Lockfile, `tsconfig.json`, `vite.config.ts`, `playwright.config.ts`.
- **Paketverwaltung kompakt mit npm:** Abhängigkeiten und Entwicklungsabhängigkeiten, semantische Versionierung, `package-lock.json` und reproduzierbare Installation mit `npm ci`; `overrides` in `package.json`, damit alle Pakete dieselbe Vite- und Vitest-Version verwenden. pnpm und andere Paketmanager höchstens als einzeilige Einordnung.
- **Supply Chain in einem Satz pro Punkt:** Grösse des Abhängigkeitsgraphen, Audit-Werkzeuge und ihre Grenzen, Install-Scripts von Abhängigkeiten (neuere npm-Versionen melden ungeprüfte Scripts und führen `allowScripts` mit `npm approve-scripts` ein; derzeit nur als Hinweis, eine spätere Version soll sie blockieren), private Registries im Unternehmen.
- **Aufgaben der Toolchain:** Entwicklungsserver mit HMR, Transformation von TypeScript ohne Typprüfung, separate Typprüfung, Linting und Formatierung, Tests, Produktionsbuild.
- **Vite und Vite+:**
  - Unbundled Development Server gegenüber gebündeltem Produktionsbuild; aktuelle Build-Architektur mit Rolldown und Oxc.
  - Vite+ als Toolchain des Kurses, installiert als Entwicklungsabhängigkeit des Projekts: `vp dev`, `vp check` (Oxfmt, Oxlint und Typprüfung), `vp test` (Vitest), `vp build`.
  - Aufruf über npm-Skripte (`npm run dev`, `npm run check`, `npm test`, `npm run build`); ohne Skript über `npx vp …`.
  - Das globale `vp`-CLI (Verwaltung von Node.js und Paketmanagern) wird nur erwähnt, aber nicht benötigt.
- **Build-Ergebnis verstehen:** Inhalt von `dist/`, Minifizierung, Hashes im Dateinamen für Cache-Busting, Source Maps für das Debugging.
- **Browser-Entwicklerwerkzeuge:** Elements, Console, Network und Sources mit Source Maps; Breakpoint im TypeScript-Quellcode setzen.
- **Git als Sicherheitsnetz:** kleine Schritte, `git diff` lesen, Übungsordner auf den Ausgangsstand zurücksetzen.
- **Testing-Grundlagen mit Vitest:**
  - Tests starten (einmalig und im Watch-Modus) und die Ausgabe lesen.
  - Aufbau eines Tests: Vorbereitung, Aktion, erwartetes Ergebnis (Arrange, Act, Assert).
  - `describe`, `it`/`test`, `expect` und die wichtigsten Matcher (`toBe`, `toEqual`, `toThrow`).
  - Ein fehlschlagender Test als Information: Erwartet gegenüber Erhalten lesen.
  - Testfälle aus Anforderungen ableiten: Normalfall, Grenzfall, Fehlerfall.
  - Ein grüner Test belegt nur die geprüften Erwartungen.
- **Erster End-to-End-Test mit Playwright:**
  - Unterschied zwischen Unit-Test (Funktion in Node) und Ablauftest (echte Seite im Browser).
  - Einen vorbereiteten Test lesen und mit `npm run e2e` ausführen; `webServer` startet den Entwicklungsserver automatisch.
  - Nutzernahe Locators (`getByRole`, `getByLabel`) und Web-First Assertions (`toHaveText`, `toBeVisible`) an einem Beispiel.
  - Einen Fehler, den die Unit-Tests nicht finden, mit einem Ablauftest absichern.
  - Hilfsmittel für die manuelle Arbeit: UI-Modus (`npx playwright test --ui`) und Codegen (`npx playwright codegen --channel=chrome`).
- **Optionale Agenteneinbindung (Demonstration):**
  - Projektkontext und Prüfkommandos in einer knappen `AGENTS.md` (oder dem Werkzeugäquivalent).
  - Einen begrenzten Auftrag formulieren: Ziel, betroffene Dateien, überprüfbare Erwartungen.
  - Arbeitszyklus: implementieren, mit denselben Projektbefehlen prüfen, korrigieren.
  - Der Agent inspiziert die laufende Seite mit der Playwright CLI (`npx playwright cli`, Teil von `@playwright/test`): öffnen, interagieren, Snapshot und Console lesen, Korrektur im Browser prüfen, Befund als Playwright-Test festhalten.
  - Alternativen einordnen: Chrome DevTools MCP (Console, Network, Performance; Anbindung an eine laufende Chrome-Sitzung) und die in Agenten oder Editoren eingebauten Browser.
  - Ergebnis im Diff und im Browser kontrollieren.
  - Rechte, Secrets und externe Anweisungen (Prompt Injection, auch über Inhalte von Webseiten) einordnen; Arbeitsrechte pro Übung begrenzen.

## Bewusst nicht enthalten

- Vergleich mehrerer Paketmanager, Bundler oder Linter; Alternativen höchstens als einzeilige Einordnung.
- Globale Installation von Vite+ und Node-Versionsverwaltung im Detail (nur Hinweis auf die vorausgesetzte Version aus `_PREPARATION.md`).
- Asynchrone Unit-Tests, Mocking und DOM-Tests mit Vitest; diese folgen in den Fachblöcken.
- Weiterführende Playwright-Techniken (mehrere Projekte und Viewports, `page.route`, Fixtures); diese folgen in Block 6 und 7.
- Einrichtung und Anmeldung eines Agenten sowie die Konfiguration eines MCP-Servers durch die Teilnehmenden.

## Ausgangslage aus 2025

- Foliensatz [05-FrontendTooling.pdf](../../../../modern-frontend-bsi-2025/00-CourseMaterial/05-FrontendTooling.pdf): npm-Grundlagen, Clean Install, Ökosystem-Risiken, Linting, Bundling, Vite, Source Maps und Testing-Überblick weitgehend wiederverwendbar; Zuordnung zu esbuild und Rollup auf den aktuellen Stand bringen, Katalog der Alternativen kürzen. Playwright-Folie S. 38 als Ausgangspunkt für den ersten Ablauftest.
- Starter [01-Starter/vanilla-vite-plus](../../../01-Starter/vanilla-vite-plus) dieses Repositorys als technische Vorlage. Er ist noch auf pnpm ausgelegt (`catalog:`, `pnpm-workspace.yaml`, `devEngines.packageManager`) und muss für die Übungen auf npm umgestellt werden; Playwright ist noch nicht eingerichtet.
- [01-Starter/vanilla-vite](../../../01-Starter/vanilla-vite) bleibt das absolute Minimum, mit dem die Teilnehmenden bei der Vorbereitung ihre Umgebung prüfen. Er ist keine Basis für Übungen.
- Laptop-Vorbereitung in [_PREPARATION.md](../../../_PREPARATION.md).
