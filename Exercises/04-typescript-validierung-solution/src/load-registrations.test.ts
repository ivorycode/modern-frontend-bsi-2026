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

/** Lädt mit der Attrappe und sammelt alle gemeldeten Zustände. */
async function collectStates(fetchFn: typeof fetch): Promise<ViewState[]> {
  const states: ViewState[] = [];
  await loadRegistrations("/api/test.json", fetchFn, (state) => states.push(state));
  return states;
}

describe("loadRegistrations", () => {
  it("lädt gültige Anmeldungen", async () => {
    expect(await collectStates(respondWith([anna]))).toEqual([
      { kind: "loading" },
      { kind: "success", registrations: [anna] },
    ]);
  });

  it("meldet eine leere Liste", async () => {
    expect(await collectStates(respondWith([]))).toEqual([{ kind: "loading" }, { kind: "empty" }]);
  });

  it("meldet ungültige Daten", async () => {
    const withoutName = { ...anna, name: undefined };

    expect(await collectStates(respondWith([withoutName]))).toEqual([
      { kind: "loading" },
      { kind: "error", message: expect.stringContaining("[0].name") },
    ]);
  });

  it("meldet einen HTTP-Fehler", async () => {
    expect(await collectStates(respondWith({}, 404))).toEqual([
      { kind: "loading" },
      { kind: "error", message: expect.stringContaining("404") },
    ]);
  });

  it("meldet eine Exception von fetch", async () => {
    const failingFetch: typeof fetch = () => Promise.reject(new Error("Netzwerk nicht erreichbar"));

    expect(await collectStates(failingFetch)).toEqual([
      { kind: "loading" },
      { kind: "error", message: "Netzwerk nicht erreichbar" },
    ]);
  });
});
