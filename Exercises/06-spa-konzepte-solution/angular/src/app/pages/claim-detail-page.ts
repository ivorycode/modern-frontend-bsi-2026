import { Component, input } from "@angular/core";
import { claimResource, isNotFound, loadErrorMessage } from "../claims/claim-resources";
import { ClaimDetails } from "../components/claim-details";

/** Detailansicht eines Schadenfalls unter /claims/:id. */
@Component({
  selector: "app-claim-detail-page",
  imports: [ClaimDetails],
  templateUrl: "./claim-detail-page.html",
})
export class ClaimDetailPage {
  /** Routenparameter :id, über withComponentInputBinding gebunden: bei /claims/4 ist id() === "4" */
  readonly id = input.required<string>();

  /** Serverzustand: lädt neu, wenn sich die ID ändert. */
  protected readonly claim = claimResource(this.id);

  protected readonly isNotFound = isNotFound;
  protected readonly loadErrorMessage = loadErrorMessage;
}
