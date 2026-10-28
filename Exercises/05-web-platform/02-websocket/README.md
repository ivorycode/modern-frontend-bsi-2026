# Übung 5.2: WebSocket – Nachrichten an alle Clients

Ein kleiner Node-Server liefert eine Chat-Seite aus und nimmt WebSocket-Verbindungen an. Im Moment schickt er jede Nachricht nur an den Absender zurück («Echo»). Sie erweitern ihn so, dass alle verbundenen Browserfenster die Nachricht erhalten.

Jeder Schritt hat einen ausklappbaren Lösungshinweis. Die Musterlösung liegt in [02-websocket-solution](../02-websocket-solution).

## Schritt 1: Starten und Verbindung untersuchen

Im Ordner `Exercises/05-web-platform/02-websocket`:

```sh
npm install
npm start
```

Öffnen Sie `http://localhost:3052/` in Chrome und senden Sie einige Nachrichten. Lesen Sie `client.js` und `server.js`.

Öffnen Sie in den DevTools den Tab **Network**, Filter **Socket**, und laden Sie die Seite neu. Klicken Sie auf den Request und sehen Sie sich **Headers** und **Messages** an.

- Mit welchem HTTP-Status und welchen Headern beginnt die Verbindung?
- In welche Richtung fliessen die Nachrichten?

<details>
<summary>Lösungshinweis</summary>

Die Verbindung beginnt als gewöhnlicher HTTP-Request mit `Upgrade: websocket`. Der Server antwortet mit Status **101 Switching Protocols**; ab dann bleibt die TCP-Verbindung offen, und beide Seiten können jederzeit Nachrichten senden. Deshalb laufen HTTP-Server und WebSocket-Server in `server.js` auf demselben Port.

Unter **Messages** sehen Sie gesendete (Pfeil nach oben) und empfangene Nachrichten (Pfeil nach unten), darunter die Begrüssung, die der Server ohne Anfrage schickt. Mit HTTP allein kann der Server nur auf einen Request antworten.

</details>

## Schritt 2: Nachricht an alle Clients

Öffnen Sie `http://localhost:3052/` in zwei oder drei Browserfenstern nebeneinander. Erweitern Sie `server.js`: Das «Server-Echo» einer Nachricht soll an **alle** verbundenen Clients gehen, nicht nur an den Absender. Der Server startet bei Änderungen dank `node --watch` neu; laden Sie danach die Fenster neu.

Zusatz: Geben Sie jedem Client beim Verbinden eine Nummer und zeigen Sie im Echo, von welchem Client die Nachricht kommt.

<details>
<summary>Lösungshinweis</summary>

`wss.clients` enthält alle offenen Verbindungen. Senden Sie nur an Verbindungen im Zustand `OPEN`; eine Verbindung, die gerade schliesst, würde sonst einen Fehler auslösen.

```js
import { WebSocket, WebSocketServer } from "ws";

let nextClientId = 1;

wss.on("connection", (ws) => {
  const clientId = nextClientId++;

  ws.on("message", (message) => {
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`Server-Echo von Client ${clientId}: ${message}`);
      }
    }
  });
  // …
});
```

`clientId` liegt in der Closure der jeweiligen Verbindung.

</details>

## Schritt 3: Verbindungsabbruch

Stoppen Sie den Server (`Ctrl+C`), während die Seite offen ist, und starten Sie ihn wieder.

- Was zeigt die Seite? Verbindet sie sich von selbst wieder?

<details>
<summary>Lösungshinweis</summary>

Die Seite meldet «Verbindung getrennt» und bleibt getrennt. Die WebSocket-API verbindet nicht automatisch neu; das müssen Sie selbst umsetzen, z. B. im `close`-Handler nach einer Wartezeit ein neues `WebSocket` erzeugen. Nachrichten, die während der Unterbrechung gesendet wurden, sind verloren.

Die Alternative **Server-Sent Events** (`EventSource`) verbindet von selbst neu, überträgt aber nur vom Server zum Browser.

</details>
