import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  use: {
    baseURL: "http://localhost:5278",
    // Das installierte Chrome verwenden; kein Browser-Download nötig.
    channel: "chrome",
    trace: "retain-on-failure",
  },
  expect: {
    toHaveScreenshot: {
      // Kleine Toleranz für Kantenglättung; Verschiebungen um wenige Pixel fallen auf.
      maxDiffPixelRatio: 0.001,
    },
  },
  // Drei Breiten: mobil, knapp unter dem Breakpoint von 50rem (800px) und Desktop.
  projects: [
    { name: "mobil", use: { viewport: { width: 375, height: 800 } } },
    { name: "grenzfall", use: { viewport: { width: 784, height: 900 } } },
    { name: "desktop", use: { viewport: { width: 1280, height: 900 } } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5278",
    reuseExistingServer: true,
  },
});
