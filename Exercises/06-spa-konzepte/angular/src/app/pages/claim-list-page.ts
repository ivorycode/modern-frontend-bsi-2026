import { Component, effect, signal } from "@angular/core";
import { type ClaimSummary, formatDate, statusLabels } from "../claims/claim";
import { claimsResource, loadErrorMessage } from "../claims/claim-resources";

/** Startseite: Liste aller Schadenfälle mit Suche. */
@Component({
  selector: "app-claim-list-page",
  templateUrl: "./claim-list-page.html",
})
export class ClaimListPage {
  protected readonly claims = claimsResource();

  /** Suchbegriff aus dem Eingabefeld */
  protected readonly query = signal("");

  /** Liste, die in der Tabelle angezeigt wird */
  protected readonly filteredClaims = signal<ClaimSummary[]>([]);

  constructor() {
    // Sobald die Schadenfälle geladen sind, die Tabelle füllen.
    effect(() => {
      if (this.claims.hasValue()) this.filteredClaims.set(this.claims.value());
    });
  }

  protected onQueryInput(value: string): void {
    this.query.set(value);
    if (this.claims.hasValue()) {
      this.filteredClaims.set(
        this.claims
          .value()
          .filter((claim) => claim.title.toLowerCase().includes(value.toLowerCase())),
      );
    }
  }

  protected readonly statusLabels = statusLabels;
  protected readonly formatDate = formatDate;
  protected readonly loadErrorMessage = loadErrorMessage;
}
