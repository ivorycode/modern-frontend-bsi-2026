// Datenvertrag der Schadenfall-API (server/api.ts) und Hilfen für die Anzeige.

export type ClaimStatus = "offen" | "in-pruefung" | "abgeschlossen";
export type ClaimCategory = "hausrat" | "motorfahrzeug" | "haftpflicht" | "reise";

/** Eintrag der Liste, wie ihn `GET /api/claims` liefert. */
export interface ClaimSummary {
  id: number;
  number: string;
  title: string;
  customer: string;
  status: ClaimStatus;
  /** Datum im Format `YYYY-MM-DD`. */
  reportedOn: string;
}

/** Schadenfall mit allen Angaben, wie ihn `GET /api/claims/:id` liefert. */
export interface Claim extends ClaimSummary {
  category: ClaimCategory;
  /** Geschätzter Schadenbetrag in CHF. */
  amount: number;
  description: string;
}

export const statusLabels: Record<ClaimStatus, string> = {
  offen: "Offen",
  "in-pruefung": "In Prüfung",
  abgeschlossen: "Abgeschlossen",
};

export const categoryLabels: Record<ClaimCategory, string> = {
  hausrat: "Hausrat",
  motorfahrzeug: "Motorfahrzeug",
  haftpflicht: "Privathaftpflicht",
  reise: "Reise",
};

const dateFormat = new Intl.DateTimeFormat("de-CH", { dateStyle: "medium" });
const amountFormat = new Intl.NumberFormat("de-CH", { style: "currency", currency: "CHF" });

/** `2026-09-02` → `02.09.2026` */
export function formatDate(isoDate: string): string {
  return dateFormat.format(new Date(isoDate));
}

/** `7350.5` → `CHF 7’350.50` */
export function formatAmount(amount: number): string {
  return amountFormat.format(amount);
}
