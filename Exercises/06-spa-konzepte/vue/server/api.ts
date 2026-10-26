// Kleine Schadenfall-API für die Übung (Node.js ohne Framework).
// Start mit `npm run api`; Node.js startet den Server bei jeder Änderung neu.
//
// Der Vite-Entwicklungsserver leitet alle Requests auf `/api` an diesen Server
// weiter (Proxy in vite.config.ts). Für den Browser haben Seite und API deshalb
// denselben Origin, und es braucht keine CORS-Header.
//
// Jede Antwort kommt mit einer kleinen Verzögerung, damit Ladezustände sichtbar sind.

import { createServer, type ServerResponse } from "node:http";

const PORT = 3182;
const DELAY_MS = 600;

type ClaimStatus = "offen" | "in-pruefung" | "abgeschlossen";
type ClaimCategory = "hausrat" | "motorfahrzeug" | "haftpflicht" | "reise";

/** Schadenfall mit allen Angaben, wie ihn `GET /api/claims/:id` liefert. */
interface Claim {
  id: number;
  number: string;
  title: string;
  customer: string;
  status: ClaimStatus;
  reportedOn: string;
  category: ClaimCategory;
  amount: number;
  description: string;
}

const claims: Claim[] = [
  {
    id: 1,
    number: "S-2026-0101",
    title: "Wasserschaden in der Küche",
    customer: "Anna Meier",
    status: "offen",
    reportedOn: "2026-09-02",
    category: "hausrat",
    amount: 4800,
    description:
      "Der Schlauch der Geschirrspülmaschine hat sich gelöst. Parkett und Küchenschrank sind durchnässt.",
  },
  {
    id: 2,
    number: "S-2026-0102",
    title: "Auffahrunfall auf der A1",
    customer: "Marco Rossi",
    status: "in-pruefung",
    reportedOn: "2026-09-05",
    category: "motorfahrzeug",
    amount: 7350.5,
    description:
      "Im stockenden Verkehr bei Kriegstetten aufgefahren. Stossstange und Kühler beschädigt.",
  },
  {
    id: 3,
    number: "S-2026-0103",
    title: "Gestohlenes Velo",
    customer: "Lea Schneider",
    status: "abgeschlossen",
    reportedOn: "2026-09-11",
    category: "hausrat",
    amount: 1290,
    description:
      "E-Bike vor dem Bahnhof Olten gestohlen, obwohl es abgeschlossen war. Polizeirapport liegt vor.",
  },
  {
    id: 4,
    number: "S-2026-0104",
    title: "Glasbruch Wohnzimmerfenster",
    customer: "Peter Meier",
    status: "abgeschlossen",
    reportedOn: "2026-09-14",
    category: "hausrat",
    amount: 860,
    description: "Beim Sturm ist ein Ast gegen das Fenster geschlagen. Die Scheibe wurde ersetzt.",
  },
  {
    id: 5,
    number: "S-2026-0105",
    title: "Hagelschaden am Auto",
    customer: "Sofia Keller",
    status: "offen",
    reportedOn: "2026-09-20",
    category: "motorfahrzeug",
    amount: 3200,
    description: "Dellen auf Dach und Motorhaube nach dem Hagelgewitter vom 19. September.",
  },
  {
    id: 6,
    number: "S-2026-0106",
    title: "Annullierter Flug nach Lissabon",
    customer: "Jonas Weber",
    status: "in-pruefung",
    reportedOn: "2026-09-23",
    category: "reise",
    amount: 940,
    description:
      "Der Hinflug wurde kurzfristig annulliert. Geltend gemacht werden Hotel und Ersatzflug.",
  },
  {
    id: 7,
    number: "S-2026-0107",
    title: "Beschädigtes Mietauto",
    customer: "Nina Frei",
    status: "offen",
    reportedOn: "2026-10-01",
    category: "motorfahrzeug",
    amount: 2150,
    description: "Kratzer an der Fahrertür, beim Parkieren in Zürich entstanden.",
  },
  {
    id: 8,
    number: "S-2026-0108",
    title: "Laptop vom Tisch gestossen",
    customer: "Luca Brunner",
    status: "abgeschlossen",
    reportedOn: "2026-10-04",
    category: "haftpflicht",
    amount: 1480,
    description:
      "Beim Besuch eines Kollegen dessen Laptop vom Tisch gestossen. Das Display ist gebrochen.",
  },
  {
    id: 9,
    number: "S-2026-0109",
    title: "Wasserschaden beim Nachbarn",
    customer: "Thomas Huber",
    status: "offen",
    reportedOn: "2026-10-12",
    category: "haftpflicht",
    amount: 12800,
    description:
      "Die Badewanne ist übergelaufen. Die Decke der darunterliegenden Wohnung ist beschädigt.",
  },
  {
    id: 10,
    number: "S-2026-0110",
    title: "Gepäck verloren in Rom",
    customer: "Claudia Graf",
    status: "offen",
    reportedOn: "2026-10-18",
    category: "reise",
    amount: 650,
    description:
      "Der Koffer ist nach der Landung nicht angekommen und bleibt seit fünf Tagen verschollen.",
  },
];

function sendJson(response: ServerResponse, status: number, body: unknown): void {
  setTimeout(() => {
    response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify(body));
  }, DELAY_MS);
}

/** GET /api/claims: Übersicht ohne Beschreibung, Kategorie und Betrag. */
function getClaims(response: ServerResponse): void {
  const summaries = claims.map(({ id, number, title, customer, status, reportedOn }) => ({
    id,
    number,
    title,
    customer,
    status,
    reportedOn,
  }));
  sendJson(response, 200, summaries);
}

/** GET /api/claims/:id: ein Schadenfall mit allen Angaben oder 404. */
function getClaim(response: ServerResponse, id: string): void {
  const claim = claims.find((c) => String(c.id) === id);
  if (claim) return sendJson(response, 200, claim);
  sendJson(response, 404, { message: `Es gibt keinen Schadenfall mit der ID ${id}.` });
}

const server = createServer((request, response) => {
  const url = new URL(request.url ?? "/", `http://localhost:${PORT}`);
  console.log(`${request.method} ${url.pathname}${url.search}`);

  if (request.method === "GET" && url.pathname === "/api/claims") return getClaims(response);

  const detail = /^\/api\/claims\/([^/]+)$/.exec(url.pathname);
  if (request.method === "GET" && detail?.[1]) return getClaim(response, detail[1]);

  sendJson(response, 404, { message: `Nicht gefunden: ${request.method} ${url.pathname}` });
});

server.listen(PORT, () => {
  console.log(`Schadenfall-API läuft auf http://localhost:${PORT}/api/claims`);
});
