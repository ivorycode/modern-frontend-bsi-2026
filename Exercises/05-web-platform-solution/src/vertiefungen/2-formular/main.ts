// Vertiefung 2: wie src/main.ts, zusätzlich mit dem Formular «Gerät erfassen».

import "../../style.css";
import "./form.css";
import { requireElement } from "../../dom.ts";
import { setupDeviceView } from "../../device-view.ts";
import { setupDeviceForm } from "./device-form.ts";

/** Adresse der Geräte-API (`npm run api`); ein anderer Origin als diese Seite. */
const API_BASE_URL = "http://localhost:3105";

const main = requireElement(document, "main", HTMLElement);
setupDeviceView(main, API_BASE_URL);

const source = requireElement(main, 'select[name="source"]', HTMLSelectElement);
setupDeviceForm(requireElement(main, "form.new-device", HTMLFormElement), API_BASE_URL, () => {
  // Liste neu laden, damit das neue Gerät erscheint.
  source.value = "/api/devices";
  source.dispatchEvent(new Event("change"));
});
