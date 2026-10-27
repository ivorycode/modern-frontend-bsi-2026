import vue from "@vitejs/plugin-vue";
import { defineConfig, lazyPlugins } from "vite-plus";

export default defineConfig({
  plugins: lazyPlugins(() => [vue()]),
  // Eigener Port, damit die Varianten nebeneinander laufen können.
  // Requests auf /api leitet der Entwicklungsserver an die Schadenfall-API weiter
  // (`npm run api`, Port 3282). Für den Browser bleibt alles unter einem Origin.
  server: {
    port: 5282,
    strictPort: true,
    proxy: { "/api": "http://localhost:3282" },
  },
  preview: {
    port: 5282,
    strictPort: true,
    proxy: { "/api": "http://localhost:3282" },
  },
  test: {
    // Nur Unit-Tests; die Playwright-Tests in e2e/ laufen mit `npm run e2e`.
    include: ["src/**/*.test.ts"],
  },
  fmt: {},
  lint: {
    plugins: ["vue", "typescript", "oxc"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
});
