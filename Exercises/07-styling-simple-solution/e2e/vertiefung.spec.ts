import { expect, test } from "@playwright/test";

// Vertiefungen a und b, je in beiden Fassungen.

const accent = "rgb(47, 111, 237)";
const edge = "rgb(217, 221, 227)";

const abschnitte = ["Übung · ProfileCard (CSS Modules)", "Übung · ProfileCard (Tailwind)"];

for (const abschnitt of abschnitte) {
  test(`Vertiefung a: Layout hängt von der Breite des Containers ab, nicht des Fensters (${abschnitt})`, async ({
    page,
  }) => {
    const karte = page.getByRole("region", { name: abschnitt }).getByRole("article");

    // Breites Fenster: mehrere Spalten, die Karte ist schmaler als 300px.
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    await expect(karte).toHaveCSS("text-align", "center");

    // Schmaleres Fenster: nur eine Spalte, die Karte ist breiter als 300px.
    await page.setViewportSize({ width: 500, height: 900 });
    await expect(karte).toHaveCSS("text-align", "start");
  });
}

for (const abschnitt of abschnitte) {
  test(`Vertiefung b: Rahmen beim Hover über «Folgen» (${abschnitt})`, async ({ page }) => {
    await page.goto("/");
    const karte = page.getByRole("region", { name: abschnitt }).getByRole("article");

    await expect(karte).toHaveCSS("border-top-color", edge);
    await karte.getByRole("button", { name: "Folgen" }).hover();
    await expect(karte).toHaveCSS("border-top-color", accent);
  });
}
