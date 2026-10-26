import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-not-found-page",
  imports: [RouterLink],
  template: `
    <h1>Seite nicht gefunden</h1>
    <p>Diese Adresse gibt es nicht. <a routerLink="/">Zur Übersicht</a></p>
  `,
})
export class NotFoundPage {}
