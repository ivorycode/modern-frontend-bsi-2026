import { expect, test } from "@playwright/test";

// Diese Tests verwenden nur, was Nutzerinnen und Nutzer sehen: Rollen, Beschriftungen
// und Texte. Sie laufen deshalb unverändert gegen die React-, Vue- und Angular-Variante.

test("zeigt die Startseite mit allen Schadenfällen", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Schadenfälle" })).toBeVisible();
  // Kopfzeile plus zehn Schadenfälle
  await expect(page.getByRole("row")).toHaveCount(11);
  await expect(page.getByText("10 von 10 Schadenfällen")).toBeVisible();
});

test("filtert die Liste nach dem Titel", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("10 von 10 Schadenfällen")).toBeVisible();

  await page.getByLabel("Suche").fill("wasserschaden");

  await expect(page.getByRole("row")).toHaveCount(3);
  await expect(page.getByText("2 von 10 Schadenfällen")).toBeVisible();
});

test("findet Schadenfälle auch über den Kundennamen (Schritt 3)", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Suche").fill("Meier");

  await expect(page.getByRole("cell", { name: "Anna Meier" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Peter Meier" })).toBeVisible();
  await expect(page.getByText("2 von 10 Schadenfällen")).toBeVisible();
});

test("übernimmt den Suchbegriff in die URL und behält ihn beim Neuladen (Schritte 2 und 3)", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByLabel("Suche").fill("velo");
  await expect(page).toHaveURL(/[?&]q=velo/);

  await page.reload();

  await expect(page.getByLabel("Suche")).toHaveValue("velo");
  await expect(page.getByText("1 von 10 Schadenfällen")).toBeVisible();
  await expect(page.getByRole("row")).toHaveCount(2);
});

test("zeigt einen Schadenfall bei direktem Aufruf der Detail-URL (Schritt 4)", async ({ page }) => {
  await page.goto("/claims/2");

  await expect(page.getByRole("heading", { name: "Auffahrunfall auf der A1" })).toBeVisible();
  await expect(page.getByText("Marco Rossi")).toBeVisible();
  await expect(page.getByText("Stossstange und Kühler beschädigt")).toBeVisible();
});

test("meldet eine unbekannte ID verständlich (Schritt 4)", async ({ page }) => {
  await page.goto("/claims/999");

  await expect(page.getByRole("heading", { name: "Schadenfall nicht gefunden" })).toBeVisible();
});

// Schritt 5: Diesen Test selbst schreiben und danach `test.fixme` durch `test` ersetzen.
test.fixme("behält den Filter nach Detailansicht und Zurück-Navigation", async ({ page }) => {
  await page.goto("/");

  // 1. Suchbegriff eingeben
  // 2. Einen Schadenfall in der gefilterten Liste anklicken
  // 3. Prüfen, dass die Detailansicht den Schadenfall zeigt
  // 4. Mit dem Zurück-Button des Browsers zurück navigieren
  // 5. Prüfen, dass Suchbegriff und gefilterte Liste noch da sind
});
