# Folienvorschlag: Web Platform APIs – Fetch, HTTP, CORS und Formulare

Erster Entwurf für etwa 35 Minuten Input. «2025: S. x» verweist auf [04-WebPlatformApis.pdf](../../../../modern-frontend-bsi-2025/00-CourseMaterial/04-WebPlatformApis.pdf).

## HTTP und Fetch

1. **Titel: Der Browser als Plattform – Fetch, HTTP, CORS und Formulare**
2. **Ein HTTP-Austausch** – Request- und Response-Anatomie mit echtem Beispiel aus dem Network-Tab.
3. **`fetch`: die Plattform-API für HTTP** – Grundaufruf mit `await`. 2025: S. 2.
4. **Die Response lesen** – `ok`, `status`, `headers`, `text()` gegenüber `json()`; Body nur einmal lesbar.
5. **Stolperstein: 404 ist kein Fehler für `fetch`** – Codebeispiel ohne und mit Statusprüfung; Quelle MDN.
6. **Vier Arten, wie ein Request scheitert** – Netzwerk, HTTP-Status, ungültiger Body, Abbruch; jeweils Erkennungsmerkmal.
7. **Ein kleiner HTTP-Helper** – `getJson(url, schema)` mit Statusprüfung und Zod-Validierung; Verweis auf Block 4.
8. **Und axios/ky?** – ein Satz zur Einordnung. 2025: S. 6, gekürzt.

## JSON

9. **JSON ist kein JavaScript** – was `stringify` verliert; Replacer und Reviver. 2025: S. 10.

## Same Origin Policy und CORS

10. **Was ist ein Origin?** – Schema, Host, Port; Beispiele gleich/verschieden. 2025: S. 3.
11. **Same Origin Policy** – warum der Browser fremde Antworten nicht freigibt. 2025: S. 4.
12. **CORS: der Server erteilt die Erlaubnis** – Ablaufdiagramm mit `Origin` und `Access-Control-Allow-Origin`. 2025: S. 5.
13. **Preflight** – wann der Browser `OPTIONS` sendet; Diagramm.
14. **CORS in den DevTools erkennen** – Screenshot einer CORS-Fehlermeldung und der fehlenden Header.
15. **CORS ist Browser-Verhalten** – `curl` funktioniert, Browser blockiert; Tests mit ersetzten Antworten sehen es nicht.
16. **Entwicklung und Produktion** – Vite-Proxy gegenüber Konfiguration des Servers.

## Formulare

17. **Formulare mit der Plattform** – `submit`, `FormData`, `Object.fromEntries`. 2025: S. 11.
18. **JSON oder multipart?** – Content-Types im Vergleich, Codebeispiele.
19. **Eingebaute Validierung und ihre Grenzen** – `required`, `type`, `pattern`; was fehlt.
20. **Client- und Servervalidierung** – ein Schema für beide Seiten.

## Weitere Plattform-APIs im Überblick

21. **WebSocket** – bidirektional, Einsatzfälle. 2025: S. 7.
22. **Streams** – inkrementelle Antworten, z. B. Ausgaben von Sprachmodellen. 2025: S. 8.
23. **Web Worker** – Rechenarbeit vom Main Thread fernhalten. 2025: S. 12.

## Testing und Übung

24. **Netzwerk im Test ersetzen** – drei Varianten mit Vor- und Nachteilen: `fetch` als Parameter (explizit, Umbau nötig), `vi.stubGlobal` (kein Umbau, globaler Zustand), Mock Service Worker (realistisch, mehr Setup); Entscheidung für den Kurs: MSW.
25. **Mock Service Worker: wie es funktioniert** – Abfangen auf Netzwerkebene; im Browser über einen echten Service Worker, in Node über abgefangene `fetch`- und HTTP-Aufrufe; der Anwendungscode bleibt unverändert.
26. **MSW-Handler und Testaufbau** – `http.get`, `HttpResponse.json`, `HttpResponse.error()`, `delay()`; `setupServer`, `server.use` pro Test, `resetHandlers`, `onUnhandledFrame: 'error'` (MSW 3; in MSW 2 `onUnhandledRequest`).
27. **Angular: `HttpTestingController`** – framework-eigene Alternative für Code mit `HttpClient`: `provideHttpClient()` und `provideHttpClientTesting()`, Request mit `expectOne` erwarten, Antwort mit `flush` liefern, mit `verify` offene Requests prüfen. MSW funktioniert in Angular ebenfalls, weil es sowohl XHR als auch `fetch` abfängt – `HttpClient` nutzt je nach Konfiguration (`withFetch()`) das eine oder das andere. Quelle: Angular-Dokumentation «Testing HTTP requests».
28. **Was ersetzte Antworten belegen – und was nicht** – Tabelle: Fehlerbehandlung ja; CORS, echte Header, API-Vertrag nein. Gegenmittel: Handler-Daten durch das Schema validieren, echte Requests im Browser beobachten.
29. **Übung 5** – Verweis auf `EXERCISE.md`.
30. **Zusammenfassung** – Status prüfen, Antwort validieren, Browser beobachten.
