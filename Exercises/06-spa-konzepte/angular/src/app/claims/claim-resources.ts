// Serverzustand: Laden, Fehler und Daten der API mit httpResource.
//
// Die relativen URLs gehen an den Entwicklungsserver, der /api an die API
// weiterleitet (proxy.conf.json). httpResource lädt neu, sobald sich ein Signal
// ändert, das die URL-Funktion liest.
//
// Die Funktionen müssen im Injection Context aufgerufen werden, z. B. bei der
// Initialisierung eines Felds einer Komponente.

import { HttpErrorResponse, httpResource } from "@angular/common/http";
import type { Claim, ClaimSummary } from "./claim";

/** Lädt die Liste der Schadenfälle; `reload()` lädt sie erneut. */
export function claimsResource() {
  // Die API gehört zur Übung und liefert den vereinbarten Datenvertrag. Auf die
  // Prüfung mit Zod wie in Übung 4 und 5 wird hier bewusst verzichtet.
  return httpResource<ClaimSummary[]>(() => "/api/claims");
}

/** Lädt einen Schadenfall; lädt neu, wenn sich `id()` ändert. */
export function claimResource(id: () => string) {
  return httpResource<Claim>(() => `/api/claims/${encodeURIComponent(id())}`);
}

/** Meldet die API, dass es den Schadenfall nicht gibt (HTTP-Status 404)? */
export function isNotFound(error: unknown): boolean {
  return error instanceof HttpErrorResponse && error.status === 404;
}

/** Meldung für die Anzeige, z. B. «Die Schadenfälle konnten nicht geladen werden (HTTP-Status 500).» */
export function loadErrorMessage(error: unknown, prefix: string): string {
  return error instanceof HttpErrorResponse && error.status > 0
    ? `${prefix} (HTTP-Status ${error.status}).`
    : `${prefix}.`;
}
