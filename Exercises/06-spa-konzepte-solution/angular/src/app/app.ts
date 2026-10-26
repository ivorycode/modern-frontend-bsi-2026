import { Component } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";

/** Rahmen für alle Seiten; `<router-outlet />` zeigt die Seite der aktuellen Route. */
@Component({
  selector: "app-root",
  imports: [RouterLink, RouterOutlet],
  templateUrl: "./app.html",
})
export class App {}
