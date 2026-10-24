# Übungsentwurf: Starter in Betrieb nehmen und erste Tests

Status: Beschreibung zur Review, noch keine Übung angelegt.

## Rahmen

- Zeitbedarf: Teil 1 etwa 20 Minuten, Teil 2 (Testing) etwa 25 Minuten.
- Voraussetzungen: vorbereiteter Laptop gemäss [_PREPARATION.md](../../../_PREPARATION.md); keine TypeScript-Vorkenntnisse über Grundtypen hinaus.

## Lernziel

Die Teilnehmenden können den Starter installieren, starten, prüfen und bauen. Sie lesen einen Vitest-Test, verstehen eine Fehlermeldung, korrigieren einen Fehler und ergänzen einen begründeten Testfall.

## Ausgangslage (vorzubereiten)

- Ein Übungsordner auf Basis von [01-Starter/vanilla-vite-plus](../../../01-Starter/vanilla-vite-plus) (Vite+ mit pnpm). Projektbefehle: `vp install`, `vp dev`, `vp check`, `vp test`, `vp build`. Tests importieren aus `vite-plus/test`.
- Eine kleine, synchrone Fachfunktion ohne Netzwerk und UI. Vorschlag: `roundToFiveRappen(amount: number): number` (Rappenrundung auf 0.05 CHF). Alternativen: Formatierung eines Betrags als `CHF 1'234.50` oder Berechnung von Versandkosten mit Schwellenwert.
- Eine Testdatei mit drei bis vier Testfällen, die alle bestehen; ein bewusst fehlender Grenzfall.
- Die Startseite zeigt das Ergebnis der Funktion für einige Beispielwerte an, damit die Funktion auch im Browser sichtbar ist.

## Aufgabe

### Teil 1: Projekt in Betrieb nehmen

1. Abhängigkeiten mit `vp install` reproduzierbar installieren und mit `vp dev` den Entwicklungsserver starten. In `package.json` nachsehen, wie die pnpm-Version festgelegt ist.
2. Eine sichtbare Textänderung in `src/main.ts` vornehmen und HMR im Browser beobachten.
3. Einen Typfehler einbauen: Der Browser zeigt die Seite weiterhin an, `vp check` meldet den Fehler. Unterschied erklären, danach Fehler entfernen.
4. Mit `vp build` den Produktionsbuild erstellen und den Inhalt von `dist/` ansehen (Hashes, minifizierter Code).
5. In den DevTools mithilfe der Source Maps einen Breakpoint in der TypeScript-Datei setzen.

### Teil 2: Tests als Rückmeldung

1. Tests mit `vp test` starten und die Ausgabe lesen.
2. Einen Test erklären: Vorbereitung, Aktion, erwartetes Ergebnis.
3. Einen Fehler in die Funktion einbauen (z. B. Rundung auf 0.10 statt 0.05) und den fehlschlagenden Test anhand von Expected/Received erklären.
4. Die Implementierung korrigieren und erneut prüfen.
5. Einen zusätzlichen Testfall für einen Grenzfall ergänzen (z. B. 0.025, negative Beträge oder 0) und die Erwartung fachlich begründen.

## Abnahmekriterien

- Entwicklungsserver läuft, Änderungen erscheinen ohne manuellen Reload.
- Check, Tests und Build laufen ohne Fehler.
- Der ergänzte Testfall schlägt bei einer fehlerhaften Implementierung fehl und besteht bei der korrekten.
- Die Teilnehmenden können erklären, warum ein Typfehler den Dev Server nicht stoppt.

## Vertiefung für Schnellere

- Watch-Modus nutzen und Test und Implementierung im Wechsel ändern.
- Einen zweiten Grenzfall finden, bei dem Fliesskommaarithmetik eine Rolle spielt (z. B. `0.1 + 0.2`), und die Funktion robust machen.

## Optional mit Agent

- Kontext: `AGENTS.md` mit Projektbefehlen (der Vite+-Starter bringt bereits eine mit).
- Auftrag: «Ergänze Testfälle für Grenzwerte von `roundToFiveRappen`; ändere die Implementierung nicht.»
- Besonders prüfen: Sind die erwarteten Werte fachlich richtig oder nur aus der aktuellen Implementierung abgeschrieben? Schlägt ein vorgeschlagener Test bei einem eingebauten Fehler tatsächlich an?

## Material aus 2025

- `04-web-platform/04-json/json.test.ts` im Vorjahresrepository als Beispiel für einen minimalen Vitest-Test (Import auf `vite-plus/test` umstellen).

## Entscheidungen

- Basis ist Vite+ mit pnpm; Linting und Formatierung laufen über Oxlint und Oxfmt in `vp check`.

## Offene Punkte für die Review

- Ist die Rappenrundung als Fachbeispiel passend, oder lieber ein BSI-nahes Beispiel?
- [_PREPARATION.md](../../../_PREPARATION.md) verweist noch auf `01-Starter/vanilla-vite` mit npm und muss auf Vite+ umgestellt werden (Installation des globalen `vp`-CLI, Node-Version passend zu Vitest 5).
