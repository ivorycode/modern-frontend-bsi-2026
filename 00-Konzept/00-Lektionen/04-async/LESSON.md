# Lektion 4: Async JavaScript und Fehlersuche

Tag 1, 90 Minuten inklusive Übung und Besprechung.

## Ziel der Lektion

Die Teilnehmenden verstehen, wie JavaScript asynchrone Arbeit ausführt. Sie schreiben asynchronen Code mit `async`/`await`, steuern Parallelität und Reihenfolge bewusst und behandeln Fehler und Abbrüche. Fehler im zeitlichen Verhalten wie veraltete Antworten diagnostizieren sie und sichern das Verhalten mit asynchronen Tests ab.

## Themen

- **Ein Thread, viele Wartezeiten:** Main Thread, Event Loop, Task- und Microtask-Queue; warum lange Berechnungen die UI blockieren.
- **Vom Callback zum Promise in einer Minute:** Callbacks als Grundmechanismus (Event Handler, `setTimeout`); Callback-Verschachtelung als Motivation für Promises.
- **Promises:**
  - Zustände `pending`, `fulfilled`, `rejected`; ein Promise wird genau einmal erfüllt.
  - Verkettung mit `then`, Fehlerbehandlung mit `catch`, Aufräumen mit `finally`.
  - Promises selbst erzeugen (`new Promise`, `Promise.withResolvers`) – vor allem zum Verständnis und für Tests.
- **`async`/`await`:** Syntax über Promises; `try`/`catch`/`finally`; eine `async`-Funktion gibt immer ein Promise zurück.
- **Häufige Fehler:** vergessenes `await`, unbehandelte Rejections, `await` in Schleifen ohne Absicht, `forEach` mit `async`-Callback.
- **Parallel oder sequenziell:**
  - Sequenziell mit `await` in der Schleife (Wasserfall).
  - Parallel mit `Promise.all`; Reihenfolge der Ergebnisse gegenüber Reihenfolge der Antworten.
  - `Promise.allSettled` bei Teilfehlern, `Promise.race` und `Promise.any` kurz.
  - Wasserfall und Parallelität im Network-Tab beobachten.
- **Abbruch:** `AbortController` und `AbortSignal`; `fetch` abbrechen; `AbortSignal.timeout`; abgebrochene Operation von echtem Fehler unterscheiden.
- **Race Conditions und veraltete Antworten:** Suche, bei der eine ältere, langsamere Antwort die neuere überschreibt; Lösungen: vorherigen Request abbrechen oder Antwort einer Anfrage-ID zuordnen und verwerfen.
- **Debouncing** als ergänzende Massnahme gegen unnötige Requests; behebt die Race Condition allein nicht.
- **Diagnose im Browser:** Network-Tab mit Timing und Throttling, Breakpoints in `async`-Funktionen, asynchroner Call Stack.
- **Ausblick Ereignisströme:** Einzelresultat (Promise), Zustand und Ereignisstrom (Observable) unterscheiden; RxJS und `switchMap` als Lösung für das Suchproblem in Angular-Projekten.
- **Testing in diesem Block:**
  - Asynchrone Tests mit `async`/`await` schreiben; erwartete Rejections mit `await expect(...).rejects` prüfen.
  - Kontrolliert verzögerte Antworten mit selbst aufgelösten Promises statt echter Wartezeiten.
  - Reihenfolge und Fehlerfälle gezielt herstellen.

## Bewusst nicht enthalten

- jQuery-AJAX und Vergleich von HTTP-Bibliotheken (axios, ky).
- Promise-Polyfills und Historie der Promise-Bibliotheken.
- Asynchrone Generatoren und `for await...of` (höchstens Backup-Folie).
- RxJS-Operatorenkatalog, Subjects, Hot und Cold Observables; bei Angular-lastiger Zielgruppe gezielt ergänzen.
- Fake Timers und umfangreiches Mocking; nur bei Bedarf als Vertiefung.

## Ausgangslage aus 2025

- Foliensatz [03-AsyncJavaScript.pdf](../../../../modern-frontend-bsi-2025/00-CourseMaterial/03-AsyncJavaScript.pdf): Event Loop, Promises, `async`/`await` und Abbruch wiederverwendbar; Callback- und RxJS-Teil stark kürzen.
- Wort-API `03-async/00-api` (neun Wörter mit zufälliger Verzögerung bis 3 Sekunden) als bewährte Grundlage.
- `03-async/20-Promises/91-Words-promise` und `91-Words-promise-solution` als Ausgangsstand für die Wort-Übung.
- `03-async/30-Observables/91-Search-exercise` (Wikipedia-Suche mit künstlich verzögerter Antwort für «React») als Vorlage für das Race-Condition-Beispiel.
- `03-async/00-EventLoop` als Demo für blockierende Berechnungen.
- Übungsblatt [03-Exercise-Async.md](../../../../modern-frontend-bsi-2025/00-CourseMaterial/03-Exercise-Async.md).
