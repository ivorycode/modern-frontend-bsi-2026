import { expect, test } from "@playwright/test";

test("berechnet die Prämie für eine erwachsene Person", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Franchise").selectOption({ label: "CHF 2500" });
  await page.getByRole("radio", { name: "Hausarzt" }).check();
  await page.getByRole("checkbox", { name: "Zahnversicherung" }).check();

  await expect(page.getByLabel("Monatsprämie")).toHaveText("CHF 317.85");
  await expect(page.getByLabel("Jahresprämie")).toHaveText("CHF 3814.20");
});
