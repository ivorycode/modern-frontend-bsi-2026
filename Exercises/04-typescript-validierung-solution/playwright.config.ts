import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  use: {
    baseURL: "http://localhost:5276",
    // Das installierte Chrome verwenden; kein Browser-Download nötig.
    channel: "chrome",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5276",
    reuseExistingServer: true,
  },
});
