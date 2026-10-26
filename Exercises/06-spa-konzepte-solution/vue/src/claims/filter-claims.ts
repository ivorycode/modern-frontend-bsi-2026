import type { ClaimSummary } from "./claim.ts";

/**
 * Filtert Schadenfälle nach einem Suchbegriff. Gesucht wird in Titel,
 * Kundenname und Schadennummer, ohne Rücksicht auf Gross- und Kleinschreibung.
 * Leerzeichen am Anfang und Ende des Suchbegriffs werden ignoriert; ein leerer
 * Suchbegriff liefert alle Schadenfälle.
 */
export function filterClaims(claims: readonly ClaimSummary[], query: string): ClaimSummary[] {
  const needle = query.trim().toLowerCase();
  if (needle === "") return [...claims];
  return claims.filter((claim) =>
    [claim.title, claim.customer, claim.number].some((text) => text.toLowerCase().includes(needle)),
  );
}
