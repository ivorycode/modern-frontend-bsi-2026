import { expect, test, type Page } from "@playwright/test";

/** Wählt ein Szenario und sammelt Fehler, die die Seite nicht selbst behandelt. */
async function selectScenario(page: Page, label: string): Promise<Error[]> {
  const pageErrors: Error[] = [];
  page.on("pageerror", (error) => pageErrors.push(error));
  await page.goto("/");
  await page.getByLabel("Szenario").selectOption({ label });
  return pageErrors;
}

test("zeigt alle Geräte", async ({ page }) => {
  await selectScenario(page, "Alle Geräte");

  await expect(page.getByRole("row")).toHaveCount(6);
  await expect(page.getByText("5 Geräte, davon 3 verfügbar")).toBeVisible();
});

test("zeigt bei einer leeren Liste einen Hinweis statt einer leeren Tabelle", async ({ page }) => {
  await selectScenario(page, "Leere Liste");

  await expect(page.getByText("Keine Geräte vorhanden.")).toBeVisible();
  await expect(page.getByRole("table")).toHaveCount(0);
});

const errorCases = [
  { scenario: "Falscher Pfad", message: "404" },
  { scenario: "Serverfehler", message: "500" },
  { scenario: "Abgeschnittene Antwort", message: "kein gültiges JSON" },
  { scenario: "Ungültige Daten", message: "ungültige Daten" },
  { scenario: "Verbindungsabbruch", message: "nicht erreichbar" },
];

for (const { scenario, message } of errorCases) {
  test(`meldet den Fehler verständlich: ${scenario}`, async ({ page }) => {
    const pageErrors = await selectScenario(page, scenario);

    await expect(page.getByRole("alert")).toContainText(message);
    await expect(page.getByRole("status")).toHaveCount(0);
    expect(pageErrors).toEqual([]);
  });
}

test("zeigt ausgemusterte Geräte (Teil 2)", async ({ page }) => {
  await selectScenario(page, "Ausgemusterte Geräte");

  await expect(page.getByRole("row")).toHaveCount(3);
});
