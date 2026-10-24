# Lektion 2: Modernes JavaScript

Tag 1, 60 Minuten inklusive Übung und Besprechung.

## Ziel der Lektion

Die Teilnehmenden lesen und erklären modernen JavaScript-Code, wie er in aktuellen Projekten vorkommt. Im Mittelpunkt stehen Module, Funktionen und Closures sowie Referenzen und Mutation. Fehler, die aus diesen Konzepten entstehen, erkennen sie und sichern das korrigierte Verhalten mit einfachen Tests ab.

## Themen

- **JavaScript heute:** eine Sprache, viele Laufzeiten (Browser, Node); Sprache, Laufzeit und Browser-APIs unterscheiden.
- **ECMAScript-Module:**
  - `import`/`export`, Named Exports gegenüber Default Export.
  - Modul-Scope statt globalem Scope; ein Modul wird einmal ausgewertet.
  - Native Module im Browser (`<script type="module">`) und Module als Grundlage für Bundler.
  - Dynamischer Import für Lazy Loading (kurz).
- **Variablen und Scope:** `const` und `let` als Standard, Block-Scope; `var` und Hoisting nur, um Bestandscode lesen zu können.
- **Funktionen als Werte:**
  - Funktionsdeklaration, Funktionsausdruck, Arrow Function.
  - Callbacks und Higher-Order Functions am Beispiel von Event Handlern und Array-Methoden.
  - Options-Objekt mit Destructuring und Default-Werten.
- **Closures:** eingefangene Variablen statt kopierter Werte; typische Fehler in Schleifen und Event Handlern.
- **`this` im Alltag:** Verlust des Kontexts bei übergebenen Methoden (`button.addEventListener('click', counter.increase)`); Lösungen mit Arrow Function oder `bind`.
- **Moderne Syntax zum Lesen von realem Code:** Template Strings, Destructuring, Spread und Rest, Optional Chaining `?.`, Nullish Coalescing `??`, Kurzschreibweisen für Objektliterale.
- **Datenverarbeitung mit Arrays:** `map`, `filter`, `find`, `some`, `reduce`; `toSorted` und `structuredClone` als nicht mutierende Varianten.
- **Referenzen und Mutation:** Objekte und Arrays werden als Referenz geteilt; flache Kopie mit Spread, tiefe Kopie mit `structuredClone`; warum UI-Frameworks unveränderliche Updates bevorzugen.
- **Klassen kurz:** Syntax, Class Fields und private Felder `#` zum Lesen; keine Vertiefung von Vererbung.
- **Testing in diesem Block:** das Verhalten einer kleinen Funktion oder eines Moduls mit einfachen Erwartungen absichern; Module erleichtern das Testen, weil sie Abhängigkeiten sichtbar machen.

## Bewusst nicht enthalten

- IIFEs und Scope-Reparaturen ausschliesslich mit `var`.
- `call`/`apply`, Symbols, eigene Iteratoren, Proxies und Generatoren; bei Bedarf beim Auftreten erklären.
- ES5-Geschichte, Polyfills und Feature-Tabellen.
- Ausblick auf Proposals (Decorators, `using`, Signals, Temporal); allenfalls als Backup-Folie.

## Ausgangslage aus 2025

- Foliensatz [01-ModernJavaScript.pdf](../../../../modern-frontend-bsi-2025/00-CourseMaterial/01-ModernJavaScript.pdf): Funktionen, Closures, `this`, Module und Syntax-Folien als Basis, deutlich gekürzt.
- Beispiele `02-Language/91-CapturingScope` (Closure in Schleife, verlorenes `this`, eingefangener Wert) und `02-Language/92-Spaghetti` (globale Namenskollision zwischen Skripten) im Vorjahresrepository.
- Übungsblatt [01-Exercise-Modern-JavaScript.md](../../../../modern-frontend-bsi-2025/00-CourseMaterial/01-Exercise-Modern-JavaScript.md); Übung 3 (Skypack und Import Maps) entfällt im Pflichtprogramm.
