import "./style.css";
import { debounceTime, distinctUntilChanged, fromEvent, map } from "rxjs";
import { searchTerms } from "./search-api.ts";
import { createSearch, type SearchView } from "./search.ts";
import { searchResults } from "./search-rx.ts";

const input = document.querySelector<HTMLInputElement>('input[name="query"]')!;
const heading = document.querySelector<HTMLElement>(".results-heading")!;
const list = document.querySelector<HTMLUListElement>(".results")!;
const error = document.querySelector<HTMLElement>(".error")!;

const view: SearchView = {
  showResults(query, results) {
    error.hidden = true;
    heading.textContent = query ? `Treffer für «${query}»` : "";
    list.replaceChildren(
      ...results.map((result) => {
        const li = document.createElement("li");
        li.textContent = result;
        return li;
      }),
    );
  },
  showError(message) {
    error.textContent = message;
    error.hidden = false;
  },
};

// Über ?umsetzung=rxjs verwendet die Seite die Variante mit RxJS (Vertiefung 2).
const useRxjs = new URLSearchParams(location.search).get("umsetzung") === "rxjs";
document.querySelector(`a[data-umsetzung="${useRxjs ? "rxjs" : "promise"}"]`)!.ariaCurrent = "page";

if (useRxjs) {
  const queries = fromEvent(input, "input").pipe(
    map(() => input.value.trim()),
    debounceTime(300),
    distinctUntilChanged(),
  );
  searchResults(queries, searchTerms).subscribe({
    next: ({ query, results }) => view.showResults(query, results),
    error: () => view.showError("Die Suche ist fehlgeschlagen."),
  });
} else {
  const search = createSearch(searchTerms, view);
  input.addEventListener("input", () => search(input.value.trim()));
}
