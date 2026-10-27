// Kleine API für die Übung: einzelne Wörter eines Satzes und eine Suche.
// Beide antworten absichtlich verzögert, damit Reihenfolge und Parallelität
// im Network-Tab sichtbar werden. Die Seite erreicht die API über den Proxy
// des Vite-Entwicklungsservers (siehe vite.config.ts).
// Start mit `npm run api`; Node.js startet den Server bei jeder Änderung neu.

import { createServer, type ServerResponse } from "node:http";

const PORT = 3103;

const WORDS = ["The", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog"];

/** Im Szenario «error» antwortet die API für dieses Wort mit einem Serverfehler. */
const FAILING_INDEX = 4;

const TERMS = [
  "Angular",
  "Angular Signals",
  "Astro",
  "Babel",
  "Bun",
  "Deno",
  "esbuild",
  "Jest",
  "Lit",
  "Next.js",
  "Node.js",
  "Nuxt",
  "Oxlint",
  "Playwright",
  "Preact",
  "Qwik",
  "React",
  "React Native",
  "React Router",
  "Reactive Forms",
  "Redux",
  "Redux Toolkit",
  "Remix",
  "Rolldown",
  "Rollup",
  "RxJS",
  "Solid",
  "Svelte",
  "SvelteKit",
  "Tailwind CSS",
  "TanStack Query",
  "TypeScript",
  "Vite",
  "Vite+",
  "Vitest",
  "Vue",
  "Vue Router",
  "Webpack",
  "Zod",
];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Zufällige Verzögerung zwischen 200 und 1200 Millisekunden. */
function randomDelay(): number {
  return 200 + Math.round(Math.random() * 1000);
}

function sendJson(response: ServerResponse, status: number, body: unknown): void {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body));
}

/** GET /api/words/:index – liefert ein einzelnes Wort nach zufälliger Verzögerung. */
async function getWord(
  response: ServerResponse,
  index: number,
  scenario: string | null,
): Promise<void> {
  await sleep(randomDelay());

  if (scenario === "error" && index === FAILING_INDEX) {
    return sendJson(response, 500, { message: "Wort vorübergehend nicht verfügbar" });
  }
  const word = WORDS[index];
  if (word === undefined) {
    return sendJson(response, 404, { message: `Kein Wort mit Index ${index}` });
  }
  sendJson(response, 200, { index, word });
}

/**
 * GET /api/search?q=… – sucht Begriffe mit einem Wort, das mit q beginnt.
 * Kurze Suchbegriffe (ein oder zwei Zeichen) treffen viele Einträge und werden
 * deshalb deutlich langsamer beantwortet als längere.
 */
async function search(response: ServerResponse, query: string): Promise<void> {
  const q = query.trim().toLowerCase();
  await sleep(q.length <= 2 ? 2000 : 200);

  const results =
    q === ""
      ? []
      : TERMS.filter((term) =>
          term
            .toLowerCase()
            .split(" ")
            .some((word) => word.startsWith(q)),
        );
  sendJson(response, 200, { query, results });
}

const server = createServer(async (request, response) => {
  const started = Date.now();
  const url = new URL(request.url ?? "/", `http://localhost:${PORT}`);
  response.on("finish", () => {
    console.log(
      `${request.method} ${url.pathname}${url.search} → ${response.statusCode} nach ${Date.now() - started} ms`,
    );
  });

  if (request.method !== "GET") {
    return sendJson(response, 405, { message: "Nur GET wird unterstützt" });
  }

  if (url.pathname === "/api/words") {
    return sendJson(response, 200, { count: WORDS.length });
  }
  const wordMatch = /^\/api\/words\/(\d+)$/.exec(url.pathname);
  if (wordMatch) {
    return getWord(response, Number(wordMatch[1]), url.searchParams.get("scenario"));
  }
  if (url.pathname === "/api/search") {
    return search(response, url.searchParams.get("q") ?? "");
  }
  sendJson(response, 404, { message: `Nicht gefunden: ${request.method} ${url.pathname}` });
});

server.listen(PORT, () => {
  console.log(`Wort-API läuft auf http://localhost:${PORT}/api/words/0`);
  console.log(`Suche:           http://localhost:${PORT}/api/search?q=react`);
});
