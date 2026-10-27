import { Subject } from "rxjs";
import { describe, expect, it } from "vite-plus/test";
import { searchResults, type SearchResult } from "./search-rx.ts";
import { createFakeSearchTerms$ } from "./test-helpers.ts";

describe("searchResults", () => {
  it("liefert die Treffer zu einem Suchbegriff", () => {
    const fake = createFakeSearchTerms$();
    const queries = new Subject<string>();
    const received: SearchResult[] = [];
    searchResults(queries, fake.searchTerms$).subscribe((result) => received.push(result));

    queries.next("vue");
    fake.respond("vue", ["Vue", "Vue Router"]);

    expect(received).toEqual([{ query: "vue", results: ["Vue", "Vue Router"] }]);
  });

  // Vertiefung 2
  it("liefert nur die Treffer der neueren Suche, auch wenn die ältere zuletzt antwortet", () => {
    const fake = createFakeSearchTerms$();
    const queries = new Subject<string>();
    const received: SearchResult[] = [];
    searchResults(queries, fake.searchTerms$).subscribe((result) => received.push(result));

    queries.next("re");
    queries.next("react");
    fake.respond("react", ["React"]);
    fake.respond("re", ["React", "Redux", "Remix"]);

    expect(received).toEqual([{ query: "react", results: ["React"] }]);
  });
  it("bricht die vorherige Suche ab", () => {
    const fake = createFakeSearchTerms$();
    const queries = new Subject<string>();
    searchResults(queries, fake.searchTerms$).subscribe();

    queries.next("re");
    queries.next("react");

    expect(fake.isAborted("re")).toBe(true);
    expect(fake.isAborted("react")).toBe(false);
  });
  it("sucht nach einem Fehler weiter", () => {
    const fake = createFakeSearchTerms$();
    const queries = new Subject<string>();
    const received: SearchResult[] = [];
    searchResults(queries, fake.searchTerms$).subscribe((result) => received.push(result));

    const error = new Error("HTTP 500");
    queries.next("vue");
    fake.fail("vue", error);
    queries.next("react");
    fake.respond("react", ["React"]);

    expect(received).toEqual([
      { query: "vue", error },
      { query: "react", results: ["React"] },
    ]);
  });
});
