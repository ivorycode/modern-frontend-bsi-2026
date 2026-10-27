import { resolve } from "node:path";
import { defineConfig } from "vite-plus";

export default defineConfig({
  // Eigener Port, damit die Übung neben anderen Übungen laufen kann.
  // Requests auf /api leitet der Entwicklungsserver an die Wort-API weiter
  // (`npm run api`, Port 3103). Für den Browser bleibt alles unter einem Origin.
  server: {
    port: 5275,
    strictPort: true,
    proxy: { "/api": "http://localhost:3103" },
  },
  // RxJS beim Start vorbereiten, damit die Suchseite nicht beim ersten Aufruf neu lädt.
  optimizeDeps: { include: ["rxjs"] },
  build: {
    rollupOptions: {
      // Zwei Seiten: die Wort-Übung und die Suche für die Vertiefung.
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        suche: resolve(import.meta.dirname, "suche.html"),
      },
    },
  },
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
