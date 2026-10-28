# Orientierung für die Kursvorbereitung 2026

Dieses Repository enthält die Vorbereitung der Neuauflage des zweitägigen Kurses «Modern Frontend Development» für BSI. Arbeitsstand dieser Orientierung: 24. Oktober 2026.

## Material von 2025

Das Vorjahresrepository liegt lokal neben diesem Repository:

- Repository: `/Users/jonas/Dev/MyGithub/modern-frontend-bsi-2025` (relativ: `../modern-frontend-bsi-2025`).
- Folien und Übungsblätter: `/Users/jonas/Dev/MyGithub/modern-frontend-bsi-2025/00-CourseMaterial`.
- Dort liegen acht PDFs: Agenda, Modern JavaScript, TypeScript, Async JavaScript, Web Platform APIs, Frontend Tooling, Styling und SPA Concepts; dazu vier Markdown-Übungsblätter zu JavaScript, TypeScript, Async und Plattform-APIs.
- Beispielcode und Starter liegen im Vorjahresrepository unter `01-Starter`, `02-Language`, `03-async`, `04-web-platform`, `06-SPA`, `07-Styling`, `08-web-components` und `99-playground`.

Für die Auswahl wiederverwendbarer Inhalte zuerst [KURSUEBERBLICK-2025.md](./00-Konzept/KURSUEBERBLICK-2025.md) lesen. Diese Zusammenfassung erschliesst die Themen und verlinkt alle zwölf Quelldokumente. Für Details die jeweiligen Originalunterlagen oder Beispiele öffnen. Pfadangaben in alten Übungsblättern mit der tatsächlichen Verzeichnisstruktur abgleichen.

Das Vorjahresrepository dient als Referenz; Anpassungen für 2026 in diesem Repository ausarbeiten.

## Bereits vorhandene Ergebnisse für 2026

| Datei oder Verzeichnis | Inhalt und Anlass zum Lesen |
| --- | --- |
| [00-Konzept/KURSKONZEPT-2026.md](./00-Konzept/KURSKONZEPT-2026.md) | Massgeblicher Planungsstand. Vor Änderungen an Kursaufbau, Themen, Übungen oder Agenda lesen. Enthält die Bewertung des Vorjahresmaterials, Lernziele, Übungsvorschläge und eine Agenda mit zwölf Netto-Unterrichtsstunden. |
| [00-Konzept/RECHERCHE-FRONTEND-2026.md](./00-Konzept/RECHERCHE-FRONTEND-2026.md) | Technische Recherche mit Primärquellen und ursprünglichen didaktischen Empfehlungen. Bei fachlichen Begründungen konsultieren; spätere Entscheidungen im Kurskonzept haben Vorrang vor den ursprünglichen Empfehlungen. |
| [00-Konzept/KURSUEBERBLICK-2025.md](./00-Konzept/KURSUEBERBLICK-2025.md) | Bestandsaufnahme des Kurses 2025, keine Agenda für 2026. |
| [00-Konzept/00-Lektionen](./00-Konzept/00-Lektionen) | Entwürfe pro Themenblock: `LESSON.md` (Themen), `SLIDES.md` (Folienvorschlag) und `EXERCISE.md` (Übungsbeschreibung zur Review). Vor Arbeiten an Folien oder Übungen eines Blocks lesen. |
| [Exercises](./Exercises) | Umgesetzte Übungen, ein Ordner pro Block mit demselben Namen wie in `00-Lektionen`. Jede Übung ist ein eigenständiges npm-Projekt mit `README.md` (Anleitung für die Teilnehmenden) und `AGENTS.md`. Fertig: [01-tooling-setup](./Exercises/01-tooling-setup) (Prämienrechner), [02-javascript](./Exercises/02-javascript) (Einkaufslisten), [03-async](./Exercises/03-async) (Wörter laden; eigener Node-Server für die API, Vertiefungen mit `AbortController` und RxJS `switchMap`), [04-typescript-validierung](./Exercises/04-typescript-validierung) (Kursanmeldungen), [05-web-platform](./Exercises/05-web-platform) (sechs kurze Einzelübungen zu fetch/CORS, WebSocket, Streaming, JSON, Formulare und Web Worker; je ein eigener Ordner mit `-solution`-Ordner daneben, ohne Vite+), [06-spa-konzepte](./Exercises/06-spa-konzepte) (Schadenfälle; drei eigenständige Projekte `react`, `vue`, `angular` ohne gemeinsamen Code, Angular mit Angular CLI statt Vite+), [07-styling](./Exercises/07-styling) (Kursanmeldung von CSS auf Tailwind umstellen). |
| [_PREPARATION.md](./_PREPARATION.md) | Vorhandene Anleitung zur Laptop-Vorbereitung und zum Start des Vite-Beispiels. Bei Änderungen an Teilnehmer-Setup und Voraussetzungen prüfen. |
| [01-Starter/vanilla-vite](./01-Starter/vanilla-vite) | Vanilla-TypeScript-Starter mit Vite und npm. Dient nur dazu, dass die Teilnehmenden in der Vorbereitung ihr Setup prüfen; soll ein absolutes Minimum bleiben und ist keine Basis für Übungen. `_PREPARATION.md` verweist bewusst darauf und wird nicht auf Vite+ umgestellt. |
| [01-Starter/vanilla-vite-plus](./01-Starter/vanilla-vite-plus) | Technische Vorlage der Übungen mit Vite+. Noch auf pnpm ausgelegt und ohne Playwright; muss auf npm umgestellt werden (siehe Ausrichtung). Vor Arbeiten darin die lokale [AGENTS.md](./01-Starter/vanilla-vite-plus/AGENTS.md) lesen. |

Die im Konzept beschriebenen Themenübungen, Testfälle und neuen Foliensätze sind bislang Planung, keine fertig erstellten Kursmaterialien. Vorhandene Starter belegen noch keine Umsetzung aller geplanten Testwerkzeuge. Für ausführbare Befehle und tatsächlich eingerichtete Werkzeuge die jeweilige `package.json` und Konfiguration prüfen.

Die Root-`README.md` trägt noch den Titel von 2025; für die Ausrichtung 2026 ist das Kurskonzept massgeblich.

## Vereinbarte Ausrichtung

- Kleine, unabhängige Übungen pro Themenblock mit eigenem Ausgangsstand; keine durchgängige Fachanwendung.
- Alle Übungen vollständig manuell lösbar. Coding Agents sind optional, ein Agentenzugang ist keine Teilnahmevoraussetzung.
- Tooling, Projekt-Setup und einfache Testing-Grundlagen stehen am Anfang; dort wird auch die optionale Agentenanbindung gezeigt.
- Testing wird danach in den Fachthemen vertieft. Es gibt keinen separaten Testing-Block.
- Toolchain: Vite+ ist Entwicklungsabhängigkeit jedes Übungsprojekts. Die Übungen laufen mit Node.js und npm, wie in `_PREPARATION.md` geprüft; eine globale Installation von Vite+ ist weder nötig noch vorausgesetzt. Projektbefehle als npm-Skripte (`npm run dev`, `npm run check`, `npm test`, `npm run build`, `npm run e2e`); kein pnpm.
- Playwright wird bereits in Block 1 mit einem ersten Ablauftest eingeführt und läuft im installierten Chrome (`channel: "chrome"`). Für die Browserinspektion durch Agenten in Demo und Übung dient die Playwright CLI (`npx playwright cli`, Teil von `@playwright/test`); Chrome DevTools MCP und eingebaute Browser von Agenten oder Editoren werden nur als Alternativen erwähnt.
- Prototypen und Experimente in `./.scratch` anlegen, nicht in Übungs- oder Starterordnern.
- Accessibility wurde aus dem Kurskonzept und dem letzten Themenblock entfernt. Die früheren Empfehlungen im Recherchepapier bilden diese spätere Entscheidung nicht ab.
- Die Konzeptabschnitte «Gemeinsamer Arbeitsablauf», «Wahlthemen und Umfangsgrenze» und «Semantisches HTML und Accessibility» wurden auf Wunsch des Nutzers gelöscht. Bei Überarbeitungen diese verworfenen Abschnitte nicht aus älteren Entwürfen wiederherstellen.

## Git

- Schreibe nie einen `Co-Authored-By`-Eintrag in Commit Messages.
- Keine Hinweise auf Claude, Claude Code, Cursor, Codex oder andere KI-Tools in Commit Messages oder Pull-Request-Beschreibungen.
