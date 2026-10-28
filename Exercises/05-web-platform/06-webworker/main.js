import { fibonacci } from "./fibonacci.js";

const clock = document.querySelector("#clock");
const nInput = document.querySelector("#n");
const result = document.querySelector("#result");

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

document.querySelector("#workerButton").addEventListener("click", () => {
  const worker = new Worker(new URL("./worker.js", import.meta.url), { type: "module" });

  worker.addEventListener("message", (event) => {
    console.log("Hauptthread: Antwort erhalten:", event.data);
  });

  worker.postMessage("Ping?");
});
