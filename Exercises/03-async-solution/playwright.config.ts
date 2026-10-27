import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  // Die Wort-API antwortet absichtlich langsam; sequenziell dauert ein Satz einige Sekunden.
  timeout: 30_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: "http://localhost:5275",
    // Das installierte Chrome verwenden; kein Browser-Download nötig.
    channel: "chrome",
    trace: "retain-on-failure",
  },
  // Startet die Wort-API und den Entwicklungsserver, falls sie nicht schon laufen.
  webServer: [
    {
      command: "npm run api",
      url: "http://localhost:3103/api/words",
      reuseExistingServer: true,
    },
    {
      command: "npm run dev",
      url: "http://localhost:5275",
      reuseExistingServer: true,
    },
  ],
});
