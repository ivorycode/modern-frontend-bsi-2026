import { describe, expect, test } from "vitest";
import type { ClaimSummary } from "./claim";
import { filterClaims } from "./filter-claims";

const claims: ClaimSummary[] = [
  {
    id: 1,
    number: "S-2026-0101",
    title: "Wasserschaden in der Küche",
    customer: "Anna Meier",
    status: "offen",
    reportedOn: "2026-09-02",
  },
  {
    id: 3,
    number: "S-2026-0103",
    title: "Gestohlenes Velo",
    customer: "Lea Schneider",
    status: "abgeschlossen",
    reportedOn: "2026-09-11",
  },
  {
    id: 4,
    number: "S-2026-0104",
    title: "Glasbruch Wohnzimmerfenster",
    customer: "Peter Meier",
    status: "abgeschlossen",
    reportedOn: "2026-09-14",
  },
];

const ids = (result: ClaimSummary[]) => result.map((claim) => claim.id);

describe("filterClaims", () => {
  test("liefert bei leerem Suchbegriff alle Schadenfälle", () => {
    expect(ids(filterClaims(claims, ""))).toEqual([1, 3, 4]);
  });

  test("findet Schadenfälle über den Titel, unabhängig von Gross- und Kleinschreibung", () => {
    expect(ids(filterClaims(claims, "VELO"))).toEqual([3]);
  });

  test("findet Schadenfälle über den Kundennamen", () => {
    expect(ids(filterClaims(claims, "meier"))).toEqual([1, 4]);
  });

  test.todo("findet Schadenfälle über die Schadennummer");

  test.todo("ignoriert Leerzeichen am Anfang und Ende des Suchbegriffs");
});
