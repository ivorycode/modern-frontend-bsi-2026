import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vite-plus/test";
import { LoadError, loadDevices } from "./api.ts";
import { API_BASE_URL, devices, DEVICES_URL } from "./mocks/handlers.ts";
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
  it.each([404, 500])("meldet HTTP %i", async (status) => {
    server.use(http.get(DEVICES_URL, () => HttpResponse.json({ message: "Fehler" }, { status })));

    await expect(loadDevices(DEVICES_URL)).rejects.toMatchObject({
      reason: "http",
      message: expect.stringContaining(`HTTP-Status ${status}`),
    });
  });

  it("meldet eine Antwort, die kein JSON ist", async () => {
    server.use(
      http.get(
        DEVICES_URL,
        () => new HttpResponse("kein json", { headers: { "Content-Type": "application/json" } }),
      ),
    );

    await expect(loadDevices(DEVICES_URL)).rejects.toMatchObject({
      reason: "invalid-json",
      message: "Die Antwort des Servers ist kein gültiges JSON.",
    });
  });

  it("meldet Daten, die nicht zum Schema passen", async () => {
    server.use(
      http.get(DEVICES_URL, () => HttpResponse.json([{ ...devices[0], available: "ja" }])),
    );

    await expect(loadDevices(DEVICES_URL)).rejects.toMatchObject({
      reason: "invalid-data",
      message: expect.stringContaining("[0].available"),
    });
  });

  it("meldet einen Netzwerkfehler", async () => {
    server.use(http.get(DEVICES_URL, () => HttpResponse.error()));

    const error = await loadDevices(DEVICES_URL).catch((error: unknown) => error);

    expect(error).toBeInstanceOf(LoadError);
    expect(error).toMatchObject({ reason: "network", message: "Der Server ist nicht erreichbar." });
  });

  // Teil 2: Test für die ausgemusterten Geräte ergänzen.
  it("lädt die ausgemusterten Geräte", async () => {
    const url = `${API_BASE_URL}/api/devices/archived`;
    const archived = [{ id: 90, name: "ThinkPad T480", category: "laptop", available: false }];
    server.use(http.get(url, () => HttpResponse.json(archived)));

    await expect(loadDevices(url)).resolves.toEqual(archived);
  });
});
