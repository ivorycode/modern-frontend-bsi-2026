// Detailansicht eines Schadenfalls – noch nicht fertig und noch keiner Route zugeordnet.
//
// Vorbereitet sind:
// - die Funktion `claimResource(id)` in ../claims/claim-resources.ts (lädt GET /api/claims/:id),
//   dazu `isNotFound(error)` und `loadErrorMessage(error, prefix)`,
// - die Komponente `ClaimDetails` in ../components/claim-details.ts (zeigt einen Schadenfall).
//
// Schritt 4 der Anleitung beschreibt, was hier fehlt.

import { Component } from "@angular/core";

@Component({
  selector: "app-claim-detail-page",
  template: `<p>Die Detailansicht ist noch nicht umgesetzt.</p>`,
})
export class ClaimDetailPage {}
