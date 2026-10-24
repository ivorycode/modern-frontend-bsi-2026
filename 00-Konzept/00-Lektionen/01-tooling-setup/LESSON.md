# Lektion 1: Tooling, Projekt-Setup und Testing-Grundlagen

Tag 1, 120 Minuten, davon etwa 30 Minuten Testing-Grundlagen und 15 bis 20 Minuten Agenten-Demonstration.

## Ziel der Lektion

Alle Teilnehmenden arbeiten in einer funktionierenden, gemeinsamen Umgebung, verstehen die Aufgaben der Werkzeuge im Starter und nutzen Tests als unmittelbare Rückmeldung. Die folgenden Blöcke setzen genau diesen Arbeitsablauf voraus.

## Themen

- **Kurseinstieg:** Ausrichtung des Kurses (verstehen, entwickeln, überprüfen), Übungsformat mit kleinen, unabhängigen Ausgangsständen, Coding Agents als optionale Unterstützung.
- **Aufbau eines modernen Frontend-Projekts:** `index.html` als Einstiegspunkt, `src/`, `public/`, `package.json`, Lockfile, `tsconfig.json`, Vite-Konfiguration.
- **Paketverwaltung kompakt mit pnpm:** Abhängigkeiten und Entwicklungsabhängigkeiten, semantische Versionierung, `pnpm-lock.yaml` und reproduzierbare Installation (`vp install --frozen-lockfile`); `devEngines.packageManager` legt die pnpm-Version fest, Vite+ lädt sie bei Bedarf. npm als Referenz, weil Dokumentation und Beispiele im Netz meist npm verwenden.
- **Supply Chain in einem Satz pro Punkt:** Grösse des Abhängigkeitsgraphen, Audit-Werkzeuge und ihre Grenzen, Build-Scripts von Abhängigkeiten nur nach Freigabe (pnpm), private Registries im Unternehmen.
- **Aufgaben der Toolchain:** Entwicklungsserver mit HMR, Transformation von TypeScript ohne Typprüfung, separate Typprüfung, Linting und Formatierung, Tests, Produktionsbuild.
- **Vite und Vite+:** unbundled Development Server gegenüber gebündeltem Produktionsbuild; aktuelle Build-Architektur mit Rolldown und Oxc. Vite+ als Toolchain des Kurses: `vp install`, `vp dev`, `vp check` (Oxfmt, Oxlint und Typprüfung), `vp test` (Vitest), `vp build`; Unterschied zwischen eingebauten Befehlen und `vp run <script>`.
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
- **Optionale Agenteneinbindung (Demonstration):**
  - Projektkontext und Prüfkommandos in einer knappen `AGENTS.md` (oder dem Werkzeugäquivalent).
  - Einen begrenzten Auftrag formulieren: Ziel, betroffene Dateien, überprüfbare Erwartungen.
  - Arbeitszyklus: implementieren, mit denselben Projektbefehlen prüfen, korrigieren.
  - Ergebnis im Diff und im Browser kontrollieren.
  - Rechte, Secrets und externe Anweisungen (Prompt Injection) einordnen; Arbeitsrechte pro Übung begrenzen.

## Bewusst nicht enthalten

- Vergleich mehrerer Paketmanager, Bundler oder Linter; Alternativen höchstens als einzeilige Einordnung.
- Node-Versionsverwaltung im Detail (nur Hinweis auf die vorausgesetzte Version aus `_PREPARATION.md`).
- Asynchrone Tests, Mocking, DOM-Tests und Playwright; diese folgen in den Fachblöcken.
- Einrichtung und Anmeldung eines Agenten durch die Teilnehmenden.

## Ausgangslage aus 2025

- Foliensatz [05-FrontendTooling.pdf](../../../../modern-frontend-bsi-2025/00-CourseMaterial/05-FrontendTooling.pdf): npm-Grundlagen, Clean Install, Ökosystem-Risiken, Linting, Bundling, Vite, Source Maps und Testing-Überblick weitgehend wiederverwendbar; Zuordnung zu esbuild und Rollup auf den aktuellen Stand bringen, Katalog der Alternativen kürzen.
- Starter [01-Starter/vanilla-vite-plus](../../../01-Starter/vanilla-vite-plus) dieses Repositorys als Basis aller Übungen (Vite+ mit pnpm). `vp test` ist damit verfügbar, Testdateien gibt es noch keine. [01-Starter/vanilla-vite](../../../01-Starter/vanilla-vite) mit npm bleibt höchstens als Vergleich.
- Laptop-Vorbereitung in [_PREPARATION.md](../../../_PREPARATION.md).
