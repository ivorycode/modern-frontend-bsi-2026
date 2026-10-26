import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vite-plus/test";
import { loadDevices } from "./api.ts";
import { devices, DEVICES_URL } from "./mocks/handlers.ts";
import { server } from "./mocks/server.ts";

describe("loadDevices", () => {
  it("lädt die Geräteliste", async () => {
    // Antwort aus dem Standard-Handler in src/mocks/handlers.ts
    await expect(loadDevices(DEVICES_URL)).resolves.toEqual(devices);
  });

  it("lädt eine leere Liste", async () => {
    // Beispiel: Die Antwort nur für diesen Test überschreiben.
    server.use(http.get(DEVICES_URL, () => HttpResponse.json([])));

    await expect(loadDevices(DEVICES_URL)).resolves.toEqual([]);
  });

  // Teil 1: Tests für die Fehlerfälle ergänzen.
  it.todo("meldet HTTP 404");
  it.todo("meldet HTTP 500");
  it.todo("meldet eine Antwort, die kein JSON ist");
  it.todo("meldet Daten, die nicht zum Schema passen");
  it.todo("meldet einen Netzwerkfehler");

  // Teil 2: Test für die ausgemusterten Geräte ergänzen.
  it.todo("lädt die ausgemusterten Geräte");
});
