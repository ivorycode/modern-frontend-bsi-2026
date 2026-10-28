import tailwindcss from "@tailwindcss/vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig, lazyPlugins } from "vite-plus";

export default defineConfig({
  plugins: lazyPlugins(() => [react(), tailwindcss(), vanillaExtractPlugin()]),
  // Eigener Port, damit die Übung neben anderen Übungen laufen kann.
  server: { port: 5277, strictPort: true },
  preview: { port: 5277, strictPort: true },
  test: {
    // Diese Übung hat keine Unit-Tests; geprüft wird mit Playwright (`npm run e2e`).
    include: ["src/**/*.test.ts"],
    passWithNoTests: true,
  },
  fmt: {},
  lint: {
    plugins: ["react", "typescript", "oxc"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: {
      "react/rules-of-hooks": "error",
      "vite-plus/prefer-vite-plus-imports": "error",
    },
    options: { typeAware: true, typeCheck: true },
  },
});
