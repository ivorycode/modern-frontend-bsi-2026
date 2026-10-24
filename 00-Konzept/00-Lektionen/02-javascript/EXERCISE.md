# Übungsentwurf: Vom Skript-Wirrwarr zu ES-Modulen

Status: Beschreibung zur Review, noch keine Übung angelegt.

## Rahmen

- Zeitbedarf: etwa 25 Minuten Kernaufgabe, 10 Minuten Besprechung.
- Voraussetzungen: Block 1 (Projektbefehle, Tests ausführen).

## Lernziel

Die Teilnehmenden erklären, warum klassische Skripte sich über den globalen Scope gegenseitig beeinflussen. Sie teilen den Code in ES-Module auf und sichern das Verhalten eines Moduls mit einfachen Tests ab.

## Ausgangslage (vorzubereiten)

- Modernisierte Fassung von `02-Language/92-Spaghetti` aus 2025, in einem eigenen Übungsordner auf Basis des Vite+-Starters:
  - Eine Seite mit zwei unabhängigen Funktionen: «Werte speichern/laden» und «Zeitstempel speichern/anzeigen».
  - Beide liegen als klassische Skripte (`<script src>`, ohne `type="module"`) vor und definieren gleichnamige Funktionen und Konstanten (`STORAGE_PREFIX`, `loadValues`, `storeValues`).
  - jQuery wird durch DOM-APIs ersetzt, damit sich die Übung auf Module konzentriert.
- Die zweite Funktion ist zunächst auskommentiert. Nach dem Einkommentieren funktioniert die erste Funktion nicht mehr korrekt.
- Vitest ist eingerichtet; eine leere Testdatei für das Speichermodul liegt bereit.

## Aufgabe

1. Seite starten, die zweite Funktion einkommentieren und das fehlerhafte Verhalten beobachten.
2. Ursache erklären: welche Bezeichner kollidieren, und welches Skript «gewinnt»?
3. Beide Funktionen in ES-Module aufteilen:
   - Speicherlogik (Laden/Speichern mit Präfix) als eigenes Modul ohne DOM-Zugriff, das `Storage` als Parameter erhält.
   - DOM-Anbindung (Event Handler) in je einem Modul pro Funktion.
   - Ein `main.ts` importiert beide.
4. Zwei bis drei Tests für das Speichermodul schreiben, z. B. «gespeicherte Werte werden mit demselben Präfix wieder geladen» und «zwei Präfixe beeinflussen sich nicht». Als Storage dient ein einfaches Testobjekt oder eine `Map`-basierte Attrappe.
5. Prüfen, dass beide Funktionen im Browser gleichzeitig korrekt arbeiten.

## Abnahmekriterien

- Keine Funktion und keine Konstante liegt im globalen Scope.
- Beide Funktionen der Seite arbeiten unabhängig voneinander.
- Die Tests für das Speichermodul laufen grün und schlagen fehl, wenn beide Module denselben Präfix verwenden.
- Die Teilnehmenden können Named Export, Modul-Scope und die Rolle von `type="module"` erklären.

## Vertiefung für Schnellere

- Aufwärm- oder Zusatzaufgabe aus `02-Language/91-CapturingScope`: drei kleine Fehler zu Closure in der Schleife, verlorenem `this` und eingefangenem Wert beheben und jeweils erklären. Eine Variante mit herausgelösten, testbaren Funktionen wäre möglich.
- Das Speichermodul so ändern, dass es gespeicherte Objekte nicht mutiert zurückgibt, und das mit einem Test belegen.

## Optional mit Agent

- Auftrag: «Teile die beiden Skripte in ES-Module auf. Die Speicherlogik darf keinen DOM-Zugriff enthalten. Prüfe mit `test` und `check`.»
- Besonders prüfen: Liegen noch Bezeichner global (`window.*`)? Testen die erzeugten Tests die Unabhängigkeit der Präfixe oder nur den Normalfall?

## Material aus 2025

- `02-Language/92-Spaghetti` und `92-Spaghetti-solution` (ES-Module-Lösung); die ES5/IIFE-Lösung entfällt.
- `02-Language/91-CapturingScope` und `91-CapturingScope-solution` für die Vertiefung.
- Übungsblatt [01-Exercise-Modern-JavaScript.md](../../../../modern-frontend-bsi-2025/00-CourseMaterial/01-Exercise-Modern-JavaScript.md), Übungen 1 und 2.

## Offene Punkte für die Review

- Kernübung Module und Vertiefung Scope – oder umgekehrt? Die Scope-Übung ist schneller, die Modul-Übung näher am Projektalltag.
- Übung in JavaScript oder bereits in TypeScript? JavaScript hält den Fokus auf Sprachkonzepten; TypeScript passt zum einheitlichen Starter.
- Soll das Speichermodul `localStorage` direkt nutzen und im Test mit jsdom/happy-dom laufen, oder `Storage` als Parameter erhalten (einfacher, zeigt Testbarkeit durch Module)?
