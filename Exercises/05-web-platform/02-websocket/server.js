import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { WebSocketServer } from "ws";

const PORT = 3052;
const ROOT = import.meta.dirname;

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

// HTTP-Server: liefert index.html und client.js aus
const server = createServer(async (req, res) => {
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
});

// WebSocket-Server auf demselben Port: Der Browser beginnt mit einem HTTP-Request
// und wechselt mit «Upgrade: websocket» auf das WebSocket-Protokoll.
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Client verbunden");

  ws.on("message", (message) => {
    console.log("Empfangen:", message.toString());

    // Nachricht an den Absender zurückschicken
    ws.send(`Server-Echo: ${message}`);
  });

  ws.on("close", () => console.log("Client getrennt"));

  ws.send("Willkommen auf dem WebSocket-Server!");
});

server.listen(PORT, () => {
  console.log(`Seite: http://localhost:${PORT}/`);
  console.log(`WebSocket: ws://localhost:${PORT}/`);
});
