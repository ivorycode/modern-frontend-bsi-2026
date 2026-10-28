# Übung 5.4: JSON – was beim Serialisieren verloren geht

Daten zwischen Browser und Server reisen meist als JSON. JSON kennt aber nur Strings, Zahlen, Booleans, `null`, Arrays und Objekte. Sie finden heraus, was mit `BigInt`, `Date` und `Set` passiert, und schreiben einen Replacer und einen Reviver, die diese Werte erhalten.

Jeder Schritt hat einen ausklappbaren Lösungshinweis. Die Musterlösung liegt in [04-json-solution](../04-json-solution).

## Schritt 1: Test ausführen

Im Ordner `Exercises/05-web-platform/04-json`:

```sh
npm install
npm test
```

Die Tests laufen mit dem [Testrunner von Node.js](https://nodejs.org/api/test.html) (`node:test`); Node führt TypeScript direkt aus. `npm run check` prüft die Typen. Lesen Sie `json.ts` und `json.test.ts`. Der Test besteht.

## Schritt 2: Andere Datentypen

Ändern Sie im Test das Interface `Person` und das Objekt `original` nacheinander, und führen Sie nach jeder Änderung `npm test` aus:

- `age: bigint` mit dem Wert `30n`
- neue Eigenschaft `birthday: Date` mit dem Wert `new Date("1990-01-01")`
- `hobbies: Set<string>` mit dem Wert `new Set(["Lesen", "Programmieren", "Wandern"])`

Was passiert jeweils? Achten Sie auf die Ausgabe von `console.log(json)`. Warum meldet TypeScript keinen Fehler?

<details>
<summary>Lösungshinweis</summary>

| Wert         | `JSON.stringify`                          | nach `JSON.parse`               |
| ------------ | ----------------------------------------- | ------------------------------- |
| `30n`        | wirft `TypeError: Do not know how to serialize a BigInt` | –                |
| `new Date()` | `"1990-01-01T00:00:00.000Z"` (über `Date.prototype.toJSON`) | String statt `Date` |
| `new Set()`  | `{}` – ein `Set` hat keine eigenen aufzählbaren Eigenschaften | leeres Objekt, Daten verloren |

Datum und Set gehen still verloren; erst `assert.deepEqual` bemerkt den Unterschied. TypeScript hilft nicht, weil `deserialize` den Typ `unknown` liefert, `JSON.parse` sogar `any`. Ein Typ wie `Person` für das Ergebnis wäre nur eine Behauptung, wie die Type Assertion aus Übung 4.

</details>

## Schritt 3: Replacer und Reviver

`JSON.stringify(value, replacer)` und `JSON.parse(json, reviver)` nehmen eine Funktion `(key, value) => …` entgegen, die für jeden Wert aufgerufen wird und ihn ersetzen kann. Ändern Sie `serialize` und `deserialize` in `json.ts` so, dass `BigInt`, `Date` und `Set` erhalten bleiben und der Test besteht. Siehe [Replacer und Reviver zusammen verwenden (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#using_reviver_when_paired_with_the_replacer_of_json.stringify).

Tipp: Codieren Sie solche Werte als Objekt mit einer Markierung, z. B. `{ "$type": "date", "value": "1990-01-01T00:00:00.000Z" }`.

<details>
<summary>Lösungshinweis</summary>

```ts
function replacer(this: Record<string, unknown>, key: string, value: unknown): unknown {
  const original = this[key];
  if (typeof original === "bigint") return { $type: "bigint", value: original.toString() };
  if (original instanceof Date) return { $type: "date", value: original.toISOString() };
  if (original instanceof Set) return { $type: "set", value: [...original] };
  return value;
}

function reviver(_key: string, value: unknown): unknown {
  if (!isTagged(value)) return value;
  switch (value.$type) {
    case "bigint":
      return BigInt(value.value);
    case "date":
      return new Date(value.value);
    case "set":
      return new Set(value.value);
  }
}
```

Die Falle beim Datum: `JSON.stringify` ruft `toJSON()` **vor** dem Replacer auf. `value instanceof Date` ist darum nie wahr; den ursprünglichen Wert liefert `this[key]`, denn `this` ist das Objekt, das die Eigenschaft enthält. Deshalb muss der Replacer eine `function` sein, keine Pfeilfunktion.

Der Reviver arbeitet von innen nach aussen: Wenn er das markierte Set sieht, sind dessen Elemente bereits verarbeitet.

Eine eigene Markierung funktioniert nur, wenn beide Seiten sie kennen. Bei fremden APIs bleibt das Datum ein String; dort wandeln Sie an der Systemgrenze um, z. B. mit einem Zod-Schema `z.iso.datetime().transform((s) => new Date(s))`. Innerhalb des Browsers kopiert `structuredClone` solche Werte ohne JSON; `postMessage` an einen Web Worker (Übung 5.6) verwendet denselben Algorithmus.

</details>
