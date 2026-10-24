# Lektion 7: Styling und semantisches HTML

Tag 2, 120 Minuten inklusive Übung und Besprechung.

## Ziel der Lektion

Die Teilnehmenden setzen eine Oberfläche mit modernem CSS strukturiert, responsiv und konsistent um. Sie ordnen die gängigen Styling-Ansätze ein und nutzen einen davon praktisch. Interaktionen und Sichtbarkeit prüfen sie im Browser automatisiert, Layout und Darstellung zusätzlich visuell.

## Themen

- **Semantisches HTML als Grundlage:** Dokumentstruktur mit `header`, `nav`, `main`, `section`, `footer`; Überschriftenhierarchie; native Elemente (`button`, `a`, `form`, `label`, `input`) statt generischer `div`s – weniger CSS und JavaScript, robustere Selektoren in Tests.
- **CSS-Grundlagen, die oft fehlen:** Kaskade, Spezifität, Vererbung; Box Model und `box-sizing`; `@layer` zur Ordnung der Kaskade.
- **Layout:**
  - Flexbox für eindimensionale Anordnung.
  - Grid für zweidimensionale Layouts, `grid-template-areas`, `auto-fit`/`minmax`.
  - Abstände konsistent mit `gap` statt Margins.
- **Responsive Darstellung:**
  - Mobile First, Media Queries, sinnvolle Breakpoints.
  - Container Queries für Komponenten, die sich an ihren Platz anpassen.
  - Fluide Grössen mit `clamp()`, relative Einheiten (`rem`, `%`, `fr`).
- **Modernes natives CSS:** Custom Properties, Nesting, `:has()`, `:focus-visible`, Logical Properties; was früher Sass erforderte.
- **Designvorgaben umsetzen:** Design Tokens als Custom Properties (Farben, Abstände, Typografie, Radien); helles und dunkles Farbschema mit `prefers-color-scheme` und `light-dark()`.
- **Konsistente Komponenten:** Zustände einer Komponente (Hover, Fokus, deaktiviert, Fehler) vollständig gestalten; Varianten über Klassen oder Datenattribute.
- **Styling-Ansätze im Überblick:**
  - Globales CSS mit Konventionen (BEM).
  - CSS Modules für komponentenbezogene Klassennamen.
  - Utility-First mit Tailwind CSS; Abwägung zwischen Wiederholung im Markup und Wartbarkeit.
  - CSS-in-JS und seine Einordnung bei SSR und Server Components.
- **Natives CSS und Tailwind im direkten Vergleich:** dieselben Design Tokens als Custom Properties beziehungsweise `@theme`; Lesbarkeit, Änderbarkeit, Konsistenz, Gültigkeitsbereich und Werkzeugunterstützung anhand derselben Seite beurteilen; Kriterien für die Wahl im Projekt.
- **Wiederverwendbare UI-Bausteine:** Komponentenbibliotheken, Design Systems, Headless Components und der shadcn-Ansatz; Abhängigkeit von Framework und Version.
- **Web Components in einer Folie:** Custom Elements und Shadow DOM als frameworkübergreifende Basis für Design Systems; Vertiefung nur bei entsprechendem Schwerpunkt der Zielgruppe.
- **Testing in diesem Block:**
  - Browserprüfungen mit Playwright für Interaktionen und Sichtbarkeit (`toBeVisible`, `toBeHidden`).
  - Verschiedene Viewports im Test (`setViewportSize` oder Projekte pro Gerät).
  - Grenzen: Ein grüner Test belegt kein gutes Layout; visuelle Kontrolle in DevTools (Device Mode, Grid- und Flex-Overlay) bleibt Teil der Abnahme.
  - Screenshot-Vergleiche als Option mit ihren Kosten (Flakiness, Pflege der Referenzbilder).

## Bewusst nicht enthalten

- Lange Listen von CSS-Frameworks, CSS-in-JS-Lösungen und Komponentenbibliotheken.
- Sass im Detail; Hinweis, welche Features inzwischen nativ verfügbar sind.
- Animationen und View Transitions (höchstens Ausblick).
- Accessibility als eigener Schwerpunkt (gemäss Kurskonzept entfernt).

## Ausgangslage aus 2025

- Foliensatz [06-Styling.pdf](../../../../modern-frontend-bsi-2025/00-CourseMaterial/06-Styling.pdf): Anforderungen an Styling, Philosophien, CSS Modules, Tailwind-Abwägung, Komponentenbibliotheken, Design Systems, Headless Components und Web Components wiederverwendbar; Katalogfolien kürzen. Layout, responsive Darstellung und modernes CSS sind neu zu erstellen.
- Beispiele `07-Styling/vite-tailwind-starter` und `07-Styling/tailwind-demo`, `08-web-components` im Vorjahresrepository.
