# Musterlösung zu Übung 5: Geräteverleih

Aufgabe: [Übung 5](../05-web-platform/README.md)

```sh
npm install
npm run api    # Terminal 1: API auf http://localhost:3105/
npm run dev    # Terminal 2
```

Seiten: `http://localhost:5277/` (Geräteliste) und `http://localhost:5277/src/vertiefungen/2-formular/` (Vertiefung 2)

Prüfungen: `npm run check`, `npm test` und `npm run e2e`. `npm run e2e` startet API und Entwicklungsserver selbst. Nach dem Erfassen von Geräten in Vertiefung 2 die API neu starten, sonst scheitert der Test «zeigt alle Geräte».

Vertiefung 1 steht in `src/vertiefungen/1-timeout/`, Vertiefung 3 als Kommentar in `src/mocks/handlers.ts`.
