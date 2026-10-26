# Übung 4: Kursanmeldungen – externe Daten prüfen und Ladezustände modellieren

Eine kleine Seite lädt Kursanmeldungen mit `fetch` von einer simulierten API (JSON-Dateien in `public/api/`, einige absichtlich fehlerhaft). Mit fehlerhaften Daten zeigt sie falsche Werte, bleibt beim Laden hängen oder widerspricht sich selbst.

- **Teil 1:** Fehler reproduzieren und erklären, warum TypeScript sie nicht verhindert hat.
- **Teil 2:** Die Daten mit [Zod](https://zod.dev/) prüfen und den Typ aus dem Schema ableiten.
- **Teil 3:** Die Ladezustände als diskriminierte Union modellieren.

Jeder Schritt hat einen ausklappbaren Lösungshinweis. Versuchen Sie es zuerst selbst.

**Optional mit einem Coding Agent:** Teil 2 und Teil 3 beginnen mit einem Auftrag für einen Coding Agent mit Terminalzugriff (z. B. Claude Code, Codex, GitHub Copilot, Cursor). Die Anleitung «Schritt für Schritt» danach beschreibt, wie Sie den Teil manuell lösen; zusammen mit den Lösungshinweisen dient sie auch dazu, das Ergebnis des Agenten zu prüfen. Teil 1 bearbeiten Sie in jedem Fall selbst: Er zeigt die Fehler, die der Agent danach beheben soll. Hinweise für Agenten stehen in [AGENTS.md](./AGENTS.md). Die laufende Seite untersucht der Agent wie in den bisherigen Übungen mit der Playwright CLI (`npx playwright cli open --browser=chrome http://localhost:5176/`).

---

## Teil 1: Was TypeScript nicht prüft

Führen Sie alle Befehle im Ordner `Exercises/04-typescript-validierung` aus.

### Schritt 1.1: Projekt starten und Code lesen

```sh
npm ci
npm run dev
```

Öffnen Sie `http://localhost:5176/` in Chrome und wählen Sie «Gültige Anmeldungen». Lesen Sie `src/registration.ts` und `src/load-registrations.ts`.

- An welcher Stelle kommen Daten von aussen in das Programm?
- Welchen Typ haben diese Daten laut TypeScript? Woher stammt dieser Typ?

Führen Sie in einem zweiten Terminal `npm run check`, `npm test` und `npm run e2e` aus. Prüfung und Unit-Tests laufen ohne Fehler, vier Tests sind `todo`. Von den Playwright-Tests besteht nur «zeigt gültige Anmeldungen». Die übrigen fünf beschreiben das Zielverhalten.

<details>
<summary>Lösungshinweis</summary>

Die Daten kommen in `loadRegistrations` herein:

```ts
state.data = (await response.json()) as Registration[];
```

`Registration` ist ein handgeschriebenes Interface. Es beschreibt, wie die Daten aussehen **sollten**. `as Registration[]` ist eine Behauptung gegenüber dem Compiler, keine Prüfung.

`fetch` wird als Parameter `fetchFn` übergeben: `main.ts` übergibt ein verzögertes `fetch`, die Tests eine Attrappe.

</details>

### Schritt 1.2: Fehlerhafte Daten im Browser

Öffnen Sie die Console der Entwicklerwerkzeuge. Wählen Sie nacheinander:

1. «Anmeldenummer als Text»
2. «Unbekannter Status»
3. «Leere Liste»
4. «Name fehlt»

Was zeigt die Seite jeweils an? Vergleichen Sie mit den Dateien in `public/api/`. Wo im Code zeigt sich der Fehler, und wie weit ist das von der Ursache entfernt?

<details>
<summary>Lösungshinweis</summary>

| Datenquelle            | Fehler in den Daten              | Beobachtung                                                                                             |
| ---------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Anmeldenummer als Text | `"id": "5"` statt `5`            | «nächste Anmeldenummer: 51» statt 6                                                                     |
| Unbekannter Status     | `"status": "pending"`            | In der Spalte «Status» steht `undefined`                                                                |
| Leere Liste            | keiner, die Liste ist leer       | Eine leere Tabelle mit «0 Anmeldungen» statt eines Hinweises                                            |
| Name fehlt             | Anmeldung 3 hat kein Feld `name` | «Lädt …» bleibt stehen; in der Console: `Cannot read properties of undefined (reading 'localeCompare')` |

Keiner dieser Fehler tritt beim Laden auf:

- `nextId` vergleicht `"5" > 4` (JavaScript wandelt in eine Zahl um: `true`) und rechnet dann `"5" + 1` = `"51"`.
- `STATUS_LABELS["pending"]` gibt es nicht, also `undefined`.
- Das Sortieren in `renderTable` stürzt ab, weil `a.name` `undefined` ist. Die Fehlermeldung nennt `renderTable`, nicht die API-Antwort.

</details>

### Schritt 1.3: Warum hat TypeScript das nicht verhindert?

Entfernen Sie in `load-registrations.ts` probehalber `as Registration[]` samt den Klammern um `await response.json()` (sonst meldet die Prüfung nur einen Formatierungsfehler) und führen Sie `npm run check` aus. Was meldet die Prüfung? Machen Sie die Änderung danach rückgängig.

<details>
<summary>Lösungshinweis</summary>

Kein Fehler. `response.json()` gibt `Promise<any>` zurück, und `any` lässt sich jedem Typ zuweisen. Beim Build werden alle Typen entfernt; im Browser läuft JavaScript ohne Typinformationen. Was von aussen kommt, ist für TypeScript eine Annahme.

**Vergleich mit Java:** Jackson bricht bei einem unpassenden Feld ab, ein falscher Cast wirft eine `ClassCastException`, weil die JVM zur Laufzeit Typen kennt. In TypeScript müssen Sie diese Prüfung selbst programmieren.

</details>

Diese Prüfung programmieren Sie in [Teil 2](#teil-2-daten-an-der-systemgrenze-prüfen).

### Schritt 1.4: Die Anzeige widerspricht sich

1. Seite neu laden. «Nicht vorhandene Datei» wählen, danach «Gültige Anmeldungen».
2. Seite neu laden. «Gültige Anmeldungen» wählen, danach «Nicht vorhandene Datei».

Was sehen Sie? Erklären Sie es mit `ViewState` in `load-registrations.ts` und `render` in `registration-view.ts`. Wie viele Kombinationen von `isLoading`, `error` und `data` sind möglich, welche sind fachlich sinnvoll?

<details>
<summary>Lösungshinweis</summary>

Im ersten Fall stehen Fehlermeldung und Tabelle gleichzeitig da, im zweiten die alte Tabelle unter der neuen Fehlermeldung. Mit «Name fehlt» nach einer anderen Quelle sehen Sie sogar «Lädt …», alte Meldung und alte Tabelle zusammen.

`loadRegistrations` setzt `error` oder `data`, setzt das andere Feld aber nie zurück. `render` zeigt alles an, was gesetzt ist.

Drei unabhängige Felder ergeben 2 × 2 × 2 = 8 Kombinationen. Fachlich sinnvoll sind nur:

| Zustand | `isLoading` | `error` | `data`      |
| ------- | ----------- | ------- | ----------- |
| Anfang  | `false`     | –       | –           |
| Lädt    | `true`      | –       | –           |
| Erfolg  | `false`     | –       | Liste       |
| Leer    | `false`     | –       | leere Liste |
| Fehler  | `false`     | Meldung | –           |

Die übrigen Kombinationen muss jede Stelle im Code selbst verhindern. Die leere Liste ist nicht als eigener Fall erkennbar, deshalb übersieht `render` sie.

</details>

Dieses Problem beheben Sie in [Teil 3](#teil-3-ladezustände-als-diskriminierte-union): Dort lassen sich nur noch die fachlich sinnvollen Zustände ausdrücken.

---

## Teil 2: Daten an der Systemgrenze prüfen

### Optional: mit einem Coding Agent

> Die Seite übernimmt API-Antworten in `src/load-registrations.ts` ungeprüft (`as Registration[]`). Ersetze in `src/registration.ts` das Interface `Registration` und den Typ `RegistrationStatus` durch Zod-Schemas und leite beide Typen mit `z.infer` ab. Leite die Regeln für die einzelnen Felder aus den Beispieldaten in `public/api/registrations.json` ab und begründe sie. Exportiere `registrationListSchema` für die ganze Liste und eine Funktion `parseRegistrations(input: unknown)`, die mit `safeParse` prüft und `{ success: true; registrations }` oder `{ success: false; message }` zurückgibt. Die Meldung soll auf Deutsch sein und die betroffene Stelle nennen. Ersetze die vier `it.todo` in `src/registration.test.ts` durch Tests für gültige Anmeldungen, eine leere Liste, eine Anmeldung ohne Namen und eine Anmeldenummer als Text; prüfe bei ungültigen Eingaben die gemeldete Stelle. Ändere `src/load-registrations.ts` und `src/registration-view.ts` noch nicht. Führe `npm run check` und `npm test` aus.

Kritisch prüfen:

- Sind die Regeln zu locker? Etwa `z.string()` statt Aufzählung für `status` oder `z.number()` ohne `.int()` für `id`. Vergleichen Sie mit den Regeln in Schritt 2.1.
- Sind die Regeln zu streng? Etwa `seat` als Pflichtfeld, obwohl die Warteliste keinen Sitzplatz hat.
- Steht `Registration` nur noch als `z.infer`, oder gibt es zusätzlich ein handgeschriebenes Interface?
- Ist der Parameter von `parseRegistrations` `unknown`? Verwendet die Funktion `safeParse` oder `parse` mit `try`/`catch`?
- Prüfen die Tests die gemeldete Stelle oder nur `success === false`? Letzteres besteht auch, wenn das Schema aus dem falschen Grund ablehnt.
- Stehen noch `as`-Behauptungen im Code, auch in den Tests?
- Sind `src/load-registrations.ts` und `src/registration-view.ts` unverändert (`git diff src/load-registrations.ts src/registration-view.ts`)? Den Anzeigezustand behandeln Sie in Teil 3.

Den erwarteten Stand beschreiben die Lösungshinweise zu den Schritten 2.1 bis 2.3.

### Schritt für Schritt

#### Schritt 2.1: Ein Schema definieren

Ersetzen Sie in `src/registration.ts` das Interface `Registration` und den Typ `RegistrationStatus` durch Zod-Schemas. Leiten Sie beide Typen mit `z.infer` ab. Regeln:

- `id`: ganze Zahl grösser als 0
- `name`: nicht leerer Text
- `email`: gültige E-Mail-Adresse
- `status`: genau einer der Werte `confirmed`, `waitlist`, `cancelled`
- `seat`: optional, ganze Zahl grösser als 0

Exportieren Sie zusätzlich `registrationListSchema` für die ganze Liste. Führen Sie `npm run check` und `npm test` aus. Welchen Typ zeigt der Editor beim Hover über `Registration`?

<details>
<summary>Lösungshinweis</summary>

```ts
import { z } from "zod";

export const registrationStatusSchema = z.enum(["confirmed", "waitlist", "cancelled"]);

export const registrationSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  email: z.email(),
  status: registrationStatusSchema,
  /** Sitzplatz; nur bei bestätigten Anmeldungen vergeben. */
  seat: z.number().int().positive().optional(),
});

export const registrationListSchema = z.array(registrationSchema);

export type RegistrationStatus = z.infer<typeof registrationStatusSchema>;
export type Registration = z.infer<typeof registrationSchema>;
```

Der abgeleitete Typ entspricht dem bisherigen Interface (mit `seat?: number | undefined`).

Das Schema ist jetzt die einzige Quelle der Wahrheit; Typ und Laufzeitprüfung können nicht auseinanderlaufen. Regeln wie «ganze Zahl» oder «gültige E-Mail» kennt nur das Schema, im Typ bleiben `number` und `string`.

</details>

#### Schritt 2.2: Unbekannte Daten prüfen

Schreiben Sie in `registration.ts` eine exportierte Funktion `parseRegistrations(input: unknown)`. Sie prüft mit `registrationListSchema.safeParse` und gibt einen `ParseResult` zurück:

```ts
export type ParseResult =
  | { success: true; registrations: Registration[] }
  | { success: false; message: string };
```

Für die Meldung können Sie `z.prettifyError(error)` verwenden. Mit `z.config(z.locales.de())` am Anfang der Datei meldet Zod auf Deutsch.

Warum ist der Parameter `unknown` und nicht `Registration[]` oder `any`?

<details>
<summary>Lösungshinweis</summary>

```ts
// Fehlermeldungen von Zod auf Deutsch.
z.config(z.locales.de());

// … Schemas aus Schritt 2.1

export type ParseResult =
  | { success: true; registrations: Registration[] }
  | { success: false; message: string };

/** Prüft unbekannte Daten, zum Beispiel eine API-Antwort, gegen das Schema. */
export function parseRegistrations(input: unknown): ParseResult {
  const result = registrationListSchema.safeParse(input);
  if (!result.success) {
    return { success: false, message: z.prettifyError(result.error) };
  }
  return { success: true, registrations: result.data };
}
```

Anders als bei `any` erlaubt TypeScript bei `unknown` keinen Zugriff vor einer Prüfung. Mit `Registration[]` würde die Funktion voraussetzen, was sie erst prüfen soll.

`safeParse` gibt selbst eine diskriminierte Union zurück (`{ success: true, data }` oder `{ success: false, error }`) und wirft keine Exception, anders als `parse`. Bei Daten von aussen ist ein Fehler ein erwarteter Fall.

</details>

#### Schritt 2.3: Die Validierung testen

Ersetzen Sie die vier `it.todo` in `src/registration.test.ts` durch echte Tests. Prüfen Sie bei ungültigen Eingaben auch, dass die Meldung die betroffene Stelle nennt; `z.prettifyError` gibt sie zum Beispiel als `→ at [0].name` aus. Mit `npx vp test watch` laufen die Tests bei jeder Änderung neu.

<details>
<summary>Lösungshinweis</summary>

Import ergänzen: `import { nextId, parseRegistrations, type Registration } from "./registration.ts";`

```ts
describe("parseRegistrations", () => {
  it("akzeptiert gültige Anmeldungen", () => {
    expect(parseRegistrations(registrations)).toEqual({ success: true, registrations });
  });

  it("akzeptiert eine leere Liste", () => {
    expect(parseRegistrations([])).toEqual({ success: true, registrations: [] });
  });

  it("lehnt eine Anmeldung ohne Namen ab", () => {
    const input = [{ id: 1, email: "anna.meier@example.ch", status: "confirmed" }];

    expect(parseRegistrations(input)).toEqual({
      success: false,
      message: expect.stringContaining("[0].name"),
    });
  });

  it("lehnt eine Anmeldenummer als Text ab", () => {
    const input = [
      { id: "1", name: "Anna Meier", email: "anna.meier@example.ch", status: "confirmed" },
    ];

    expect(parseRegistrations(input)).toEqual({
      success: false,
      message: expect.stringContaining("[0].id"),
    });
  });
});
```

Wegen `unknown` lassen sich ungültige Eingaben ohne `as` übergeben. Dass sie abgelehnt werden, belegt erst der Test. Die Seite verhält sich noch wie vorher; `loadRegistrations` verwendet `parseRegistrations` erst in Teil 3.

</details>

---

## Teil 3: Ladezustände als diskriminierte Union

### Optional: mit einem Coding Agent

> Kundenmeldung: «Die Anzeige der Kursanmeldungen widerspricht sich. Nach einem Wechsel der Datenquelle stehen Fehlermeldung und Tabelle gleichzeitig da, eine leere Liste erscheint als leere Tabelle, und manchmal bleibt ‹Lädt …› stehen.» Reproduziere das auf dem laufenden Entwicklungsserver (`http://localhost:5176/`) mit der Playwright CLI, indem du die Datenquellen in verschiedener Reihenfolge wählst, und erkläre die Ursache anhand von `ViewState` in `src/load-registrations.ts`. Modelliere den Anzeigezustand als diskriminierte Union mit dem Diskriminator `kind` und den Zuständen `initial`, `loading`, `success` (mit den Anmeldungen), `empty` und `error` (mit einer Meldung). `loadRegistrations(url, fetchFn, onChange)` soll keinen Zustand mehr verändern, sondern zuerst `loading` und danach genau einen der Zustände `success`, `empty` oder `error` an `onChange` melden. Verwende `parseRegistrations` aus `src/registration.ts` und entferne `as Registration[]`; auch ein HTTP-Fehler oder eine Exception von `fetchFn` führt zu `error`. Stelle zuerst `src/load-registrations.test.ts` um: Prüfe die ganze Abfolge der gemeldeten Zustände, auch für eine leere Liste und ungültige Daten. Stelle danach die Anzeige in `src/registration-view.ts` auf ein `switch` über `kind` um, mit dem Hinweis «Keine Anmeldungen vorhanden.» für eine leere Liste und einer erschöpfenden Prüfung mit `assertNever` im `default`-Zweig. Ändere weder die Playwright-Tests noch die Dateien in `public/api/`. Prüfe das Ergebnis im Browser und führe `npm run check`, `npm test` und `npm run e2e` aus.

Kritisch prüfen:

- Hat der Agent den Fehler im Browser reproduziert, mit mehreren Datenquellen nacheinander?
- Ist `ViewState` eine Union, in der jeder Zustand genau seine Daten trägt, oder wieder eine Sammlung optionaler Felder, vielleicht mit zusätzlichem `kind`?
- Prüfen die Tests die ganze Abfolge (`loading`, dann ein Endzustand) oder nur den letzten Zustand?
- Wird das Ergebnis von `response.json()` als `unknown` behandelt und mit `parseRegistrations` geprüft?
- Gibt es den `default`-Zweig mit `assertNever`? Probieren Sie die erschöpfende Prüfung wie in Schritt 3.5 selbst aus.
- Stehen noch Behauptungen im Code (`grep -rnE " as |!\.|: any" src`)?
- Sind `e2e/` und `public/api/` unverändert (`git diff e2e/ public/api/`)?

Den erwarteten Stand beschreibt Schritt 3.6.

### Schritt für Schritt

#### Schritt 3.1: Den Zustand modellieren

Ersetzen Sie in `src/load-registrations.ts` das Interface `ViewState` durch eine diskriminierte Union mit dem Diskriminator `kind`. Zustände: `initial`, `loading`, `success` (mit den Anmeldungen), `empty` und `error` (mit einer Meldung).

Führen Sie `npm run check` aus. Die gemeldeten Fehler sind Ihre Arbeitsliste für die nächsten Schritte.

<details>
<summary>Lösungshinweis</summary>

```ts
/** Was die Seite gerade anzeigt. */
export type ViewState =
  | { kind: "initial" }
  | { kind: "loading" }
  | { kind: "success"; registrations: Registration[] }
  | { kind: "empty" }
  | { kind: "error"; message: string };
```

Jeder Zustand trägt genau seine Daten. Daten und Fehler gleichzeitig lassen sich nicht mehr ausdrücken. `npm run check` meldet Fehler in `load-registrations.ts`, `load-registrations.test.ts` und `registration-view.ts`, die noch `isLoading`, `error` und `data` verwenden.

</details>

#### Schritt 3.2: Den Ladeablauf umstellen

Ändern Sie `loadRegistrations`: Die Funktion verändert keinen Zustand mehr, sondern meldet jeden neuen Zustand an `onChange`:

```ts
export async function loadRegistrations(
  url: string,
  fetchFn: typeof fetch,
  onChange: (state: ViewState) => void,
): Promise<void>;
```

Zuerst meldet sie `loading`, danach genau einen der Zustände `success`, `empty` oder `error`. Verwenden Sie `parseRegistrations` und entfernen Sie `as Registration[]`. Auch ein HTTP-Fehler oder eine Exception von `fetchFn` führt zu `error`.

<details>
<summary>Lösungshinweis</summary>

```ts
import { parseRegistrations, type Registration } from "./registration.ts";

// … ViewState aus Schritt 3.1

/**
 * Lädt die Anmeldungen von `url` und meldet jeden Zustand an `onChange`.
 * `fetchFn` wird übergeben, damit Tests eine Attrappe statt des Netzwerks verwenden können.
 */
export async function loadRegistrations(
  url: string,
  fetchFn: typeof fetch,
  onChange: (state: ViewState) => void,
): Promise<void> {
  onChange({ kind: "loading" });
  onChange(await fetchRegistrations(url, fetchFn));
}

async function fetchRegistrations(url: string, fetchFn: typeof fetch): Promise<ViewState> {
  try {
    const response = await fetchFn(url);
    if (!response.ok) {
      return {
        kind: "error",
        message: `Die Daten konnten nicht geladen werden (HTTP-Status ${response.status}).`,
      };
    }

    const json: unknown = await response.json();
    const result = parseRegistrations(json);
    if (!result.success) {
      return { kind: "error", message: `Die Antwort enthält ungültige Daten:\n${result.message}` };
    }
    if (result.registrations.length === 0) {
      return { kind: "empty" };
    }
    return { kind: "success", registrations: result.registrations };
  } catch (error) {
    return { kind: "error", message: error instanceof Error ? error.message : String(error) };
  }
}
```

`const json: unknown = …` macht aus dem `any` ein `unknown`; ab hier verlangt TypeScript eine Prüfung. Jeder gemeldete Zustand ersetzt den vorherigen vollständig, es gibt nichts mehr zurückzusetzen. Fehlt in `fetchRegistrations` ein Rückgabepfad, meldet der Compiler einen Fehler.

</details>

#### Schritt 3.3: Die Tests für das Laden anpassen

Stellen Sie `src/load-registrations.test.ts` auf die neue Signatur um. Sammeln Sie in einer Hilfsfunktion alle gemeldeten Zustände in einem Array und prüfen Sie die ganze Abfolge. Ergänzen Sie Tests für eine leere Liste und für ungültige Daten.

<details>
<summary>Lösungshinweis</summary>

```ts
/** Lädt mit der Attrappe und sammelt alle gemeldeten Zustände. */
async function collectStates(fetchFn: typeof fetch): Promise<ViewState[]> {
  const states: ViewState[] = [];
  await loadRegistrations("/api/test.json", fetchFn, (state) => states.push(state));
  return states;
}

describe("loadRegistrations", () => {
  it("lädt gültige Anmeldungen", async () => {
    expect(await collectStates(respondWith([anna]))).toEqual([
      { kind: "loading" },
      { kind: "success", registrations: [anna] },
    ]);
  });

  it("meldet eine leere Liste", async () => {
    expect(await collectStates(respondWith([]))).toEqual([{ kind: "loading" }, { kind: "empty" }]);
  });

  it("meldet ungültige Daten", async () => {
    const withoutName = { ...anna, name: undefined };

    expect(await collectStates(respondWith([withoutName]))).toEqual([
      { kind: "loading" },
      { kind: "error", message: expect.stringContaining("[0].name") },
    ]);
  });

  it("meldet einen HTTP-Fehler", async () => {
    expect(await collectStates(respondWith({}, 404))).toEqual([
      { kind: "loading" },
      { kind: "error", message: expect.stringContaining("404") },
    ]);
  });
});
```

`Response.json` lässt Felder mit dem Wert `undefined` weg. `withoutName` kommt deshalb ganz ohne `name` an, wie in der fehlerhaften Datei.

</details>

#### Schritt 3.4: Den Zustand darstellen

Ändern Sie `setupRegistrationView` in `src/registration-view.ts`:

- `render` erhält den Zustand als Parameter und unterscheidet die Fälle mit `switch (state.kind)`.
- Eine leere Liste zeigt den Hinweis «Keine Anmeldungen vorhanden.».
- Im `default`-Zweig rufen Sie eine Funktion `assertNever(value: never): never` auf.
- Die Variable `state` entfällt. `render` wird direkt als `onChange` an `loadRegistrations` übergeben.

<details>
<summary>Lösungshinweis</summary>

```ts
/** Verbindet die Auswahl der Datenquelle mit der Anzeige der Anmeldungen. */
export function setupRegistrationView(root: HTMLElement, fetchFn: typeof fetch): void {
  const source = requireElement(root, "select", HTMLSelectElement);
  const output = requireElement(root, ".output", HTMLElement);

  function render(state: ViewState): void {
    switch (state.kind) {
      case "initial":
        output.replaceChildren(message("Wählen Sie eine Datenquelle.", "hint"));
        break;
      case "loading":
        output.replaceChildren(message("Lädt …", "loading", "status"));
        break;
      case "empty":
        output.replaceChildren(message("Keine Anmeldungen vorhanden.", "hint"));
        break;
      case "error":
        output.replaceChildren(message(state.message, "error", "alert"));
        break;
      case "success":
        output.replaceChildren(
          renderSummary(state.registrations),
          renderTable(state.registrations),
        );
        break;
      default:
        assertNever(state);
    }
  }

  source.addEventListener("change", () => {
    void loadRegistrations(source.value, fetchFn, render);
  });

  render({ kind: "initial" });
}

// … renderSummary, renderTable, renderRow, cell und message unverändert

/** Meldet einen Compilerfehler, wenn ein Fall der Union nicht behandelt ist. */
function assertNever(value: never): never {
  throw new Error(`Unbehandelter Fall: ${JSON.stringify(value)}`);
}
```

In `case "success"` kennt TypeScript `state.registrations`, in `case "error"` `state.message` (Narrowing). `?.` und `!` werden überflüssig. Im `default`-Zweig sind alle Fälle ausgeschlossen, `state` hat dort den Typ `never`.

</details>

#### Schritt 3.5: Die erschöpfende Prüfung ausprobieren

Ergänzen Sie in `ViewState` probehalber einen Zustand, zum Beispiel `{ kind: "stale"; registrations: Registration[] }`. Was meldet `npm run check`, und wo? Entfernen Sie den Zustand danach wieder.

Was würde passieren, wenn der `default`-Zweig mit `assertNever` fehlte?

<details>
<summary>Lösungshinweis</summary>

```text
src/registration-view.ts: error TS2345: Argument of type '{ kind: "stale"; registrations: … }'
is not assignable to parameter of type 'never'.
```

Der neue Fall erreicht den `default`-Zweig, dort ist `state` nicht mehr `never`. So zeigt der Compiler jede Stelle, die den neuen Zustand nicht behandelt.

Ohne `assertNever` meldet der Compiler nichts. `render` gibt `void` zurück; ein nicht behandelter Fall ist kein Fehler. Die Seite würde beim neuen Zustand nichts tun.

**Vergleich mit Java:** Wie ein `switch`-Ausdruck über eine `sealed`-Hierarchie.

</details>

#### Schritt 3.6: Alles prüfen

```sh
npm run check
npm test
npm run e2e
```

Alles läuft ohne Fehler. Gehen Sie im Browser alle Datenquellen in verschiedener Reihenfolge durch: Die Ladeanzeige verschwindet immer, fehlerhafte Daten führen zu einer verständlichen Meldung, keine alte Meldung bleibt stehen.

Prüfen Sie, dass keine Behauptungen mehr im Code stehen (es darf keine Treffer geben):

```sh
grep -rnE " as |!\.|: any" src
```

---

## Checkliste

- [ ] Kein `any`, keine Type Assertion (`as`), keine Non-Null Assertion (`!`) im Übungscode.
- [ ] `Registration` wird aus dem Schema abgeleitet, nicht von Hand geschrieben.
- [ ] Ungültige Daten führen zu einer verständlichen Meldung statt zu Absturz oder falschen Werten.
- [ ] Die Ladeanzeige verschwindet immer. Nach erneutem Laden bleibt keine alte Meldung stehen.
- [ ] Ein zusätzlicher Zustand in `ViewState` führt zu einem Compilerfehler, bis die Darstellung ihn behandelt.
- [ ] Tests decken gültige, leere und ungültige Eingaben ab, ohne Netzwerk und echte Wartezeiten.
- [ ] `npm run check`, `npm test` und `npm run e2e` laufen ohne Fehler.
- [ ] Sie können erklären, was die Typprüfung belegt und was erst ein Test zur Laufzeit belegt.

## Kontrollfragen

1. Was belegt `npm run check`, was `npm test` und was `npm run e2e` in dieser Übung?
2. Wo kommen in Ihren Projekten sonst Daten von aussen herein (Formulare, URL-Parameter, `localStorage`, Nachrichten aus anderen Fenstern)?
3. Ist es richtig, die ganze Liste abzulehnen, weil eine Anmeldung ungültig ist? Welche Alternativen gibt es, und wer entscheidet das?
4. Was passiert, wenn man schnell zwei Datenquellen wählt und die erste Antwort langsamer ist? Verhindert die diskriminierte Union das?
5. Das Backend liefert eine OpenAPI-Beschreibung, aus der sich Typen generieren lassen. Braucht es dann noch eine Laufzeitprüfung?

<details>
<summary>Antworten zu den Kontrollfragen</summary>

1. `check`: Der Code ist in sich stimmig; jeder Zustand wird behandelt, Daten werden nur verwendet, wo sie sicher vorhanden sind. `test`: Ungültige Daten werden abgelehnt, die Zustände entstehen in der richtigen Reihenfolge. `e2e`: Das Ergebnis ist auf der Seite sichtbar.
2. Überall, wo Daten nicht aus dem gerade kompilierten Code stammen, auch gespeicherte Daten einer älteren Version der eigenen Anwendung.
3. Eine fachliche Entscheidung. Alternativen: gültige Anmeldungen anzeigen und ungültige gesondert melden, oder ungültige Felder mit Ersatzwert darstellen. Die Validierung macht die Entscheidung sichtbar.
4. Nein. Die Union beschreibt, **was** angezeigt wird, nicht **zu welcher Anfrage** es gehört. Die späte erste Antwort überschreibt die neuere Anzeige. Abhilfe: vorherige Anfrage mit `AbortController` abbrechen oder veraltete Antworten verwerfen, etwa über eine laufende Nummer pro Anfrage.
5. Ja, sobald die Daten nicht vertrauenswürdig sind oder Client und Server unabhängig ausgeliefert werden. Generierte Typen beschreiben den Vertrag, prüfen aber nicht, ob der laufende Server ihn einhält.

</details>

## Vertiefung

1. **Fachliche Regel im Schema:** Ein Sitzplatz ist nur bei bestätigten Anmeldungen erlaubt, und jede bestätigte Anmeldung braucht einen. Bilden Sie das mit `z.discriminatedUnion` über `status` ab und ergänzen Sie Tests. Was meldet `npm run check` danach in `registration-view.ts`, und warum?
2. **Meldungen pro Anmeldung und Feld:** Erzeugen Sie statt `z.prettifyError` eine Meldung wie «Anmeldung 3, Feld «name»: Ungültige Eingabe: erwartet string, erhalten undefined». Verwenden Sie `result.error.issues`.
3. **Zwischenzustand testen:** Belegen Sie mit einem Test, dass `loading` gemeldet wird, **bevor** die Antwort eintrifft. `Promise.withResolvers()` liefert ein Promise samt `resolve`, das der Test selbst erfüllen kann.

<details>
<summary>Lösungshinweis zu Vertiefung 1</summary>

```ts
const baseSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  email: z.email(),
});

export const registrationSchema = z.discriminatedUnion("status", [
  baseSchema.extend({
    status: z.literal("confirmed"),
    seat: z.number().int().positive(),
  }),
  z.strictObject({
    ...baseSchema.shape,
    status: z.enum(["waitlist", "cancelled"]),
  }),
]);

export const registrationListSchema = z.array(registrationSchema);

export type Registration = z.infer<typeof registrationSchema>;
export type RegistrationStatus = Registration["status"];
```

`registrationStatusSchema` entfällt. `z.strictObject` ist nötig, weil `z.object` unbekannte Felder stillschweigend entfernt; ein Sitzplatz auf der Warteliste würde sonst verschwinden statt abgelehnt.

`npm run check` meldet in `renderRow`: `Property 'seat' does not exist on type '… | { status: "waitlist" | "cancelled"; … }'`. `seat` gibt es nur noch im Fall `confirmed`. Lösung mit Narrowing:

```ts
cell(registration.status === "confirmed" ? String(registration.seat) : "–"),
```

Tests: Eine bestätigte Anmeldung ohne `seat` liefert `success: false` mit einer Meldung, die `[0].seat` enthält. Eine Anmeldung auf der Warteliste mit `seat: 4` liefert `success: false`.

</details>

<details>
<summary>Lösungshinweis zu Vertiefung 2</summary>

```ts
export function parseRegistrations(input: unknown): ParseResult {
  const result = registrationListSchema.safeParse(input);
  if (!result.success) {
    return { success: false, message: result.error.issues.map(describeIssue).join("\n") };
  }
  return { success: true, registrations: result.data };
}

/** Beschreibt einen Validierungsfehler mit Nummer der Anmeldung und Feld. */
function describeIssue(issue: z.core.$ZodIssue): string {
  const [index, ...field] = issue.path;
  if (typeof index !== "number") return issue.message;

  const location = field.length > 0 ? `, Feld «${field.map(String).join(".")}»` : "";
  return `Anmeldung ${index + 1}${location}: ${issue.message}`;
}
```

`issue.path` ist zum Beispiel `[2, "name"]`; Elemente können auch Symbole sein, deshalb `map(String)` vor `join`. Ist die Eingabe kein Array, ist der Pfad leer und es bleibt bei der allgemeinen Meldung.

Die Tests auf `[0].name` und `[0].id` schlagen danach fehl. Passen Sie sie an, etwa `expect.stringContaining("Anmeldung 1, Feld «name»")`.

</details>

<details>
<summary>Lösungshinweis zu Vertiefung 3</summary>

```ts
it("meldet «loading», bevor die Antwort eintrifft", async () => {
  const { promise, resolve } = Promise.withResolvers<Response>();
  const states: ViewState[] = [];

  const loading = loadRegistrations(
    "/api/test.json",
    () => promise,
    (state) => states.push(state),
  );

  expect(states).toEqual([{ kind: "loading" }]);

  resolve(Response.json([anna]));
  await loading;

  expect(states).toEqual([{ kind: "loading" }, { kind: "success", registrations: [anna] }]);
});
```

Der Zwischenzustand lässt sich so ohne echte Wartezeit und ohne Fake Timers prüfen. In Java entspricht das etwa einem `CompletableFuture`, das der Test mit `complete(…)` abschliesst.

</details>
