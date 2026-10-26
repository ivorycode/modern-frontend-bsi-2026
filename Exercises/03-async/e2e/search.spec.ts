import { expect, test, type Page, type Request } from "@playwright/test";

/** Zählt die offenen Requests an die Such-API. */
function trackOpenSearches(page: Page): () => number {
  let open = 0;
  const isSearchRequest = (request: Request) => request.url().includes("/api/search");

  page.on("request", (request) => {
    if (isSearchRequest(request)) open++;
  });
  const close = (request: Request) => {
    if (isSearchRequest(request)) open--;
  };
  page.on("requestfinished", close);
  page.on("requestfailed", close);
  return () => open;
}

for (const umsetzung of ["promise", "rxjs"]) {
  test(`${umsetzung}: zeigt nach schnellem Tippen die Treffer des letzten Suchbegriffs`, async ({
    page,
  }) => {
    const openSearches = trackOpenSearches(page);
    await page.goto(`/suche.html?umsetzung=${umsetzung}`);

    // «r» und «re» beantwortet die API langsam, «rea» bis «react» schnell.
    const heading = page.getByRole("heading", { level: 2 });
    await page.getByLabel("Suchbegriff").pressSequentially("react", { delay: 100 });
    await expect(heading).toHaveText("Treffer für «react»");

    // Warten, bis auch die langsamen Antworten eingetroffen oder abgebrochen sind.
    await expect.poll(openSearches).toBe(0);

    await expect(heading).toHaveText("Treffer für «react»");
    await expect(page.getByRole("listitem")).toHaveText([
      "React",
      "React Native",
      "React Router",
      "Reactive Forms",
    ]);
    await expect(page.getByRole("alert")).toBeHidden();
  });
}
