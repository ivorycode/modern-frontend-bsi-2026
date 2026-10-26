import { describe, expect, it } from "vite-plus/test";
import { add, canUndo, getItems, remove, toggle, undo } from "./shopping-list.ts";

describe("Einkaufsliste", () => {
  it("fügt einen Eintrag mit Menge 1 hinzu", () => {
    add("Milch");

    expect(getItems()).toEqual([{ id: 1, name: "Milch", quantity: 1, done: false }]);
  });

  it("startet mit einer leeren Liste", () => {
    expect(getItems()).toEqual([]);
    expect(canUndo()).toBe(false);
  });

  it("hakt einen Eintrag ab", () => {
    add("Brot", 2);
    const [bread] = getItems();

    toggle(bread.id);

    expect(getItems()).toEqual([{ id: 1, name: "Brot", quantity: 2, done: true }]);
  });

  it("entfernt einen Eintrag", () => {
    add("Äpfel", 6);
    add("Käse");
    const [apples] = getItems();

    remove(apples.id);

    expect(getItems().map((item) => item.name)).toEqual(["Käse"]);
  });

  it("macht das Hinzufügen rückgängig", () => {
    add("Butter");

    undo();

    expect(getItems()).toEqual([]);
    expect(canUndo()).toBe(false);
  });

  // Teil 2: Tests für Abhaken, Menge und «Rückgängig» ergänzen.
  it.todo("verändert den bisherigen Stand beim Abhaken nicht");
  it.todo("macht das Abhaken rückgängig");
});
