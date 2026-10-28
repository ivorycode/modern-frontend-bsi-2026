# Übung 5: Web Platform APIs

Sechs eigenständige Mini-Projekte ohne Framework und ohne Build-Werkzeug; Übersicht in `README.md`, Aufgabe jeweils im `README.md` des Unterordners. Zu jedem Ordner `NN-name` gibt es `NN-name-solution` (Ports +100). Die Ordner teilen keinen Code.

- Server laufen direkt mit Node (`node server.js` bzw. `node server/server.ts` mit Type Stripping). Kein Vite+, kein Bundler; Browser-Code ist natives JavaScript mit ES-Modulen.
- Befehle stehen in der jeweiligen `package.json` (`npm start`, `npm run dev`, `npm test`, `npm run check`).
- Ports: 3051 fetch, 3052 WebSocket, 3053 Streaming, 3055 Formulare, 3056 Web Worker; Lösungen 3151–3156.
- Die laufende Seite mit der Playwright CLI prüfen: `npx playwright cli open --browser=chrome http://localhost:<port>/`. Keine Browser herunterladen.
- Beim Lösen einer Übung nur den Übungsordner ändern, nie den `-solution`-Ordner. Lösungen im Stil der Lösungshinweise im README halten: kurz, ohne zusätzliche Bibliotheken.
