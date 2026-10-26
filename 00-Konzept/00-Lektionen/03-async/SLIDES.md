# Folienvorschlag: Async JavaScript und Fehlersuche

Erster Entwurf für etwa 35 Minuten Input. «2025: S. x» verweist auf [03-AsyncJavaScript.pdf](../../../../modern-frontend-bsi-2025/00-CourseMaterial/03-AsyncJavaScript.pdf).

## Grundlagen

1. **Titel: Async JavaScript – Reihenfolge, Fehler und Abbruch**
2. **Ein Thread, eine Event Loop** – Diagramm Call Stack, Task Queue, Microtask Queue. 2025: S. 2.
3. **Demo: blockierte UI** – `00-EventLoop`: Spinner stoppt bei langer Berechnung.
4. **Browser und Netzwerk** – Netzwerkzugriffe laufen ausserhalb des JS-Threads. 2025: S. 3.
5. **Callbacks in einer Folie** – Event Handler, `setTimeout`, Verschachtelung als Motivation. 2025: S. 4, gekürzt; jQuery entfernen.

## Promises und async/await

6. **Ein Promise ist ein zukünftiges Ergebnis** – Zustände und Übergänge. 2025: S. 6–10.
7. **Verkettung und Fehlerbehandlung** – `then`, `catch`, `finally`. 2025: S. 18–21.
8. **Promises selbst erzeugen** – `new Promise`, `Promise.withResolvers`; Nutzen für Tests. 2025: S. 23.
9. **`async`/`await`** – derselbe Code mit `then` und mit `await`. 2025: S. 26–29.
10. **Fehler mit `try`/`catch`/`finally`** – Ladeanzeige zuverlässig zurücksetzen.
11. **Vier typische Fehler** – vergessenes `await`, unbehandelte Rejection, `forEach(async …)`, unbeabsichtigter Wasserfall.

## Mehrere Operationen koordinieren

12. **Sequenziell: der Wasserfall** – Code und Network-Tab-Screenshot.
13. **Parallel mit `Promise.all`** – Code und Network-Tab-Screenshot; Ergebnisreihenfolge bleibt erhalten.
14. **Wenn einzelne Requests scheitern** – `all` gegenüber `allSettled`; `race` und `any` in einer Zeile.
15. **Abbruch mit `AbortController`** – Signal an `fetch` übergeben, `AbortError` erkennen; `AbortSignal.timeout`. 2025: S. 22, aktualisiert.

## Fehlersuche: veraltete Antworten

16. **Das Suchproblem** – Live-Demo: «Rea» wird langsam beantwortet, «React» schnell; das alte Resultat überschreibt das neue.
17. **Timeline der Race Condition** – Sequenzdiagramm zweier überlappender Requests.
18. **Diagnose im Browser** – Network-Throttling, Timing-Spalte, Breakpoint im `await`.
19. **Zwei Lösungen** – vorherigen Request abbrechen oder veraltete Antworten anhand einer Anfrage-ID verwerfen.
20. **Debouncing ist keine Lösung für Race Conditions** – reduziert Requests, verhindert aber keine Überholvorgänge.

## Ausblick Ereignisströme

21. **Wert, Zustand, Strom** – Promise, Signal/State, Observable. 2025: S. 41–42.
22. **Dasselbe Suchproblem mit RxJS** – `switchMap` in fünf Zeilen; Hinweis für Angular-Projekte. 2025: S. 49–50.

## Testing und Übung

23. **Asynchrone Tests** – `async`-Testfunktion, `await expect(...).rejects`.
24. **Zeit kontrollieren statt warten** – Antwortreihenfolge mit `Promise.withResolvers` im Test festlegen.
25. **Übung 3** – Wort-API, Verweis auf `EXERCISE.md`.
26. **Zusammenfassung** – Reihenfolge ist eine Anforderung, kein Zufall.

## Aus 2025 nicht übernehmen

- jQuery-AJAX und Promise-Bibliotheken (S. 4, 12–13), HTTP-Bibliotheken (S. 24).
- Async Generators (S. 30) als Backup-Folie.
- RxJS-Detailfolien (S. 33–52) als Zusatzmaterial für Angular-lastige Durchführungen.
