import { expect, test, type Locator } from "@playwright/test";

async function addItem(list: Locator, name: string) {
  await list.getByLabel("Artikel").fill(name);
  await list.getByRole("button", { name: "Hinzufügen" }).click();
}

test("Einträge erscheinen nur in ihrer eigenen Liste", async ({ page }) => {
  await page.goto("/");
  const weekly = page.getByRole("region", { name: "Wocheneinkauf" });
  const party = page.getByRole("region", { name: "Party" });

  await addItem(weekly, "Milch");
  await addItem(party, "Chips");

  await expect(weekly.getByRole("checkbox")).toHaveAccessibleName("Milch");
  await expect(party.getByRole("checkbox")).toHaveAccessibleName("Chips");
});

test("Abhaken lässt sich rückgängig machen", async ({ page }) => {
  await page.goto("/");
  const weekly = page.getByRole("region", { name: "Wocheneinkauf" });

  await addItem(weekly, "Milch");
  await weekly.getByRole("checkbox", { name: "Milch" }).check();
  await expect(weekly.getByText("0 von 1 offen")).toBeVisible();

  await weekly.getByRole("button", { name: "Rückgängig" }).click();

  await expect(weekly.getByRole("checkbox", { name: "Milch" })).not.toBeChecked();
  await expect(weekly.getByText("1 von 1 offen")).toBeVisible();
});
