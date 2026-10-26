import { beforeEach, describe, expect, it } from "vite-plus/test";
import type { ShoppingList } from "./shopping-list.ts";
import { createShoppingList } from "./shopping-list.vertiefung-2.ts";

// Vertiefung 2: Die bisherigen Tests zum Abhaken bestehen auch mit Immer.
describe("Einkaufsliste mit Immer", () => {
  let list: ShoppingList;

  beforeEach(() => {
    list = createShoppingList();
  });

  it("hakt einen Eintrag ab", () => {
    list.add("Brot", 2);
    const [bread] = list.getItems();

    list.toggle(bread.id);

    expect(list.getItems()).toEqual([{ id: 1, name: "Brot", quantity: 2, done: true }]);
  });

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

  it("übernimmt unveränderte Einträge", () => {
    list.add("Milch");
    list.add("Brot");
    const [, bread] = list.getItems();

    list.toggle(1);

    expect(list.getItems()[1]).toBe(bread);
  });

  it("friert den Stand nach dem Abhaken ein", () => {
    list.add("Milch");
    list.toggle(1);

    expect(Object.isFrozen(list.getItems())).toBe(true);
    expect(Object.isFrozen(list.getItems()[0])).toBe(true);
  });
});
