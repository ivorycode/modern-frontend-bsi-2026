import { http, HttpResponse } from "msw";
import type { Device } from "../device.ts";

/** Basisadresse der API, wie sie die Seite verwendet. */
export const API_BASE_URL = "http://localhost:3005";
export const DEVICES_URL = `${API_BASE_URL}/api/devices`;

export const devices: Device[] = [
  { id: 1, name: "ThinkPad T14", category: "laptop", available: true },
  { id: 2, name: "Dell UltraSharp 27", category: "monitor", available: false },
];

/** Standardantworten für alle Tests; einzelne Tests überschreiben sie mit `server.use(…)`. */
export const handlers = [http.get(DEVICES_URL, () => HttpResponse.json(devices))];
