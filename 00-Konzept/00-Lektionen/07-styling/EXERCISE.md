# Übungsentwurf: Ein Formular responsiv und konsistent gestalten – natives CSS und Tailwind im Vergleich

Status: Beschreibung zur Review, noch keine Übung angelegt.

## Rahmen

- Zeitbedarf: etwa 50 Minuten Kernaufgabe, 20 Minuten Vergleich und Besprechung.
- Voraussetzungen: Block 6 (Playwright-Grundlagen). Keine Framework-Kenntnisse nötig; die Übung arbeitet mit HTML, CSS und wenig TypeScript.
- Varianten: Die Übung gibt es in zwei Varianten mit identischer Aufgabe – **natives CSS** und **Tailwind CSS**. Die Teilnehmenden wählen eine Variante; im Vergleich arbeiten Paare mit je einer Variante zusammen.

## Lernziel

Die Teilnehmenden strukturieren eine Seite mit semantischem HTML und gestalten ein Formular mit Grid, Flexbox und Design Tokens responsiv. Komponentenzustände setzen sie konsistent um. Sichtbarkeit und Interaktion prüfen sie mit Playwright bei mehreren Viewports; das Layout kontrollieren sie zusätzlich visuell. Anhand der eigenen und einer fremden Lösung beurteilen sie, welche Stärken und Schwächen natives CSS und Utility-First-CSS haben.

## Ausgangslage (vorzubereiten)

### Gemeinsam für beide Varianten

- Zwei Übungsordner auf Basis des Vite+-Starters, je einer pro Variante.
- Eine Seite «Kursanmeldung» (oder ein vergleichbares Fachformular) mit:
  - Markup aus verschachtelten `div`s ohne Struktur, Formularfelder ohne `label`, ein «Button» als `div` mit Click-Handler.
  - Einer Zusammenfassung der Eingaben neben dem Formular und einer Navigation, die auf kleinen Bildschirmen hinter einem Menü-Button verschwinden soll.
- Eine Designvorgabe als Bild oder kurze Beschreibung: Farben, Abstände, Schrift, zwei Layouts (schmal einspaltig, breit zweispaltig mit Zusammenfassung daneben).
- Dieselben Design Tokens in beiden Varianten, teilweise ausgefüllt.
- **Eine gemeinsame Playwright-Testsuite** mit zwei Viewport-Projekten (z. B. Mobil und Desktop), die gegen beide Varianten läuft. Ein Beispieltest ist vorhanden; weitere Tests ergänzen die Teilnehmenden.
- Musterlösungen beider Varianten für den Vergleich.

### Pro Variante

| | Natives CSS | Tailwind CSS |
| --- | --- | --- |
| Ausgangs-CSS | Minimales, unsystematisches CSS mit festen Pixelbreiten und wiederholten Farbwerten | Tailwind ist eingerichtet (Vite-Plugin); im Markup stehen willkürliche Werte wie `w-[347px]` und `bg-[#1a5fb4]` |
| Design Tokens | Custom Properties in `:root` | `@theme`-Block in der CSS-Datei (Tailwind 4 erzeugt daraus Utilities und Custom Properties) |
| Ordnung | `@layer`, Nesting, eine Klasse pro Komponente | Utilities im Markup, Wiederholung bei Bedarf in einer kleinen Komponentenfunktion oder einem Template |
| Responsive | Media Query oder Container Query | `md:`-Präfixe oder `@container`-Varianten |
| Zustände | `:hover`, `:focus-visible`, `:disabled`, `:user-invalid` | `hover:`, `focus-visible:`, `disabled:`, `user-invalid:` |

## Aufgabe

1. Das Markup semantisch strukturieren: `header`, `nav`, `main`, `form`, `label`-Zuordnung, echter `button`.
2. Die Design Tokens vervollständigen und alle festen Farb- und Abstandswerte durch Tokens ersetzen.
3. Das Layout umsetzen:
   - Formularfelder mit Grid ausrichten.
   - Schmal einspaltig, ab einer sinnvollen Breite zweispaltig mit der Zusammenfassung daneben.
   - Navigation auf kleinen Bildschirmen über den Menü-Button ein- und ausblendbar.
4. Zustände der Eingabefelder und des Buttons gestalten: Hover, Fokus, deaktiviert und Fehler.
5. Playwright-Tests in der gemeinsamen Suite ergänzen:
   - Mobil: Navigation ist zunächst verborgen und nach Klick auf den Menü-Button sichtbar.
   - Desktop: Navigation ist ohne Klick sichtbar; die Zusammenfassung steht neben dem Formular (z. B. über Bounding Boxes).
   - Ein ungültiges Feld zeigt nach dem Absenden eine sichtbare Fehlermeldung.
6. Layout in den DevTools bei mehreren Breiten visuell prüfen und Abweichungen von der Vorgabe notieren.

## Vergleich der Varianten

In Paaren mit je einer Variante, danach im Plenum, anhand der eigenen Lösungen oder der Musterlösungen:

1. Die gemeinsame Playwright-Suite gegen beide Lösungen laufen lassen. Beide sollen bestehen; das Verhalten ist gleich, nur die Umsetzung unterscheidet sich.
2. Beide Lösungen anhand derselben Kriterien vergleichen und in einer Tabelle festhalten:
   - **Lesbarkeit:** Wie gut versteht man Markup und Styling einer Komponente beim ersten Lesen?
   - **Änderung der Designvorgabe:** Die Primärfarbe und den Grundabstand ändern. Wie viele Stellen sind betroffen?
   - **Neue Variante einer Komponente:** einen sekundären Button ergänzen. Wo entsteht der Code, und was wird wiederholt?
   - **Konsistenz:** Wie leicht schleichen sich Werte ausserhalb der Tokens ein (`w-[347px]` gegenüber festem Pixelwert im CSS)?
   - **Gültigkeitsbereich:** Wie gross ist das Risiko, dass eine Änderung ungewollt andere Stellen beeinflusst?
   - **Werkzeuge:** DevTools-Diagnose, Editor-Unterstützung, Umfang des ausgelieferten CSS im Build.
3. Fazit formulieren: Für welches Projekt (Design System, Fachanwendung mit Komponentenbibliothek, kleine Inhaltsseite) passt welcher Ansatz?

## Abnahmekriterien

- Keine festen Farbwerte und keine festen Seitenbreiten ausserhalb der Tokens (in der Tailwind-Variante: keine willkürlichen Werte in eckigen Klammern).
- Das Layout entspricht bei schmaler und breiter Darstellung der Vorgabe; kein horizontales Scrollen bei 320 px Breite.
- Alle Komponentenzustände sind sichtbar unterscheidbar.
- Die gemeinsame Playwright-Suite läuft für beide Viewports grün und nutzt nutzernahe Locators.
- Die Teilnehmenden benennen, welche Aspekte die Tests nicht abdecken und wie sie diese visuell geprüft haben.
- Die Vergleichstabelle ist ausgefüllt und mit Beispielen aus dem Code belegt.

## Vertiefung für Schnellere

- Die Seite zusätzlich in der anderen Variante umsetzen und den Vergleich aus eigener Erfahrung ergänzen.
- Dunkles Farbschema über die Tokens ergänzen (natives CSS: `light-dark()`; Tailwind: `dark:`-Variante oder Token-Überschreibung) und beide Schemata in Playwright mit `colorScheme` öffnen.
- Einen Screenshot-Vergleich (`toHaveScreenshot`) für eine Komponente einrichten und bewusst eine Änderung auslösen.

## Optional mit Agent

- Auftrag: Designvorgabe als Bild oder Text mitgeben und das responsive Layout mit Tokens umsetzen lassen, wahlweise in einer oder in beiden Varianten.
- Besonders prüfen: Werden Tokens konsequent verwendet oder neue feste beziehungsweise willkürliche Werte eingeführt? Entspricht das Layout bei allen Breiten der Vorgabe (selbst im Browser kontrollieren)? Bleibt das Markup semantisch, oder entstehen wieder `div`-Buttons?
- Für den Vergleich: Den Agenten eine Lösung in die andere Variante übertragen lassen und mit der gemeinsamen Suite prüfen; die Vergleichskriterien beurteilen die Teilnehmenden selbst.

## Material aus 2025

- `07-Styling/vite-tailwind-starter` und `07-Styling/tailwind-demo` als Ausgangspunkt für die Tailwind-Variante; Einrichtung auf Tailwind 4 mit Vite-Plugin und `@theme` prüfen.
- `04-web-platform/05-forms/client/test.html` als mögliche Basis für das Formular.
- Tailwind-Abwägung aus [06-Styling.pdf](../../../../modern-frontend-bsi-2025/00-CourseMaterial/06-Styling.pdf), S. 13–16, als Einstieg in den Vergleich.

## Offene Punkte für die Review

- Reicht die Zeit für Umsetzung und Vergleich? Alternative: Vergleich nur anhand der Musterlösungen, damit die Kernaufgabe die vollen 60 Minuten erhält.
- Fachbeispiel mit Block 3 abstimmen (gleiches Datenmodell «Kursanmeldung» würde Wiedererkennung schaffen, ohne Abhängigkeit zwischen den Übungen).
- Designvorgabe selbst gestalten oder ein bestehendes Design System als Referenz nehmen?
- Sollen in der Tailwind-Variante wiederkehrende Klassen über Komponentenfunktionen gebündelt werden, oder bewusst nicht, damit die Wiederholung im Vergleich sichtbar wird?
