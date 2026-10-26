import { describe, expect, it } from "vite-plus/test";
import { allowedDeductibles, calculatePremium } from "./premium.ts";

describe("calculatePremium", () => {
  it("berechnet die Grundprämie für Erwachsene ohne Rabatte", () => {
    const premium = calculatePremium({
      age: 40,
      deductible: 300,
      model: "standard",
      dental: false,
    });

    expect(premium).toEqual({ monthly: 437.35, yearly: 5248.2 });
  });

  it("berücksichtigt Franchise, Hausarztmodell und Zahnversicherung", () => {
    const premium = calculatePremium({
      age: 40,
      deductible: 2500,
      model: "familyDoctor",
      dental: true,
    });

    // (437.35 - 115) * 0.92 + 21.30 = 317.862 → 317.85
    expect(premium.monthly).toBe(317.85);
    expect(premium.yearly).toBe(3814.2);
  });

  it("berechnet die Prämie für Kinder", () => {
    const premium = calculatePremium({
      age: 10,
      deductible: 600,
      model: "familyDoctor",
      dental: true,
    });

    expect(premium.monthly).toBe(90);
  });

  it("lehnt eine Franchise ab, die für Kinder nicht erlaubt ist", () => {
    expect(() =>
      calculatePremium({ age: 10, deductible: 2500, model: "standard", dental: false }),
    ).toThrow(RangeError);
  });
});

describe("allowedDeductibles", () => {
  it("bietet Kindern tiefere Franchisen an als Erwachsenen", () => {
    expect(allowedDeductibles(10)).toEqual([0, 300, 600]);
    expect(allowedDeductibles(40)).toEqual([300, 1000, 2000, 2500]);
  });
});
