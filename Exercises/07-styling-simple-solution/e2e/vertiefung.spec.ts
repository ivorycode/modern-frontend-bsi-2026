import { expect, test } from "@playwright/test";

// Vertiefungen a und b. Die Container Query ist nur in der Fassung mit CSS Modules umgesetzt.

const accent = "rgb(47, 111, 237)";
const edge = "rgb(217, 221, 227)";

test("Vertiefung a: Layout hängt von der Breite des Containers ab, nicht des Fensters", async ({
  page,
}) => {
  const karte = page
    .getByRole("region", { name: "Übung · ProfileCard (CSS Modules)" })
    .getByRole("article");

  // Breites Fenster: mehrere Spalten, die Karte ist schmaler als 300px.
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await expect(karte).toHaveCSS("text-align", "center");

  // Schmaleres Fenster: nur eine Spalte, die Karte ist breiter als 300px.
  await page.setViewportSize({ width: 500, height: 900 });
  await expect(karte).toHaveCSS("text-align", "start");
});

for (const abschnitt of ["Übung · ProfileCard (CSS Modules)", "Übung · ProfileCard (Tailwind)"]) {
  test(`Vertiefung b: Rahmen beim Hover über «Folgen» (${abschnitt})`, async ({ page }) => {
    await page.goto("/");
    const karte = page.getByRole("region", { name: abschnitt }).getByRole("article");

    await expect(karte).toHaveCSS("border-top-color", edge);
    await karte.getByRole("button", { name: "Folgen" }).hover();
    await expect(karte).toHaveCSS("border-top-color", accent);
  });
}
