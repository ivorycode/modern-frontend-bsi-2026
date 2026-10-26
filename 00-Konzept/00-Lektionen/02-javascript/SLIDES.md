# Folienvorschlag: Modernes JavaScript

Erster Entwurf für etwa 25 Minuten Input. «2025: S. x» verweist auf [01-ModernJavaScript.pdf](../../../../modern-frontend-bsi-2025/00-CourseMaterial/01-ModernJavaScript.pdf).

## Einstieg

1. **Titel: Modernes JavaScript für Java-Entwickler – Code lesen, verstehen und absichern**
2. **JavaScript heute** – Sprache, Laufzeit, Browser-APIs; was gehört wozu? 2025: S. 63, neu gezeichnet.
3. **Agenda des Blocks** – drei Schwerpunkte: Module, funktional und objektorientiert, unveränderliche Daten.

## Module

4. **Das Problem: ein globaler Scope für alle Skripte** – Ausschnitt aus `92-Spaghetti`: zwei Skripte definieren `loadValues`. Frage ans Publikum: Was passiert?
5. **ECMAScript-Module** – `import`/`export`, Modul-Scope; ein Modul wird einmal ausgewertet. 2025: S. 27–29.
6. **Module im Vergleich zu Java** – Datei statt Package, Sichtbarkeit durch `export` statt Modifier.
7. **Named Export gegenüber Default Export** – Empfehlung für Named Exports, Gründe (Refactoring, Auffindbarkeit). 2025: S. 32–33.
8. **Module zur Laufzeit und im Build** – Browser lädt Module nativ, Bundler nutzen den Modulgraphen; dynamischer Import für Lazy Loading in einem Codebeispiel. 2025: S. 34–36, zusammengefasst.

## Funktional und objektorientiert

9. **Zwei Stile, eine Sprache** – derselbe Zähler als Factory-Funktion mit Closure und als Klasse mit privatem Feld; Vorschau auf die folgenden Folien.

### Funktionale Programmierung

10. **Funktionen sind Werte** – Deklaration, Ausdruck, Arrow Function; `const` und `let` mit Block-Scope. 2025: S. 6–7, 10–12.
11. **Callbacks und Higher-Order Functions** – Event Handler und `map`, `filter`, `find`, `reduce` an einem Fachbeispiel; Funktionen, die Funktionen zurückgeben.
12. **Closures** – innere Funktion behält Zugriff auf ihre Umgebung. 2025: S. 14–16.
13. **Closures im Vergleich zu Java** – Java-Lambda mit «effectively final» Variable gegenüber JavaScript-Closure, die die Variable selbst einfängt und verändern kann.
14. **Klassischer Fehler: Closure in der Schleife** – Ausschnitt aus `91-CapturingScope`, Task 1. Lösung mit `let` beziehungsweise Variable im Schleifenblock.

### Objektorientierte Programmierung

15. **Klassen** – Konstruktor, Methoden, Class Fields, `static`; Klassen sind Funktionen mit Prototypen, `extends` nur zum Lesen. 2025: S. 22–24, verdichtet.
16. **Private Felder `#`** – zur Laufzeit erzwungene Kapselung; Gegenüberstellung mit `private` in TypeScript, das nur der Compiler prüft.
17. **`this` ist nicht Java-`this`** – `this` hängt vom Aufruf ab, nicht von der Definition; dieselbe Methode mit unterschiedlichem `this` aufgerufen.
18. **Klassischer Fehler: verlorenes `this`** – `addEventListener('click', counter.increase)` gegenüber Java `counter::increase`; Lösungen mit Arrow Function, Class Field als Arrow Function oder `bind`. 2025: S. 25–26.
19. **Welcher Stil wo?** – React und Vue Composition API setzen auf Funktionen, Angular auf Klassen; beide Stile lesen können.

## Unveränderliche Daten

20. **Referenz gegenüber Kopie** – Diagramm: zwei Variablen zeigen auf dasselbe Objekt; Mutation wirkt überall. `const` entspricht `final`, nicht Unveränderlichkeit.
21. **Kopieren** – flache Kopie mit Spread, tiefe Kopie mit `structuredClone` und ihre Grenzen; `Object.freeze` wirkt nur flach.
22. **Unveränderliche Updates von Hand** – verschachteltes Objekt mit Spread aktualisieren; nicht mutierende Array-Methoden `toSorted`, `toSpliced`, `with`.
23. **Immer** – dasselbe Update mit `produce` im mutierenden Stil; Einsatz etwa in Redux Toolkit.
24. **Warum Frameworks das wollen** – Änderungserkennung über Referenzvergleich; Bezug zu `UI = f(state)` in Block 6.

## Syntax, Testing und Übung

25. **Syntax, die man täglich liest** – Template Strings, `?.`, `??`, Spread und Rest, Destructuring, Options-Objekt mit Defaults, Kurzschreibweisen. 2025: S. 8–9, 40–47 auf eine Folie verdichtet.
26. **Module machen Code testbar** – Funktion aus Event Handler herauslösen, exportieren, testen; Test, dass eine Update-Funktion ihre Eingabe nicht verändert.
27. **Übung 2** – Verweis auf `EXERCISE.md`, Zeitrahmen, Abnahmekriterien.
28. **Zusammenfassung** – drei Fragen, die man bei fremdem JavaScript-Code stellt: Welcher Scope? Welches `this`? Wird hier etwas mutiert?

## Aus 2025 nicht übernehmen

- «The Bad Parts» (S. 3) höchstens als Einstiegs-Gag, `call`/`apply` (S. 13), Iteratoren, Symbols, Proxies, Generatoren (S. 48–52), Proposals (S. 56–59), Feature Gap und Transpiler-Historie (S. 60–64).
- Import Maps (S. 37–38) als Backup-Folie behalten.
