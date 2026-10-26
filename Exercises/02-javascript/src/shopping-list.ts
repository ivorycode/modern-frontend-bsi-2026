export interface Item {
  id: number;
  name: string;
  quantity: number;
  done: boolean;
}

let items: Item[] = [];
const history: Item[][] = [];
let nextId = 1;

/** Merkt sich den aktuellen Stand, damit «Rückgängig» dorthin zurückkehren kann. */
function remember(): void {
  history.push([...items]);
}

export function getItems(): Item[] {
  return items;
}

export function canUndo(): boolean {
  return history.length > 0;
}

export function add(name: string, quantity = 1): void {
  remember();
  items.push({ id: nextId++, name, quantity, done: false });
}

export function toggle(id: number): void {
  const item = items.find((item) => item.id === id);
  if (!item) return;

  remember();
  item.done = !item.done;
}

export function changeQuantity(id: number, delta: number): void {
  const item = items.find((item) => item.id === id);
  if (!item) return;

  remember();
  item.quantity = Math.max(1, item.quantity + delta);
}

export function remove(id: number): void {
  remember();
  items = items.filter((item) => item.id !== id);
}

export function undo(): void {
  const previous = history.pop();
  if (previous) items = previous;
}
