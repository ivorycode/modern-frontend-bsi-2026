import { expect, test } from "@playwright/test";

// Funktionale Tests: prüfen Verhalten und Sichtbarkeit, nicht das Aussehen.

test("zeigt die Eingaben in der Zusammenfassung", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Name").fill("Ada Lovelace");
  await page.getByLabel("Kurs").selectOption("Testing im Frontend");

  const summary = page.getByRole("complementary", { name: "Ihre Anmeldung" });
  await expect(summary).toContainText("Ada Lovelace");
  await expect(summary).toContainText("Testing im Frontend");
});

// TODO Schritt 8: Tests für Navigation, Layout und Fehlermeldung ergänzen.
