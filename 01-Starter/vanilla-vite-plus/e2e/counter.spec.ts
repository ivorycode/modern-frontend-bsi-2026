import { expect, test } from "@playwright/test";

test("Counter zählt bei Klick hoch", async ({ page }) => {
  await page.goto("/");

  const counter = page.getByRole("button", { name: /Count is/ });
  await expect(counter).toHaveText("Count is 0");

  await counter.click();
  await counter.click();
  await expect(counter).toHaveText("Count is 2");
});
