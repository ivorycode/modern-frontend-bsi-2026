// Minimaler statischer Webserver ohne Abhängigkeiten.
// Liefert die Dateien aus diesem Ordner aus: http://localhost:PORT/
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const PORT = Number(process.env.PORT ?? 3056);
const ROOT = import.meta.dirname;

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

createServer(async (req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  const file = normalize(join(ROOT, pathname === "/" ? "index.html" : pathname));
  if (!file.startsWith(ROOT)) {
    res.writeHead(403).end("Forbidden");
    return;
  }
  try {
    const content = await readFile(file);
    res.writeHead(200, { "Content-Type": CONTENT_TYPES[extname(file)] ?? "text/plain" });
    res.end(content);
  } catch {
    res.writeHead(404).end("Not found");
  }
}).listen(PORT, () => {
  console.log(`Seite: http://localhost:${PORT}/`);
});
