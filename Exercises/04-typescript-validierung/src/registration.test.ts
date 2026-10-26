import { describe, expect, it } from "vite-plus/test";
import { nextId, type Registration } from "./registration.ts";

const registrations: Registration[] = [
  { id: 1, name: "Anna Meier", email: "anna.meier@example.ch", status: "confirmed", seat: 3 },
  { id: 2, name: "Luca Rossi", email: "luca.rossi@example.ch", status: "waitlist" },
];

describe("nextId", () => {
  it("ist eins höher als die höchste Anmeldenummer", () => {
    expect(nextId(registrations)).toBe(3);
  });

  it("ist 1 bei einer leeren Liste", () => {
    expect(nextId([])).toBe(1);
  });
});

// Teil 2: Tests für parseRegistrations ergänzen.
describe("parseRegistrations", () => {
  it.todo("akzeptiert gültige Anmeldungen");
  it.todo("akzeptiert eine leere Liste");
  it.todo("lehnt eine Anmeldung ohne Namen ab");
  it.todo("lehnt eine Anmeldenummer als Text ab");
});
