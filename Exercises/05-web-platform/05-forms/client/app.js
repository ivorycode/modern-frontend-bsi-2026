// Prüfung im Browser: schnelle Rückmeldung für die Nutzerin, kein Schutz für den Server.
function validateFields(name, email) {
  if (!name || name.trim() === "") {
    return "Name ist erforderlich";
  }
  if (!email || email.trim() === "") {
    return "E-Mail ist erforderlich";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Bitte eine gültige E-Mail-Adresse eingeben";
  }
  return null;
}

async function sendJson() {
  const name = document.querySelector("#jsonName").value;
  const email = document.querySelector("#jsonEmail").value;
  const result = document.querySelector("#jsonResult");

  const validationError = validateFields(name, email);
  if (validationError) {
    result.textContent = `Ungültige Eingabe: ${validationError}`;
    return;
  }

  try {
    const response = await fetch("/api/json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    const data = await response.json();
    result.textContent = `Status ${response.status}\n${JSON.stringify(data, null, 2)}`;
  } catch (error) {
    result.textContent = `Fehler: ${error.message}`;
  }
}

async function sendForm(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const result = document.querySelector("#formResult");

  const validationError = validateFields(formData.get("name"), formData.get("email"));
  if (validationError) {
    result.textContent = `Ungültige Eingabe: ${validationError}`;
    return;
  }

  try {
    const response = await fetch("/api/form", {
      method: "POST",
      body: formData, // multipart/form-data; den Content-Type setzt der Browser
    });
    const data = await response.json();
    result.textContent = `Status ${response.status}\n${JSON.stringify(data, null, 2)}`;
  } catch (error) {
    result.textContent = `Fehler: ${error.message}`;
  }
}

document.querySelector("#jsonButton").addEventListener("click", sendJson);
document.querySelector("#registrationForm").addEventListener("submit", sendForm);
