// Vertiefung 2: wie `shopping-list.ts`, `toggle` aber mit Immer (`produce`).

import { produce } from "immer";
import type { Item, ShoppingList } from "./shopping-list.ts";

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
      // Im Callback wird ein Entwurf (`draft`) verändert; Immer erzeugt daraus einen neuen Stand
      // und übernimmt unveränderte Teile.
      update(
        produce(items, (draft) => {
          const item = draft.find((item) => item.id === id);
          if (item) item.done = !item.done;
        }),
      );
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
