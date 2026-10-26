// Kleine Geräte-API für die Übung. Sie läuft auf einem anderen Port als der
// Vite-Entwicklungsserver, Requests der Seite sind deshalb Cross-Origin.
// Start mit `npm run api`; Node.js startet den Server bei jeder Änderung neu.

import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { z } from "zod";
import { newDeviceSchema, type Device } from "../src/device.ts";

const PORT = 3005;
/** Origin der Seite (Vite-Entwicklungsserver), die diese API verwenden darf. */
const ALLOWED_ORIGIN = "http://localhost:5177";

const devices: Device[] = [
  { id: 1, name: "ThinkPad T14", category: "laptop", available: true },
  { id: 2, name: "MacBook Air 13", category: "laptop", available: false },
  { id: 3, name: "Dell UltraSharp 27", category: "monitor", available: true },
  { id: 4, name: "Epson EB-W51", category: "beamer", available: true },
  { id: 5, name: "Jabra Evolve2 65", category: "headset", available: false },
];

const archivedDevices: Device[] = [
  { id: 90, name: "ThinkPad T480", category: "laptop", available: false },
  { id: 91, name: "Beamer Sony VPL-EX7", category: "beamer", available: false },
];

/** Antwortet mit JSON und erlaubt der Seite den Zugriff (CORS). */
function sendJson(response: ServerResponse, status: number, body: unknown): void {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  });
  response.end(JSON.stringify(body));
}

/** Simuliert verschiedene Antworten von GET /api/devices über `?scenario=…`. */
async function getDevices(response: ServerResponse, scenario: string | null): Promise<void> {
  switch (scenario) {
    case "empty":
      return sendJson(response, 200, []);
    case "server-error":
      return sendJson(response, 500, { message: "Datenbank nicht erreichbar" });
    case "invalid-json":
      // Abgeschnittene Antwort: Der Header verspricht JSON, der Body ist keines.
      response.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      });
      return void response.end('[{"id": 1, "name": "ThinkPad T14", "categ');
    case "invalid-data":
      return sendJson(response, 200, [
        { id: 1, name: "ThinkPad T14", category: "laptop", available: "ja" },
      ]);
    case "network-error":
      // Verbindung ohne Antwort schliessen; der Browser meldet einen Netzwerkfehler.
      return void response.socket?.destroy();
    case "slow":
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return sendJson(response, 200, devices);
    default:
      return sendJson(response, 200, devices);
  }
}

/** Nimmt ein neues Gerät entgegen und prüft es mit demselben Schema wie die Seite. */
async function postDevice(request: IncomingMessage, response: ServerResponse): Promise<void> {
  let body: unknown;
  try {
    body = JSON.parse(await readBody(request));
  } catch {
    return sendJson(response, 400, { message: "Der Request enthält kein gültiges JSON." });
  }

  const result = newDeviceSchema.safeParse(body);
  if (!result.success) {
    return sendJson(response, 400, {
      message: "Die Eingaben sind ungültig.",
      fieldErrors: z.flattenError(result.error).fieldErrors,
    });
  }

  const device: Device = {
    id: Math.max(0, ...devices.map((d) => d.id)) + 1,
    ...result.data,
    available: true,
  };
  devices.push(device);
  sendJson(response, 201, device);
}

// Ausgemusterte Geräte: Die Antwort geht jetzt über sendJson und enthält damit
// wie /api/devices den CORS-Header Access-Control-Allow-Origin.
function getArchivedDevices(response: ServerResponse): void {
  sendJson(response, 200, archivedDevices);
}

/** Beantwortet den Preflight-Request, den der Browser vor einem POST mit JSON sendet. */
function allowPreflight(response: ServerResponse): void {
  response.writeHead(204, {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "GET, POST",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  response.end();
}

async function readBody(request: IncomingMessage): Promise<string> {
  let body = "";
  for await (const chunk of request) body += String(chunk);
  return body;
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://localhost:${PORT}`);
  console.log(
    `${request.method} ${url.pathname}${url.search}  (Origin: ${request.headers.origin ?? "–"})`,
  );

  const route = `${request.method} ${url.pathname}`;
  if (route === "GET /api/devices") return getDevices(response, url.searchParams.get("scenario"));
  if (route === "POST /api/devices") return postDevice(request, response);
  if (route === "OPTIONS /api/devices") return allowPreflight(response);
  if (route === "GET /api/devices/archived") return getArchivedDevices(response);
  sendJson(response, 404, { message: `Nicht gefunden: ${request.method} ${url.pathname}` });
});

server.listen(PORT, () => {
  console.log(`Geräte-API läuft auf http://localhost:${PORT}/api/devices`);
});
