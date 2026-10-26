import { beforeEach, describe, expect, it } from "vite-plus/test";
import { ShoppingListClass } from "./shopping-list-class.ts";

// Vertiefung 1: Die Klasse verhält sich wie die Factory-Funktion.
describe("Einkaufsliste als Klasse", () => {
  let list: ShoppingListClass;

  beforeEach(() => {
    list = new ShoppingListClass();
  });

  it("hält zwei Listen unabhängig voneinander", () => {
    const party = new ShoppingListClass();

    list.add("Milch");
    party.add("Chips");

    expect(list.getItems().map((item) => item.name)).toEqual(["Milch"]);
    expect(party.getItems().map((item) => item.name)).toEqual(["Chips"]);
  });

  it("macht das Abhaken rückgängig", () => {
    list.add("Milch");
    list.toggle(1);

    list.undo();

    expect(list.getItems()).toEqual([{ id: 1, name: "Milch", quantity: 1, done: false }]);
  });

  it("macht rückgängig, wenn undo ohne Objekt aufgerufen wird", () => {
    list.add("Butter");
    const undo = list.undo;

    // So ruft `action` in `list-view.ts` die Funktion auf.
    undo();

    expect(list.getItems()).toEqual([]);
  });
});
