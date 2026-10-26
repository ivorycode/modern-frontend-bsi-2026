import { Component, computed, inject, input } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { formatDate, statusLabels } from "../claims/claim";
import { claimsResource, loadErrorMessage } from "../claims/claim-resources";
import { filterClaims } from "../claims/filter-claims";

/** Startseite: Liste aller Schadenfälle mit Suche. */
@Component({
  selector: "app-claim-list-page",
  imports: [RouterLink],
  templateUrl: "./claim-list-page.html",
})
export class ClaimListPage {
  private readonly router = inject(Router);

  protected readonly claims = claimsResource();

  /** Query-Parameter ?q=…, über withComponentInputBinding an die Komponente gebunden */
  readonly q = input<string>();

  /** URL-Zustand: Der Suchbegriff kommt aus der Adresse. */
  protected readonly query = computed(() => this.q() ?? "");

  /** Abgeleiteter Zustand: berechnet aus Liste und Suchbegriff, nie gespeichert. */
  protected readonly filteredClaims = computed(() =>
    this.claims.hasValue() ? filterClaims(this.claims.value(), this.query()) : [],
  );

  protected onQueryInput(value: string): void {
    // replaceUrl: Nicht jeder Tastendruck soll einen Eintrag in der History erzeugen.
    // null entfernt den Parameter aus der URL.
    void this.router.navigate([], { queryParams: { q: value || null }, replaceUrl: true });
  }

  protected readonly statusLabels = statusLabels;
  protected readonly formatDate = formatDate;
  protected readonly loadErrorMessage = loadErrorMessage;
}
