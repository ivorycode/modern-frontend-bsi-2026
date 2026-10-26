# Übungsentwurf: Eine Seite von nativem CSS auf Tailwind umstellen – mit Tests als Sicherheitsnetz

Status: Übung angelegt in [Exercises/07-styling](../../../Exercises/07-styling). Die ausführliche Anleitung für die Teilnehmenden mit Schritt-für-Schritt-Lösungshinweisen steht in deren [README.md](../../../Exercises/07-styling/README.md); dieser Entwurf fasst Absicht und Entscheidungen zusammen.

## Rahmen

- Zeitbedarf: etwa 75 Minuten.
  - Referenz festhalten und Umstellung: 45 Minuten.
  - Änderungsauftrag: 10 Minuten.
  - Vergleich und Besprechung: 20 Minuten.
- Voraussetzungen: Block 1 und 6 (Playwright-Grundlagen). Keine Framework- und keine Tailwind-Kenntnisse nötig; die Anleitung enthält eine Kurzeinführung in Tailwind.
- Es gibt nur eine Variante. Alle stellen dieselbe Seite um und vergleichen danach ihre eigene Tailwind-Fassung mit der gegebenen CSS-Fassung.

## Lernziel

Die Teilnehmenden lesen eine mit modernem CSS gestaltete Seite und verstehen sie: Grid, Flexbox, Media und Container Queries, Design Tokens, `:has()` und Komponentenzustände. Sie stellen die Seite schrittweise auf Tailwind CSS um, ohne Darstellung oder Verhalten zu verändern. Dabei schützen sie das Refactoring mit Screenshot-Vergleichen und Playwright-Tests. An bewusst eingebauten Stolpersteinen wägen sie Lösungsvarianten ab. Mit einem Änderungsauftrag in beiden Fassungen beurteilen sie aus eigener Erfahrung, welche Stärken und Schwächen natives CSS und Utility-First-CSS haben.

## Ausgangslage

- Vite+-Projekt mit TypeScript ohne Framework, Port 5178. `tailwindcss` und `@tailwindcss/vite` (4.3.3) sind installiert, aber nicht eingebunden; das Einbinden ist Schritt 1.
- Seite «Kursanmeldung» mit Kopf (Marke, Navigation, Menü-Button), Formular (Name, E-Mail, Kurs, Teilnahme als `fieldset`, Bemerkung, Bedingungen, «Anmelden», «Zurücksetzen») und Zusammenfassung (`aside` mit `dl`, Liste und Button «Anmeldung drucken»). Das Markup ist bereits semantisch; umgebaut wird nur das Styling.
- `src/styles.css`: sauberes, modernes CSS ohne `@layer` (Tokens in `:root`, Nesting, eine Klasse pro Komponente, Media Query bei `50rem`, Container Query bei `30rem`, Fehlerzustand mit `.field:has(:user-invalid)`).
- `src/app.ts` setzt nur `aria-expanded`, `disabled` und Text, nie Klassen, und sucht Elemente über Rollen und Attribute statt über Styling-Klassen.
- `css-referenz/`: unveränderte Kopie der Ausgangsseite unter `/css-referenz/`, als zweiter Einstiegspunkt im Build. Dient dem Vergleich und dem Änderungsauftrag.
- Playwright mit drei Viewports: `mobil` 375 px, `grenzfall` 784 px (zwischen `48rem` und `50rem`), `desktop` 1280 px. Vier Screenshot-Tests (Ausgangszustand, Menü geöffnet, ausgefüllt mit Fokus und Hover, Fehlerzustand) mit `maxDiffPixelRatio: 0.001` und ein funktionaler Beispieltest.
- Referenzbilder werden nicht mitgeliefert und sind von Git ausgeschlossen; jede Person erzeugt sie in Schritt 0 auf dem eigenen Rechner.
- `NOTIZEN.md`: Vorlage für die gewählten Varianten, den Änderungsauftrag und die Vergleichstabelle.

## Stolpersteine

Alle Stolpersteine sind im Prototyp nachgewiesen; die Lösungsvarianten in der Anleitung sind geprüft.

| Stolperstein | Wo er auftritt | Lösungsvarianten in der Anleitung |
| --- | --- | --- |
| A: Preflight verändert die Seite | Schritt 1: Überschriften verlieren die Fettschrift, die Liste Aufzählungszeichen und Einzug, weil das CSS dafür den Browser-Standard nutzt | ausdrücklich gestalten / Preflight vorerst weglassen / bewusst akzeptieren |
| B: Standardpalette und Zeilenhöhen | Schritt 2: Tailwinds Farben bleiben neben den Tokens verfügbar; `text-sm` setzt zusätzlich `line-height` 1.43 statt der geerbten 1.5 | `--color-*: initial` oder Palette behalten; `--text-sm--line-height` im Token, `leading-normal` je Stelle oder bewusst übernehmen |
| C: Altes CSS überschreibt Utilities | Schritt 3: Utilities verlieren gegen CSS ohne Layer, auch versteckt über `* { margin: 0 }` gegen `mx-auto` | alte Regel löschen / altes CSS mit `@import "./styles.css" layer(legacy)` unter die Utilities legen / `!` als Notlösung |
| D: Zustand eines anderen Elements | Schritt 3 (Menü über `aria-expanded`) und Schritt 5 (Fehler über `:user-invalid`) | `group-has-[…]` / `@custom-variant` / `peer` / kleine eigene Regel |
| E: Grössen ausserhalb der Skala | Schritt 4 (Breakpoint `50rem` gegenüber `md` = `48rem`, nur im Viewport `grenzfall` sichtbar) und Schritt 7 (Container `30rem` gegenüber `@md` = `28rem`) | willkürlich `min-[50rem]:` / Token `--breakpoint-wide` / Design angleichen |
| F: Ein Wert aus der Designvorgabe | Schritt 4: Zusammenfassung `350px` breit | willkürlicher Wert / Token `--spacing-summary` / runden; Hinweis auf `w-87.5`, das mit dem Grundabstand skaliert |
| G: Reihenfolge der Varianten | Schritt 5: Hover über einem ungültigen Feld färbt den Rahmen in Tailwind grau, im CSS bleibt er rot; kein Test bemerkt es | `user-invalid:hover:border-danger` |
| H: Wiederholung | Schritt 6: Button zweimal, Eingabefelder viermal | wiederholen / `@utility btn` mit `@apply` / Komponente im Framework (nur einordnen) |

## Ablauf

- **Teil 1:** Schritt 0 (Seite kennenlernen, Referenzbilder erzeugen), Schritte 1–7 (einbinden, Tokens, Kopf, Layout, Formular, Buttons, Zusammenfassung), Schritt 8 (altes CSS entfernen, funktionale Tests für Menü, Layout und Fehler ergänzen, visuell prüfen). Bei Zeitmangel entfallen Schritte 6 und 7.
- **Teil 2:** Änderungsauftrag in beiden Fassungen: Primärfarbe, Grundabstand `0.3rem`, sekundärer Button «Entwurf speichern». Referenzbilder danach bewusst aktualisieren. Ergebnis im Prototyp: Beide Fassungen bleiben gleich bis auf den Einzug der Liste, weil `pl-10` mit dem Grundabstand wächst und die 40 px des Browsers nicht.
- **Teil 3:** Vergleichstabelle aus eigener Erfahrung, Fazit nach Projektart.

## Optional mit Agent

Der Agent stellt die Seite um; die Teilnehmenden prüfen die gewählten Varianten, eingeführte Palettenfarben oder willkürliche Werte, unveränderte Tests und Referenzbilder sowie Stolperstein G im Browser. Änderungsauftrag und Vergleich führen sie selbst durch.

## Material aus 2025

- Tailwind-Abwägung aus [06-Styling.pdf](../../../../modern-frontend-bsi-2025/00-CourseMaterial/06-Styling.pdf), S. 13–16, als Einstieg in den Vergleich.
- Die Beispiele `07-Styling/vite-tailwind-starter` und `07-Styling/tailwind-demo` wurden nicht übernommen; die Übung verwendet Tailwind 4 mit Vite-Plugin und `@theme`.

## Entscheidungen

- Eine Umstellung von CSS auf Tailwind statt zweier paralleler Varianten. Der Vergleich beruht so auf eigener Erfahrung mit beiden Fassungen derselben Seite. Eine Umstellung in Gegenrichtung wird nicht angeboten.
- Die gegebene CSS-Fassung ist sauber und modern, damit der Vergleich nicht durch schlechtes Ausgangs-CSS verzerrt wird. Die Stolpersteine entstehen aus Unterschieden der Ansätze. Das `fieldset` ist im CSS ausdrücklich gestaltet, damit Preflight gezielt Überschriften und Liste trifft und nicht den schwer nachzubauenden Rahmen des Browsers.
- Tailwind ist vorinstalliert und versionsgenau festgelegt, damit `npm ci` im Kurs ohne zusätzlichen Download reicht und alle dieselbe Version verwenden.
- Semantisches HTML ist Thema der Folien, nicht der Übung.
- Screenshot-Vergleiche sind Kern der Übung: Bei einem Refactoring ohne gewollte Änderung der Darstellung sind sie das passende Sicherheitsnetz. Stolperstein G zeigt zugleich ihre Grenze.
- `:user-invalid` greift in Chrome auch mit `novalidate` nach einem Absendeversuch; ein zusätzliches Attribut am Formular ist nicht nötig.
- Schrittweise Umstellung mit eingebundenem altem CSS statt Neuschreiben. Das entspricht der Praxis, macht Stolperstein C erlebbar und erlaubt einen Teilabschluss.
- Die Gesamtlösung steht ausklappbar am Ende der Anleitung, nicht als eigene Seite im Projekt; sonst bräuchte sie vor Schritt 1 eine eingebundene Tailwind-Konfiguration.
- Tailwind durchsucht alle nicht ignorierten Dateien im Übungsordner, auch `README.md`. Dadurch enthält das gebaute CSS einige zusätzliche Utilities; für den Grössenvergleich in Teil 3 ist das vernachlässigbar.

## Offene Punkte für die Review

- Reichen 45 Minuten für Schritt 0 bis 8? Erfahrungswerte aus einem Probelauf fehlen.
- Die Referenzbilder sind unter macOS geprüft; unter Windows und Linux ist nur zu erwarten, dass sie auf demselben Rechner stabil bleiben.
