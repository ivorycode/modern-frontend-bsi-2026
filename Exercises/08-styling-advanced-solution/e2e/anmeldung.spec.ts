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

test("blendet die Navigation mobil über den Menü-Button ein", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobil", "Nur auf schmalen Bildschirmen");
  await page.goto("/");
  const navigation = page.getByRole("navigation", { name: "Hauptnavigation" });

  await expect(navigation).toBeHidden();
  await page.getByRole("button", { name: "Menü" }).click();
  await expect(navigation.getByRole("link", { name: "Kurse" })).toBeVisible();
});

test("zeigt die Navigation auf dem Desktop ohne Menü-Button", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Nur auf breiten Bildschirmen");
  await page.goto("/");

  await expect(page.getByRole("button", { name: "Menü" })).toBeHidden();
  await expect(page.getByRole("link", { name: "Kurse" })).toBeVisible();
});

test("stellt die Zusammenfassung ab 50rem neben das Formular", async ({ page }, testInfo) => {
  await page.goto("/");
  const form = await page.locator("form").boundingBox();
  const summary = await page.getByRole("complementary", { name: "Ihre Anmeldung" }).boundingBox();
  if (!form || !summary) throw new Error("Formular oder Zusammenfassung nicht sichtbar");

  if (testInfo.project.name === "desktop") {
    expect(summary.x).toBeGreaterThanOrEqual(form.x + form.width);
    expect(summary.y).toBeLessThan(form.y + form.height);
  } else {
    expect(summary.y).toBeGreaterThanOrEqual(form.y + form.height);
  }
});

test("zeigt nach dem Absenden die Fehler aller ungültigen Felder", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Ich akzeptiere").check();
  await page.getByRole("button", { name: "Anmelden" }).click();

  await expect(page.getByText("Bitte geben Sie Ihren Namen an.")).toBeVisible();
  await expect(page.getByText("Bitte wählen Sie einen Kurs.")).toBeVisible();
  await expect(page.getByRole("status")).toBeHidden();

  await page.getByLabel("Name").fill("Ada Lovelace");
  await page.getByLabel("E-Mail").fill("ada@example.ch");
  await page.getByLabel("Kurs").selectOption("Testing im Frontend");
  await page.getByRole("button", { name: "Anmelden" }).click();

  await expect(page.getByText("Bitte geben Sie Ihren Namen an.")).toBeHidden();
  await expect(page.getByRole("status")).toHaveText("Danke, Ihre Anmeldung ist eingegangen.");
});
