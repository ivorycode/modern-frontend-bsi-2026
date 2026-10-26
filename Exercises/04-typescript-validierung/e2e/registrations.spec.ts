import { expect, test, type Page } from "@playwright/test";

async function selectSource(page: Page, label: string) {
  await page.getByLabel("Datenquelle").selectOption({ label });
}

test("zeigt gültige Anmeldungen", async ({ page }) => {
  await page.goto("/");

  await selectSource(page, "Gültige Anmeldungen");

  await expect(page.getByRole("row")).toHaveCount(6);
  await expect(page.getByText("nächste Anmeldenummer: 6")).toBeVisible();
});

test("zeigt bei einer leeren Liste einen Hinweis statt einer leeren Tabelle", async ({ page }) => {
  await page.goto("/");

  await selectSource(page, "Leere Liste");

  await expect(page.getByText("Keine Anmeldungen vorhanden.")).toBeVisible();
  await expect(page.getByRole("table")).toHaveCount(0);
});

for (const source of ["Name fehlt", "Anmeldenummer als Text", "Unbekannter Status"]) {
  test(`meldet ungültige Daten statt sie anzuzeigen: ${source}`, async ({ page }) => {
    await page.goto("/");

    await selectSource(page, source);

    await expect(page.getByRole("alert")).toContainText("ungültige Daten");
    await expect(page.getByRole("status")).toHaveCount(0);
    await expect(page.getByRole("table")).toHaveCount(0);
  });
}

test("entfernt eine alte Fehlermeldung beim erneuten Laden", async ({ page }) => {
  await page.goto("/");
  await selectSource(page, "Nicht vorhandene Datei");
  await expect(page.getByRole("alert")).toBeVisible();

  await selectSource(page, "Gültige Anmeldungen");

  await expect(page.getByRole("table")).toBeVisible();
  await expect(page.getByRole("alert")).toHaveCount(0);
});
