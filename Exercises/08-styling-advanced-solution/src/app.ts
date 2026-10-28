import { requireElement } from "./dom.ts";

/**
 * Verhalten der Seite: Menü, Zusammenfassung, Freigabe und Absenden des Formulars.
 *
 * Das Skript setzt nur Zustandsattribute (`aria-expanded`, `disabled`) und
 * Textinhalte, nie Klassen. Dadurch funktioniert es unverändert mit CSS-Selektoren und mit
 * Tailwind-Varianten.
 */
export function setupApp(root: Document): void {
  setupMenu(root);
  setupForm(root);
}

function setupMenu(root: Document): void {
  const menuButton = requireElement(root, "button[aria-controls=site-nav]", HTMLButtonElement);
  menuButton.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!expanded));
  });
}

function setupForm(root: Document): void {
  const form = requireElement(root, "form", HTMLFormElement);
  const consent = requireElement(form, "input[name=consent]", HTMLInputElement);
  const submitButton = requireElement(form, "button[type=submit]", HTMLButtonElement);
  const status = requireElement(form, "[role=status]", HTMLElement);
  const printButton = requireElement(root, "[data-action=print]", HTMLButtonElement);

  function updateSummary(): void {
    const data = new FormData(form);
    for (const output of root.querySelectorAll<HTMLElement>("[data-summary]")) {
      const value = data.get(output.dataset["summary"] ?? "");
      output.textContent = typeof value === "string" && value.trim() !== "" ? value : "–";
    }
    submitButton.disabled = !consent.checked;
  }

  form.addEventListener("input", () => {
    status.textContent = "";
    updateSummary();
  });

  form.addEventListener("reset", () => {
    status.textContent = "";
    // Das Formular setzt seine Felder erst nach dem Ereignis zurück.
    setTimeout(updateSummary);
  });

  form.addEventListener("submit", (event) => {
    // `novalidate` am Formular unterdrückt die Meldungen des Browsers. Nach dem Absendeversuch
    // gelten ungültige Felder trotzdem als `:user-invalid`, und das CSS zeigt ihre Fehler an.
    event.preventDefault();
    if (!form.checkValidity()) {
      status.textContent = "";
      return;
    }
    status.textContent = "Danke, Ihre Anmeldung ist eingegangen.";
  });

  printButton.addEventListener("click", () => window.print());

  updateSummary();
}
