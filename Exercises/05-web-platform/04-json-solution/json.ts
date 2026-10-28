// JSON kennt nur Strings, Zahlen, Booleans, null, Arrays und Objekte.
// Andere Werte werden als Objekt mit Typ-Markierung codiert, z. B.
// { "$type": "date", "value": "1990-01-01T00:00:00.000Z" }.
type Tagged =
  | { $type: "bigint"; value: string }
  | { $type: "date"; value: string }
  | { $type: "set"; value: unknown[] };

export function serialize(value: unknown): string {
  return JSON.stringify(value, replacer);
}

export function deserialize(json: string): unknown {
  return JSON.parse(json, reviver);
}

function replacer(this: Record<string, unknown>, key: string, value: unknown): unknown {
  // `value` ist bei einem Date bereits der String aus `toJSON()`.
  // `this[key]` enthält den ursprünglichen Wert.
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

function isTagged(value: unknown): value is Tagged {
  return typeof value === "object" && value !== null && "$type" in value && "value" in value;
}
