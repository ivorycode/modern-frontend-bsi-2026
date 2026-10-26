import { describe, expect, it, vi } from "vite-plus/test";
import { createSearch } from "./search.ts";
import { createFakeSearchTerms } from "./test-helpers.ts";

function createFakeView() {
  return { showResults: vi.fn(), showError: vi.fn() };
}

describe("createSearch", () => {
  it("zeigt die Treffer einer Suche", async () => {
    const fake = createFakeSearchTerms();
    const view = createFakeView();
    const search = createSearch(fake.searchTerms, view);

    const searching = search("vue");
    fake.respond("vue", ["Vue", "Vue Router"]);
    await searching;

    expect(view.showResults).toHaveBeenCalledWith("vue", ["Vue", "Vue Router"]);
    expect(view.showError).not.toHaveBeenCalled();
  });

  it("zeigt eine Meldung, wenn die Suche fehlschlägt", async () => {
    const fake = createFakeSearchTerms();
    const view = createFakeView();
    const search = createSearch(fake.searchTerms, view);

    const searching = search("vue");
    fake.fail("vue", new Error("HTTP 500"));
    await searching;

    expect(view.showError).toHaveBeenCalledWith("Die Suche ist fehlgeschlagen.");
    expect(view.showResults).not.toHaveBeenCalled();
  });

  // Vertiefung 1
  it.todo("zeigt die Treffer der neueren Suche, auch wenn die ältere zuletzt antwortet");
  it.todo("bricht die vorherige Suche ab und zeigt dafür keine Fehlermeldung");
});
