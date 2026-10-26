import { Component, input } from "@angular/core";
import {
  type Claim,
  categoryLabels,
  formatAmount,
  formatDate,
  statusLabels,
} from "../claims/claim";

/** Zeigt alle Angaben eines Schadenfalls. Reine Darstellung: Die Daten kommen als Input. */
@Component({
  selector: "app-claim-details",
  templateUrl: "./claim-details.html",
})
export class ClaimDetails {
  readonly claim = input.required<Claim>();

  protected readonly statusLabels = statusLabels;
  protected readonly categoryLabels = categoryLabels;
  protected readonly formatDate = formatDate;
  protected readonly formatAmount = formatAmount;
}
