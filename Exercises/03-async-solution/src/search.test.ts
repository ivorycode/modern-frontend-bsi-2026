import { describe, expect, it, vi } from "vite-plus/test";
import { createSearch } from "./search.ts";
import { createFakeSearchTerms, flushPromises } from "./test-helpers.ts";

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
  it("zeigt die Treffer der neueren Suche, auch wenn die ältere zuletzt antwortet", async () => {
    const fake = createFakeSearchTerms();
    const view = createFakeView();
    const search = createSearch(fake.searchTerms, view);

    const older = search("re");
    const newer = search("react");
    fake.respond("react", ["React"]);
    await flushPromises();
    fake.respond("re", ["React", "Redux", "Remix"]);
    await Promise.all([older, newer]);

    expect(view.showResults).toHaveBeenCalledTimes(1);
    expect(view.showResults).toHaveBeenLastCalledWith("react", ["React"]);
  });
  it("bricht die vorherige Suche ab und zeigt dafür keine Fehlermeldung", async () => {
    const fake = createFakeSearchTerms();
    const view = createFakeView();
    const search = createSearch(fake.searchTerms, view);

    const older = search("re");
    const newer = search("react");
    expect(fake.isAborted("re")).toBe(true);

    fake.respond("react", ["React"]);
    await Promise.all([older, newer]);

    expect(view.showError).not.toHaveBeenCalled();
  });
});
