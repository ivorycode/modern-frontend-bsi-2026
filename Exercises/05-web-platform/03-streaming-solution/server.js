import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const PORT = 3153;

const server = createServer((req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  switch (pathname) {
    case "/":
      return handleHtmlStream(req, res);
    case "/api":
      return handleApi(req, res);
    case "/app":
      return sendFile(res, "app.html", "text/html; charset=utf-8");
    case "/app-script.js":
      return sendFile(res, "app-script.js", "text/javascript; charset=utf-8");
    default:
      res.writeHead(404).end("Not found");
  }
});

server.listen(PORT, () => {
  console.log(`HTML-Stream: http://localhost:${PORT}/`);
  console.log(`App:         http://localhost:${PORT}/app`);
  console.log(`API:         http://localhost:${PORT}/api`);
});

// Eine HTML-Seite, die über zehn Sekunden Stück für Stück gesendet wird
function handleHtmlStream(req, res) {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });

  // Unsichtbarer Fülltext: Browser beginnen erst ab einer gewissen Datenmenge zu rendern.
  const padding = `<span style="display: none">${"&nbsp;".repeat(1024)}</span>`;

  res.write("<!doctype html><html><head><title>HTML-Stream</title></head><body>");
  res.write("<h1>HTML wird gestreamt</h1>");
  res.write(padding);

  const interval = setInterval(() => {
    res.write(`<p>Daten um ${new Date().toLocaleTimeString("de-CH")}</p>`);
    res.write(padding);
  }, 1000);

  setTimeout(() => {
    clearInterval(interval);
    res.write("<p>Ende des Streams.</p>");
    res.end("</body></html>");
  }, 10_000);

  res.on("close", () => clearInterval(interval));
}

function handleApi(req, res) {
  res.writeHead(200, {
    "Content-Type": "application/x-ndjson",
    "Cache-Control": "no-cache",
  });

  // Eine JSON-Nachricht pro Zeile (NDJSON), jede Sekunde eine
  let count = 0;
  const interval = setInterval(() => {
    count++;
    res.write(
      JSON.stringify({ message: `Datenpaket ${count}`, timestamp: new Date().toISOString() }) + "\n",
    );
    if (count === 5) {
      clearInterval(interval);
      res.end(JSON.stringify({ message: "Ende des Streams" }) + "\n");
    }
  }, 1000);

  // Bricht der Client ab (Seite geschlossen, curl mit Ctrl+C), nicht weiter senden
  res.on("close", () => clearInterval(interval));
}

async function sendFile(res, fileName, contentType) {
  const content = await readFile(join(import.meta.dirname, fileName));
  res.writeHead(200, { "Content-Type": contentType });
  res.end(content);
}
