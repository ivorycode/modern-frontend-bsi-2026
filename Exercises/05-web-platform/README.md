# Übung 5: Web Platform APIs

Sechs kurze, voneinander unabhängige Übungen zu APIs, die der Browser ohne Framework mitbringt. Jede Übung ist ein eigenes kleines Projekt mit eigener Anleitung und eigener Musterlösung im Ordner mit der Endung `-solution`. Bearbeiten Sie die Übungen in beliebiger Reihenfolge und Auswahl.

| Übung                                     | Thema                                                                         | Start                         | Seite                         |
| ----------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------- | ----------------------------- |
| [5.1 fetch](./01-fetch/README.md)         | `response.text()` und `json()`, HTTP-Fehler, Netzwerkfehler, Same Origin Policy und CORS | `npm start`                   | `http://localhost:3051/`      |
| [5.2 WebSocket](./02-websocket/README.md) | Verbindung mit Upgrade, Nachrichten in beide Richtungen, Broadcast an alle Clients | `npm install`, `npm start`    | `http://localhost:3052/`      |
| [5.3 Streaming](./03-streaming/README.md) | HTML und NDJSON in Chunks senden, `ReadableStream` im Browser lesen          | `npm start`                   | `http://localhost:3053/app`   |
| [5.4 JSON](./04-json/README.md)           | Grenzen von JSON bei `BigInt`, `Date` und `Set`, Replacer und Reviver        | `npm install`, `npm test`     | –                             |
| [5.5 Formulare](./05-forms/README.md)     | JSON und `FormData` senden, Prüfung im Browser umgehen, Prüfung auf dem Server mit Zod | `npm install`, `npm run dev`  | `http://localhost:3055/`      |
| [5.6 Web Worker](./06-webworker/README.md) | Blockierter Hauptthread, Berechnung in einen Worker verschieben, `terminate()` | `npm start`                   | `http://localhost:3056/`      |

Voraussetzungen: Node.js (wie in der Vorbereitung geprüft) und Chrome. Übung 5.1 braucht Internetzugang. Die Server laufen ohne Build-Werkzeug direkt mit Node; Node führt auch TypeScript-Dateien direkt aus. Die Musterlösungen verwenden die Ports 3151 bis 3156 und können neben den Übungen laufen.
