import { expect, test } from "@playwright/test";

test("passt die Franchise an, wenn sie für das neue Alter nicht erlaubt ist", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Franchise").selectOption({ label: "CHF 2500" });

  await page.getByLabel("Alter").fill("10");

  // R7: tiefste erlaubte Franchise für Kinder ist CHF 0.
  // R2, R3: 104.65 − 0 = 104.65 pro Monat, 12 × 104.65 = 1255.80 pro Jahr.
  await expect(page.getByLabel("Franchise")).toHaveValue("0");
  await expect(page.getByLabel("Monatsprämie")).toHaveText("CHF 104.65");
  await expect(page.getByLabel("Jahresprämie")).toHaveText("CHF 1255.80");
});
