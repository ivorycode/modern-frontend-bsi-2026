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

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // Bytes des Chunks in Text umwandeln
      const chunk = decoder.decode(value, { stream: true });
      console.log("Chunk:", JSON.stringify(chunk));

      const lines = chunk.split("\n").filter((line) => line.trim());
      for (const line of lines) {
        displayMessage(line);
      }
    }
    showStatus("Stream beendet", "complete");
  } catch (error) {
    console.error(error);
    showStatus(`Fehler: ${error.message}`, "error");
  } finally {
    fetchBtn.disabled = false;
  }
}

function displayMessage(text) {
  const itemEl = document.createElement("div");
  itemEl.className = "stream-item";
  itemEl.textContent = text;
  contentDiv.append(itemEl);
}

function showStatus(text, className) {
  const statusEl = document.createElement("div");
  statusEl.className = `status ${className}`;
  statusEl.textContent = text;
  statusDiv.replaceChildren(statusEl);
}
