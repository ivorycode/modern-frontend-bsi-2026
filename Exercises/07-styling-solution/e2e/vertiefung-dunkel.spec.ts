import { expect, test } from "@playwright/test";

// Vertiefung 1: Screenshots im dunklen Farbschema mit eigenen Referenzbildern. Die Tests laufen
// nur, wenn das dunkle Farbschema eingebunden ist (siehe `src/main.ts`), sonst werden sie
// übersprungen.

test.use({ colorScheme: "dark" });

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  const colorScheme = await page.evaluate(
    () => getComputedStyle(document.documentElement).colorScheme,
  );
  test.skip(!colorScheme.includes("dark"), "Dunkles Farbschema ist nicht eingebunden.");
});

test("Dunkel: Ausgangszustand", async ({ page }) => {
  await expect(page).toHaveScreenshot("dunkel-ausgangszustand.png", { fullPage: true });
});

test("Dunkel: Fehlerzustand nach dem Absenden", async ({ page }) => {
  await page.getByLabel("Ich akzeptiere").check();
  await page.getByLabel("E-Mail").fill("keine-adresse");
  await page.getByLabel("E-Mail").press("Tab");
  await page.getByRole("button", { name: "Anmelden" }).click();
  await page.mouse.move(0, 0);
  await expect(page).toHaveScreenshot("dunkel-fehlerzustand.png", { fullPage: true });
});
