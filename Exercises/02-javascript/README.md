# Übung 2: Einkaufslisten – Modulzustand, Closures und unveränderliche Updates

Eine Seite verwaltet zwei Einkaufslisten: «Wocheneinkauf» und «Party». Zwei Fehler machen sie unbrauchbar:

- Ein Eintrag aus der einen Liste erscheint auch in der anderen.
- «Rückgängig» funktioniert nach dem Hinzufügen und Entfernen, nicht aber nach dem Abhaken oder dem Ändern der Menge.

Sie finden, erklären und beheben die Fehler und sichern das Verhalten mit Tests ab. Jeder Schritt enthält einen ausklappbaren Lösungshinweis. Versuchen Sie es zuerst selbst.

**Optional mit einem Coding Agent:** Beide Teile beginnen mit einem Auftrag für einen Coding Agent mit Terminalzugriff (z. B. Claude Code, Codex, GitHub Copilot, Cursor): Fehler reproduzieren und beheben. Die Anleitung «Schritt für Schritt» danach beschreibt, wie Sie den Teil manuell lösen; zusammen mit den Lösungshinweisen dient sie auch dazu, das Ergebnis des Agenten zu prüfen. Hinweise für Agenten stehen in [AGENTS.md](./AGENTS.md). Die laufende Seite untersucht der Agent wie in Übung 1 mit der Playwright CLI (`npx playwright cli open --browser=chrome http://localhost:5174/`).

---

## Teil 1: Zwei Listen, ein Zustand

Führen Sie alle Befehle in diesem Ordner aus (`Exercises/02-javascript`).

### Optional: mit einem Coding Agent

Installieren Sie die Abhängigkeiten und starten Sie den Entwicklungsserver (`npm ci`, `npm run dev`). Geben Sie dem Agenten dann diesen Auftrag:

> Kundenmeldung: «Ein Eintrag aus der einen Einkaufsliste erscheint auch in der anderen.» Reproduziere den Fehler auf dem laufenden Entwicklungsserver (`http://localhost:5174/`) mit der Playwright CLI. In `src/shopping-list.test.ts` schlagen zudem Tests fehl, die einzeln ausgeführt bestehen. Erkläre die gemeinsame Ursache und behebe sie: Jede Listenansicht und jeder Test soll mit einer eigenen Einkaufsliste arbeiten. Ergänze einen Unit-Test «hält zwei Listen unabhängig voneinander». Verstecke den geteilten Zustand nicht in den Tests, z. B. mit `vi.resetModules` oder einer Funktion zum Zurücksetzen. Behebe nur diesen Fehler, nicht den Fehler bei «Rückgängig», und ändere die Playwright-Tests nicht. Prüfe das Ergebnis im Browser und führe `npm run check`, `npm test` und `npm run e2e` aus. Der Playwright-Test «Abhaken lässt sich rückgängig machen» darf noch fehlschlagen.

Kritisch prüfen:

- Hat der Agent den Fehler tatsächlich im Browser reproduziert oder nur aus dem Code geschlossen?
- Liegt noch Zustand auf Modulebene, zum Beispiel `nextId`?
- Erzeugt jeder Test eine eigene Liste (z. B. in `beforeEach`), oder setzen die Tests einen weiterhin geteilten Zustand nur zurück?
- Bekommt jede Ansicht ihre Liste von `main.ts` übergeben, oder importiert `list-view.ts` das Modul noch direkt?
- Hat der Agent nur die Struktur geändert oder auch den Inhalt der Operationen (`git diff`)? Den zweiten Fehler behandeln Sie in Teil 2.
- Ist `e2e/` unverändert (`git diff e2e/`)?

Den erwarteten Stand beschreibt Schritt 1.8.

### Schritt für Schritt

#### Schritt 1.1: Projekt starten und Code lesen

```sh
npm ci
npm run dev
```

Öffnen Sie `http://localhost:5174/` in Chrome. Lesen Sie `src/shopping-list.ts` und `src/list-view.ts`.

In `list-view.ts` steht die Funktion `action`. Was nimmt sie entgegen, was gibt sie zurück, wozu dient sie?

<details>
<summary>Lösungshinweis</summary>

`action` ist eine Higher-Order Function. Sie nimmt eine Funktion `change` entgegen und gibt eine neue Funktion zurück, die zuerst `change` ausführt und danach die Liste neu zeichnet. So muss nicht jeder Event Handler selbst `render()` aufrufen. Die zurückgegebene Funktion bildet eine Closure über `change` und `render`.

</details>

#### Schritt 1.2: Den Fehler im Browser reproduzieren

1. Fügen Sie in «Wocheneinkauf» den Artikel «Milch» hinzu.
2. Fügen Sie in «Party» den Artikel «Chips» hinzu.
3. Haken Sie in «Wocheneinkauf» die Milch ab.

Was beobachten Sie nach jedem Schritt? Warum zeigt die eine Liste den Fehler sofort, die andere erst nach einer weiteren Aktion?

<details>
<summary>Lösungshinweis</summary>

Nach Schritt 2 stehen in «Party» Milch **und** Chips; «Wocheneinkauf» zeigt nur Milch. Nach Schritt 3 erscheinen die Chips auch im Wocheneinkauf.

Jede Ansicht zeichnet nur sich selbst neu, nach einer Aktion in ihrem Abschnitt. Beide lesen aber aus derselben Liste. Die andere Ansicht zeigt deshalb einen veralteten Stand bis zum nächsten Neuzeichnen.

</details>

#### Schritt 1.3: Die Tests befragen

```sh
npm test
```

Vier Tests schlagen fehl, einer besteht, zwei sind als `todo` markiert. Welche Einträge stehen bei «startet mit einer leeren Liste» unter `Received`? Woher stammen sie?

Führen Sie danach nur diesen Test aus. Was schliessen Sie daraus?

```sh
npx vp test -t "leer"
```

<details>
<summary>Lösungshinweis</summary>

Unter `Received` stehen Einträge, die andere Tests hinzugefügt haben. Allein ausgeführt besteht der Test. Das deutet klar auf geteilten Zustand zwischen den Tests hin.

</details>

#### Schritt 1.4: Die Ursache erklären

In `src/shopping-list.ts` stehen drei Variablen auf oberster Ebene des Moduls:

```ts
let items: Item[] = [];
const history: Item[][] = [];
let nextId = 1;
```

Erklären Sie damit beide Beobachtungen (Browser und Tests). Beantworten Sie auch:

- Warum schlägt «hakt einen Eintrag ab» fehl, obwohl `toggle` an sich korrekt arbeitet?
- Was wäre anders in einem klassischen `<script>` ohne `type="module"`?

<details>
<summary>Lösungshinweis</summary>

Ein ES-Modul wird beim ersten `import` genau **einmal** ausgewertet. Jeder weitere Import erhält dieselbe Instanz mit denselben Variablen, ob aus `list-view.ts` oder aus der Testdatei. Beide Listenansichten und alle Tests einer Testdatei arbeiten deshalb mit derselben Liste.

**Vergleich mit Java:** Variablen auf Modulebene verhalten sich wie `static`-Felder. Ein Modul mit Zustand ist ein Singleton.

- «hakt einen Eintrag ab» erwartet «Brot» mit `id` 1 als einzigen Eintrag. In der geteilten Liste steht aber noch «Milch» aus dem ersten Test, und «Brot» erhält `id` 2. `getItems()[0]` ist die Milch, und sie wird abgehakt.
- Ein klassisches Skript legt Variablen auf oberster Ebene im globalen Scope ab. Alle Skripte der Seite teilen sich dann den Zustand, gleichnamige Bezeichner überschreiben sich. Ein Modul hat einen eigenen Scope; sichtbar ist nur, was mit `export` freigegeben ist.

</details>

#### Schritt 1.5: Eine Factory-Funktion schreiben

Schreiben Sie in `src/shopping-list.ts` eine exportierte Funktion `createShoppingList()`. Sie legt `items`, `history` und `nextId` bei jedem Aufruf neu an und gibt ein Objekt mit `getItems`, `canUndo`, `add`, `toggle`, `changeQuantity`, `remove` und `undo` zurück. Beschreiben Sie dieses Objekt mit einer Schnittstelle `ShoppingList`.

Ändern Sie den Inhalt der Operationen noch nicht; den zweiten Fehler beheben Sie in Teil 2.

Tipp: Schreiben Sie die Operationen in der Schnittstelle als Eigenschaften mit Funktionstyp (`undo: () => void`), nicht in Methodenschreibweise (`undo(): void`). Den Grund zeigt Vertiefung 1.

<details>
<summary>Lösungshinweis</summary>

```ts
export interface ShoppingList {
  getItems: () => Item[];
  canUndo: () => boolean;
  add: (name: string, quantity?: number) => void;
  toggle: (id: number) => void;
  changeQuantity: (id: number, delta: number) => void;
  remove: (id: number) => void;
  undo: () => void;
}

export function createShoppingList(): ShoppingList {
  let items: Item[] = [];
  const history: Item[][] = [];
  let nextId = 1;

  function remember(): void {
    history.push([...items]);
  }

  return {
    getItems: () => items,

    canUndo: () => history.length > 0,

    add(name, quantity = 1) {
      remember();
      items.push({ id: nextId++, name, quantity, done: false });
    },

    toggle(id) {
      const item = items.find((item) => item.id === id);
      if (!item) return;

      remember();
      item.done = !item.done;
    },

    // changeQuantity, remove und undo unverändert übernehmen
  };
}
```

Die zurückgegebenen Funktionen behalten über ihre **Closure** Zugriff auf `items`, `history` und `nextId`, auch nachdem `createShoppingList` beendet ist. Jeder Aufruf erzeugt neue Variablen und damit eine unabhängige Liste. Von aussen sind die Variablen nicht erreichbar, so privat wie `private`-Felder in Java.

Die Parametertypen ergeben sich aus der Schnittstelle und müssen nicht wiederholt werden.

</details>

#### Schritt 1.6: Die Tests anpassen

Stellen Sie die Tests so um, dass jeder Test mit einer frischen Liste arbeitet. Ergänzen Sie einen Test für den Fehler aus dem Browser: «hält zwei Listen unabhängig voneinander».

<details>
<summary>Lösungshinweis</summary>

```ts
import { beforeEach, describe, expect, it } from "vite-plus/test";
import { createShoppingList, type ShoppingList } from "./shopping-list.ts";

describe("Einkaufsliste", () => {
  let list: ShoppingList;

  beforeEach(() => {
    list = createShoppingList();
  });

  it("fügt einen Eintrag mit Menge 1 hinzu", () => {
    list.add("Milch");

    expect(list.getItems()).toEqual([{ id: 1, name: "Milch", quantity: 1, done: false }]);
  });

  // übrige Tests analog: add(…) → list.add(…), getItems() → list.getItems() usw.

  it("hält zwei Listen unabhängig voneinander", () => {
    const party = createShoppingList();

    list.add("Milch");
    party.add("Chips");

    expect(list.getItems().map((item) => item.name)).toEqual(["Milch"]);
    expect(party.getItems().map((item) => item.name)).toEqual(["Chips"]);
  });
});
```

Mit `npm test` bestehen jetzt alle Tests ausser den beiden `todo`.

</details>

#### Schritt 1.7: Die Oberfläche anbinden

`list-view.ts` importiert das Modul bisher direkt (`import * as shoppingList …`). Ändern Sie `setupListView` so, dass die Funktion die Liste als Parameter erhält. Erzeugen Sie in `main.ts` für jeden Abschnitt eine eigene Liste.

<details>
<summary>Lösungshinweis</summary>

In `src/list-view.ts` den Namespace-Import entfernen und die Liste als zweiten Parameter übernehmen. Der Parameter heisst wie der bisherige Import; der Rest bleibt unverändert:

```ts
import type { Item, ShoppingList } from "./shopping-list.ts";

/** Verbindet eine Listenansicht im HTML mit der Einkaufsliste. */
export function setupListView(root: HTMLElement, shoppingList: ShoppingList): void {
  // … unverändert
}
```

In `src/main.ts`:

```ts
import "./style.css";
import { setupListView } from "./list-view.ts";
import { createShoppingList } from "./shopping-list.ts";

for (const root of document.querySelectorAll<HTMLElement>(".shopping-list")) {
  setupListView(root, createShoppingList());
}
```

Die Ansicht bekommt ihre Daten übergeben, wie bei Dependency Injection in Java, nur ohne Framework.

</details>

#### Schritt 1.8: Teil 1 prüfen

```sh
npm run check
npm test
npm run e2e
```

Meldet `npm run check` nur Formatierungsabweichungen, korrigiert `npx vp check --fix` sie.

Im Browser bleiben beide Listen getrennt. `npm run check` und `npm test` laufen ohne Fehler. Von den Playwright-Tests besteht «Einträge erscheinen nur in ihrer eigenen Liste»; «Abhaken lässt sich rückgängig machen» schlägt weiterhin fehl.

---

## Teil 2: «Rückgängig» nach dem Abhaken

### Optional: mit einem Coding Agent

> Kundenmeldung: «Rückgängig funktioniert manchmal nicht.» Finde auf dem laufenden Entwicklungsserver (`http://localhost:5174/`) mit der Playwright CLI heraus, nach welchen Aktionen «Rückgängig» funktioniert und nach welchen nicht: Hinzufügen, Abhaken, Menge ändern, Entfernen. Erkläre die Ursache anhand von `src/shopping-list.ts`. Schreibe zuerst Unit-Tests, die fehlschlagen: Ersetze die beiden `it.todo` in `src/shopping-list.test.ts` durch echte Tests und prüfe zusätzlich, dass ein zuvor mit `getItems()` erhaltener Stand nach dem Abhaken und nach dem Hinzufügen unverändert bleibt. Zeige, dass die neuen Tests fehlschlagen. Behebe danach die Ursache: Keine Operation darf ein bestehendes Array oder Objekt verändern; gleiche Mutationen nicht mit tiefen Kopien aus. Führe `npm run check`, `npm test` und `npm run e2e` aus und zeige die Ergebnisse.

Kritisch prüfen:

- Hat der Agent alle vier Aktionen im Browser ausprobiert?
- Haben die neuen Tests vor der Korrektur tatsächlich fehlgeschlagen? Prüfen die Tests zum bisherigen Stand das zuvor erhaltene Ergebnis von `getItems()` oder nur den aktuellen Stand?
- Hat der Agent nur eine tiefe Kopie in die Historie eingebaut (`structuredClone`, `JSON.parse(JSON.stringify(…))`) und damit das Symptom überdeckt (siehe Schritt 2.5)?
- Verändert noch eine Operation ein bestehendes Array oder Objekt, z. B. mit `push` oder einer Zuweisung an `item.done`?
- Hat der Agent die neuen Tests nach der Korrektur noch angepasst?
- Kann der Agent erklären, warum `history.push(items)` ohne Kopie korrekt ist?

### Schritt für Schritt

#### Schritt 2.1: Den Fehler im Browser reproduzieren

1. Fügen Sie «Milch» hinzu, haken Sie sie ab, klicken Sie «Rückgängig».
2. Erhöhen Sie die Menge eines Eintrags, klicken Sie «Rückgängig».
3. Entfernen Sie einen Eintrag, klicken Sie «Rückgängig».

Wann funktioniert «Rückgängig», wann nicht? Vergleichen Sie in `shopping-list.ts` `remove` mit `toggle` und `changeQuantity`.

<details>
<summary>Lösungshinweis</summary>

Nach dem Abhaken bleibt die Milch abgehakt; erst ein zweites «Rückgängig» entfernt sie. Nach dem Erhöhen bleibt die neue Menge. Nach dem Entfernen erscheint der Eintrag wieder. `remove` ersetzt `items` durch ein neues Array, `toggle` und `changeQuantity` verändern ein bestehendes Objekt.

</details>

#### Schritt 2.2: Fehlschlagende Tests schreiben

Ersetzen Sie die beiden `it.todo` in `src/shopping-list.test.ts` durch echte Tests und ergänzen Sie zwei weitere:

- «verändert den bisherigen Stand beim Abhaken nicht»: Stand mit `getItems()` merken, abhaken, prüfen, dass der gemerkte Stand unverändert ist.
- «macht das Abhaken rückgängig»
- «macht das Ändern der Menge rückgängig»
- «verändert den bisherigen Stand beim Hinzufügen nicht»

Alle vier Tests müssen jetzt fehlschlagen.

<details>
<summary>Lösungshinweis</summary>

```ts
it("verändert den bisherigen Stand beim Abhaken nicht", () => {
  list.add("Milch");
  const before = list.getItems();

  list.toggle(before[0].id);

  expect(before[0].done).toBe(false);
  expect(list.getItems()[0].done).toBe(true);
});

it("macht das Abhaken rückgängig", () => {
  list.add("Milch");
  const [milk] = list.getItems();
  list.toggle(milk.id);

  list.undo();

  expect(list.getItems()).toEqual([{ id: 1, name: "Milch", quantity: 1, done: false }]);
});

it("macht das Ändern der Menge rückgängig", () => {
  list.add("Eier", 6);
  const [eggs] = list.getItems();
  list.changeQuantity(eggs.id, 1);

  list.undo();

  expect(list.getItems()[0].quantity).toBe(6);
});

it("verändert den bisherigen Stand beim Hinzufügen nicht", () => {
  list.add("Milch");
  const before = list.getItems();

  list.add("Brot");

  expect(before).toHaveLength(1);
});
```

</details>

#### Schritt 2.3: Die Ursache erklären

`remember` legt vor jeder Änderung eine Kopie ab: `history.push([...items])`. Warum genügt diese Kopie nicht? Warum schlägt auch der Test für `add` fehl, obwohl «Rückgängig» nach dem Hinzufügen funktioniert?

<details>
<summary>Lösungshinweis</summary>

Der Spread-Operator erzeugt ein **neues Array**, das auf **dieselben Objekte** zeigt (flache Kopie):

```text
items      ──► [ ● ]
                 │
                 ▼
             { id: 1, name: "Milch", done: false }
                 ▲
                 │
history[0] ──► [ ● ]
```

`toggle` ändert das Objekt direkt (`item.done = !item.done`); die Änderung ist auch über `history[0]` sichtbar. `remove` ersetzt dagegen nur das Array.

`add` verändert mit `items.push(…)` das Array, das `getItems()` vorher zurückgegeben hat. «Rückgängig» funktioniert, weil `history` eine Kopie des Arrays enthält. Wer sich den Stand über `getItems()` gemerkt hat, sieht ihn aber nachträglich wachsen.

**Vergleich mit Java:** `[...items]` entspricht `new ArrayList<>(items)`. `const` verhindert wie `final` nur eine neue Zuweisung, nicht die Änderung des Objekts.

</details>

#### Schritt 2.4: Unveränderliche Updates

Ändern Sie die Operationen so, dass sie kein bestehendes Array und kein bestehendes Objekt verändern. Unveränderte Einträge übernehmen Sie, Sie kopieren sie nicht.

| Operation        | Bisher (mutierend)        | Neu (unveränderlich)                                               |
| ---------------- | ------------------------- | ------------------------------------------------------------------ |
| `add`            | `items.push(newItem)`     | `[...items, newItem]`                                              |
| `toggle`         | `item.done = !item.done`  | `items.map(…)`, für den betroffenen Eintrag `{ ...item, done: … }` |
| `changeQuantity` | `item.quantity = …`       | wie `toggle`, mit `{ ...item, quantity: … }`                       |
| `remove`         | bereits `items.filter(…)` | unverändert                                                        |

Ersetzen Sie `remember` durch eine Hilfsfunktion `update(next)`: Sie legt den bisherigen Stand in `history` ab und ersetzt `items` durch den neuen.

<details>
<summary>Lösungshinweis</summary>

```ts
export function createShoppingList(): ShoppingList {
  let items: readonly Item[] = [];
  const history: (readonly Item[])[] = [];
  let nextId = 1;

  /** Ersetzt den Stand; der bisherige Stand bleibt unverändert und dient für «Rückgängig». */
  function update(next: readonly Item[]): void {
    history.push(items);
    items = next;
  }

  /** Ersetzt einen Eintrag durch eine geänderte Kopie. */
  function updateItem(id: number, change: (item: Item) => Item): void {
    update(items.map((item) => (item.id === id ? change(item) : item)));
  }

  return {
    getItems: () => items,

    canUndo: () => history.length > 0,

    add(name, quantity = 1) {
      update([...items, { id: nextId++, name, quantity, done: false }]);
    },

    toggle(id) {
      updateItem(id, (item) => ({ ...item, done: !item.done }));
    },

    changeQuantity(id, delta) {
      updateItem(id, (item) => ({ ...item, quantity: Math.max(1, item.quantity + delta) }));
    },

    remove(id) {
      update(items.filter((item) => item.id !== id));
    },

    undo() {
      const previous = history.pop();
      if (previous) items = previous;
    },
  };
}
```

Ändern Sie in der Schnittstelle `getItems` auf `() => readonly Item[]`. `readonly Item[]` verbietet Aufrufern Methoden wie `push` oder `sort`.

</details>

#### Schritt 2.5: Warum die Historie keine Kopie mehr braucht

In der Lösung steht `history.push(items)` ohne Kopie. Warum ist das korrekt?

Ein Kollege schlägt vor, die alten Operationen zu behalten und in `remember` `history.push(structuredClone(items))` zu verwenden. Behebt das den Fehler? Probieren Sie es mit Ihren Tests aus.

<details>
<summary>Lösungshinweis</summary>

Kein Stand wird mehr verändert, deshalb lässt sich jeder alte Stand gefahrlos aufbewahren. «Rückgängig» kehrt zur vorherigen Referenz zurück.

Mit `structuredClone` (tiefe Kopie) funktioniert «Rückgängig» zwar. Die Tests «verändert den bisherigen Stand beim Abhaken nicht» und «… beim Hinzufügen nicht» schlagen aber weiterhin fehl: Wer mit `getItems()` eine Referenz erhalten hat, sieht den Stand weiterhin sich verändern. Zudem kopiert diese Variante bei jeder Änderung die ganze Liste. Die tiefe Kopie überdeckt das Symptom, unveränderliche Updates beheben die Ursache.

</details>

#### Schritt 2.6: Mit Typen absichern

Deklarieren Sie die Felder von `Item` als `readonly`. Bauen Sie probehalber `item.done = !item.done` wieder ein und führen Sie `npm run check` aus. Was meldet die Prüfung? Was passiert zur Laufzeit?

<details>
<summary>Lösungshinweis</summary>

```ts
export interface Item {
  readonly id: number;
  readonly name: string;
  readonly quantity: number;
  readonly done: boolean;
}
```

`npm run check` meldet `TS2540: Cannot assign to 'done' because it is a read-only property.` Zur Laufzeit lässt JavaScript die Änderung weiterhin zu: `readonly` prüft nur der Compiler.

</details>

#### Schritt 2.7: Alles prüfen

```sh
npm run check
npm test
npm run e2e
```

Alles läuft ohne Fehler. Im Browser funktioniert «Rückgängig» für alle Operationen, und beide Listen arbeiten unabhängig.

---

## Checkliste

- [ ] `shopping-list.ts` hat keinen Zustand mehr auf Modulebene.
- [ ] Beide Listen arbeiten im Browser unabhängig voneinander.
- [ ] Keine Operation verändert ein bestehendes Array oder Objekt.
- [ ] Die neuen Tests haben vor der Korrektur fehlgeschlagen und bestehen danach.
- [ ] `npm run check`, `npm test` und `npm run e2e` laufen ohne Fehler.
- [ ] Sie können erklären, warum ein Modul seinen Zustand mit allen Importen teilt und warum eine flache Kopie für «Rückgängig» nicht genügt.

## Kontrollfragen

1. Wann ist Zustand auf Modulebene trotzdem sinnvoll?
2. Hält eine Closure den Wert einer Variablen zum Zeitpunkt der Erzeugung fest oder die Variable selbst? Woran sieht man das an `nextId`?
3. UI-Frameworks wie React erkennen Änderungen, indem sie Referenzen vergleichen (`previous === next`). Was würde passieren, wenn `toggle` weiterhin mutiert?
4. Was belegen die Unit-Tests, was erst die Playwright-Tests?

<details>
<summary>Antworten zu den Kontrollfragen</summary>

1. Wenn es den Zustand bewusst genau einmal pro Anwendung geben soll (Singleton), z. B. eine beim Start gelesene Konfiguration, ein Cache oder ein gemeinsamer API-Client. Der Zustand gilt dann auch für alle Tests einer Testdatei; Tests brauchen eine Möglichkeit, ihn zurückzusetzen oder zu ersetzen.
2. Die Variable selbst. `add` liest bei `nextId++` den aktuellen Wert und erhöht ihn; der nächste Aufruf sieht den erhöhten Wert. Sonst hätten alle Einträge die `id` 1. Anders als bei Lambdas in Java muss die Variable nicht «effectively final» sein.
3. Das Array behält seine Referenz, `previous === next` ergibt `true`. Das Framework zeichnet nicht neu; der Haken erscheint erst bei einer späteren Änderung. Unveränderliche Updates erzeugen bei jeder Änderung eine neue Referenz, ein Referenzvergleich genügt.
4. Die Unit-Tests belegen die Fachlogik in `shopping-list.ts` (unabhängige Listen, unveränderte alte Stände, korrektes «Rückgängig»), schnell und ohne Browser. Die Playwright-Tests belegen die Anbindung der Oberfläche, z. B. dass `main.ts` pro Abschnitt eine eigene Liste erzeugt und die Seite nach «Rückgängig» den richtigen Stand zeigt.

</details>

## Vertiefung

1. **Dieselbe Liste als Klasse:** Schreiben Sie in `src/shopping-list-class.ts` eine Klasse `ShoppingListClass` mit privaten Feldern `#items`, `#history` und `#nextId` und normalen Methoden (`undo(): void { … }`). Verwenden Sie in `main.ts` `new ShoppingListClass()` und ändern Sie in `list-view.ts` den Parametertyp auf `ShoppingListClass`. Führen Sie `npm run check` aus, fügen Sie im Browser einen Eintrag hinzu und klicken Sie «Rückgängig». Erklären Sie die Meldungen und beheben Sie den Fehler. Warum tritt er bei der Factory-Funktion nicht auf?
2. **Unveränderliche Updates mit Immer:** [Immer](https://immerjs.github.io/immer/) ist installiert. Schreiben Sie `toggle` mit `produce` um. Bestehen die Tests weiterhin? Ergänzen Sie einen Test, der zeigt, dass Immer den neuen Stand einfriert (`Object.isFrozen`). Welche Variante ist für `toggle` lesbarer, welche für ein verschachteltes Objekt wie `{ customer: { address: { city } } }`?

<details>
<summary>Lösungshinweis zu Vertiefung 1</summary>

`npm run check` meldet die Warnung `typescript(unbound-method)` bei `action(shoppingList.undo)`. Im Browser erscheint in der Console:

```text
TypeError: Cannot read properties of undefined (reading '#history')
```

`this` hängt davon ab, **wie** eine Funktion aufgerufen wird. `action` ruft die übergebene Funktion als `change()` auf, ohne Objekt davor; in einem Modul ist `this` dann `undefined`. In Java wäre `list::undo` an das Objekt gebunden.

Drei Lösungen:

- beim Aufruf mit einer Arrow Function: `action(() => shoppingList.undo())`
- beim Übergeben mit `bind`: `action(shoppingList.undo.bind(shoppingList))`
- in der Klasse als Class Field mit Arrow Function: `undo = (): void => { … };` Eine Arrow Function hat kein eigenes `this`, sie verwendet das `this` der Instanz.

Die Factory-Funktion verwendet kein `this`, sondern greift über die Closure auf `items` und `history` zu. Die Schreibweise `undo: () => void` in der Schnittstelle hält das fest. Mit `undo(): void` würde Oxlint auch bei der Factory warnen.

</details>

<details>
<summary>Lösungshinweis zu Vertiefung 2</summary>

```ts
import { produce } from "immer";

// …
toggle(id) {
  update(
    produce(items, (draft) => {
      const item = draft.find((item) => item.id === id);
      if (item) item.done = !item.done;
    }),
  );
},
```

```ts
it("friert den Stand nach dem Abhaken ein", () => {
  list.add("Milch");
  list.toggle(1);

  expect(Object.isFrozen(list.getItems())).toBe(true);
  expect(Object.isFrozen(list.getItems()[0])).toBe(true);
});
```

Alle bisherigen Tests bestehen weiterhin, da sie das Verhalten prüfen, nicht die Umsetzung. Im Callback von `produce` ändern Sie einen Entwurf (`draft`); Immer erzeugt daraus einen neuen Stand und übernimmt unveränderte Teile. Für einen flachen Eintrag ist der Spread-Ausdruck ebenso lesbar, bei tief verschachtelten Objekten spart Immer viele Zeilen.

</details>
