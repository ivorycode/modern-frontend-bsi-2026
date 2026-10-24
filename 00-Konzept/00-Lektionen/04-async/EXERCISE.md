# Übungsentwurf: Wörter laden – parallel, sequenziell und getestet

Status: Beschreibung zur Review, noch keine Übung angelegt.

## Rahmen

- Zeitbedarf: etwa 35 Minuten Kernaufgabe, 10 Minuten Besprechung; Vertiefung zusätzlich etwa 20 Minuten.
- Voraussetzungen: Block 1 und 3 (Tests, Typen). Die Wort-API läuft lokal.

## Lernziel

Die Teilnehmenden laden mehrere Ressourcen bewusst parallel und sequenziell, beobachten den Unterschied im Network-Tab und behandeln Fehler. Das Verhalten belegen sie mit asynchronen Tests mit kontrolliert verzögerten Antworten. In der Vertiefung diagnostizieren und beheben sie eine Race Condition.

## Ausgangslage (vorzubereiten)

- Die Wort-API aus 2025 (`03-async/00-api`), unverändert oder mit einem zusätzlichen Endpunkt, der für einen bestimmten Index einen HTTP-Fehler liefert.
- Ein Übungsordner auf Basis des Vite+-Starters mit einem Modul `words.ts`:
  - Eine fertige Funktion `fetchWord(index, signal?)`, die genau ein Wort lädt und bei HTTP-Fehlern ein Promise ablehnt.
  - Zwei leere Funktionen `loadSentenceParallel(fetchWord)` und `loadSentenceSequential(fetchWord, onWord)`. Die Lade-Funktion wird als Parameter übergeben, damit Tests sie ersetzen können.
- Eine Seite, die den Satz darstellt, mit Buttons für beide Varianten und einer Lade- und Fehleranzeige.
- Ein Test-Hilfsmittel, das eine kontrollierbare `fetchWord`-Attrappe liefert (Antworten einzeln auflösen oder ablehnen, z. B. auf Basis von `Promise.withResolvers`).
- Ein vorbereiteter Beispieltest, der zeigt, wie die Attrappe verwendet wird.

## Aufgabe

1. API starten und ein Wort im Browser beziehungsweise mit einem HTTP-Client abrufen.
2. `loadSentenceParallel` mit `Promise.all` umsetzen: Alle Wörter werden sofort angefragt, der Satz erscheint vollständig und in der richtigen Reihenfolge.
3. `loadSentenceSequential` umsetzen: Das nächste Wort wird erst nach Erhalt des vorherigen angefragt; jedes Wort erscheint sofort.
4. Beide Varianten im Network-Tab vergleichen (Wasserfall gegenüber parallelen Requests) und die Gesamtdauer erklären.
5. Fehlerfall behandeln: Schlägt ein Wort fehl, zeigt die Seite eine verständliche Meldung, und die Ladeanzeige verschwindet.
6. Tests ergänzen:
   - Parallel: Antworten in umgekehrter Reihenfolge auflösen; der Satz ist trotzdem korrekt geordnet.
   - Sequenziell: Das zweite Wort wird erst angefragt, nachdem das erste aufgelöst ist.
   - Fehler: Eine abgelehnte Antwort führt zu einer abgelehnten Gesamtoperation beziehungsweise zum Fehlerzustand.

## Abnahmekriterien

- Beide Varianten zeigen den Satz «The quick brown fox jumps over the lazy dog» korrekt an.
- Im Network-Tab ist der Unterschied zwischen Wasserfall und Parallelität sichtbar und erklärbar.
- Fehler führen zu einer Meldung, nicht zu einer hängenden Ladeanzeige oder einer unbehandelten Rejection.
- Die Tests verwenden keine echten Wartezeiten und kein Netzwerk, laufen grün und schlagen fehl, wenn die sequenzielle Variante parallel lädt.

## Vertiefung für Schnellere: veraltete Suchantworten

Separater Ausgangsstand, angelehnt an `03-async/30-Observables/91-Search-exercise`, aber ohne RxJS und ohne externe Wikipedia-Abhängigkeit:

- Eine lokale Such-API (oder Attrappe), die bestimmte Suchbegriffe absichtlich langsamer beantwortet.
- Die Suche reagiert auf Eingaben; bei schnellem Tippen überschreibt ein älteres Resultat das neuere.
- Aufgabe: Verhalten reproduzieren, mit Network-Tab und Throttling untersuchen, Ursache begründen und beheben (`AbortController` oder Verwerfen veralteter Antworten).
- Test: Zwei überlappende Suchen, die ältere wird zuletzt aufgelöst; angezeigt wird das Resultat der neueren.

## Optional mit Agent

- Auftrag: «Implementiere `loadSentenceSequential` so, dass jedes Wort angezeigt wird, sobald es eintrifft. Schreibe einen Test, der die sequenzielle Reihenfolge belegt.»
- Besonders prüfen: Belegt der Test wirklich die Reihenfolge der Requests oder nur das Endergebnis? Verwendet er echte Timeouts? Wird bei einem Fehler die Ladeanzeige zurückgesetzt?
- Für die Vertiefung: Eine vom Agenten vorgeschlagene Diagnose mit eigenen Beobachtungen im Network-Tab abgleichen.

## Material aus 2025

- `03-async/00-api` (Wort-API) und `03-async/20-Promises/91-Words-promise` beziehungsweise `-solution`; axios durch `fetch` ersetzen.
- `03-async/30-Observables/91-Search-exercise` für die Idee der künstlich verzögerten Suchantwort.
- Übungsblatt [03-Exercise-Async.md](../../../../modern-frontend-bsi-2025/00-CourseMaterial/03-Exercise-Async.md), Abschnitt «AJAX with Promises».

## Offene Punkte für die Review

- Soll die Wort-API in den Übungsordner wandern (z. B. als Vite-Middleware oder kleiner Node-Server im selben Projekt), damit nur ein Befehl nötig ist?
- Bei Angular-lastiger Durchführung: Vertiefung zusätzlich mit RxJS `switchMap` anbieten?
