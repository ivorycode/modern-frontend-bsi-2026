// Zugriff auf die Schadenfall-API. Die relativen URLs gehen an den
// Entwicklungsserver, der /api an die API weiterleitet (siehe vite.config.ts).

import type { Claim, ClaimSummary } from "./claim.ts";

/** Die API kennt keinen Schadenfall mit dieser ID (HTTP-Status 404). */
export class ClaimNotFoundError extends Error {}

export async function fetchClaims(signal?: AbortSignal): Promise<ClaimSummary[]> {
  const response = await fetch("/api/claims", { signal });
  if (!response.ok) {
    throw new Error(
      `Die Schadenfälle konnten nicht geladen werden (HTTP-Status ${response.status}).`,
    );
  }
  // Die API gehört zur Übung und liefert den vereinbarten Datenvertrag. Auf die
  // Prüfung mit Zod wie in Übung 4 und 5 wird hier bewusst verzichtet.
  const claims: ClaimSummary[] = await response.json();
  return claims;
}

export async function fetchClaim(id: string, signal?: AbortSignal): Promise<Claim> {
  const response = await fetch(`/api/claims/${encodeURIComponent(id)}`, { signal });
  if (response.status === 404) {
    throw new ClaimNotFoundError(`Es gibt keinen Schadenfall mit der ID ${id}.`);
  }
  if (!response.ok) {
    throw new Error(
      `Der Schadenfall konnte nicht geladen werden (HTTP-Status ${response.status}).`,
    );
  }
  const claim: Claim = await response.json();
  return claim;
}
