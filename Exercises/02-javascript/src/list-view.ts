import * as shoppingList from "./shopping-list.ts";
import type { Item } from "./shopping-list.ts";

/** Verbindet eine Listenansicht im HTML mit der Einkaufsliste. */
export function setupListView(root: HTMLElement): void {
  const form = root.querySelector<HTMLFormElement>("form")!;
  const nameInput = root.querySelector<HTMLInputElement>('input[name="name"]')!;
  const quantityInput = root.querySelector<HTMLInputElement>('input[name="quantity"]')!;
  const list = root.querySelector<HTMLUListElement>("ul")!;
  const undoButton = root.querySelector<HTMLButtonElement>("button.undo")!;
  const summary = root.querySelector<HTMLElement>(".summary")!;

  /** Führt eine Änderung aus und zeichnet die Liste danach neu. */
  function action(change: () => void): () => void {
    return () => {
      change();
      render();
    };
  }

  function renderItem(item: Item): HTMLLIElement {
    const li = document.createElement("li");
    li.classList.toggle("done", item.done);

    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.done;
    checkbox.addEventListener(
      "change",
      action(() => shoppingList.toggle(item.id)),
    );
    label.append(checkbox, ` ${item.name}`);

    const quantity = document.createElement("span");
    quantity.className = "quantity";
    const decrease = button("−", `Menge von ${item.name} verringern`);
    decrease.disabled = item.quantity <= 1;
    decrease.addEventListener(
      "click",
      action(() => shoppingList.changeQuantity(item.id, -1)),
    );
    const amount = document.createElement("output");
    amount.textContent = String(item.quantity);
    const increase = button("+", `Menge von ${item.name} erhöhen`);
    increase.addEventListener(
      "click",
      action(() => shoppingList.changeQuantity(item.id, 1)),
    );
    quantity.append(decrease, amount, increase);

    const removeButton = button("✕", `${item.name} entfernen`);
    removeButton.className = "remove";
    removeButton.addEventListener(
      "click",
      action(() => shoppingList.remove(item.id)),
    );

    li.append(label, quantity, removeButton);
    return li;
  }

  function render(): void {
    const items = shoppingList.getItems();
    list.replaceChildren(...items.map(renderItem));

    const open = items.filter((item) => !item.done).length;
    summary.textContent = `${open} von ${items.length} offen`;
    undoButton.disabled = !shoppingList.canUndo();
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = nameInput.value.trim();
    if (!name) return;

    shoppingList.add(name, quantityInput.valueAsNumber);
    form.reset();
    nameInput.focus();
    render();
  });

  undoButton.addEventListener("click", action(shoppingList.undo));

  render();
}

function button(text: string, label: string): HTMLButtonElement {
  const element = document.createElement("button");
  element.type = "button";
  element.textContent = text;
  element.setAttribute("aria-label", label);
  return element;
}
