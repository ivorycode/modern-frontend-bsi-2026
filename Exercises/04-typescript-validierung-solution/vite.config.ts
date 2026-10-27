import { defineConfig } from "vite-plus";

export default defineConfig({
  // Kein SPA-Fallback: Eine nicht vorhandene Datei liefert 404 statt index.html.
  appType: "mpa",
  // Eigener Port, damit die Übung neben anderen Übungen laufen kann.
  server: { port: 5276, strictPort: true },
  test: {
    // Nur Unit-Tests; die Playwright-Tests in e2e/ laufen mit `npm run e2e`.
    include: ["src/**/*.test.ts"],
  },
  fmt: {},
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
});
