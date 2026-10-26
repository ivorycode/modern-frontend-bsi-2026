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

  it("startet mit einer leeren Liste", () => {
    expect(list.getItems()).toEqual([]);
    expect(list.canUndo()).toBe(false);
  });

  it("hakt einen Eintrag ab", () => {
    list.add("Brot", 2);
    const [bread] = list.getItems();

    list.toggle(bread.id);

    expect(list.getItems()).toEqual([{ id: 1, name: "Brot", quantity: 2, done: true }]);
  });

  it("entfernt einen Eintrag", () => {
    list.add("Äpfel", 6);
    list.add("Käse");
    const [apples] = list.getItems();

    list.remove(apples.id);

    expect(list.getItems().map((item) => item.name)).toEqual(["Käse"]);
  });

  it("macht das Hinzufügen rückgängig", () => {
    list.add("Butter");

    list.undo();

    expect(list.getItems()).toEqual([]);
    expect(list.canUndo()).toBe(false);
  });

  it("hält zwei Listen unabhängig voneinander", () => {
    const party = createShoppingList();

    list.add("Milch");
    party.add("Chips");

    expect(list.getItems().map((item) => item.name)).toEqual(["Milch"]);
    expect(party.getItems().map((item) => item.name)).toEqual(["Chips"]);
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
});
