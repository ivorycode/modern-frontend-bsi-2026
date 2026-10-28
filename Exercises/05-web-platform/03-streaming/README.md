# Übung 5.3: Streaming – Antworten Stück für Stück verarbeiten

Ein Node-Server sendet Antworten nicht auf einmal, sondern in Teilen (Chunks). Sie beobachten das bei einer HTML-Seite und bei einer API, lassen die API mehrere Nachrichten senden und zeigen diese im Browser an, sobald sie eintreffen.

Jeder Schritt hat einen ausklappbaren Lösungshinweis. Die Musterlösung liegt in [03-streaming-solution](../03-streaming-solution).

## Schritt 1: HTML-Streaming beobachten

Im Ordner `Exercises/05-web-platform/03-streaming` (keine Abhängigkeiten):

```sh
npm start
```

Öffnen Sie `http://localhost:3053/` und beobachten Sie die Seite zehn Sekunden lang. Rufen Sie dieselbe Adresse im Terminal auf:

```sh
curl -N http://localhost:3053/
```

Lesen Sie `handleHtmlStream` in `server.js`.

- Wann beginnt der Browser, die Seite anzuzeigen?
- Was zeigt der Network-Tab bei diesem Request unter **Timing**?

<details>
<summary>Lösungshinweis</summary>

Der Browser zeigt die Seite an, bevor die Antwort vollständig ist, und ergänzt jede Sekunde einen Absatz. HTTP überträgt den Body in Teilen (`Transfer-Encoding: chunked`); Node setzt diesen Header selbst, weil die Länge der Antwort zu Beginn nicht bekannt ist. Unter **Timing** dauert «Content Download» rund zehn Sekunden.

Der unsichtbare Fülltext sorgt dafür, dass Browser schon die ersten Chunks rendern; ohne ihn warten sie, bis etwas mehr Daten da sind. Frameworks wie Next.js nutzen dasselbe Prinzip, um eine Seite zu senden, während langsame Teile noch geladen werden.

</details>

## Schritt 2: Die Streaming-API untersuchen

Führen Sie aus und öffnen Sie danach `http://localhost:3053/app`:

```sh
curl -N http://localhost:3053/api
```

Klicken Sie «Stream laden». Lesen Sie `handleApi` in `server.js` und `app-script.js`.

- In welchem Format sendet die API ihre Daten?
- Warum liest `app-script.js` den Body mit `response.body.getReader()` statt mit `response.json()`?

<details>
<summary>Lösungshinweis</summary>

Die API sendet **NDJSON** (Newline Delimited JSON): ein JSON-Objekt pro Zeile. Als Ganzes ist das kein gültiges JSON; `response.json()` würde mit einem `SyntaxError` ablehnen. Ausserdem wartet `response.json()` bis zum Ende der Antwort.

`response.body` ist ein `ReadableStream`. `reader.read()` liefert jeden Chunk als `Uint8Array`, sobald er eintrifft, und am Ende `{ done: true }`. `TextDecoder` wandelt die Bytes in Text um; `{ stream: true }` sorgt dafür, dass ein Umlaut, dessen Bytes auf zwei Chunks verteilt sind, korrekt dekodiert wird.

</details>

## Schritt 3: Mehrere Nachrichten senden

Ändern Sie `handleApi` in `server.js`: Die API soll fünf Nachrichten im Abstand von einer Sekunde senden, danach die Abschlussnachricht. Der Server startet bei Änderungen neu. Prüfen Sie mit `curl -N` und auf `http://localhost:3053/app`.

<details>
<summary>Lösungshinweis</summary>

```js
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

res.on("close", () => clearInterval(interval));
```

`res.write` sendet einen Chunk und lässt die Antwort offen, `res.end` schliesst sie. Der `close`-Handler beendet das Intervall, wenn der Client vorher abbricht; sonst schreibt der Server weiter in eine geschlossene Verbindung.

</details>

## Schritt 4: Nachrichten im Browser anzeigen

Bisher zeigt die Seite jede Zeile als rohen Text. Ändern Sie `app-script.js`: Jede Zeile soll als JSON geparst werden, und die Seite zeigt nur den Text von `message` und den Zeitstempel `timestamp` als lokale Zeit an (CSS-Klassen `message-text` und `timestamp` sind vorbereitet).

Zusatz: Das Programm geht davon aus, dass jeder Chunk aus ganzen Zeilen besteht. Das ist nicht garantiert; ein Proxy oder ein langsames Netz kann eine Zeile auf zwei Chunks verteilen. Machen Sie das Einlesen robust.

<details>
<summary>Lösungshinweis</summary>

```js
let buffer = "";

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  buffer += decoder.decode(value, { stream: true });
  const lines = buffer.split("\n");
  buffer = lines.pop(); // unvollständige letzte Zeile aufbewahren

  for (const line of lines) {
    if (line.trim()) displayMessage(JSON.parse(line));
  }
}
```

```js
function displayMessage(data) {
  const itemEl = document.createElement("div");
  itemEl.className = "stream-item";

  const messageEl = document.createElement("div");
  messageEl.className = "message-text";
  messageEl.textContent = data.message;
  itemEl.append(messageEl);

  if (data.timestamp) {
    const timestampEl = document.createElement("div");
    timestampEl.className = "timestamp";
    timestampEl.textContent = new Date(data.timestamp).toLocaleString("de-CH");
    itemEl.append(timestampEl);
  }
  contentDiv.append(itemEl);
}
```

Die Abschlussnachricht hat keinen Zeitstempel; ohne die Prüfung erschiene «Invalid Date».

Statt eines eigenen Puffers lässt sich der Stream auch umformen: `response.body.pipeThrough(new TextDecoderStream())` liefert Text statt Bytes. Dieselbe Technik verwenden Chat-Oberflächen, die die Antwort eines Sprachmodells Wort für Wort anzeigen.

</details>
