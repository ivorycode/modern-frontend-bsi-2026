// Vertiefung 2: Tests für Meldungen pro Anmeldung und Feld.
import { describe, expect, it } from "vite-plus/test";
import { parseRegistrations } from "./registration.vertiefung-2.ts";

describe("parseRegistrations mit Meldung pro Anmeldung und Feld", () => {
  it("akzeptiert eine leere Liste", () => {
    expect(parseRegistrations([])).toEqual({ success: true, registrations: [] });
  });

  it("nennt Anmeldung und Feld, wenn der Name fehlt", () => {
    const input = [
      { id: 1, name: "Anna Meier", email: "anna.meier@example.ch", status: "confirmed" },
      { id: 2, name: "Luca Rossi", email: "luca.rossi@example.ch", status: "waitlist" },
      { id: 3, email: "sophie.keller@example.ch", status: "confirmed" },
    ];

    expect(parseRegistrations(input)).toEqual({
      success: false,
      message: "Anmeldung 3, Feld «name»: Ungültige Eingabe: erwartet string, erhalten undefined",
    });
  });

  it("nennt Anmeldung und Feld bei einer Anmeldenummer als Text", () => {
    const input = [
      { id: "1", name: "Anna Meier", email: "anna.meier@example.ch", status: "confirmed" },
    ];

    expect(parseRegistrations(input)).toEqual({
      success: false,
      message: expect.stringContaining("Anmeldung 1, Feld «id»"),
    });
  });

  it("meldet allgemein, wenn die Antwort keine Liste ist", () => {
    expect(parseRegistrations({ registrations: [] })).toEqual({
      success: false,
      message: expect.not.stringContaining("Anmeldung"),
    });
  });
});
