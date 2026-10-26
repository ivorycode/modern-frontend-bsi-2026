import { roundToFiveRappen } from "./rounding.ts";

// Fiktive Tarifregeln für die Übung, keine echten Prämien.

export type AgeGroup = "child" | "youngAdult" | "adult";
export type Model = "standard" | "familyDoctor";

export interface PremiumInput {
  age: number;
  deductible: number;
  model: Model;
  dental: boolean;
}

export interface Premium {
  monthly: number;
  yearly: number;
}

const BASE_PREMIUM: Record<AgeGroup, number> = {
  child: 104.65,
  youngAdult: 329.8,
  adult: 437.35,
};

/** Franchise in CHF → monatlicher Rabatt in CHF */
const CHILD_DEDUCTIBLES: Record<number, number> = { 0: 0, 300: 15, 600: 30 };
const ADULT_DEDUCTIBLES: Record<number, number> = { 300: 0, 1000: 40, 2000: 90, 2500: 115 };

const DEDUCTIBLE_DISCOUNT: Record<AgeGroup, Record<number, number>> = {
  child: CHILD_DEDUCTIBLES,
  youngAdult: ADULT_DEDUCTIBLES,
  adult: ADULT_DEDUCTIBLES,
};

const MODEL_DISCOUNT_RATE: Record<Model, number> = {
  standard: 0,
  familyDoctor: 0.08,
};

const DENTAL_SUPPLEMENT = 21.3;

export function ageGroup(age: number): AgeGroup {
  if (!Number.isInteger(age) || age < 0 || age > 120) {
    throw new RangeError(`Ungültiges Alter: ${age}`);
  }
  if (age <= 18) return "child";
  if (age <= 25) return "youngAdult";
  return "adult";
}

/** Erlaubte Franchisen für ein Alter, aufsteigend sortiert. */
export function allowedDeductibles(age: number): number[] {
  return Object.keys(DEDUCTIBLE_DISCOUNT[ageGroup(age)])
    .map(Number)
    .sort((a, b) => a - b);
}

export function calculatePremium(input: PremiumInput): Premium {
  const group = ageGroup(input.age);
  const discount = DEDUCTIBLE_DISCOUNT[group][input.deductible];
  if (discount === undefined) {
    throw new RangeError(`Franchise ${input.deductible} ist für dieses Alter nicht erlaubt`);
  }

  const afterDeductible = BASE_PREMIUM[group] - discount;
  const afterModel = afterDeductible * (1 - MODEL_DISCOUNT_RATE[input.model]);
  const monthly = roundToFiveRappen(afterModel + (input.dental ? DENTAL_SUPPLEMENT : 0));

  return { monthly, yearly: roundToFiveRappen(monthly * 12) };
}
