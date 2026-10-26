import { describe, expect, it } from "vite-plus/test";
import { roundToFiveRappen } from "./rounding.ts";

describe("roundToFiveRappen", () => {
  it("rundet 1.02 auf 1.00 ab", () => {
    // Arrange: Ausgangswert vorbereiten
    const amount = 1.02;

    // Act: die zu prüfende Funktion aufrufen
    const rounded = roundToFiveRappen(amount);

    // Assert: Ergebnis mit der Erwartung vergleichen
    expect(rounded).toBe(1);
  });

  it("rundet 1.03 auf 1.05 auf", () => {
    expect(roundToFiveRappen(1.03)).toBe(1.05);
  });

  it("rundet mehrere Beträge", () => {
    const amounts = [4.99, 7.21, 12.38];

    expect(amounts.map(roundToFiveRappen)).toEqual([5, 7.2, 12.4]);
  });

  it("lehnt negative Beträge ab", () => {
    expect(() => roundToFiveRappen(-1)).toThrow(RangeError);
  });
});
