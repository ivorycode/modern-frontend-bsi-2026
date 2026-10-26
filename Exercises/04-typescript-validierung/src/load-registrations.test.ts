import { describe, expect, it } from "vite-plus/test";
import { loadRegistrations, type ViewState } from "./load-registrations.ts";

/** Attrappe für `fetch`, die ohne Netzwerk mit `body` antwortet. */
function respondWith(body: unknown, status = 200): typeof fetch {
  return () => Promise.resolve(Response.json(body, { status }));
}

const anna = {
  id: 1,
  name: "Anna Meier",
  email: "anna.meier@example.ch",
  status: "confirmed",
  seat: 3,
};

describe("loadRegistrations", () => {
  it("lädt gültige Anmeldungen", async () => {
    const state: ViewState = { isLoading: false };

    await loadRegistrations(state, "/api/test.json", respondWith([anna]), () => {});

    expect(state).toEqual({ isLoading: false, data: [anna] });
  });

  it("meldet einen HTTP-Fehler", async () => {
    const state: ViewState = { isLoading: false };

    await loadRegistrations(state, "/api/test.json", respondWith({}, 404), () => {});

    expect(state.isLoading).toBe(false);
    expect(state.error).toContain("404");
  });
});
