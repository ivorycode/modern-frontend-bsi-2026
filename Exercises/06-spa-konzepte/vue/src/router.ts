import { createRouter, createWebHistory } from "vue-router";
import ClaimListPage from "./pages/ClaimListPage.vue";
import NotFoundPage from "./pages/NotFoundPage.vue";

/** Routen der Anwendung; clientseitiges Routing mit der History API (echte Pfade wie /claims/4). */
export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: ClaimListPage },
    { path: "/:pathMatch(.*)*", component: NotFoundPage },
  ],
});
