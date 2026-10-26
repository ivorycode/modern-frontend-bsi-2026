import "./style.css";
import { setupListView } from "./list-view.ts";

for (const root of document.querySelectorAll<HTMLElement>(".shopping-list")) {
  setupListView(root);
}
