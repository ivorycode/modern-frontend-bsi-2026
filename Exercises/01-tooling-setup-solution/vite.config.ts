import { defineConfig } from "vite-plus";

export default defineConfig({
  // Fester Port, damit die Musterlösung parallel zur Übung (Port 5173) laufen kann.
  server: { port: 5273, strictPort: true },
  test: {
    // Nur Unit-Tests; die Playwright-Tests in e2e/ laufen mit `npm run e2e`.
    include: ["src/**/*.test.ts"],
  },
  // Zusatz zu Schritt 1.4 (experimenteller Bundled Dev Mode, dauerhaft aktiviert):
  // experimental: { bundledDev: true },
  fmt: {},
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
});
