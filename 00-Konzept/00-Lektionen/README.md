# Lektionen 2026

Entwürfe pro Themenblock aus dem [Kurskonzept](../KURSKONZEPT-2026.md). Jeder Ordner enthält:

- `LESSON.md`: Ziel und wichtigste Themen der Lektion, bewusste Auslassungen, wiederverwendbares Material aus 2025.
- `SLIDES.md`: erster Folienvorschlag mit Verweisen auf wiederverwendbare Folien aus 2025.
- `EXERCISE.md`: Beschreibung der Übung zur Review. Umgesetzte Übungen liegen in [Exercises/](../../Exercises) mit demselben Ordnernamen wie der Block; bisher [Exercises/01-tooling-setup](../../Exercises/01-tooling-setup), [Exercises/02-javascript](../../Exercises/02-javascript), [Exercises/03-async](../../Exercises/03-async), [Exercises/04-typescript-validierung](../../Exercises/04-typescript-validierung), [Exercises/05-web-platform](../../Exercises/05-web-platform), [Exercises/06-spa-konzepte](../../Exercises/06-spa-konzepte) und [Exercises/07-styling](../../Exercises/07-styling).

| Tag | Block | Zeit | Ordner |
| --- | --- | --- | --- |
| 1 | Tooling, Projekt-Setup und Testing-Grundlagen | 120 min | [01-tooling-setup](./01-tooling-setup) |
| 1 | Modernes JavaScript | 60 min | [02-javascript](./02-javascript) |
| 1 | Async JavaScript und Fehlersuche | 90 min | [03-async](./03-async) |
| 1 | TypeScript, Datenverträge, Laufzeitvalidierung und Zustandsmodellierung | 90 min | [04-typescript-validierung](./04-typescript-validierung) |
| 2 | Web Platform APIs: Fetch, HTTP, CORS und Formulare | 90 min | [05-web-platform](./05-web-platform) |
| 2 | SPA-Konzepte: Komponenten, Zustand, Routing und Rendering | 105 min | [06-spa-konzepte](./06-spa-konzepte) |
| 2 | Styling und semantisches HTML | 120 min | [07-styling](./07-styling) |

## Getroffene Entscheidungen

- **Toolchain:** Alle Übungen basieren auf [01-Starter/vanilla-vite-plus](../../01-Starter/vanilla-vite-plus) mit Vite+ als Entwicklungsabhängigkeit und npm. Sie laufen mit Node.js und npm, wie sie in [_PREPARATION.md](../../_PREPARATION.md) geprüft werden; eine globale Installation von Vite+ ist nicht nötig. Projektbefehle als npm-Skripte: `npm ci`, `npm run dev`, `npm run check`, `npm test`, `npm run build`, `npm run e2e`. Der Starter ist noch auf pnpm ausgelegt und muss umgestellt werden. Ausnahme: die Angular-Variante in Block 6 verwendet die Angular CLI mit npm.
- **Playwright:** wird in Block 1 mit einem ersten Ablauftest eingeführt und in Block 6 und 7 vertieft. Die Tests laufen im installierten Chrome (`channel: "chrome"`), ohne Browser-Download.
- **Browserinspektion durch Agenten:** Playwright CLI (`npx playwright cli`, Teil von `@playwright/test`); Chrome DevTools MCP und eingebaute Browser von Agenten und Editoren werden als Alternativen erwähnt.
- **Netzwerk in Tests:** Block 3 übergibt `fetch` als Parameter; ab Block 5 ersetzt Mock Service Worker die Antworten auf Netzwerkebene. Für Angular wird `HttpTestingController` als Alternative gezeigt.
- **SPA-Übung:** je eine vollständig eigenständige Variante für React, Angular und Vue (kein Workspace, kein gemeinsamer Code) mit identischen Playwright-Tests, angebunden an eine eigene echte lokale API.
- **Styling-Übung:** eine gegebene Seite in nativem CSS wird schrittweise auf Tailwind CSS umgestellt, abgesichert durch Screenshot-Vergleiche und Playwright-Tests; bewusst eingebaute Stolpersteine mit Lösungsvarianten, danach ein Änderungsauftrag in beiden Fassungen und ein Vergleich aus eigener Erfahrung.

Der abschliessende Rückblick (45 min) ist kein eigener Themenblock und hat keinen Ordner.
