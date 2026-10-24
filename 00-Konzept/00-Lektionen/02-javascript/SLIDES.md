# Folienvorschlag: Modernes JavaScript

Erster Entwurf für etwa 25 Minuten Input. «2025: S. x» verweist auf [01-ModernJavaScript.pdf](../../../../modern-frontend-bsi-2025/00-CourseMaterial/01-ModernJavaScript.pdf).

## Einstieg

1. **Titel: Modernes JavaScript – Code lesen, verstehen und absichern**
2. **JavaScript heute** – Sprache, Laufzeit, Browser-APIs; was gehört wozu? 2025: S. 63, neu gezeichnet.
3. **Agenda des Blocks** – Module, Funktionen und Closures, `this`, moderne Syntax, Referenzen und Mutation.

## Module

4. **Das Problem: ein globaler Scope für alle Skripte** – Ausschnitt aus `92-Spaghetti`: zwei Skripte definieren `loadValues`. Frage ans Publikum: Was passiert?
5. **ECMAScript-Module** – `import`/`export`, Modul-Scope. 2025: S. 27–29.
6. **Named Export gegenüber Default Export** – Empfehlung für Named Exports, Gründe (Refactoring, Auffindbarkeit). 2025: S. 32–33.
7. **Module zur Laufzeit und im Build** – Browser lädt Module nativ, Bundler nutzen den Modulgraphen. 2025: S. 34–35, zusammengefasst.
8. **Dynamischer Import** – Lazy Loading in einem Satz und einem Codebeispiel. 2025: S. 36.

## Funktionen, Scope und Closures

9. **`const`, `let` und Block-Scope** – `var` nur noch zum Lesen von Bestandscode.
10. **Funktionen sind Werte** – Deklaration, Ausdruck, Arrow Function; Callback als Argument. 2025: S. 6–7, 10–12.
11. **Options-Objekt mit Destructuring und Defaults** – 2025: S. 8–9, mit modernem Beispiel.
12. **Closures** – eine Funktion behält Zugriff auf ihre Umgebung. 2025: S. 14–16.
13. **Klassischer Fehler: Closure in der Schleife** – Ausschnitt aus `91-CapturingScope`, Task 1. Lösung mit `let` beziehungsweise Variable im Schleifenblock.
14. **Klassischer Fehler: verlorenes `this`** – `addEventListener('click', counter.increase)`; Lösung mit Arrow Function oder Class Field als Arrow Function. 2025: S. 25–26.
15. **Klassen in drei Zeilen** – Class Fields, private Felder `#`, keine Vererbungsvertiefung. 2025: S. 22–24, auf eine Folie verdichtet.

## Moderne Syntax und Daten

16. **Syntax, die man täglich liest** – Template Strings, `?.`, `??`, Spread, Destructuring, Kurzschreibweisen. 2025: S. 40–47 auf zwei Folien verdichtet.
17. **Daten verarbeiten mit Array-Methoden** – `map`, `filter`, `find`, `reduce` an einem Fachbeispiel.
18. **Referenz gegenüber Kopie** – Diagramm: zwei Variablen zeigen auf dasselbe Objekt; Mutation wirkt überall.
19. **Nicht mutierende Varianten** – Spread, `toSorted`, `structuredClone`; Bezug zu UI-Frameworks und `UI = f(state)`.

## Testing und Übung

20. **Module machen Code testbar** – Funktion aus Event Handler herauslösen, exportieren, testen.
21. **Übung 2** – Verweis auf `EXERCISE.md`, Zeitrahmen, Abnahmekriterien.
22. **Zusammenfassung** – drei Fragen, die man bei fremdem JavaScript-Code stellt: Welcher Scope? Welche Referenz? Welches `this`?

## Aus 2025 nicht übernehmen

- «The Bad Parts» (S. 3) höchstens als Einstiegs-Gag, `call`/`apply` (S. 13), Iteratoren, Symbols, Proxies, Generatoren (S. 48–52), Proposals (S. 56–59), Feature Gap und Transpiler-Historie (S. 60–64).
- Import Maps (S. 37–38) als Backup-Folie behalten.
