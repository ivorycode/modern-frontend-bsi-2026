# Übungsentwurf: Robuster Fetch, kontrollierte Antworten und CORS im Browser

Status: Beschreibung zur Review, noch keine Übung angelegt.

## Rahmen

- Zeitbedarf: etwa 40 Minuten Kernaufgabe (Teil 1 etwa 25, Teil 2 etwa 15 Minuten), 10 Minuten Besprechung.
- Voraussetzungen: Block 3 (Zod) und Block 4 (`async`/`await`, asynchrone Tests).

## Lernziel

Die Teilnehmenden behandeln die Fehlerpfade eines HTTP-Requests vollständig und testen sie mit kontrollierten Antworten. Im Browser untersuchen sie CORS und begründen, warum ein Test mit ersetzten Antworten dieses Verhalten nicht belegt.

## Ausgangslage (vorzubereiten)

- Ein Übungsordner auf Basis des Vite+-Starters mit einer kleinen lokalen API (z. B. Fastify wie in `04-web-platform/05-forms`), die neben dem Vite-Dev-Server auf einem anderen Port läuft. Damit ist der Request automatisch Cross-Origin.
- Endpunkte der API:
  - `GET /api/items` liefert gültiges JSON.
  - Über einen Query-Parameter oder separate Endpunkte lassen sich `404`, `500`, ungültiges JSON und eine langsame Antwort auslösen.
  - Ein Endpunkt mit CORS-Header und einer ohne.
- Eine Seite, die die Liste lädt und anzeigt. Der vorhandene Code verwendet `fetch(url).then(r => r.json())` ohne Statusprüfung; bei `404` erscheint eine leere oder kaputte Anzeige statt einer Fehlermeldung.
- Ein Modul `api.ts` mit einer Funktion `loadItems()`, die das echte `fetch` mit der absoluten API-URL aufruft, und einem Zod-Schema für die Antwort.
- Mock Service Worker (MSW) ist für Vitest eingerichtet: `setupServer` aus `msw/node` in einer Setup-Datei, `listen` mit `onUnhandledRequest: 'error'`, `resetHandlers` nach jedem Test, `close` am Ende. Ein Standard-Handler liefert gültige Daten.
- Ein vorbereiteter Test für den Erfolgsfall als Vorlage, dazu ein Beispiel, wie ein Test mit `server.use(...)` einen Handler überschreibt.

## Aufgabe

### Teil 1: Fehlerpfade umsetzen und testen

1. Die Fehlerfälle im Browser auslösen und im Network-Tab untersuchen: Status, Header, Body.
2. `loadItems` so erweitern, dass sie:
   - den Status prüft und bei HTTP-Fehlern einen aussagekräftigen Fehler liefert,
   - die Antwort mit dem Schema validiert,
   - Netzwerkfehler und ungültiges JSON unterscheidbar meldet.
3. Die Anzeige über die Zustände `loading`, `success`, `empty`, `error` steuern.
4. Tests mit MSW-Handlern ergänzen, die pro Test mit `server.use(...)` die Antwort festlegen: Erfolg, `404`, `500`, ungültiges JSON (`new HttpResponse('kein json', …)`), Netzwerkfehler (`HttpResponse.error()`).
5. Mit dem Vorgehen aus Block 4 vergleichen: Was ändert sich, wenn `fetch` nicht mehr als Parameter übergeben, sondern auf Netzwerkebene abgefangen wird?

### Teil 2: CORS untersuchen

1. Den Endpunkt ohne CORS-Header aus der Seite aufrufen und die Fehlermeldung in Console und Network-Tab lesen.
2. Denselben Endpunkt mit `curl` aufrufen und den Unterschied erklären.
3. Feststellen, dass die MSW-Tests aus Teil 1 weiterhin grün sind, und begründen, warum (keine Browser-Prüfung, die Antwort kommt vom Handler, nicht vom Server).
4. Das Problem auf zwei Arten beheben: CORS-Header auf dem Server setzen und alternativ den Vite-Dev-Server-Proxy verwenden. Vor- und Nachteile benennen.

## Abnahmekriterien

- Jeder Fehlerfall führt zu einer passenden, verständlichen Meldung in der UI; keine unbehandelte Rejection in der Console.
- Für jeden Fehlerfall gibt es einen Test, der ohne echtes Netzwerk läuft; unerwartete Requests lassen die Tests scheitern.
- Die Teilnehmenden können erklären, warum der CORS-Fehler nur im Browser auftritt und welche Header ihn beheben.

## Vertiefung für Schnellere

- Formular ergänzen: ein Eintrag wird mit `FormData` erfasst und als JSON gesendet. Server und Client validieren mit demselben Zod-Schema; Validierungsfehler des Servers (`400` mit Feldfehlern) werden im Formular angezeigt. Grundlage: `04-web-platform/05-forms-solution`.
- Timeout mit `AbortSignal.timeout` für die langsame Antwort und ein Test dafür (MSW-Handler mit `delay()`).
- Die Testdaten der Handler durch das Zod-Schema validieren, damit Handler und API-Vertrag nicht auseinanderlaufen.
- Das CORS-Experiment aus 2025 wiederholen: `jsonplaceholder.typicode.com` gegenüber einer Nachrichtenseite.

## Optional mit Agent

- Auftrag: «Ergänze Tests für alle Fehlerpfade von `loadItems` mit den vorhandenen MSW-Handlern. Verwende kein echtes Netzwerk.»
- Besonders prüfen: Decken die Tests alle Fehlerarten ab, und prüfen sie die konkrete Meldung? Nutzt der Agent MSW wie vorbereitet, oder ersetzt er `fetch` zusätzlich mit `vi.stubGlobal`? Schlägt ein Agent vor, CORS-Probleme mit `mode: 'no-cors'` zu «lösen», ist das ein guter Anlass zur Diskussion (opake Response, kein Zugriff auf Daten).

## Material aus 2025

- Übungsblatt [04-Exercise-Platform.md](../../../../modern-frontend-bsi-2025/00-CourseMaterial/04-Exercise-Platform.md), Abschnitte «Exercise fetch» und «Forms».
- `04-web-platform/05-forms` und `05-forms-solution` (Fastify, JSON- und FormData-Endpunkte) als Basis für die lokale API.
- `04-web-platform/04-json` für die optionale JSON-Serialisierung.

## Entscheidungen

- Netzwerk im Test wird mit Mock Service Worker ersetzt (in Vitest über `msw/node`). Das Setup ist im Ausgangsstand vorbereitet; die Teilnehmenden schreiben Handler und Tests. Block 4 übergibt `fetch` bewusst noch als Parameter, Block 5 steigert das zum Abfangen auf Netzwerkebene.

## Offene Punkte für die Review

- Lokale API selbst schreiben oder 2025er Fastify-Server erweitern?
- Formular in die Kernaufgabe aufnehmen? Die Agenda nennt Formulare im Blocktitel; im Entwurf sind sie aus Zeitgründen Vertiefung.
