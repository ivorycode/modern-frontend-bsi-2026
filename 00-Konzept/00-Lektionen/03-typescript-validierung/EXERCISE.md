# Übungsentwurf: Externe Daten prüfen und Ladezustände modellieren

Status: Beschreibung zur Review, noch keine Übung angelegt.

## Rahmen

- Zeitbedarf: etwa 40 Minuten Kernaufgabe, 10 Minuten Besprechung.
- Voraussetzungen: Block 1 (Tests ausführen und ergänzen). Promises sind noch nicht eingeführt; die Übung arbeitet deshalb synchron mit vorgegebenen JSON-Daten.

## Lernziel

Die Teilnehmenden ersetzen eine scheinbar funktionierende, aber ungeprüfte Typbehauptung durch eine Schemavalidierung. Sie modellieren die Anzeigezustände als diskriminierte Union und testen gültige und ungültige Eingaben.

## Ausgangslage (vorzubereiten)

- Ein Übungsordner auf Basis des Vite+-Starters mit strikter TypeScript-Konfiguration und Zod.
- Fachbeispiel: eine Liste von Kursanmeldungen (oder vergleichbaren Datensätzen) mit Feldern wie `id`, `name`, `email`, `status` (`'confirmed' | 'waitlist' | 'cancelled'`) und optionalem `seat`.
- Mehrere JSON-Dateien als «API-Antworten»: gültig, leer, mit fehlendem Pflichtfeld, mit falschem Typ (`id` als String), mit unbekanntem Status.
- Bestehender Code, der die Daten mit `JSON.parse(...) as Registration[]` übernimmt und anzeigt. Mit der gültigen Datei funktioniert er; mit den fehlerhaften Dateien stürzt er an einer entfernten Stelle ab oder zeigt `undefined` an.
- Der Anzeigezustand ist mit unabhängigen Feldern modelliert (`isLoading`, `error?`, `data?`).
- Eine Auswahl auf der Seite lädt die verschiedenen JSON-Dateien, damit das Verhalten im Browser sichtbar ist.
- Vorhandene Tests für den Normalfall.

## Aufgabe

1. Mit den fehlerhaften Dateien das Fehlverhalten reproduzieren und erklären, warum TypeScript es nicht verhindert hat.
2. Ein Zod-Schema für eine Anmeldung und die Liste definieren; den Typ `Registration` mit `z.infer` aus dem Schema ableiten und den handgeschriebenen Typ entfernen.
3. Eine Funktion `parseRegistrations(input: unknown)` schreiben, die mit `safeParse` arbeitet und ein Ergebnis für Erfolg oder Fehler liefert.
4. Den Anzeigezustand als diskriminierte Union modellieren: `initial`, `loading`, `success` (mit Daten), `empty`, `error` (mit Meldung).
5. Die Darstellung mit einer erschöpfenden Fallunterscheidung umsetzen (`switch` mit `never`-Prüfung).
6. Tests ergänzen: mindestens ein gültiger Datensatz, eine leere Liste, zwei ungültige Eingaben mit erwarteter Fehlermeldung.

## Abnahmekriterien

- Kein `any`, keine Type Assertion und keine Non-Null Assertion im Übungscode.
- Ungültige Daten führen zu einer verständlichen Fehlermeldung statt zu einem Absturz.
- Ein zusätzlicher Zustand im Union-Typ führt zu einem Compilerfehler, bis er in der Darstellung behandelt ist.
- Tests decken gültige, leere und ungültige Eingaben ab und laufen grün; `check` meldet keine Fehler.
- Die Teilnehmenden können erklären, was die Typprüfung und was der Laufzeittest belegt.

## Vertiefung für Schnellere

- Fachliche Regel ins Schema aufnehmen: `seat` ist nur bei `confirmed` erlaubt (z. B. mit `z.discriminatedUnion` über `status`).
- Fehlermeldungen pro Datensatz und Feld aufbereiten statt einer Gesamtmeldung.
- Einen bewusst fehlerhaften vorgegebenen Test finden und anhand der fachlichen Anforderung korrigieren.

## Optional mit Agent

- Auftrag: «Leite aus den Beispieldaten ein Zod-Schema ab und schreibe Tests für gültige und ungültige Eingaben.»
- Besonders prüfen: Ist das Schema zu locker (z. B. `z.string()` statt Literal-Union für `status`) oder zu streng? Prüfen die Tests konkrete Fehlermeldungen oder nur `success === false`? Bleiben irgendwo `as`-Behauptungen stehen?

## Material aus 2025

- Zod-Demo aus [02-TypeScript.pdf](../../../../modern-frontend-bsi-2025/00-CourseMaterial/02-TypeScript.pdf), S. 60.
- `04-web-platform/05-forms` (Feldvalidierung im Client) als Ideengeber für Validierungsregeln.
- Externe Übungen unter <https://typescript-exercises.github.io/> als Hinweis für die Nacharbeit.

## Offene Punkte für die Review

- Die Kursplanung nennt zwei Einzelübungen (Zustandsmodellierung, Laufzeitvalidierung). Dieser Entwurf kombiniert sie in einer Übung. Alternative: zwei getrennte Übungsordner mit je etwa 20 Minuten.
- Fachbeispiel festlegen (Kursanmeldungen, Kunden, Bestellungen oder etwas BSI-Nahes).
- Soll `loading` in dieser synchronen Übung bereits vorkommen, obwohl Promises erst in Block 4 folgen? Alternative: Zustände `initial`, `success`, `empty`, `error` und `loading` erst im Async-Block ergänzen.
