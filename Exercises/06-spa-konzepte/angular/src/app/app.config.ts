import { provideHttpClient, withFetch } from "@angular/common/http";
import { type ApplicationConfig, provideBrowserGlobalErrorListeners } from "@angular/core";
import { provideRouter, withComponentInputBinding } from "@angular/router";
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Clientseitiges Routing mit der History API (echte Pfade wie /claims/4).
    // withComponentInputBinding: Routenparameter und Query-Parameter kommen als
    // Inputs in die Komponente der Route, z. B. `id = input<string>()`.
    provideRouter(routes, withComponentInputBinding()),
    // HttpClient (für httpResource) verwendet fetch.
    provideHttpClient(withFetch()),
  ],
};
