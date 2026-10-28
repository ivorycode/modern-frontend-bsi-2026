import { expect, test, type Page } from "@playwright/test";

// Prüft die Abnahmekriterien der Aufgaben 1 und 2: Die Karte verwendet die Design Tokens aus
// src/index.css und färbt deshalb im dunklen Farbschema um, ohne eigenes Dark-Mode-CSS.
// Erwartet werden die berechneten Werte der Tokens (Hex-Werte aus src/index.css als RGB).

const tokens = {
  hell: {
    surface: "rgb(255, 255, 255)",
    ink: "rgb(26, 34, 51)",
    inkMuted: "rgb(91, 100, 114)",
    accent: "rgb(47, 111, 237)",
    accentContrast: "rgb(255, 255, 255)",
    edge: "rgb(217, 221, 227)",
    online: "rgb(47, 191, 113)",
  },
  dunkel: {
    surface: "rgb(28, 35, 51)",
    ink: "rgb(238, 241, 246)",
    inkMuted: "rgb(154, 164, 181)",
    accent: "rgb(122, 162, 255)",
    accentContrast: "rgb(16, 24, 43)",
    edge: "rgb(50, 60, 82)",
    online: "rgb(61, 220, 132)",
  },
};

const varianten = [
  { aufgabe: "Aufgabe 1", abschnitt: "Übung · ProfileCard (CSS Modules)" },
  { aufgabe: "Aufgabe 2", abschnitt: "Übung · ProfileCard (Tailwind)" },
];

async function expectTokens(page: Page, abschnitt: string, farben: (typeof tokens)["hell"]) {
  const karte = page.getByRole("region", { name: abschnitt }).getByRole("article");

  await expect(karte).toHaveCSS("background-color", farben.surface);
  await expect(karte).toHaveCSS("color", farben.ink);
  await expect(karte).toHaveCSS("border-top-color", farben.edge);
  await expect(karte.getByText("SK", { exact: true })).toHaveCSS("background-color", farben.accent);
  await expect(karte.getByText("SK", { exact: true })).toHaveCSS("color", farben.accentContrast);
  await expect(karte.getByRole("img", { name: "online" })).toHaveCSS(
    "background-color",
    farben.online,
  );
  await expect(karte.getByText("Frontend Engineer")).toHaveCSS("color", farben.inkMuted);
  await expect(karte.getByRole("listitem").filter({ hasText: "React" })).toHaveCSS(
    "border-top-color",
    farben.edge,
  );
  await expect(karte.getByRole("button", { name: "Folgen" })).toHaveCSS(
    "background-color",
    farben.accent,
  );
  await expect(karte.getByRole("button", { name: "Folgen" })).toHaveCSS(
    "color",
    farben.accentContrast,
  );
}

for (const { aufgabe, abschnitt } of varianten) {
  test(`${aufgabe}: verwendet die Design Tokens im hellen Farbschema`, async ({ page }) => {
    await page.goto("/");
    await expectTokens(page, abschnitt, tokens.hell);
  });

  test(`${aufgabe}: färbt im dunklen Farbschema um`, async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Dark Mode" }).click();
    await expectTokens(page, abschnitt, tokens.dunkel);
  });
}
