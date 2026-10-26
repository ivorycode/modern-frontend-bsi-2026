// Vertiefung 1: Tests für die fachliche Regel zum Sitzplatz.
import { describe, expect, it } from "vite-plus/test";
import { parseRegistrations, seatLabel, type Registration } from "./registration.vertiefung-1.ts";

const anna: Registration = {
  id: 1,
  name: "Anna Meier",
  email: "anna.meier@example.ch",
  status: "confirmed",
  seat: 3,
};
const luca: Registration = {
  id: 2,
  name: "Luca Rossi",
  email: "luca.rossi@example.ch",
  status: "waitlist",
};
const registrations = [anna, luca];

describe("parseRegistrations mit Regel zum Sitzplatz", () => {
  it("akzeptiert gültige Anmeldungen", () => {
    expect(parseRegistrations(registrations)).toEqual({ success: true, registrations });
  });

  it("lehnt eine bestätigte Anmeldung ohne Sitzplatz ab", () => {
    const input = [
      { id: 1, name: "Anna Meier", email: "anna.meier@example.ch", status: "confirmed" },
    ];

    expect(parseRegistrations(input)).toEqual({
      success: false,
      message: expect.stringContaining("[0].seat"),
    });
  });

  it("lehnt einen Sitzplatz auf der Warteliste ab", () => {
    const input = [
      { id: 2, name: "Luca Rossi", email: "luca.rossi@example.ch", status: "waitlist", seat: 4 },
    ];

    expect(parseRegistrations(input)).toEqual({
      success: false,
      message: expect.stringContaining("seat"),
    });
  });

  it("lehnt einen unbekannten Status ab", () => {
    const input = [
      { id: 2, name: "Luca Rossi", email: "luca.rossi@example.ch", status: "pending" },
    ];

    expect(parseRegistrations(input)).toEqual({
      success: false,
      message: expect.stringContaining("[0].status"),
    });
  });
});

describe("seatLabel", () => {
  it("zeigt den Sitzplatz einer bestätigten Anmeldung", () => {
    expect(seatLabel(anna)).toBe("3");
  });

  it("zeigt einen Strich ohne Sitzplatz", () => {
    expect(seatLabel(luca)).toBe("–");
  });
});
