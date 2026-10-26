import { expect, test, type Page, type Request } from "@playwright/test";

const SENTENCE = "The quick brown fox jumps over the lazy dog";

/** Zählt die Requests an die Wort-API und merkt sich, wie viele höchstens gleichzeitig offen waren. */
function trackWordRequests(page: Page) {
  const stats = { total: 0, maxOpen: 0 };
  let open = 0;
  const isWordRequest = (request: Request) => request.url().includes("/api/words/");

  page.on("request", (request) => {
    if (!isWordRequest(request)) return;
    stats.total++;
    open++;
    stats.maxOpen = Math.max(stats.maxOpen, open);
  });
  const close = (request: Request) => {
    if (isWordRequest(request)) open--;
  };
  page.on("requestfinished", close);
  page.on("requestfailed", close);
  return stats;
}

test("lädt alle Wörter parallel", async ({ page }) => {
  const requests = trackWordRequests(page);
  await page.goto("/");

  await page.getByRole("button", { name: "Parallel laden" }).click();

  await expect(page.getByLabel("Satz")).toHaveText(SENTENCE);
  await expect(page.getByText("Lädt …")).toBeHidden();
  expect(requests.total).toBe(9);
  expect(requests.maxOpen).toBeGreaterThan(1);
});

test("lädt die Wörter nacheinander und zeigt jedes sofort an", async ({ page }) => {
  const requests = trackWordRequests(page);
  await page.goto("/");

  await page.getByRole("button", { name: "Sequenziell laden" }).click();

  // Das erste Wort erscheint, während die übrigen noch laden.
  await expect(page.getByLabel("Satz")).toContainText("The");
  await expect(page.getByText("Lädt …")).toBeVisible();

  await expect(page.getByLabel("Satz")).toHaveText(SENTENCE);
  await expect(page.getByText("Lädt …")).toBeHidden();
  expect(requests.total).toBe(9);
  expect(requests.maxOpen).toBe(1);
});

for (const variant of ["Parallel laden", "Sequenziell laden"]) {
  test(`${variant}: zeigt eine Meldung, wenn ein Wort fehlt`, async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Szenario").selectOption("Wort 5 schlägt fehl");

    await page.getByRole("button", { name: variant }).click();

    await expect(page.getByRole("alert")).toHaveText(
      "Wort 5 konnte nicht geladen werden (HTTP 500).",
    );
    await expect(page.getByText("Lädt …")).toBeHidden();
    await expect(page.getByRole("button", { name: variant })).toBeEnabled();
  });
}
