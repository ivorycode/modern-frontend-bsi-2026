import { describe, expect, it } from "vite-plus/test";
import { nextId, parseRegistrations, type Registration } from "./registration.ts";

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

describe("parseRegistrations", () => {
  it("akzeptiert gültige Anmeldungen", () => {
    expect(parseRegistrations(registrations)).toEqual({ success: true, registrations });
  });

  it("akzeptiert eine leere Liste", () => {
    expect(parseRegistrations([])).toEqual({ success: true, registrations: [] });
  });

  it("lehnt eine Anmeldung ohne Namen ab", () => {
    const input = [{ id: 1, email: "anna.meier@example.ch", status: "confirmed" }];

    expect(parseRegistrations(input)).toEqual({
      success: false,
      message: expect.stringContaining("[0].name"),
    });
  });

  it("lehnt eine Anmeldenummer als Text ab", () => {
    const input = [
      { id: "1", name: "Anna Meier", email: "anna.meier@example.ch", status: "confirmed" },
    ];

    expect(parseRegistrations(input)).toEqual({
      success: false,
      message: expect.stringContaining("[0].id"),
    });
  });
});
