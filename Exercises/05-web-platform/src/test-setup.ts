import { afterAll, afterEach, beforeAll } from "vite-plus/test";
import { server } from "./mocks/server.ts";

const unhandledRequests: string[] = [];

beforeAll(() => {
  // Requests ohne passenden Handler gehen nicht ins Netzwerk, sondern schlagen fehl.
  server.listen({ onUnhandledFrame: "error" });
  server.events.on("request:unhandled", ({ request }) => {
    unhandledRequests.push(`${request.method} ${request.url}`);
  });
});

afterEach(() => {
  // Mit server.use(…) überschriebene Antworten gelten nur für einen Test.
  server.resetHandlers();
  // Der fehlgeschlagene Request sieht für den Code wie ein Netzwerkfehler aus. Fängt der
  // Code ihn ab, bliebe der Test grün; deshalb scheitert der Test hier ausdrücklich.
  const requests = unhandledRequests.splice(0);
  if (requests.length > 0) {
    throw new Error(`Request ohne passenden Handler: ${requests.join(", ")}`);
  }
});

afterAll(() => server.close());
