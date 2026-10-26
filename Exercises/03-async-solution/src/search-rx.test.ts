import { Subject } from "rxjs";
import { describe, expect, it } from "vite-plus/test";
import { searchResults, type SearchResult } from "./search-rx.ts";
import { createFakeSearchTerms, flushPromises } from "./test-helpers.ts";

describe("searchResults", () => {
  it("liefert die Treffer zu einem Suchbegriff", async () => {
    const fake = createFakeSearchTerms();
    const queries = new Subject<string>();
    const received: SearchResult[] = [];
    searchResults(queries, fake.searchTerms).subscribe((result) => received.push(result));

    queries.next("vue");
    fake.respond("vue", ["Vue", "Vue Router"]);
    await flushPromises();

    expect(received).toEqual([{ query: "vue", results: ["Vue", "Vue Router"] }]);
  });

  // Vertiefung 2
  it("liefert nur die Treffer der neueren Suche, auch wenn die ältere zuletzt antwortet", async () => {
    const fake = createFakeSearchTerms();
    const queries = new Subject<string>();
    const received: SearchResult[] = [];
    searchResults(queries, fake.searchTerms).subscribe((result) => received.push(result));

    queries.next("re");
    queries.next("react");
    fake.respond("react", ["React"]);
    await flushPromises();
    fake.respond("re", ["React", "Redux", "Remix"]);
    await flushPromises();

    expect(received).toEqual([{ query: "react", results: ["React"] }]);
  });
  it("bricht die vorherige Suche ab", () => {
    const fake = createFakeSearchTerms();
    const queries = new Subject<string>();
    searchResults(queries, fake.searchTerms).subscribe();

    queries.next("re");
    queries.next("react");

    expect(fake.isAborted("re")).toBe(true);
    expect(fake.isAborted("react")).toBe(false);
  });
});
