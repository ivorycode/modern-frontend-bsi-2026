import "./style.css";
import { setupListView } from "./list-view.ts";
import { createShoppingList } from "./shopping-list.ts";

for (const root of document.querySelectorAll<HTMLElement>(".shopping-list")) {
  setupListView(root, createShoppingList());
}
