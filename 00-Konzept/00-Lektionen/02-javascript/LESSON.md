# Lektion 2: Modernes JavaScript

Tag 1, 60 Minuten inklusive Übung und Besprechung.

## Ziel der Lektion

Die Teilnehmenden lesen und erklären modernen JavaScript-Code, wie er in aktuellen Projekten vorkommt. Die meisten bringen Erfahrung mit Java mit; die Lektion setzt deshalb dort an, wo JavaScript sich anders verhält, als Java-Entwicklerinnen und -Entwickler erwarten. Im Mittelpunkt stehen drei Themen:

1. ECMAScript-Module als Grundlage jedes Projekts.
2. Funktionale und objektorientierte Programmierung in JavaScript und ihre Unterschiede zu Java.
3. Unveränderliche Daten: Referenzen, Kopien und unveränderliche Updates.

Fehler, die aus diesen Konzepten entstehen, erkennen die Teilnehmenden und sichern das korrigierte Verhalten mit einfachen Tests ab.

## Primäre Themen

### 1. ECMAScript-Module

- `import`/`export`, Named Exports gegenüber Default Export.
- Modul-Scope statt globalem Scope; ein Modul wird einmal ausgewertet und von allen Importen geteilt.
- Native Module im Browser (`<script type="module">`) und Module als Grundlage für Bundler.
- Vergleich mit Java: ein Modul ist eine Datei, kein Package; Sichtbarkeit entsteht durch `export`, nicht durch Modifier.
- Dynamischer Import für Lazy Loading (kurz).
- Module erleichtern das Testen, weil sie Abhängigkeiten sichtbar machen.

### 2. Funktionale und objektorientierte Programmierung

JavaScript unterstützt beide Stile, und reale Frontend-Codebasen mischen sie. Die Lektion stellt beide nebeneinander, zum Beispiel einen Zähler einmal als Closure und einmal als Klasse.

**Funktionale Programmierung:**

- Funktionen sind Werte: Funktionsdeklaration, Funktionsausdruck, Arrow Function.
- Callbacks und Higher-Order Functions am Beispiel von Event Handlern und Array-Methoden (`map`, `filter`, `find`, `some`, `reduce`).
- Innere Funktionen: Funktionen, die in Funktionen definiert und zurückgegeben werden.
- Closures: eine Funktion behält Zugriff auf die Variablen ihrer Umgebung.
  - Vergleich mit Java: Lambdas in Java dürfen nur «effectively final» Variablen verwenden; Closures in JavaScript fangen die Variable selbst ein, nicht eine Kopie ihres Werts.
  - Typische Fehler in Schleifen und Event Handlern; `const` und `let` mit Block-Scope als Standard, `var` nur zum Lesen von Bestandscode.
- Closures als Mittel zur Kapselung: Factory-Funktion mit privatem Zustand statt Klasse.

**Objektorientierte Programmierung:**

- Klassensyntax, Konstruktor, Methoden, Class Fields, `static`.
- Private Felder und Methoden mit `#`: zur Laufzeit erzwungene Kapselung, anders als `private` in TypeScript, das nur der Compiler prüft (Ausblick auf Block 4).
- `this` verhält sich anders als in Java:
  - `this` hängt davon ab, wie eine Funktion aufgerufen wird, nicht davon, wo sie definiert ist.
  - Verlust des Kontexts bei übergebenen Methoden (`button.addEventListener('click', counter.increase)`); in Java ist eine Methodenreferenz `counter::increase` dagegen an das Objekt gebunden.
  - Lösungen: Arrow Function beim Aufruf, Class Field mit Arrow Function oder `bind`.
  - Arrow Functions haben kein eigenes `this`.
- Klassen sind Funktionen mit Prototypen; Vererbung mit `extends` nur zum Lesen, keine Vertiefung.
- Wann welcher Stil: Frontend-Frameworks bevorzugen heute überwiegend Funktionen (React-Komponenten, Vue Composition API); Angular nutzt Klassen.

### 3. Unveränderliche Daten

- Objekte und Arrays werden als Referenz geteilt; eine Mutation wirkt über alle Referenzen.
- `const` verhindert nur eine neue Zuweisung, nicht die Mutation des Objekts (wie `final` in Java).
- Kopieren:
  - Flache Kopie mit Spread (`{ ...obj }`, `[...arr]`).
  - Tiefe Kopie mit `structuredClone`; Grenzen bei Funktionen und Klasseninstanzen.
- Unveränderliche Updates:
  - Verschachtelte Objekte mit Spread aktualisieren; warum das schnell unübersichtlich wird.
  - Nicht mutierende Array-Methoden: `map`, `filter`, `toSorted`, `toReversed`, `toSpliced`, `with`.
  - `Object.freeze` und seine Grenze (wirkt nur flach).
- Immer: `produce` erlaubt Code im mutierenden Stil und liefert ein neues, unverändertes Objekt; Einsatz etwa in Redux Toolkit.
- Warum UI-Frameworks unveränderliche Updates bevorzugen: Änderungen werden über den Vergleich von Referenzen erkannt (Bezug zu `UI = f(state)` in Block 6).

## Ergänzende Themen

Nur so weit, wie sie zum Lesen der Beispiele nötig sind:

- **JavaScript heute:** eine Sprache, viele Laufzeiten (Browser, Node); Sprache, Laufzeit und Browser-APIs unterscheiden.
- **Moderne Syntax:** Template Strings, Destructuring, Spread und Rest, Optional Chaining `?.`, Nullish Coalescing `??`, Kurzschreibweisen für Objektliterale, Options-Objekt mit Default-Werten.
- **Testing in diesem Block:** das Verhalten einer kleinen Funktion oder eines Moduls mit einfachen Erwartungen absichern, etwa dass eine Update-Funktion das Eingabeobjekt nicht verändert.

## Bewusst nicht enthalten

- IIFEs und Scope-Reparaturen ausschliesslich mit `var`.
- `call`/`apply`, Symbols, eigene Iteratoren, Proxies und Generatoren; bei Bedarf beim Auftreten erklären.
- Vertiefung von Prototypketten und Vererbungshierarchien.
- Funktionale Bibliotheken (Ramda, Lodash/fp), Currying und Point-free Style.
- Persistente Datenstrukturen (Immutable.js) und das zurückgezogene Proposal für Records und Tuples.
- ES5-Geschichte, Polyfills und Feature-Tabellen.
- Ausblick auf Proposals (Decorators, `using`, Signals, Temporal); allenfalls als Backup-Folie.

## Ausgangslage aus 2025

- Foliensatz [01-ModernJavaScript.pdf](../../../../modern-frontend-bsi-2025/00-CourseMaterial/01-ModernJavaScript.pdf): Funktionen, Closures, `this`, Klassen, Module und Syntax-Folien als Basis, deutlich gekürzt.
- Beispiele `02-Language/91-CapturingScope` (Closure in Schleife, verlorenes `this`, eingefangener Wert) und `02-Language/92-Spaghetti` (globale Namenskollision zwischen Skripten) im Vorjahresrepository.
- Übungsblatt [01-Exercise-Modern-JavaScript.md](../../../../modern-frontend-bsi-2025/00-CourseMaterial/01-Exercise-Modern-JavaScript.md); Übung 3 (Skypack und Import Maps) entfällt im Pflichtprogramm.
- Material zu Immer und unveränderlichen Updates ist neu zu erstellen; 2025 bindet `99-playground/browser-plain/index.html` Immer nur per Script-Tag ein, ohne Beispiel.
