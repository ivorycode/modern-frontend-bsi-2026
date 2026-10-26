// Vertiefung 1: dieselbe Einkaufsliste als Klasse.
//
// Mit `undo(): void { … }` als normaler Methode meldet `npm run check` bei
// `action(shoppingList.undo)` in `list-view.ts` die Warnung `typescript(unbound-method)`,
// und im Browser erscheint nach «Rückgängig»:
//   TypeError: Cannot read properties of undefined (reading '#history')
// `action` ruft die Funktion als `change()` ohne Objekt davor auf; `this` ist dann `undefined`.
//
// Behoben ist der Fehler hier in der Klasse: `undo` ist ein Class Field mit Arrow Function.
// Eine Arrow Function hat kein eigenes `this` und verwendet das `this` der Instanz.
// Alternativen beim Aufrufer in `list-view.ts`:
//   action(() => shoppingList.undo())
//   action(shoppingList.undo.bind(shoppingList))
//
// Die Factory-Funktion `createShoppingList` kennt das Problem nicht: Sie verwendet kein `this`,
// sondern greift über die Closure auf `items` und `history` zu.

import type { Item, ShoppingList } from "./shopping-list.ts";

export class ShoppingListClass implements ShoppingList {
  #items: readonly Item[] = [];
  #history: (readonly Item[])[] = [];
  #nextId = 1;

  getItems(): readonly Item[] {
    return this.#items;
  }

  canUndo(): boolean {
    return this.#history.length > 0;
  }

  add(name: string, quantity = 1): void {
    this.#update([...this.#items, { id: this.#nextId++, name, quantity, done: false }]);
  }

  toggle(id: number): void {
    this.#updateItem(id, (item) => ({ ...item, done: !item.done }));
  }

  changeQuantity(id: number, delta: number): void {
    this.#updateItem(id, (item) => ({ ...item, quantity: Math.max(1, item.quantity + delta) }));
  }

  remove(id: number): void {
    this.#update(this.#items.filter((item) => item.id !== id));
  }

  /** Class Field mit Arrow Function: bleibt an die Instanz gebunden, auch ohne Objekt davor. */
  undo = (): void => {
    const previous = this.#history.pop();
    if (previous) this.#items = previous;
  };

  /** Ersetzt den Stand; der bisherige Stand bleibt unverändert und dient für «Rückgängig». */
  #update(next: readonly Item[]): void {
    this.#history.push(this.#items);
    this.#items = next;
  }

  /** Ersetzt einen Eintrag durch eine geänderte Kopie. */
  #updateItem(id: number, change: (item: Item) => Item): void {
    this.#update(this.#items.map((item) => (item.id === id ? change(item) : item)));
  }
}
