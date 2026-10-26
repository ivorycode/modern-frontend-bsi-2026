import { defineConfig } from "vite-plus";

export default defineConfig({
  // Eigener Port, damit die Übung neben anderen Übungen laufen kann.
  // Die Geräte-API (`npm run api`) läuft separat auf Port 3005.
  server: { port: 5177, strictPort: true },
  test: {
    // Nur Unit-Tests; die Playwright-Tests in e2e/ laufen mit `npm run e2e`.
    include: ["src/**/*.test.ts"],
    // Startet Mock Service Worker für alle Tests, siehe src/test-setup.ts.
    setupFiles: ["src/test-setup.ts"],
  },
  fmt: {},
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
});
