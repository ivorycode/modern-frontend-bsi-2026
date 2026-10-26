/**
 * Rundet einen Betrag in CHF auf 5 Rappen.
 *
 * - Auf das nächstgelegene Vielfache von 0.05 runden.
 * - Ab genau 2.5 Rappen wird aufgerundet.
 * - Negative oder nicht endliche Beträge lösen einen RangeError aus.
 */
export function roundToFiveRappen(amount: number): number {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new RangeError(`Ungültiger Betrag: ${amount}`);
  }
  return Math.round(amount * 20) / 20;
}
