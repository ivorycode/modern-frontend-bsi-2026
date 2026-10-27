import react from "@vitejs/plugin-react";
import { defineConfig, lazyPlugins } from "vite-plus";

export default defineConfig({
  plugins: lazyPlugins(() => [react()]),
  // Eigener Port, damit die Varianten nebeneinander laufen können.
  // Requests auf /api leitet der Entwicklungsserver an die Schadenfall-API weiter
  // (`npm run api`, Port 3281). Für den Browser bleibt alles unter einem Origin.
  server: {
    port: 5281,
    strictPort: true,
    proxy: { "/api": "http://localhost:3281" },
  },
  preview: {
    port: 5281,
    strictPort: true,
    proxy: { "/api": "http://localhost:3281" },
  },
  test: {
    // Nur Unit-Tests; die Playwright-Tests in e2e/ laufen mit `npm run e2e`.
    include: ["src/**/*.test.ts"],
  },
  fmt: {},
  lint: {
    plugins: ["react", "typescript", "oxc"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: {
      "react/rules-of-hooks": "error",
      "react/exhaustive-deps": "warn",
      "vite-plus/prefer-vite-plus-imports": "error",
    },
    options: { typeAware: true, typeCheck: true },
  },
});
