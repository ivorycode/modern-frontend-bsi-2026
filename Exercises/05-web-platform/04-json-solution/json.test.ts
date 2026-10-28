import assert from "node:assert/strict";
import { test } from "node:test";
import { deserialize, serialize } from "./json.ts";

interface Person {
  name: string;
  age: bigint;
  birthday: Date;
  address: {
    city: string;
    street: string;
    number: number;
  };
  hobbies: Set<string>;
}

test("Objekt bleibt nach serialize und deserialize gleich", () => {
  const original: Person = {
    name: "Anna Muster",
    age: 30n,
    birthday: new Date("1990-01-01"),
    address: {
      city: "Bern",
      street: "Bundesgasse",
      number: 3,
    },
    hobbies: new Set(["Lesen", "Programmieren", "Wandern"]),
  };

  const json = serialize(original);
  console.log(json);
  const parsed = deserialize(json);

  assert.deepEqual(parsed, original);
});

test("Ohne Replacer gehen Typen verloren", () => {
  assert.throws(() => JSON.stringify({ age: 30n }), TypeError);
  assert.equal(JSON.stringify({ birthday: new Date("1990-01-01") }), '{"birthday":"1990-01-01T00:00:00.000Z"}');
  assert.equal(JSON.stringify({ hobbies: new Set(["Lesen"]) }), '{"hobbies":{}}');
});
