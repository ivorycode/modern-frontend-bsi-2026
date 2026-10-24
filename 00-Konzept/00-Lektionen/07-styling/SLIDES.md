# Folienvorschlag: Styling und semantisches HTML

Erster Entwurf für etwa 45 Minuten Input. «2025: S. x» verweist auf [06-Styling.pdf](../../../../modern-frontend-bsi-2025/00-CourseMaterial/06-Styling.pdf). Ein grosser Teil der Folien zu Layout und modernem CSS ist neu.

## Grundlagen

1. **Titel: Styling – Struktur, Layout und Konsistenz**
2. **Was Styling in Anwendungen leisten muss** – Gültigkeitsbereich, Nähe zur Komponente, Dynamik, Performance. 2025: S. 3.
3. **Semantisches HTML zuerst** – Vorher/Nachher: `div`-Suppe gegenüber `header`/`main`/`nav`/`button`; Vorteile für CSS, JavaScript und Tests.
4. **Kaskade, Spezifität, Vererbung** – warum eine Regel «nicht greift»; DevTools-Styles-Panel als Diagnosewerkzeug.
5. **Kaskade ordnen mit `@layer`** – Reset, Basis, Komponenten, Utilities.

## Layout

6. **Box Model und `box-sizing`**
7. **Flexbox in einer Folie** – Achsen, `justify-content`, `align-items`, `gap`.
8. **Grid in einer Folie** – Spalten, `fr`, `grid-template-areas`.
9. **Responsive Karten ohne Media Query** – `repeat(auto-fit, minmax(…))`.
10. **Wann Flexbox, wann Grid?** – Entscheidungsregel mit Beispielen.

## Responsive Darstellung

11. **Mobile First und Media Queries** – Breakpoints aus dem Inhalt ableiten.
12. **Container Queries** – eine Karte, zwei Container, zwei Layouts.
13. **Fluide Grössen mit `clamp()`** – Typografie und Abstände.
14. **Demo: DevTools Device Mode und Layout-Overlays**

## Modernes CSS und Designvorgaben

15. **Was früher Sass brauchte** – Custom Properties, Nesting, Farbfunktionen. 2025: S. 6–7 als Vergleich.
16. **Design Tokens als Custom Properties** – Farben, Abstände, Typografie, Radien.
17. **Helles und dunkles Schema** – `prefers-color-scheme`, `color-scheme`, `light-dark()`.
18. **Komponentenzustände vollständig gestalten** – Hover, Fokus, deaktiviert, Fehler; `:focus-visible`, `:has()`.

## Styling-Ansätze

19. **Styling-Philosophien** – global, komponentenbezogen, Utility-First. 2025: S. 4.
20. **CSS Modules** – 2025: S. 8.
21. **CSS-in-JS und seine Einordnung heute** – 2025: S. 9–12, auf eine Folie verdichtet.
22. **Tailwind CSS** – Beispiel und Abwägung. 2025: S. 13–16, auf zwei Folien verdichtet.
23. **Tokens in beiden Welten** – `:root`-Custom-Properties gegenüber Tailwind-`@theme`; beide erzeugen CSS-Variablen.
24. **Dieselbe Komponente zweimal** – Button mit Zuständen in nativem CSS und in Tailwind nebeneinander.
25. **Vergleichskriterien** – Lesbarkeit, Änderbarkeit, Konsistenz, Gültigkeitsbereich, Werkzeuge; Vorlage für die Vergleichstabelle der Übung.
26. **Welcher Ansatz für welches Projekt?** – Entscheidungskriterien statt Empfehlung eines Gewinners; wird nach der Übung mit den Ergebnissen der Teilnehmenden ergänzt.

## Wiederverwendbare UI-Bausteine

27. **Komponentenbibliotheken und Design Systems** – 2025: S. 17–22, auf zwei Folien verdichtet.
28. **Headless Components und shadcn** – 2025: S. 23–25.
29. **Web Components für frameworkübergreifende Design Systems** – 2025: S. 26–29, auf eine Folie verdichtet.

## Testing und Übung

30. **Was sich im Browser automatisch prüfen lässt** – Sichtbarkeit, Interaktion, Verhalten bei verschiedenen Viewports.
31. **Playwright mit mehreren Viewports** – Codebeispiel; dieselbe Suite prüft beide Styling-Varianten.
32. **Grenzen automatischer Prüfungen** – grüner Test gegenüber gutem Layout; Screenshot-Vergleiche als Option mit Kosten.
33. **Übung 7** – Verweis auf `EXERCISE.md`, Wahl der Variante, Ablauf des Vergleichs.
34. **Zusammenfassung** – Struktur in HTML, Layout mit Grid und Flexbox, Konsistenz mit Tokens, Abnahme mit Test und Auge.
