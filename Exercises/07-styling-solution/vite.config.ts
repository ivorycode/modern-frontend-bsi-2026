import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite-plus";

export default defineConfig({
  plugins: [tailwindcss()],
  // Eigener Port, damit die Übung neben anderen Übungen laufen kann.
  server: { port: 5178, strictPort: true },
  build: {
    rollupOptions: {
      // Zwei Seiten: die umzustellende Seite und die unveränderte CSS-Fassung zum Vergleich.
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        cssReferenz: resolve(import.meta.dirname, "css-referenz/index.html"),
      },
    },
  },
  test: {
    // Diese Übung hat keine Unit-Tests; geprüft wird mit Playwright (`npm run e2e`).
    include: ["src/**/*.test.ts"],
    passWithNoTests: true,
  },
  fmt: {},
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
});
