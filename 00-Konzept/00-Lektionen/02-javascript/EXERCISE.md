# Übungsentwurf: Einkaufslisten – Modulzustand, Closures und unveränderliche Updates

Status: Übung angelegt in [Exercises/02-javascript](../../../Exercises/02-javascript). Die ausführliche Anleitung für die Teilnehmenden mit Schritt-für-Schritt-Lösungshinweisen steht in deren [README.md](../../../Exercises/02-javascript/README.md); dieser Entwurf fasst Absicht und Entscheidungen zusammen.

## Rahmen

- Zeitbedarf: etwa 25 Minuten Kernaufgabe (Teil 1 etwa 12, Teil 2 etwa 13 Minuten), 10 Minuten Besprechung.
- Voraussetzungen: Block 1 (Projektbefehle, Tests ausführen und lesen).

## Lernziel

Die Teilnehmenden erklären, warum ein ES-Modul nur einmal ausgewertet wird und Zustand auf Modulebene deshalb von allen Importen geteilt wird. Sie kapseln den Zustand mit einer Factory-Funktion in einer Closure. Sie erkennen, dass eine flache Kopie die enthaltenen Objekte teilt, ersetzen Mutationen durch unveränderliche Updates und sichern beides mit Unit-Tests ab.

Damit deckt die Übung die drei Schwerpunkte der Lektion ab: Module, funktionale Programmierung mit Closures und unveränderliche Daten. Objektorientierung und `this` folgen in der Vertiefung.

## Ausgangslage

- Übungsordner auf Basis von Übung 1 (Vite+, npm, Vitest, Playwright mit installiertem Chrome), Entwicklungsserver auf festem Port 5174, damit die Übung neben Übung 1 laufen kann.
- Eine Seite mit zwei gleich aufgebauten Einkaufslisten («Wocheneinkauf», «Party»): hinzufügen, abhaken, Menge ändern, entfernen, rückgängig.
- `src/shopping-list.ts` (Fachlogik ohne DOM) mit zwei eingebauten Fehlern:
  1. **Geteilter Modulzustand:** `items`, `history` und `nextId` liegen auf Modulebene. Beide Listenansichten importieren dasselbe Modul und teilen sich die Liste.
  2. **Flache Kopie in der Historie:** `history.push([...items])` kopiert nur das Array; `toggle` und `changeQuantity` ändern die Objekte direkt. «Rückgängig» funktioniert deshalb nach `add` und `remove`, aber nicht nach `toggle` und `changeQuantity`.
- `src/list-view.ts` importiert das Modul direkt (`import * as shoppingList`) und verwendet die Higher-Order Function `action(change)`, die eine Änderung ausführt und neu zeichnet.
- `src/shopping-list.test.ts`: fünf Tests, von denen vier wegen des geteilten Zustands fehlschlagen; einzeln ausgeführt bestehen sie. Zwei `it.todo` für Teil 2.
- `e2e/shopping-list.spec.ts`: je ein Playwright-Test pro Fehler, beide schlagen anfangs fehl.
- Immer als Abhängigkeit für die Vertiefung.

## Aufgabe

### Teil 1: Zwei Listen, ein Zustand

1. Fehler im Browser reproduzieren: Ein Eintrag der einen Liste erscheint in der anderen, aber erst nach deren nächstem Neuzeichnen.
2. Tests ausführen und feststellen, dass ein Test allein besteht und zusammen mit anderen fehlschlägt.
3. Ursache erklären: Modul wird einmal ausgewertet; Modulvariablen entsprechen `static`-Feldern in Java.
4. `createShoppingList()` als Factory-Funktion mit Zustand in der Closure schreiben; Schnittstelle `ShoppingList` mit Funktionstypen.
5. Tests auf `beforeEach` mit frischer Liste umstellen; Test «hält zwei Listen unabhängig voneinander» ergänzen.
6. `setupListView(root, shoppingList)` erhält die Liste als Parameter; `main.ts` erzeugt pro Abschnitt eine Liste.

### Teil 2: «Rückgängig» nach dem Abhaken

1. Im Browser vergleichen, nach welchen Operationen «Rückgängig» funktioniert.
2. Vier fehlschlagende Tests schreiben: bisheriger Stand bleibt beim Abhaken und Hinzufügen unverändert; Abhaken und Mengenänderung lassen sich rückgängig machen.
3. Ursache erklären: flache Kopie, geteilte Objekte; `const` entspricht `final`.
4. Alle Operationen mit `update(next)` und nicht mutierenden Ausdrücken umschreiben (`[...items, newItem]`, `map` mit `{ ...item, … }`, `filter`).
5. Begründen, warum `history.push(items)` danach ohne Kopie korrekt ist, und `structuredClone` als Symptombehandlung einordnen.
6. `readonly` für `Item` als Absicherung durch den Compiler.

## Abnahmekriterien

- Kein Zustand auf Modulebene; beide Listen arbeiten unabhängig.
- Keine Operation verändert ein bestehendes Array oder Objekt.
- Die neuen Tests schlagen vor der Korrektur fehl und bestehen danach.
- `npm run check`, `npm test` und `npm run e2e` laufen ohne Fehler.
- Die Teilnehmenden können Modul-Scope, Closure und flache Kopie erklären.

## Vertiefung für Schnellere

- **Klasse mit privaten Feldern:** dieselbe Liste als `class` mit `#items`. `action(shoppingList.undo)` verliert `this`; Oxlint warnt mit `unbound-method`, im Browser erscheint `TypeError: Cannot read properties of undefined (reading '#history')`. Lösungen mit Arrow Function, `bind` oder Class Field; Vergleich mit Java-Methodenreferenzen.
- **Immer:** `toggle` mit `produce` umschreiben; die Tests bleiben grün, und `Object.isFrozen` zeigt, dass Immer den neuen Stand einfriert.

## Optional mit Agent

- Auftrag ohne Lösungsvorgabe: «Beide Listen teilen sich ihren Zustand, und ‹Rückgängig› funktioniert nach dem Abhaken nicht. Schreibe zuerst fehlschlagende Unit-Tests, behebe dann beide Fehler.»
- Besonders prüfen: tiefe Kopie statt unveränderlicher Updates (überdeckt das Symptom, zwei Tests bleiben rot); verbliebener Modulzustand (`nextId`); Tests, die den geteilten Zustand nur verstecken.

## Geprüft

Am 25. Oktober 2026 mit Node 26.12, npm 11.17, `vite-plus` 1.4.0, `@playwright/test` 1.64.1 und Immer 11.2.9:

- Ausgangsstand: `npm run check` ohne Befund; `npm test` mit 4 fehlschlagenden, 1 bestandenen und 2 `todo`-Tests; beide Playwright-Tests schlagen fehl.
- Stand nach Teil 1 mit den Tests aus Teil 2: die vier neuen Tests schlagen fehl, der erste Playwright-Test besteht, der zweite nicht.
- Variante mit `structuredClone` in der Historie: die beiden Tests zum unveränderten bisherigen Stand schlagen weiterhin fehl.
- Lösung aus dem README: `check`, 10 Unit-Tests und beide Playwright-Tests ohne Fehler; mit `readonly`-Feldern meldet eine wieder eingebaute Mutation `TS2540`.
- Vertiefungen: Klassenvariante mit den beschriebenen Meldungen, Korrektur mit Class Field; Immer-Variante mit eingefrorenem Stand.

## Material aus 2025

- Kein Übungscode übernommen. Die globale Namenskollision aus `02-Language/92-Spaghetti` dient nur noch als kurze Folien-Demo; Schritt 1.4 der Anleitung greift sie als Kontrollfrage auf.
- `02-Language/91-CapturingScope` entfällt als Übung; `this`-Verlust ist Teil der Vertiefung.

## Offene Punkte für die Review

- Reichen 25 Minuten für beide Teile, oder wird Teil 2 bei wenig JavaScript-Erfahrung zur gemeinsamen Besprechung?
- Soll die Lösung zusätzlich als eigener Ordner vorliegen (z. B. für die Trainer-Demo), oder genügen die Lösungshinweise im README wie in Übung 1?
