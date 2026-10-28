const WEB_URL = "https://jsonplaceholder.typicode.com/albums";
// Schritt 3: Andere Website – scheitert an der Same Origin Policy (kein CORS-Header).
// const WEB_URL = "https://www.20min.ch/";
// Schritt 4: HTTP-Fehler – fetch lehnt nicht ab, Status 404.
// const WEB_URL = "https://jsonplaceholder.typicode.com/albums/9999";
// Schritt 4: Netzwerkfehler – fetch lehnt mit einem TypeError ab.
// const WEB_URL = "https://does-not-exist.invalid/albums";

const output = document.querySelector("#output");

try {
  const response = await fetch(WEB_URL);
  if (!response.ok) {
    throw new Error(`HTTP-Fehler ${response.status} ${response.statusText}`);
  }

  const albums = await response.json();
  console.log(albums);

  const list = document.createElement("ul");
  for (const album of albums) {
    const item = document.createElement("li");
    item.textContent = album.title;
    list.append(item);
  }
  output.replaceChildren(list);
} catch (error) {
  console.error(error);
  const message = document.createElement("p");
  message.className = "error";
  message.textContent = `Laden fehlgeschlagen: ${error.message}`;
  output.replaceChildren(message);
}
