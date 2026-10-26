# Übungsentwurf: Wörter laden – parallel, sequenziell und getestet

Status: Übung angelegt in [Exercises/03-async](../../../Exercises/03-async). Die ausführliche Anleitung für die Teilnehmenden mit Schritt-für-Schritt-Lösungshinweisen steht in deren [README.md](../../../Exercises/03-async/README.md); dieser Entwurf fasst Absicht und Entscheidungen zusammen.

## Rahmen

- Zeitbedarf: etwa 35 Minuten Kernaufgabe (Teil 1 und 2), 10 Minuten Besprechung; Vertiefung 1 (Race Condition) und Vertiefung 2 (RxJS `switchMap`) zusätzlich je etwa 20 Minuten.
- Voraussetzungen: Block 1 und 2 (Tests, Module, Closures). TypeScript ist noch nicht eingeführt; wie in Block 2 enthält der Code nur einfache, vorgegebene Typannotationen.
- Die Wort- und Such-API läuft als eigener Node-Server im Übungsprojekt (`server/api.ts`, `npm run api`, Port 3003). Der Vite-Entwicklungsserver (Port 5175) leitet `/api` per Proxy weiter, damit CORS erst in Block 5 Thema wird.

## Lernziel

Die Teilnehmenden laden mehrere Ressourcen bewusst parallel und sequenziell, beobachten den Unterschied im Network-Tab und behandeln Fehler. Das Verhalten belegen sie mit asynchronen Tests mit kontrolliert verzögerten Antworten. In der Vertiefung diagnostizieren und beheben sie eine Race Condition, zuerst mit `AbortController`, danach mit RxJS `switchMap`.

## Ausgangslage

- `server/api.ts` (Node.js ohne Framework): `GET /api/words/:index` mit zufälliger Verzögerung von 0,2 bis 1,2 Sekunden; mit `?scenario=error` antwortet Wort 5 mit HTTP 500. `GET /api/search?q=…` beantwortet Suchbegriffe mit ein oder zwei Zeichen nach 2 Sekunden, längere nach 0,2 Sekunden.
- `src/word-api.ts`: fertige Funktion `fetchWord(index, scenario)`, die genau ein Wort lädt und bei HTTP-Fehlern ablehnt.
- `src/sentence.ts`: `loadSentenceParallel(fetchWord)` und `loadSentenceSequential(fetchWord, onWord)` laden bisher nur das erste Wort. Die Lade-Funktion wird als Parameter übergeben, damit Tests sie ersetzen können.
- `src/sentence-view.ts`: Seite mit Szenario-Auswahl, Buttons für beide Varianten, Ladeanzeige, Fehlerelement und Dauer. `load` hat kein `try`/`catch`/`finally`; im Fehlerfall bleibt die Ladeanzeige stehen.
- `src/test-helpers.ts`: kontrollierbare Attrappen für `fetchWord` und die Suche auf Basis von `Promise.withResolvers` sowie `flushPromises` (eine Task, nachdem die Microtask-Queue leer ist). Die Such-Attrappe lehnt wie `fetch` ab, wenn das Signal abbricht.
- Ein vorbereiteter Beispieltest «fragt alle Wörter sofort an und liefert den Satz», der zu Beginn fehlschlägt; die übrigen Tests sind `it.todo`.
- Playwright-Tests gegen die echte API: Parallelität beziehungsweise Sequenz über die Zahl gleichzeitig offener Requests, Fehlermeldung und Ladeanzeige in beiden Varianten, Suche nach schnellem Tippen in beiden Umsetzungen.

## Aufgabe

1. API starten, ein Wort im Browser und mit `curl` abrufen, Proxy erklären.
2. Ausgangslage und Testattrappe verstehen.
3. `loadSentenceParallel` mit `Promise.all` umsetzen; Test mit umgekehrter Antwortreihenfolge ergänzen.
4. Test für `loadSentenceSequential` zuerst schreiben, dann umsetzen; prüfen, dass der Test bei paralleler Umsetzung fehlschlägt.
5. Beide Varianten im Network-Tab vergleichen: Wasserfall, Gesamtdauer, Grenze von sechs Verbindungen bei HTTP/1.1.
6. Fehlerfall reproduzieren (unbehandelte Rejection, hängende Ladeanzeige), Tests für Rejections ergänzen und deren Aussagekraft mit einem verschluckten Fehler prüfen, `load` mit `try`/`catch`/`finally` korrigieren.
7. Beobachten, dass `Promise.all` früh ablehnt, die übrigen Requests aber weiterlaufen; `Promise.allSettled` einordnen.

## Abnahmekriterien

- Beide Varianten zeigen den Satz «The quick brown fox jumps over the lazy dog» korrekt an.
- Im Network-Tab ist der Unterschied zwischen Wasserfall und Parallelität sichtbar und erklärbar.
- Fehler führen zu einer Meldung, nicht zu einer hängenden Ladeanzeige oder einer unbehandelten Rejection.
- Die Tests verwenden keine echten Wartezeiten und kein Netzwerk, laufen grün und schlagen fehl, wenn die sequenzielle Variante parallel lädt.

## Vertiefung 1: veraltete Suchantworten

Zweite Seite `suche.html` im selben Projekt, angelehnt an `03-async/30-Observables/91-Search-exercise`, aber ohne Wikipedia-Abhängigkeit. Bei zügigem Tippen von «react» überschreibt die langsame Antwort für «re» das Resultat für «react».

- Reproduzieren, mit Network-Tab, Throttling und Breakpoint untersuchen, Ablauf skizzieren.
- Fehlschlagenden Test schreiben: zwei überlappende Suchen, die ältere antwortet zuletzt.
- Debouncing als Vorschlag prüfen und verwerfen.
- Mit `AbortController` beheben; Abbruch von echtem Fehler über das lokale `signal` unterscheiden. Verwerfen per Anfrage-ID als Alternative.

## Vertiefung 2: RxJS und switchMap

Dieselbe Suchseite mit `?umsetzung=rxjs`. `src/search-rx.ts` verwendet anfangs `mergeMap` und zeigt denselben Fehler.

- Test mit `Subject` und Attrappe schreiben.
- `mergeMap` durch `switchMap` ersetzen und beobachten, dass die Requests weiterlaufen.
- Inneres Observable mit Teardown, der den `AbortController` abbricht; Hinweis auf `fromFetch` und Angulars `HttpClient`.
- `debounceTime` und `distinctUntilChanged` in der Anbindung ergänzen, damit die Unit-Tests zeitfrei bleiben.
- Abschlussfrage: Ein Fehler beendet den Strom; `catchError` innerhalb von `switchMap`.

## Optional mit Agent

Jeder Teil und jede Vertiefung beginnt im README mit einem Auftrag und einer Liste «Kritisch prüfen». Schwerpunkte:

- Belegt der Test die Reihenfolge der Anfragen oder nur das Endergebnis? Verwendet er echte Wartezeiten?
- Wird die Ladeanzeige in `finally` zurückgesetzt? Fängt der Agent Fehler in `sentence.ts` ab?
- Stimmt die Diagnose der Race Condition mit eigenen Beobachtungen im Network-Tab überein? Hat der Agent nur Debouncing eingebaut oder nur `mergeMap` durch `switchMap` ersetzt, ohne abzubrechen?

## Material aus 2025

- Wort-API aus `03-async/00-api` als eigener Node-Server ohne Express neu geschrieben; Fehlerszenario ergänzt.
- `03-async/20-Promises/91-Words-promise-solution`: Varianten mit `Promise.all` und `await` in der Schleife; axios durch `fetch` ersetzt.
- `03-async/30-Observables/91-Search-exercise`: Idee der künstlich verzögerten Suchantwort und Hinweise `mergeMap` → `debounceTime` → `switchMap`.

## Offene Punkte für die Review

- Reichen 35 Minuten für Teil 1 und 2, oder wird Schritt 1.7 (Network-Tab) gemeinsam im Plenum gezeigt?
- Sollen die Vertiefungen bei wenig Angular-Bezug auf Vertiefung 1 beschränkt werden?
- Die Playwright-Tests laufen gegen die echte, zufällig verzögerte API und dauern deshalb etwa 15 Sekunden. Genügt das, oder soll die API für Tests eine kürzere Verzögerung erhalten?
