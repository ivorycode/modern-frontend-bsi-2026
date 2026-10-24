# Lektionen 2026

Entwürfe pro Themenblock aus dem [Kurskonzept](../KURSKONZEPT-2026.md). Jeder Ordner enthält:

- `LESSON.md`: Ziel und wichtigste Themen der Lektion, bewusste Auslassungen, wiederverwendbares Material aus 2025.
- `SLIDES.md`: erster Folienvorschlag mit Verweisen auf wiederverwendbare Folien aus 2025.
- `EXERCISE.md`: Beschreibung der Übung zur Review; der Übungsordner selbst ist noch nicht angelegt.

| Tag | Block | Zeit | Ordner |
| --- | --- | --- | --- |
| 1 | Tooling, Projekt-Setup und Testing-Grundlagen | 120 min | [01-tooling-setup](./01-tooling-setup) |
| 1 | Modernes JavaScript | 60 min | [02-javascript](./02-javascript) |
| 1 | TypeScript, Datenverträge, Laufzeitvalidierung und Zustandsmodellierung | 90 min | [03-typescript-validierung](./03-typescript-validierung) |
| 1 | Async JavaScript und Fehlersuche | 90 min | [04-async](./04-async) |
| 2 | Web Platform APIs: Fetch, HTTP, CORS und Formulare | 90 min | [05-web-platform](./05-web-platform) |
| 2 | SPA-Konzepte: Komponenten, Zustand, Routing und Rendering | 105 min | [06-spa-konzepte](./06-spa-konzepte) |
| 2 | Styling und semantisches HTML | 120 min | [07-styling](./07-styling) |

## Getroffene Entscheidungen

- **Toolchain:** Alle Übungen basieren auf [01-Starter/vanilla-vite-plus](../../01-Starter/vanilla-vite-plus) mit Vite+ und pnpm (`vp install`, `vp dev`, `vp check`, `vp test`, `vp build`). Ausnahme: die Angular-Variante in Block 6 verwendet die Angular CLI mit pnpm.
- **Netzwerk in Tests:** Block 4 übergibt `fetch` als Parameter; ab Block 5 ersetzt Mock Service Worker die Antworten auf Netzwerkebene. Für Angular wird `HttpTestingController` als Alternative gezeigt.
- **SPA-Übung:** je eine eigene Variante für React, Angular und Vue mit gemeinsamen Playwright-Tests, angebunden an eine echte lokale API.
- **Styling-Übung:** zwei Varianten, natives CSS und Tailwind CSS, mit gemeinsamen Playwright-Tests und einem strukturierten Vergleich.

Der abschliessende Rückblick (45 min) ist kein eigener Themenblock und hat keinen Ordner.
