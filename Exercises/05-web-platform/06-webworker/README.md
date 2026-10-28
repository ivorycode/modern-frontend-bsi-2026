# Übung 5.6: Web Worker – rechnen, ohne die Seite zu blockieren

Eine Seite berechnet Fibonacci-Zahlen mit einem absichtlich langsamen Algorithmus. Solange sie rechnet, steht die Seite still. Sie verschieben die Berechnung in einen Web Worker, damit die Seite bedienbar bleibt, und ergänzen einen Abbruch.

Jeder Schritt hat einen ausklappbaren Lösungshinweis. Die Musterlösung liegt in [06-webworker-solution](../06-webworker-solution).

## Schritt 1: Den blockierten Hauptthread beobachten

Im Ordner `Exercises/05-web-platform/06-webworker` (keine Abhängigkeiten):

```sh
npm start
```

Öffnen Sie `http://localhost:3056/` in Chrome. Klicken Sie «Im Hauptthread berechnen» und versuchen Sie sofort, in das Textfeld zu tippen. Lesen Sie `main.js` und `fibonacci.js`.

- Was passiert mit der Uhr und mit Ihren Eingaben?
- Zeichnen Sie im DevTools-Tab **Performance** eine Berechnung auf. Was sehen Sie im Bereich **Main**?

<details>
<summary>Lösungshinweis</summary>

Die Uhr bleibt stehen, Eingaben erscheinen erst nach der Berechnung, auch der Button reagiert nicht. JavaScript, Layout und Rendering der Seite teilen sich **einen** Thread. Ein langer synchroner Aufruf blockiert die Event Loop: Weder `setInterval` noch Tastatur-Events kommen an die Reihe.

Im Performance-Tab erscheint ein einziger langer Task, rot markiert als «Long Task» (über 50 ms). `async`/`await` hilft hier nicht: Ein Promise macht eine Berechnung nicht nebenläufig, es verschiebt sie nur.

</details>

## Schritt 2: Nachrichten mit einem Worker austauschen

Klicken Sie «Im Worker berechnen» und beobachten Sie die Konsole. Lesen Sie `worker.js` und den zugehörigen Code in `main.js`.

- Wie kommunizieren Hauptthread und Worker?
- Wo sehen Sie den Worker in den DevTools?

<details>
<summary>Lösungshinweis</summary>

`new Worker(url, { type: "module" })` startet `worker.js` in einem eigenen Thread. Die beiden Seiten teilen keine Variablen; sie tauschen Nachrichten aus: `postMessage(daten)` sendet, das Event `message` empfängt (`event.data`). Die Daten werden dabei kopiert (Structured Clone), auch Objekte, `Date`, `Map` und `Set`, aber keine Funktionen und keine DOM-Elemente.

Der Worker hat kein `document` und kein `window`; `self` ist sein globales Objekt. Im Tab **Sources** erscheint `worker.js` als eigener Thread, und in der Konsole lässt sich oben zwischen «top» und dem Worker umschalten.

`new URL("./worker.js", import.meta.url)` löst den Pfad relativ zu `main.js` auf. Vite erkennt diese Schreibweise und bündelt den Worker beim Build mit.

</details>

## Schritt 3: Berechnung in den Worker verschieben

Ändern Sie `worker.js` und `main.js`: Beim Klick auf «Im Worker berechnen» sendet die Seite `n` an den Worker. Der Worker berechnet `fibonacci(n)`, misst die Dauer und sendet das Ergebnis zurück. Die Seite zeigt es an. Prüfen Sie mit `n = 42`, ob Uhr und Textfeld während der Berechnung weiterlaufen.

<details>
<summary>Lösungshinweis</summary>

```js
// worker.js
import { fibonacci } from "./fibonacci.js";

self.addEventListener("message", (event) => {
  const n = event.data;
  const start = performance.now();
  const value = fibonacci(n);
  const duration = Math.round(performance.now() - start);
  self.postMessage({ n, value, duration });
});
```

```js
// main.js
document.querySelector("#workerButton").addEventListener("click", () => {
  const n = nInput.valueAsNumber;
  result.textContent = "Rechne im Worker …";

  const worker = new Worker(new URL("./worker.js", import.meta.url), { type: "module" });
  worker.addEventListener("message", (event) => {
    const { n, value, duration } = event.data;
    result.textContent = `fibonacci(${n}) = ${value} (${duration} ms, im Worker)`;
    worker.terminate();
  });
  worker.postMessage(n);
});
```

Weil der Worker ein Modul ist, kann er `fibonacci.js` importieren; Hauptthread und Worker verwenden denselben Code. Die Berechnung dauert gleich lang, blockiert aber nur den Worker-Thread.

</details>

## Schritt 4: Abbrechen

Der Button «Abbrechen» ist vorbereitet. Ergänzen Sie `main.js`: Während der Worker rechnet, ist «Abbrechen» aktiv und beendet die Berechnung. Ein erneuter Klick auf «Im Worker berechnen» bricht eine laufende Berechnung ebenfalls ab.

<details>
<summary>Lösungshinweis</summary>

```js
let worker;

function stopWorker() {
  worker?.terminate();
  worker = undefined;
  cancelButton.disabled = true;
}

cancelButton.addEventListener("click", () => {
  stopWorker();
  result.textContent = "Abgebrochen";
});
```

Im Klick-Handler zuerst `stopWorker()` aufrufen, dann den neuen Worker in der Variablen `worker` speichern und `cancelButton.disabled = false` setzen; im `message`-Handler nach der Anzeige wieder `stopWorker()`.

`terminate()` beendet den Thread sofort, auch mitten in einer Schleife. Eine Berechnung im Hauptthread lässt sich so nicht abbrechen: Solange sie läuft, kommt der Klick auf «Abbrechen» gar nicht an. Der Vergleich mit Übung 3: `AbortController` bricht Operationen ab, die warten (z. B. `fetch`), `terminate()` bricht Code ab, der rechnet.

</details>
