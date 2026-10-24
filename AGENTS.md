# Orientierung für die Kursvorbereitung 2026

Dieses Repository enthält die Vorbereitung der Neuauflage des zweitägigen Kurses «Modern Frontend Development» für BSI. Arbeitsstand dieser Orientierung: 24. Oktober 2026.

## Material von 2025

Das Vorjahresrepository liegt lokal neben diesem Repository:

- Repository: `/Users/jonas/Dev/MyGithub/modern-frontend-bsi-2025` (relativ: `../modern-frontend-bsi-2025`).
- Folien und Übungsblätter: `/Users/jonas/Dev/MyGithub/modern-frontend-bsi-2025/00-CourseMaterial`.
- Dort liegen acht PDFs: Agenda, Modern JavaScript, TypeScript, Async JavaScript, Web Platform APIs, Frontend Tooling, Styling und SPA Concepts; dazu vier Markdown-Übungsblätter zu JavaScript, TypeScript, Async und Plattform-APIs.
- Beispielcode und Starter liegen im Vorjahresrepository unter `01-Starter`, `02-Language`, `03-async`, `04-web-platform`, `06-SPA`, `07-Styling`, `08-web-components` und `99-playground`.

Für die Auswahl wiederverwendbarer Inhalte zuerst [KURSUEBERBLICK-2025.md](./KURSUEBERBLICK-2025.md) lesen. Diese Zusammenfassung erschliesst die Themen und verlinkt alle zwölf Quelldokumente. Für Details die jeweiligen Originalunterlagen oder Beispiele öffnen. Pfadangaben in alten Übungsblättern mit der tatsächlichen Verzeichnisstruktur abgleichen.

Das Vorjahresrepository dient als Referenz; Anpassungen für 2026 in diesem Repository ausarbeiten.

## Bereits vorhandene Ergebnisse für 2026

| Datei oder Verzeichnis | Inhalt und Anlass zum Lesen |
| --- | --- |
| [KURSKONZEPT-2026.md](./KURSKONZEPT-2026.md) | Massgeblicher Planungsstand. Vor Änderungen an Kursaufbau, Themen, Übungen oder Agenda lesen. Enthält die Bewertung des Vorjahresmaterials, Lernziele, Übungsvorschläge und eine Agenda mit zwölf Netto-Unterrichtsstunden. |
| [RECHERCHE-FRONTEND-2026.md](./RECHERCHE-FRONTEND-2026.md) | Technische Recherche mit Primärquellen und ursprünglichen didaktischen Empfehlungen. Bei fachlichen Begründungen konsultieren; spätere Entscheidungen im Kurskonzept haben Vorrang vor den ursprünglichen Empfehlungen. |
| [KURSUEBERBLICK-2025.md](./KURSUEBERBLICK-2025.md) | Bestandsaufnahme des Kurses 2025, keine Agenda für 2026. |
| [_PREPARATION.md](./_PREPARATION.md) | Vorhandene Anleitung zur Laptop-Vorbereitung und zum Start des Vite-Beispiels. Bei Änderungen an Teilnehmer-Setup und Voraussetzungen prüfen. |
| [01-Starter/vanilla-vite](./01-Starter/vanilla-vite) | Vorhandener Vanilla-TypeScript-Starter mit Vite. |
| [01-Starter/vanilla-vite-plus](./01-Starter/vanilla-vite-plus) | Vorhandene Startervariante mit Vite+. Vor Arbeiten darin die lokale [AGENTS.md](./01-Starter/vanilla-vite-plus/AGENTS.md) lesen. |

Die im Konzept beschriebenen Themenübungen, Testfälle und neuen Foliensätze sind bislang Planung, keine fertig erstellten Kursmaterialien. Vorhandene Starter belegen noch keine Umsetzung aller geplanten Testwerkzeuge. Für ausführbare Befehle und tatsächlich eingerichtete Werkzeuge die jeweilige `package.json` und Konfiguration prüfen.

Die Root-`README.md` trägt noch den Titel von 2025; für die Ausrichtung 2026 ist das Kurskonzept massgeblich.

## Vereinbarte Ausrichtung

- Kleine, unabhängige Übungen pro Themenblock mit eigenem Ausgangsstand; keine durchgängige Fachanwendung.
- Alle Übungen vollständig manuell lösbar. Coding Agents sind optional, ein Agentenzugang ist keine Teilnahmevoraussetzung.
- Tooling, Projekt-Setup und einfache Testing-Grundlagen stehen am Anfang; dort wird auch die optionale Agentenanbindung gezeigt.
- Testing wird danach in den Fachthemen vertieft. Es gibt keinen separaten Testing-Block.
- Accessibility wurde aus dem Kurskonzept und dem letzten Themenblock entfernt. Die früheren Empfehlungen im Recherchepapier bilden diese spätere Entscheidung nicht ab.
- Die Konzeptabschnitte «Gemeinsamer Arbeitsablauf», «Wahlthemen und Umfangsgrenze» und «Semantisches HTML und Accessibility» wurden auf Wunsch des Nutzers gelöscht. Bei Überarbeitungen diese verworfenen Abschnitte nicht aus älteren Entwürfen wiederherstellen.

## Git

- Schreibe nie einen `Co-Authored-By`-Eintrag in Commit Messages.
- Keine Hinweise auf Claude, Claude Code, Cursor, Codex oder andere KI-Tools in Commit Messages oder Pull-Request-Beschreibungen.
