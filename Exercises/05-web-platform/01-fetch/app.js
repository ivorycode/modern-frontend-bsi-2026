const WEB_URL = "https://jsonplaceholder.typicode.com/albums";

const output = document.querySelector("#output");

fetch(WEB_URL)
  .then((response) => response.text())
  .then((data) => {
    console.log(data);
    const pre = document.createElement("pre");
    pre.textContent = data;
    output.replaceChildren(pre);
  });
