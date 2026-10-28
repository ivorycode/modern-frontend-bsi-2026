import assert from "node:assert/strict";
import { test } from "node:test";
import { deserialize, serialize } from "./json.ts";

interface Person {
  name: string;
  age: number;
  address: {
    city: string;
    street: string;
    number: number;
  };
  hobbies: string[];
}

test("Objekt bleibt nach serialize und deserialize gleich", () => {
  const original: Person = {
    name: "Anna Muster",
    age: 30,
    address: {
      city: "Bern",
      street: "Bundesgasse",
      number: 3,
    },
    hobbies: ["Lesen", "Programmieren", "Wandern"],
  };

  const json = serialize(original);
  console.log(json);
  const parsed = deserialize(json);

  assert.deepEqual(parsed, original);
});
