// Vertiefung 3: Den Zwischenzustand `loading` ohne echte Wartezeit testen.
import { describe, expect, it } from "vite-plus/test";
import { loadRegistrations, type ViewState } from "./load-registrations.ts";

const anna = {
  id: 1,
  name: "Anna Meier",
  email: "anna.meier@example.ch",
  status: "confirmed",
  seat: 3,
};

describe("loadRegistrations", () => {
  it("meldet «loading», bevor die Antwort eintrifft", async () => {
    const { promise, resolve } = Promise.withResolvers<Response>();
    const states: ViewState[] = [];

    const loading = loadRegistrations(
      "/api/test.json",
      () => promise,
      (state) => states.push(state),
    );

    expect(states).toEqual([{ kind: "loading" }]);

    resolve(Response.json([anna]));
    await loading;

    expect(states).toEqual([{ kind: "loading" }, { kind: "success", registrations: [anna] }]);
  });
});
