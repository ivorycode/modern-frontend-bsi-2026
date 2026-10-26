import { beforeEach, describe, expect, test } from "vite-plus/test";
import { setupCounter } from "./counter.ts";

describe("setupCounter", () => {
  let button: HTMLButtonElement;

  beforeEach(() => {
    button = document.createElement("button");
    setupCounter(button);
  });

  test("startet bei 0", () => {
    expect(button.textContent).toBe("Count is 0");
  });

  test("zählt bei jedem Klick um 1 hoch", () => {
    button.click();
    button.click();
    expect(button.textContent).toBe("Count is 2");
  });
});
