import { z } from "zod";
import { LoadError } from "../../api.ts";
import { newDeviceSchema } from "../../device.ts";
import { requireElement } from "../../dom.ts";
import { createDevice, type FieldErrors } from "./api.ts";

/** Verbindet das Formular «Gerät erfassen» mit der API; `onCreated` lädt die Liste neu. */
export function setupDeviceForm(
  form: HTMLFormElement,
  apiBaseUrl: string,
  onCreated: () => void,
): void {
  const formMessage = requireElement(form, ".form-message", HTMLElement);

  /** Schreibt die Feldfehler in die passenden `[data-error-for]`-Elemente. */
  function showFieldErrors(fieldErrors: FieldErrors): void {
    for (const output of form.querySelectorAll("[data-error-for]")) {
      if (!(output instanceof HTMLElement)) continue;
      const field = output.dataset["errorFor"] ?? "";
      output.textContent = fieldErrors[field]?.join(" ") ?? "";
    }
  }

  async function submit(): Promise<void> {
    formMessage.textContent = "";

    // Prüfung im Browser: schnelle Rückmeldung, ersetzt die Serverprüfung nicht.
    const result = newDeviceSchema.safeParse(Object.fromEntries(new FormData(form)));
    if (!result.success) {
      showFieldErrors(z.flattenError(result.error).fieldErrors);
      return;
    }

    try {
      const created = await createDevice(new URL("/api/devices", apiBaseUrl), result.data);
      if (!created.success) {
        showFieldErrors(created.fieldErrors);
        return;
      }
      showFieldErrors({});
      form.reset();
      formMessage.textContent = `«${created.device.name}» wurde erfasst.`;
      onCreated();
    } catch (error) {
      if (error instanceof LoadError) {
        formMessage.textContent = error.message;
      } else {
        console.error(error);
        formMessage.textContent = "Beim Speichern ist ein unerwarteter Fehler aufgetreten.";
      }
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    void submit();
  });
}
