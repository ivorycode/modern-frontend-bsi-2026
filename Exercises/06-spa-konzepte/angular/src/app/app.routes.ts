import type { Routes } from "@angular/router";
import { ClaimListPage } from "./pages/claim-list-page";
import { NotFoundPage } from "./pages/not-found-page";

/** Routen der Anwendung. */
export const routes: Routes = [
  { path: "", component: ClaimListPage },
  { path: "**", component: NotFoundPage },
];
