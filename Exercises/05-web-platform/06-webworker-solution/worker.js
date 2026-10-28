// Läuft in einem eigenen Thread: kein Zugriff auf document und window.
import { fibonacci } from "./fibonacci.js";

self.addEventListener("message", (event) => {
  const n = event.data;

  const start = performance.now();
  const value = fibonacci(n);
  const duration = Math.round(performance.now() - start);

  self.postMessage({ n, value, duration });
});
