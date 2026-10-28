import { fibonacci } from "./fibonacci.js";

const clock = document.querySelector("#clock");
const nInput = document.querySelector("#n");
const result = document.querySelector("#result");
const cancelButton = document.querySelector("#cancelButton");

// Die Uhr zeigt, ob der Hauptthread frei ist: Steht sie still, ist die Seite blockiert.
setInterval(() => {
  clock.textContent = new Date().toLocaleTimeString("de-CH", { fractionalSecondDigits: 1 });
}, 100);

document.querySelector("#mainButton").addEventListener("click", () => {
  const n = nInput.valueAsNumber;
  result.textContent = "Rechne …";

  const start = performance.now();
  const value = fibonacci(n);
  const duration = Math.round(performance.now() - start);

  result.textContent = `fibonacci(${n}) = ${value} (${duration} ms)`;
});

let worker;

document.querySelector("#workerButton").addEventListener("click", () => {
  // Eine laufende Berechnung abbrechen, bevor die nächste beginnt
  stopWorker();

  const n = nInput.valueAsNumber;
  result.textContent = "Rechne im Worker …";
  cancelButton.disabled = false;

  worker = new Worker(new URL("./worker.js", import.meta.url), { type: "module" });
  worker.addEventListener("message", (event) => {
    const { n, value, duration } = event.data;
    result.textContent = `fibonacci(${n}) = ${value} (${duration} ms, im Worker)`;
    stopWorker();
  });
  worker.postMessage(n);
});

cancelButton.addEventListener("click", () => {
  stopWorker();
  result.textContent = "Abgebrochen";
});

function stopWorker() {
  // terminate() beendet den Thread sofort, auch mitten in der Berechnung
  worker?.terminate();
  worker = undefined;
  cancelButton.disabled = true;
}
