import { defineConfig } from "vite-plus";

export default defineConfig({
  test: {
    environment: "jsdom",
    // Nur Unit-Tests; die Playwright-Tests in e2e/ laufen mit `pnpm run e2e`.
    include: ["src/**/*.test.ts"],
  },
  fmt: {},
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
});
