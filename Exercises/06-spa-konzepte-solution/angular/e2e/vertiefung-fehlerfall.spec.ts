import { expect, test } from "@playwright/test";

// Vertiefung c: Fehlerfall im Ablauftest. Die Antwort von GET /api/claims wird im
// Browser durch einen Status 500 ersetzt; die echte API bleibt unberührt.

test("meldet einen Serverfehler in der Liste", async ({ page }) => {
  // page.route muss vor page.goto stehen. Das Muster passt nur auf die Liste,
  // nicht auf /api/claims/4.
  await page.route("**/api/claims", (route) =>
    route.fulfill({ status: 500, json: { message: "Datenbank nicht erreichbar" } }),
  );

  await page.goto("/");

  await expect(page.getByRole("alert")).toContainText("HTTP-Status 500");
});
