// Läuft in einem eigenen Thread: kein Zugriff auf document und window.
self.addEventListener("message", (event) => {
  console.log("Worker: Nachricht erhalten:", event.data);
  self.postMessage("Pong!");
});
