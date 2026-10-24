# Lektion 5: Web Platform APIs – Fetch, HTTP, CORS und Formulare

Tag 2, 90 Minuten inklusive Übung und Besprechung.

## Ziel der Lektion

Die Teilnehmenden kommunizieren mit `fetch` korrekt über HTTP, inklusive Statuscodes, Fehlerpfaden und JSON. Sie verstehen das Sicherheitsmodell des Browsers mit Same Origin Policy und CORS und untersuchen es in den Entwicklerwerkzeugen. Formulardaten übermitteln und validieren sie mit Plattformmitteln. Netzwerkabhängige Logik testen sie mit kontrollierten Antworten und kennen die Grenzen solcher Tests.

## Themen

- **HTTP-Grundlagen für Frontend-Entwickler:** Methode, URL, Header, Body, Statuscode; Content-Type und Accept.
- **`fetch` im Detail:**
  - Request erstellen, Methode, Header und Body setzen.
  - Response lesen: `ok`, `status`, `headers`; Body einmalig als `text()` oder `json()` konsumieren.
  - `fetch` lehnt nur bei Netzwerkfehlern ab, nicht bei HTTP 404 oder 500 – Status explizit prüfen.
  - Fehlerarten unterscheiden: Netzwerkfehler, HTTP-Fehler, ungültiger Body, Abbruch.
  - Ein kleiner, typisierter HTTP-Helper mit Statusprüfung und Validierung der Antwort (Brücke zu Block 3).
- **JSON:** `JSON.stringify` und `JSON.parse`; was verloren geht (`Date`, `BigInt`, `Map`, `Set`, `undefined`); Replacer und Reviver kurz.
- **Same Origin Policy und CORS:**
  - Was ist ein Origin; warum der Browser Antworten fremder Origins schützt.
  - CORS als Freigabe durch den Server (`Access-Control-Allow-Origin` und weitere Header).
  - Einfache Requests gegenüber Preflight (`OPTIONS`).
  - Credentials und Cookies kurz.
  - CORS ist Browser-Verhalten: `curl` und Tests mit ersetzten Antworten zeigen es nicht.
  - Lösungen in der Entwicklung: Dev-Server-Proxy; in Produktion: gleicher Origin oder korrekt konfigurierter Server.
- **Formulare mit Plattformmitteln:**
  - `<form>`, `submit`-Event, `FormData`, `new FormData(form)` und `Object.fromEntries`.
  - Übermittlung als JSON oder als `multipart/form-data`.
  - Eingebaute Constraint Validation (`required`, `type="email"`, `pattern`) und ihre Grenzen.
  - Client-Validierung für Rückmeldung, Server-Validierung für Sicherheit; dasselbe Schema auf beiden Seiten.
- **Browser-Entwicklerwerkzeuge:** Network-Tab mit Headern, Payload, Response und Timing; Request als `fetch` oder `curl` kopieren; Console-Meldungen zu CORS lesen.
- **Überblick weiterer Plattform-APIs (je eine Folie):** WebSocket für bidirektionale Kommunikation, Streams für inkrementelle Antworten (z. B. LLM-Ausgaben), Web Worker für rechenintensive Arbeit.
- **Testing in diesem Block:**
  - Netzwerkabhängigkeiten durch vorbereitete Antworten ersetzen; Varianten `fetch` als Parameter (Block 4), `vi.stubGlobal` und Mock Service Worker im Überblick.
  - Mock Service Worker als Werkzeug des Blocks: Handler mit `http.get` und `HttpResponse`, Überschreiben pro Test mit `server.use`, `onUnhandledRequest: 'error'`; im Browser optional als echter Service Worker.
  - Angular-Projekte: `HttpTestingController` (`provideHttpClientTesting`) als framework-eigene Alternative für Code, der `HttpClient` verwendet.
  - Erfolg, HTTP-Fehler, ungültiges JSON und Netzwerkfehler gezielt testen.
  - Unterscheiden, was ein Test mit ersetzten Antworten belegt und was nur der echte Request im Browser zeigt (CORS, Header, tatsächliche API).

## Bewusst nicht enthalten

- Vergleich von `fetch` mit axios und ky; ein Satz zur Einordnung genügt.
- WebSocket-, Streaming- und Worker-Übungen im Pflichtprogramm; nur bei konkretem Bedarf der Zielgruppe.
- Authentifizierung, OAuth und Cookie-Sicherheit im Detail.
- Service Worker und Offline-Fähigkeit.

## Ausgangslage aus 2025

- Foliensatz [04-WebPlatformApis.pdf](../../../../modern-frontend-bsi-2025/00-CourseMaterial/04-WebPlatformApis.pdf): Fetch, SOP, CORS, JSON und Forms als Grundlage; um HTTP-Fehlerbehandlung und Testing erweitern.
- Übungsblatt [04-Exercise-Platform.md](../../../../modern-frontend-bsi-2025/00-CourseMaterial/04-Exercise-Platform.md): CORS-Experiment mit `jsonplaceholder.typicode.com` gegenüber einer Nachrichtenseite.
- Beispiele `04-web-platform/04-json` (Vitest-Test für JSON-Serialisierung), `04-web-platform/05-forms` und `-solution` (Fastify-Server mit JSON- und FormData-Endpunkt), `02-websocket`, `03-streaming`, `06-webworker` als Demos.
