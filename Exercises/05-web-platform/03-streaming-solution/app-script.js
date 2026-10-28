const fetchBtn = document.querySelector("#fetchBtn");
const contentDiv = document.querySelector("#content");
const statusDiv = document.querySelector("#status");

fetchBtn.addEventListener("click", fetchStream);

async function fetchStream() {
  contentDiv.replaceChildren();
  showStatus("Stream läuft …", "active");
  fetchBtn.disabled = true;

  try {
    const response = await fetch("/api");
    if (!response.ok) {
      throw new Error(`HTTP-Fehler ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    // Ein Chunk endet nicht unbedingt an einer Zeilengrenze. Den unvollständigen
    // Rest der letzten Zeile aufbewahren, bis der nächste Chunk ihn ergänzt.
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop();

      for (const line of lines) {
        if (line.trim()) {
          displayMessage(JSON.parse(line));
        }
      }
    }
    if (buffer.trim()) {
      displayMessage(JSON.parse(buffer));
    }
    showStatus("Stream beendet", "complete");
  } catch (error) {
    console.error(error);
    showStatus(`Fehler: ${error.message}`, "error");
  } finally {
    fetchBtn.disabled = false;
  }
}

function displayMessage(data) {
  const itemEl = document.createElement("div");
  itemEl.className = "stream-item";

  const messageEl = document.createElement("div");
  messageEl.className = "message-text";
  messageEl.textContent = data.message;
  itemEl.append(messageEl);

  // Die Abschlussnachricht hat keinen Zeitstempel
  if (data.timestamp) {
    const timestampEl = document.createElement("div");
    timestampEl.className = "timestamp";
    timestampEl.textContent = new Date(data.timestamp).toLocaleString("de-CH");
    itemEl.append(timestampEl);
  }

  contentDiv.append(itemEl);
}

function showStatus(text, className) {
  const statusEl = document.createElement("div");
  statusEl.className = `status ${className}`;
  statusEl.textContent = text;
  statusDiv.replaceChildren(statusEl);
}
