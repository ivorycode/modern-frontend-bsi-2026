# Übungsentwurf: Kursanmeldungen – externe Daten prüfen und Ladezustände modellieren

Status: Übung angelegt in [Exercises/04-typescript-validierung](../../../Exercises/04-typescript-validierung). Die ausführliche Anleitung für die Teilnehmenden mit Schritt-für-Schritt-Lösungshinweisen steht in deren [README.md](../../../Exercises/04-typescript-validierung/README.md); dieser Entwurf fasst Absicht und Entscheidungen zusammen.

## Rahmen

- Zeitbedarf: etwa 40 Minuten Kernaufgabe (Teil 1 etwa 10, Teil 2 und Teil 3 je etwa 15 Minuten), 10 Minuten Besprechung.
- Voraussetzungen: Block 1 (Tests ausführen und ergänzen) und Block 3 (`async`/`await`, `fetch` als Parameter, asynchrone Tests).

## Lernziel

Die Teilnehmenden ersetzen eine scheinbar funktionierende, aber ungeprüfte Typbehauptung durch eine Schemavalidierung. Sie modellieren die Zustände eines echten Ladevorgangs als diskriminierte Union und testen gültige und ungültige Eingaben.

## Ausgangslage

- Übungsordner auf Basis von Übung 2 (Vite+, npm, Vitest, Playwright mit installiertem Chrome) mit Zod 4 und strenger TypeScript-Konfiguration (`strict`, `noUncheckedIndexedAccess`). Entwicklungsserver auf festem Port 5176, ohne SPA-Fallback (`appType: "mpa"`), damit eine fehlende Datei 404 liefert statt `index.html`.
- Fachbeispiel: Kursanmeldungen mit `id`, `name`, `email`, `status` (`confirmed`, `waitlist`, `cancelled`) und optionalem `seat`.
- Sechs Datenquellen in einer Auswahl, davon fünf JSON-Dateien in `public/api/`. Jede Quelle zeigt im Ausgangsstand ein eigenes Symptom, und keines davon tritt beim Laden auf:

  | Datenquelle            | Fehler                    | Symptom im Ausgangsstand                                               |
  | ---------------------- | ------------------------- | ---------------------------------------------------------------------- |
  | Gültige Anmeldungen    | –                         | funktioniert                                                           |
  | Leere Liste            | –                         | leere Tabelle statt Hinweis                                            |
  | Name fehlt             | Pflichtfeld fehlt         | Absturz beim Sortieren in `renderTable`, «Lädt …» bleibt stehen        |
  | Anmeldenummer als Text | `"id": "5"`               | «nächste Anmeldenummer: 51» durch `"5" + 1` in `nextId`                |
  | Unbekannter Status     | `"status": "pending"`     | `undefined` in der Statusspalte                                        |
  | Nicht vorhandene Datei | HTTP 404                  | Meldung korrekt, aber alte Daten bleiben daneben stehen                |

- `src/load-registrations.ts`: `ViewState` mit `isLoading`, `error?`, `data?` und `loadRegistrations(state, url, fetchFn, onChange)`, die die Antwort mit `as Registration[]` übernimmt und `error` beziehungsweise `data` nie zurücksetzt.
- `src/registration.ts`: handgeschriebenes Interface `Registration`, `STATUS_LABELS`, `nextId`.
- `src/registration-view.ts`: `render` zeigt alles an, was gesetzt ist. DOM-Zugriffe über `requireElement` in `src/dom.ts`, damit der Übungscode ohne `!` auskommt.
- `main.ts` übergibt ein `fetch` mit 0,8 Sekunden Verzögerung; die Tests übergeben eine Attrappe (`Response.json`).
- Tests: zwei für `nextId`, zwei für `loadRegistrations` (Normalfall, HTTP-Fehler), vier `it.todo` für `parseRegistrations`. Sechs Playwright-Tests, von denen anfangs nur «zeigt gültige Anmeldungen» besteht.

## Aufgabe

### Teil 1: Was TypeScript nicht prüft

1. Datenquellen im Browser durchgehen und die Symptome mit den Dateien in `public/api/` vergleichen; feststellen, dass sich die Fehler fern der Ursache zeigen.
2. `as Registration[]` probehalber entfernen: `check` bleibt grün, weil `response.json()` `any` liefert. Typen existieren zur Laufzeit nicht; Vergleich mit Jackson und `ClassCastException` in Java.
3. Widersprüchliche Anzeige reproduzieren (Fehlermeldung und Tabelle gleichzeitig) und die acht Kombinationen der drei Felder den fünf sinnvollen Zuständen gegenüberstellen.

### Teil 2: Daten an der Systemgrenze prüfen

1. Zod-Schema für Anmeldung und Liste; `Registration` und `RegistrationStatus` mit `z.infer` ableiten, handgeschriebene Typen entfernen.
2. `parseRegistrations(input: unknown): ParseResult` mit `safeParse` und `z.prettifyError`; deutsche Meldungen mit `z.config(z.locales.de())`. `ParseResult` folgt demselben Muster wie das Ergebnis von `safeParse`.
3. Die vier `it.todo` umsetzen; ungültige Eingaben prüfen die gemeldete Stelle (`[0].name`, `[0].id`), nicht nur `success: false`.

### Teil 3: Ladezustände als diskriminierte Union

1. `ViewState` als Union über `kind`: `initial`, `loading`, `success`, `empty`, `error`. Die Compilerfehler danach dienen als Arbeitsliste.
2. `loadRegistrations(url, fetchFn, onChange)` meldet `loading` und danach genau einen Endzustand; `const json: unknown`, kein `as`.
3. Tests sammeln die gemeldeten Zustände und prüfen die vollständige Abfolge; Fälle für leere Liste und ungültige Daten ergänzen.
4. `render(state)` mit `switch (state.kind)` und `assertNever` im `default`-Zweig; Hinweis «Keine Anmeldungen vorhanden.».
5. Zusätzlichen Zustand `stale` probehalber ergänzen und den Compilerfehler `TS2345 … not assignable to parameter of type 'never'` beobachten.

## Abnahmekriterien

- Kein `any`, keine Type Assertion und keine Non-Null Assertion im Übungscode (`grep -rnE " as |!\.|: any" src` ohne Treffer).
- Der Typ `Registration` stammt aus dem Schema.
- Ungültige Daten führen zu einer verständlichen Fehlermeldung statt zu einem Absturz oder falschen Werten.
- Die Ladeanzeige verschwindet in jedem Fall; nach erneutem Laden bleibt keine alte Meldung stehen.
- Ein zusätzlicher Zustand im Union-Typ führt zu einem Compilerfehler, bis er in der Darstellung behandelt ist.
- Tests decken gültige, leere und ungültige Eingaben ab, verwenden kein Netzwerk und keine echten Wartezeiten.
- `npm run check`, `npm test` und `npm run e2e` laufen ohne Fehler.
- Die Teilnehmenden können erklären, was die Typprüfung und was der Laufzeittest belegt.

## Vertiefung für Schnellere

- **Sitzplatzregel:** `z.discriminatedUnion` über `status`; Sitzplatz Pflicht bei `confirmed`, verboten sonst. Ohne `z.strictObject` würde Zod einen Sitzplatz auf der Warteliste stillschweigend entfernen. Danach ist auch `Registration` eine Union, und `renderRow` braucht Narrowing auf `status`.
- **Fehlermeldungen pro Anmeldung und Feld** aus `result.error.issues`; die Tests auf `[0].name` müssen dafür angepasst werden.
- **Zwischenzustand testen:** Mit `Promise.withResolvers` belegen, dass `loading` vor der Antwort gemeldet wird.

## Optional mit Agent

- Auftrag: «Leite aus den Beispieldaten ein Zod-Schema ab, leite den Typ daraus ab und schreibe Tests für gültige und ungültige Eingaben.»
- Besonders prüfen: Schema zu locker (`z.string()` für `status`, `z.number()` ohne `.int()`) oder zu streng (`seat` als Pflichtfeld); Tests, die nur `success === false` prüfen; verbliebene `as`-Behauptungen; ein Anzeigezustand, der wieder aus optionalen Feldern besteht.

## Geprüft

Am 25. Oktober 2026 mit Node 26.12, npm 11.17, `vite-plus` 1.4.0, `@playwright/test` 1.64.1 und Zod 4.6.7:

- Ausgangsstand: `npm run check` ohne Befund; `npm test` mit 4 bestandenen und 4 `todo`-Tests; von 6 Playwright-Tests besteht einer. Die Symptome aus der Tabelle oben sind im Browser nachvollzogen.
- Ohne `as Registration[]` meldet `check` keinen Fehler.
- Lösung aus dem README: `check`, 10 Unit-Tests und 6 Playwright-Tests ohne Fehler; `grep` auf `as`, `!.` und `any` ohne Treffer.
- Ein zusätzlicher Zustand `stale` führt zu `TS2345` in `registration-view.ts`.
- Vertiefungen: Sitzplatzregel mit den beschriebenen Meldungen und 12 Unit-Tests; Meldungen pro Feld; Test mit `Promise.withResolvers`.

## Material aus 2025

- Kein Übungscode übernommen. Die Zod-Demo aus [02-TypeScript.pdf](../../../../modern-frontend-bsi-2025/00-CourseMaterial/02-TypeScript.pdf), S. 60, dient als Folienbeispiel.
- `04-web-platform/05-forms` (Feldvalidierung im Client) als Ideengeber für Validierungsregeln.
- Externe Übungen unter <https://typescript-exercises.github.io/> als Hinweis für die Nacharbeit.

## Offene Punkte für die Review

- Reichen 40 Minuten für drei Teile? Falls nicht, Schritt 3.3 (Tests für den Ladeablauf) in die Besprechung verschieben.
- Die Kursplanung nennt zwei Einzelübungen (Zustandsmodellierung, Laufzeitvalidierung). Diese Übung kombiniert sie bewusst, weil `safeParse` und `ViewState` dasselbe Muster zeigen.
- Fachbeispiel «Kursanmeldungen» bestätigen oder durch etwas BSI-Näheres ersetzen.
