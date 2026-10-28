import { expect, test } from "@playwright/test";

// Screenshot-Vergleiche als Sicherheitsnetz für die Umstellung. Die Referenzbilder erzeugen Sie
// vor der ersten Änderung mit `npm run e2e -- --update-snapshots` (Schritt 0 der Anleitung).

test("Ausgangszustand", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveScreenshot("ausgangszustand.png", { fullPage: true });
});

test("Menü geöffnet", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobil", "Das Menü gibt es nur auf schmalen Bildschirmen.");
  await page.goto("/");
  await page.getByRole("button", { name: "Menü" }).click();
  await expect(page).toHaveScreenshot("menue-geoeffnet.png", { fullPage: true });
});

test("Ausgefülltes Formular mit Fokus und Hover", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Name").fill("Ada Lovelace");
  await page.getByLabel("E-Mail").fill("ada@example.ch");
  await page.getByLabel("Kurs").selectOption("Testing im Frontend");
  await page.getByLabel("Online").check();
  await page.getByLabel("Ich akzeptiere").check();
  await page.getByLabel("Bemerkung").focus();
  await page.getByRole("button", { name: "Anmelden" }).hover();
  await expect(page).toHaveScreenshot("ausgefuellt.png", { fullPage: true });
});

test("Fehlerzustand nach dem Absenden", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Ich akzeptiere").check();
  await page.getByLabel("E-Mail").fill("keine-adresse");
  // Verlässt den Fokus, bevor geklickt wird: Die Fehlermeldung verschiebt sonst den Button.
  await page.getByLabel("E-Mail").press("Tab");
  await page.getByRole("button", { name: "Anmelden" }).click();
  await page.mouse.move(0, 0);
  await expect(page).toHaveScreenshot("fehlerzustand.png", { fullPage: true });
});
