import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  use: {
    baseURL: "http://localhost:5283",
    // Das installierte Chrome verwenden; kein Browser-Download nötig.
    channel: "chrome",
    trace: "retain-on-failure",
  },
  // Startet die Schadenfall-API und den Entwicklungsserver, falls sie nicht schon laufen.
  webServer: [
    {
      command: "npm run api",
      url: "http://localhost:3283/api/claims",
      reuseExistingServer: true,
    },
    {
      command: "npm run dev",
      url: "http://localhost:5283",
      reuseExistingServer: true,
    },
  ],
});
