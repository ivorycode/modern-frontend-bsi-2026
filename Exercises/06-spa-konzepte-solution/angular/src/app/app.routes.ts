import type { Routes } from "@angular/router";
import { ClaimDetailPage } from "./pages/claim-detail-page";
import { ClaimListPage } from "./pages/claim-list-page";
import { NotFoundPage } from "./pages/not-found-page";

/** Routen der Anwendung. */
export const routes: Routes = [
  { path: "", component: ClaimListPage },
  { path: "claims/:id", component: ClaimDetailPage },
  { path: "**", component: NotFoundPage },
];
