# Übung 5.1: fetch, HTTP-Fehler und CORS

Eine Seite lädt Alben von der öffentlichen Test-API [JSONPlaceholder](https://jsonplaceholder.typicode.com/) und zeigt die Antwort als Text an. Sie werten die Antwort als JSON aus, laden eine fremde Website und untersuchen, warum das scheitert, und behandeln HTTP- und Netzwerkfehler.

Jeder Schritt hat einen ausklappbaren Lösungshinweis. Die Musterlösung liegt in [01-fetch-solution](../01-fetch-solution).

## Schritt 1: Starten

Im Ordner `Exercises/05-web-platform/01-fetch` (keine Abhängigkeiten, kein `npm install` nötig):

```sh
npm start
```

Öffnen Sie `http://localhost:3051/` in Chrome mit den DevTools (Tabs **Console** und **Network**). Lesen Sie `app.js`.

## Schritt 2: `response.text()` und `response.json()`

- Welchen Typ hat `data` in der Konsole?
- Ersetzen Sie `response.text()` durch `response.json()`. Was ändert sich?
- Zeigen Sie statt des Textes die Titel der Alben als Liste (`<ul>`) an.

<details>
<summary>Lösungshinweis</summary>

Beide Methoden lesen den Body der Antwort als Stream bis zum Ende und liefern ein Promise. `text()` liefert einen String, `json()` parst ihn zusätzlich mit `JSON.parse` und liefert Objekte, hier ein Array. Den Body können Sie nur einmal lesen; ein zweiter Aufruf lehnt ab.

```js
const albums = await response.json();
const list = document.createElement("ul");
for (const album of albums) {
  const item = document.createElement("li");
  item.textContent = album.title;
  list.append(item);
}
output.replaceChildren(list);
```

`await` direkt auf oberster Ebene funktioniert, weil `app.js` als Modul geladen wird (`type="module"`). `textContent` statt `innerHTML` verhindert, dass Daten von aussen als HTML interpretiert werden.

</details>

## Schritt 3: Eine fremde Website laden

Ändern Sie `WEB_URL` auf eine bekannte Website, z. B. `https://www.20min.ch/`. Was erwarten Sie?

- Was zeigen Console und Network-Tab? Wurde der Request gesendet?
- Vergleichen Sie im Network-Tab die **Response Headers** von JSONPlaceholder und 20min. Welcher Header erklärt den Unterschied?
- Holen Sie dieselbe Seite im Terminal: `curl -sI https://www.20min.ch/`. Warum funktioniert es dort?

<details>
<summary>Lösungshinweis</summary>

Die Konsole meldet einen CORS-Fehler, `fetch` lehnt mit `TypeError: Failed to fetch` ab. Der Request wurde trotzdem gesendet und vom Server beantwortet; der Browser gibt die Antwort nur nicht an das Skript weiter.

Grund ist die **Same Origin Policy**: Ein Skript von `http://localhost:3051` darf Antworten eines anderen Origins (Schema, Host, Port) nur lesen, wenn der Server das erlaubt. Der Browser sendet dazu den Request-Header `Origin: http://localhost:3051`. JSONPlaceholder antwortet mit `access-control-allow-origin: http://localhost:3051`, 20min sendet keinen solchen Header.

CORS ist ein Schutz **im Browser**: Er verhindert, dass eine fremde Seite mit den Cookies der Nutzerin Daten einer anderen Website liest. `curl` hat keine Cookies der Nutzerin und setzt die Regel nicht durch. Deshalb ist CORS auch kein Schutz für die API selbst.

</details>

## Schritt 4: HTTP-Fehler und Netzwerkfehler

Setzen Sie `WEB_URL` zurück und probieren Sie nacheinander:

- `https://jsonplaceholder.typicode.com/albums/9999` (gibt es nicht)
- `https://does-not-exist.invalid/albums` (Host gibt es nicht)

Was passiert jeweils? Ergänzen Sie den Code so, dass die Seite in beiden Fällen eine verständliche Fehlermeldung zeigt.

<details>
<summary>Lösungshinweis</summary>

Bei `/albums/9999` antwortet der Server mit Status 404 und dem Body `{}`. `fetch` **lehnt nicht ab**: Für `fetch` ist jede HTTP-Antwort ein Erfolg, auch 404 oder 500. Erst `for … of` auf dem leeren Objekt wirft einen Fehler. Den Status müssen Sie selbst mit `response.ok` (Status 200–299) oder `response.status` prüfen.

Beim unbekannten Host gibt es keine Antwort. `fetch` lehnt mit `TypeError: Failed to fetch` ab, wie beim CORS-Fehler. Aus Sicherheitsgründen erfährt das Skript nicht, welcher der beiden Fälle vorliegt; die Details stehen nur in der Konsole.

```js
try {
  const response = await fetch(WEB_URL);
  if (!response.ok) {
    throw new Error(`HTTP-Fehler ${response.status} ${response.statusText}`);
  }
  const albums = await response.json();
  // … Liste anzeigen
} catch (error) {
  const message = document.createElement("p");
  message.className = "error";
  message.textContent = `Laden fehlgeschlagen: ${error.message}`;
  output.replaceChildren(message);
}
```

</details>
