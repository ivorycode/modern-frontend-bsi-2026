# Übung 8: Kursanmeldung von CSS auf Tailwind umstellen

Kleines Vite+-Projekt mit TypeScript ohne Framework. Die Seite `index.html` ist mit nativem CSS gestaltet (`src/styles.css`) und wird in der Übung schrittweise auf Tailwind CSS 4 umgestellt. `tailwindcss` und `@tailwindcss/vite` sind installiert, aber zu Beginn nicht eingebunden; das ist Schritt 1 der Übung. Das Verhalten steht in `src/app.ts` und setzt nur Zustandsattribute (`aria-expanded`, `disabled`) und Text, keine Klassen. `css-referenz/` ist eine unveränderte Kopie der Ausgangsseite für den Vergleich. Aufgabe, Stolpersteine und Lösungsvarianten stehen in `README.md`; Entscheidungen der Teilnehmenden in `NOTIZEN.md`.

## Projektbefehle

Alle Werkzeuge sind lokal installiert; kein globales `vp` verwenden oder voraussetzen.

- `npm ci` – Abhängigkeiten installieren
- `npm run dev` – Entwicklungsserver auf `http://localhost:5278/`; CSS-Referenz unter `/css-referenz/`
- `npm run check` – Formatierung, Linting und Typprüfung; `npx vp check --fix` korrigiert Formatierung
- `npm run e2e` – Playwright-Tests in `e2e/` im installierten Chrome, drei Viewports (`mobil` 375 px, `grenzfall` 784 px, `desktop` 1280 px); startet den Entwicklungsserver bei Bedarf
- `npm run e2e -- --update-snapshots` – Referenzbilder neu erzeugen; nur auf ausdrücklichen Wunsch
- `npm run build` – baut beide Seiten nach `dist/`

## Browser untersuchen

Die laufende Seite mit der Playwright CLI öffnen und Layout sowie Zustände selbst ansehen, nicht nur aus dem Code schliessen. Der Entwicklungsserver muss laufen.

- `npx playwright cli open --browser=chrome http://localhost:5278/`
- `npx playwright cli resize`, `snapshot`, `click`, `hover`, `screenshot`
- `npx playwright cli close` am Ende

Keine eigenen Browser herunterladen (`playwright install` nicht ausführen); `channel: "chrome"` ist konfiguriert.

## Regeln für Änderungen

- Die Screenshot-Tests in `e2e/screenshots.spec.ts` sind das Sicherheitsnetz der Umstellung. Referenzbilder nie mit `--update-snapshots` überschreiben, um fehlschlagende Tests grün zu bekommen. Abweichungen ansehen (`test-results/**/*-diff.png`) und die Ursache im Styling beheben. Ausnahme: Teil 2 (Änderungsauftrag), dort nach Rücksprache.
- `src/app.ts` und `src/dom.ts` bleiben unverändert; das Styling darf nicht von Skriptänderungen abhängen.
- `css-referenz/` nur in Teil 2 ändern.
- Bei jedem Stolperstein die gewählte Variante nennen und begründen; die Notizen in `NOTIZEN.md` schreiben die Teilnehmenden selbst.
- Tokens im `@theme`-Block verwenden. Keine Farben aus Tailwinds Standardpalette und keine willkürlichen Werte in eckigen Klammern ohne Begründung.
- Kein `any`, keine Type Assertion (`as`) und keine Non-Null Assertion (`!`) im Code.
- Nach Änderungen `npm run check` und `npm run e2e` ausführen.
