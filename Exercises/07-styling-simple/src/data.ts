export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

export const proPlan: PricingPlan = {
  name: "Pro",
  price: "CHF 29",
  period: "pro Monat",
  features: ["Unbegrenzte Projekte", "10 GB Speicher", "Prioritäts-Support", "Team-Funktionen"],
  cta: "Jetzt starten",
  highlighted: true,
};
