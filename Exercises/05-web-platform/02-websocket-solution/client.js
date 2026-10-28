const messagesDiv = document.querySelector("#messages");
const form = document.querySelector("#messageForm");

// Verbindung zum WebSocket-Server auf demselben Host und Port wie die Seite.
const ws = new WebSocket(`ws://${location.host}`);

ws.addEventListener("open", () => addMessage("Verbunden mit dem Server", "status"));
ws.addEventListener("message", (event) => addMessage(`Empfangen: ${event.data}`, "received"));
ws.addEventListener("close", () => addMessage("Verbindung getrennt", "status"));
ws.addEventListener("error", () => addMessage("Verbindungsfehler", "status"));

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = form.elements.message.value.trim();
  if (message && ws.readyState === WebSocket.OPEN) {
    ws.send(message);
    addMessage(`Gesendet: ${message}`, "sent");
    form.reset();
  }
});

function addMessage(text, className) {
  const messageEl = document.createElement("div");
  messageEl.className = `message ${className}`;
  messageEl.textContent = text;
  messagesDiv.append(messageEl);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
