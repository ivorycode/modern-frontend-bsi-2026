import { expect, test } from "@playwright/test";

// Vertiefung c: Fehlerfall im Ablauftest. Statt der echten API liefert `page.route`
// für die Liste einen Status 500. So lässt sich ein Serverfehler reproduzierbar prüfen.

test("meldet einen Serverfehler in der Liste", async ({ page }) => {
  // Vor page.goto registrieren; das Muster passt nur auf die Liste, nicht auf /api/claims/4.
  await page.route("**/api/claims", (route) =>
    route.fulfill({ status: 500, json: { message: "Datenbank nicht erreichbar" } }),
  );

  await page.goto("/");

  await expect(page.getByRole("alert")).toContainText("HTTP-Status 500");
});
