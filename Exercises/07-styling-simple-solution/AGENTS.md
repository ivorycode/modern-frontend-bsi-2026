# Übung 7: ProfileCard mit CSS Modules und Tailwind gestalten

Kleines Vite+-Projekt mit React 19 und TypeScript. Die Demo zeigt dieselbe `PricingCard` in vier Styling-Ansätzen (`src/variants/`: CSS Modules, styled-components, vanilla-extract, Tailwind CSS 4). Alle verwenden die Design Tokens (Custom Properties) aus `src/index.css`; der `@theme`-Block registriert sie als Tailwind-Utilities (`bg-surface`, `text-ink`, `border-edge`, `bg-status-online`, …). Der Schalter «Dark Mode» in `src/App.tsx` setzt nur `data-theme="dark"` am `<html>`. Musterlösung: `src/exercise/ProfileCard.tsx` mit `ProfileCard.module.css` (Aufgabe 1, Vertiefungen a und b) und `src/exercise/ProfileCardTailwind.tsx` (Aufgabe 2, Vertiefung b). Die Aufgabe steht in `../07-styling-simple/README.md`; die Tests der Vertiefungen in `e2e/vertiefung.spec.ts`.

## Projektbefehle

Alle Werkzeuge sind lokal installiert; kein globales `vp` verwenden oder voraussetzen.

- `npm ci` – Abhängigkeiten installieren
- `npm run dev` – Entwicklungsserver auf `http://localhost:5277/` (fester Port)
- `npm run check` – Formatierung, Linting und Typprüfung; `npx vp check --fix` korrigiert Formatierung
- `npm run e2e` – Playwright-Tests in `e2e/` im installierten Chrome; startet den Entwicklungsserver bei Bedarf
- `npm run build` – Produktions-Build nach `dist/`

## Browser untersuchen

Die laufende Seite mit der Playwright CLI öffnen und Layout sowie beide Farbschemas selbst ansehen, nicht nur aus dem Code schliessen. Die Tests prüfen nur Farben, nicht das Layout. Der Entwicklungsserver muss laufen.

- `npx playwright cli open --browser=chrome http://localhost:5277/`
- `npx playwright cli resize`, `snapshot`, `click`, `hover`, `screenshot`
- `npx playwright cli close` am Ende

Keine eigenen Browser herunterladen (`playwright install` nicht ausführen); `channel: "chrome"` ist konfiguriert.

## Regeln für Änderungen

- `src/index.css`, `src/variants/` und `e2e/` nicht ändern. Erwartete Werte in den Tests nicht an fehlerhaftes Styling anpassen.
- Für Farben, Radius und Schatten nur die Tokens verwenden: in CSS `var(--…)`, in Tailwind die Token-Utilities oder `(--…)`-Kurzformen. Keine fest eingetragenen Farbwerte, keine Farben aus Tailwinds Standardpalette und kein CSS für `[data-theme="dark"]`.
- `role="img"` und `aria-label` am Status-Punkt beibehalten; die Tests finden ihn darüber. Die Abschnitte der Übung in `src/App.tsx` behalten Überschrift und `aria-labelledby`.
- Tailwind-Klassen vollständig ausschreiben, nicht aus Teilen zusammensetzen.
- `Profile` und `initials` aus `ProfileCard.tsx` importieren, nicht kopieren. `demoProfile` nach Versuchen zurücksetzen.
- Kein `any`, keine Type Assertion (`as`) und keine Non-Null Assertion (`!`).
- Nach Änderungen `npm run check` und `npm run e2e` ausführen.
