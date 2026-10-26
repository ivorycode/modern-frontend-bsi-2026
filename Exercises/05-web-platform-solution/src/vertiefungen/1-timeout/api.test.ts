import { delay, http, HttpResponse } from "msw";
import { describe, expect, it } from "vite-plus/test";
import { devices, DEVICES_URL } from "../../mocks/handlers.ts";
import { server } from "../../mocks/server.ts";
import { loadDevices } from "./api.ts";

describe("loadDevices mit Timeout (Vertiefung 1)", () => {
  it("lädt die Geräteliste innerhalb der Frist", async () => {
    await expect(loadDevices(DEVICES_URL)).resolves.toEqual(devices);
  });

  it("bricht eine zu langsame Antwort ab", async () => {
    server.use(
      http.get(DEVICES_URL, async () => {
        await delay("infinite");
        return HttpResponse.json(devices);
      }),
    );

    // 10 ms statt drei Sekunden: Der Test wartet nicht wirklich.
    await expect(loadDevices(DEVICES_URL, 10)).rejects.toMatchObject({
      reason: "timeout",
      message: "Der Server antwortet nicht rechtzeitig.",
    });
  });

  it("meldet weiterhin einen Netzwerkfehler", async () => {
    server.use(http.get(DEVICES_URL, () => HttpResponse.error()));

    await expect(loadDevices(DEVICES_URL)).rejects.toMatchObject({ reason: "network" });
  });
});
